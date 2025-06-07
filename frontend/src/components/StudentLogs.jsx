import { useState } from 'react';
import axios from 'axios';

const StudentLogs = () => {
  const [rfid, setRfid] = useState('');
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Check In');
  const [studentLogs, setStudentLogs] = useState(null);
  const [error, setError] = useState('');

  const handleLogAttendance = async () => {
    setError('');
    // Validate all fields are filled
    if (!rfid.trim() || !studentId.trim() || !name.trim() || !status) {
      alert('❗ All fields (RFID UID, Student ID, Name, and Status) are required.');
      return;
    }

    try {
      await axios.post('https://bus-tracking-app-wt0f.onrender.com/api/attendance/log', {
        uid: rfid.trim(),
        student_id: studentId.trim(),
        name: name.trim(),
        status,
      });

      alert('✅ Attendance logged!');
      handleSearch(); // refresh logs after logging
    } catch (err) {
      alert('❌ Log failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSearch = async () => {
    setError('');
    try {
      const res = await axios.get(`https://bus-tracking-app-wt0f.onrender.com/api/attendance/student/${rfid.trim()}`);
      setStudentLogs(res.data);
    } catch (err) {
      setStudentLogs(null);
      setError(err.response?.data?.message || 'Error fetching student logs');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Student Attendance Logs</h2>

      <input
        type="text"
        placeholder="Enter RFID UID"
        value={rfid}
        onChange={e => setRfid(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="text"
        placeholder="Enter Student ID"
        value={studentId}
        onChange={e => setStudentId(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="text"
        placeholder="Enter Student Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        <option value="Check In">Check In</option>
        <option value="Check Out">Check Out</option>
      </select>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleLogAttendance}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Log Attendance
        </button>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search Logs
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {studentLogs && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">
            {studentLogs.student.name} ({studentLogs.student.studentId})
          </h3>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {studentLogs.logs.map(log => (
                <tr key={log._id}>
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
