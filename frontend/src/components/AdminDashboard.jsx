import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // ✅ Changed to relative path (works locally & on Render)
        const res = await axios.get('/api/attendance/logs');
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching attendance logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p>Loading attendance logs...</p>;

  if (logs.length === 0) return <p>No attendance logs found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Attendance Logs</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Student ID</th>
            <th className="border px-4 py-2">RFID UID</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id} className="border-t">
              <td className="border px-4 py-2">{log.studentId?.name || 'N/A'}</td>
              <td className="border px-4 py-2">{log.studentId?.studentId || 'N/A'}</td>
              <td className="border px-4 py-2">{log.studentId?.rfidUid || 'N/A'}</td>
              <td className="border px-4 py-2">{log.status}</td>
              <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
