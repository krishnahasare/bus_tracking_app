import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  DirectionsBus as BusIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const AttendanceDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [searchBusId, setSearchBusId] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filter, setFilter] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
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

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      {/* Sidebar */}
      <div className={`bg-blue-800 text-white w-64 space-y-6 py-6 px-4 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out z-30`}>
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        <nav className="flex flex-col space-y-2">
          <SidebarLink icon={<HomeIcon />} label="Home" onClick={() => navigate('/')} />
          <SidebarLink icon={<BusIcon />} label="Attendance Dashboard" onClick={() => navigate('/attendance')} />
          <SidebarLink icon={<SearchIcon />} label="Bus Location Search" onClick={() => navigate('/searchlocation')} />
          <SidebarLink icon={<PeopleIcon />} label="Student Logs" onClick={() => navigate('/student-logs')} />
          <SidebarLink icon={<WarningIcon />} label="Emergencies / Overspeeding" onClick={() => navigate('/emergencies-overspeeding')} />
          <SidebarLink icon={<AddIcon />} label="Add Bus" onClick={() => navigate('/add-bus')} />
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Navbar */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button onClick={toggleSidebar} className="text-gray-600">
                {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">School Name</h1>
            </div>
            <button className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition">
              <LogoutIcon fontSize="small" className="mr-2" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Attendance Dashboard</h2>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Search by Student ID"
                  value={searchStudentId}
                  onChange={(e) => setSearchStudentId(e.target.value)}
                  className="input-style"
                />
                <input
                  type="text"
                  placeholder="Search by Bus ID"
                  value={searchBusId}
                  onChange={(e) => setSearchBusId(e.target.value)}
                  className="input-style"
                />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="input-style"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="input-style"
                />
              </div>
              <div className="flex gap-2">
                {['Today', 'Last 7 Days', 'All'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setFilter(range)}
                    className={`px-4 py-2 rounded-md ${filter === range ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition`}
                  >
                    {range}
                  </button>
                ))}
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Export to CSV
                </button>
              </div>
            </div>

            {/* Table or Feedback */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading attendance logs...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">{error}</div>
            ) : filteredLogs.length === 0 ? (
              <p className="text-center text-gray-600 py-12">No attendance logs found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Student ID', 'Student Name', 'Bus ID', 'Status', 'Timestamp'].map((col) => (
                        <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log, index) => (
                      <tr key={log._id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 text-sm text-gray-900">{log.studentId?.studentId || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{log.studentId?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{log.busId || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            log.status === 'Check In' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status === 'Check In' ? 'Boarded' : 'Alighted'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</td>
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

// Reusable sidebar button component
const SidebarLink = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-700 rounded-md transition">
    {icon}
    <span>{label}</span>
  </button>
);

export default AttendanceDashboard;
