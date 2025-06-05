import { useState } from 'react';
import axios from 'axios';

const StudentLogs = () => {
  const [rfid, setRfid] = useState('');
  const [studentLogs, setStudentLogs] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance/student/${rfid}`);
      setStudentLogs(res.data);
    } catch (err) {
      setStudentLogs(null);
      setError(err.response?.data?.message || 'Error fetching student logs');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Student Attendance Logs</h2>
      <input
        type="text"
        placeholder="Enter RFID UID"
        value={rfid}
        onChange={e => setRfid(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {studentLogs && (
        <div className="mt-6">
          <h3 className="font-bold">
            {studentLogs.student.name} ({studentLogs.student.studentId})
          </h3>
          <table className="min-w-full border border-gray-300 mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {studentLogs.logs.map(log => (
                <tr key={log._id} className="border-t">
                  <td className="border px-4 py-2">{log.status}</td>
                  <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentLogs;
