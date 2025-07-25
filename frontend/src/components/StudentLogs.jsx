// File: frontend/src/pages/StudentLogs.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  AccessTime as LogsIcon,
  DirectionsBusFilled as BusIcon,
  Warning as AlertIcon,
  QrCodeScanner as RFIDIcon,
} from '@mui/icons-material';

const StudentLogs = () => {
  const [rfid, setRfid] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchStudentLogs = async () => {
    try {
      const response = await axios.get(`https://bus-tracking-app-wt0f.onrender.com/api/attendance/student/${rfid}`);
      setStudentData(response.data);
      setError(null);
    } catch (err) {
      setError('❌ Failed to fetch student logs. Please try again.');
      setStudentData(null);
    }
  };

  const handleSearch = () => {
    if (rfid.trim()) {
      fetchStudentLogs();
    } else {
      setError('⚠️ Please enter an RFID UID.');
    }
  };

  const handleLogAttendance = async () => {
    try {
      await axios.post('https://bus-tracking-app-wt0f.onrender.com/api/attendance/log', {
        rfidUid: rfid,
        status: 'Check In',
      });
      alert('✅ Attendance logged successfully!');
      fetchStudentLogs();
    } catch (err) {
      setError('❌ Failed to log attendance. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-blue-800 text-white w-64 p-6 space-y-4 fixed h-full transition-transform duration-200 z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <h2 className="text-lg font-semibold mb-6">Navigation</h2>
        <nav className="space-y-2">
          <NavItem icon={<HomeIcon />} label="Home" onClick={() => navigate('/')} />
          <NavItem icon={<LogsIcon />} label="Attendance Dashboard" onClick={() => navigate('/attendance')} />
          <NavItem icon={<SearchIcon />} label="Bus Location Search" onClick={() => navigate('/searchlocation')} />
          <NavItem icon={<RFIDIcon />} label="Student Logs" onClick={() => navigate('/student-logs')} />
          <NavItem icon={<AlertIcon />} label="Emergencies/Overspeeding" onClick={() => navigate('/emergencies-overspeeding')} />
        </nav>
      </aside>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <MenuIcon className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">Student Attendance</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800">
            <LogoutIcon fontSize="small" />
            Logout
          </button>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Student Logs</h2>

            <div className="flex flex-wrap gap-4 mb-6">
              <input
                type="text"
                placeholder="Enter RFID UID"
                value={rfid}
                onChange={(e) => setRfid(e.target.value)}
                className="flex-1 min-w-[200px] border px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Search
              </button>
              <button
                onClick={handleLogAttendance}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Log Attendance
              </button>
              <button
                onClick={() => navigate('/searchlocation')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Show Location
              </button>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 border border-red-300">
                {error}
              </div>
            )}

            {studentData && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Student: {studentData.student?.name} (ID: {studentData.student?.studentId})
                </h3>
                {studentData.logs?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
                          <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentData.logs.map((log) => (
                          <tr key={log._id} className="border-t">
                            <td className="px-6 py-4 text-sm text-gray-800">{log.status}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{new Date(log.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No attendance logs found.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar Nav Item
const NavItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-blue-700 rounded transition"
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default StudentLogs;
