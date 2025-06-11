import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentLogs = () => {
  const [rfid, setRfid] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed
  const navigate = useNavigate();

  const fetchStudentLogs = async () => {
    try {
      const response = await axios.get(`https://bus-tracking-app-wt0f.onrender.com/api/attendance/student/${rfid}`);
      setStudentData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch student logs. Please try again.');
      setStudentData(null);
    }
  };

  const handleSearch = () => {
    if (rfid) {
      fetchStudentLogs();
    } else {
      setError('Please enter an RFID UID.');
    }
  };

  const handleLogAttendance = async () => {
    try {
      await axios.post('https://bus-tracking-app-wt0f.onrender.com/api/attendance/log', {
        rfidUid: rfid,
        status: 'Check In',
      });
      alert('Attendance logged successfully!');
      fetchStudentLogs();
    } catch (err) {
      setError('Failed to log attendance. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      {/* Sidebar */}
      <div
        className={`bg-blue-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out z-20`}
      >
        <nav className="mt-10">
          <h2 className="text-lg font-semibold px-4 mb-4">Navigation</h2>
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-4 py-2 hover:bg-blue-700 transition rounded-md flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </button>
          <button
            onClick={() => navigate('/attendance')}
            className="w-full text-left px-4 py-2 hover:bg-blue-700 transition rounded-md flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Attendance Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/searchlocation')}
            className="w-full text-left px-4 py-2 hover:bg-blue-700 transition rounded-md flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.243l-4.243-4.243m0 0l-4.243 4.243m4.243-4.243l4.243-4.243m-4.243 4.243l-4.243-4.243m0 0a6 6 0 1112 0 6 6 0 01-12 0z" />
            </svg>
            <span>Bus Location Search</span>
          </button>
          <button
            onClick={() => navigate('/student-logs')}
            className="w-full text-left px-4 py-2 hover:bg-blue-700 transition rounded-md flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Student Logs</span>
          </button>
          <button
            onClick={() => navigate('/emergencies-overspeeding')}
            className="w-full text-left px-4 py-2 hover:bg-blue-700 transition rounded-md flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z" />
            </svg>
            <span>Emergencies/Overspeeding</span>
          </button>
        </nav>
      </div>

      <div className={`flex-1 transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button onClick={toggleSidebar} className="text-gray-600">
                {isSidebarOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">School Name</h1>
            </div>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition">
              Logout
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Attendance Logs</h2>
            <div className="flex space-x-4 mb-4">
              <input
                type="text"
                placeholder="Enter RFID UID"
                value={rfid}
                onChange={(e) => setRfid(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Search
              </button>
              <button
                onClick={handleLogAttendance}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Log Attendance
              </button>
              <button
                onClick={() => navigate('/searchlocation')}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
              >
                Show Location
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4">
                <p>{error}</p>
              </div>
            )}

            {studentData && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Student: {studentData.student?.name} (ID: {studentData.student?.studentId})
                </h3>
                {studentData.logs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studentData.logs.map((log) => (
                          <tr key={log._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {log.status}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No attendance logs found for this student.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLogs;