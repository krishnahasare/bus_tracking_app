import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AttendanceDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [searchBusId, setSearchBusId] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filter, setFilter] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const apiUrl = process.env.NODE_ENV === 'production'
          ? 'https://bus-tracking-app-wt0f.onrender.com/api/attendance/logs'
          : 'http://localhost:5000/api/attendance/logs';
        
        const res = await axios.get(apiUrl);
        const fetchedLogs = Array.isArray(res.data) ? res.data : [];
        setLogs(fetchedLogs);
        setFilteredLogs(fetchedLogs);
      } catch (err) {
        setError(`Failed to fetch attendance logs: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = [...logs];

    if (searchStudentId) {
      filtered = filtered.filter(log => 
        log.studentId?.studentId?.toLowerCase().includes(searchStudentId.toLowerCase())
      );
    }

    if (searchBusId) {
      filtered = filtered.filter(log => 
        log.busId?.toLowerCase().includes(searchBusId.toLowerCase())
      );
    }

    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    if (filter !== 'All') {
      const now = new Date();
      let startDate;

      if (filter === 'Today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (filter === 'Last 7 Days') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      }

      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return filter === 'All' || logDate >= startDate;
      });
    }

    setFilteredLogs(filtered);
  }, [searchStudentId, searchBusId, dateRange, filter, logs]);

  const exportToCSV = () => {
    const headers = ['Student ID,Student Name,Bus ID,Status,Timestamp\n'];
    const rows = filteredLogs.map(log => 
      `${log.studentId?.studentId || 'N/A'},${log.studentId?.name || 'N/A'},${log.busId || 'N/A'},${log.status},${new Date(log.timestamp).toLocaleString()}\n`
    );
    const csvContent = headers.concat(rows).join('');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Dashboard</h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  placeholder="Search by Student ID"
                  value={searchStudentId}
                  onChange={(e) => setSearchStudentId(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Search by Bus ID"
                  value={searchBusId}
                  onChange={(e) => setSearchBusId(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('Today')}
                  className={`px-4 py-2 rounded-md ${filter === 'Today' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilter('Last 7 Days')}
                  className={`px-4 py-2 rounded-md ${filter === 'Last 7 Days' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setFilter('All')}
                  className={`px-4 py-2 rounded-md ${filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition`}
                >
                  All
                </button>
              </div>
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Export to CSV
              </button>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                <p className="ml-4 text-gray-600">Loading attendance logs...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No attendance logs found.</p>
              </div>
            )}

            {!loading && !error && filteredLogs.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log, index) => (
                      <tr
                        key={log._id}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.studentId?.studentId || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.studentId?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.busId || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.status === 'Check In'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {log.status === 'Check In' ? 'Boarded' : 'Alighted'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendanceDashboard;