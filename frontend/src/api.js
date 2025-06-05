import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/attendance';

export const fetchAllLogs = () => axios.get(`${BASE_URL}/admin/all`);
export const fetchStudentLogs = (rfidUid) => axios.get(`${BASE_URL}/student/${rfidUid}`);
