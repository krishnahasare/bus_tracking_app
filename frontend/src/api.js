import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔒 Required for session cookies
});

// ✅ Attendance APIs
export const fetchAllLogs = () => axiosInstance.get('/api/attendance/admin/all');
export const fetchStudentLogs = (rfidUid) => axiosInstance.get(`/api/attendance/student/${rfidUid}`);

// ✅ Admin Auth APIs
export const adminLogin = (credentials) => axiosInstance.post('/api/admin/login', credentials);
export const adminSignup = (data) => axiosInstance.post('/api/admin/signup', data);
export const adminLogout = () => axiosInstance.get('/api/admin/logout'); // ✅ changed to GET
export const checkLoginStatus = () => axiosInstance.get('/api/admin/check'); // ✅ for frontend

export default axiosInstance;
