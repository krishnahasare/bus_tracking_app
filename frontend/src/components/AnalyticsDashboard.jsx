import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts';

const AnalyticsDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [distanceData, setDistanceData] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState('bus_201'); // default bus

  useEffect(() => {
    fetchAttendance();
    fetchDistance(selectedBusId);
  }, [selectedBusId]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get('https://bus-tracking-app-wt0f.onrender.com/analytics/attendance/weekly-summary');
      setAttendanceData(res.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchDistance = async (busId) => {
    try {
      const res = await axios.get(`https://bus-tracking-app-wt0f.onrender.com/analytics/distance/weekly-summary/${busId}`);
      setDistanceData(res.data);
    } catch (error) {
      console.error('Error fetching distance:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📊 Weekly Analytics Dashboard</h2>

      {/* Attendance Chart */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">🧍 Weekly Attendance</h3>
        <BarChart width={700} height={300} data={attendanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="checkIn" fill="#4ade80" name="Check In" />
          <Bar dataKey="checkOut" fill="#60a5fa" name="Check Out" />
        </BarChart>
      </div>

      {/* Bus Selection */}
      <div className="mb-4">
        <label className="font-medium mr-2">Select Bus:</label>
        <select
          value={selectedBusId}
          onChange={(e) => setSelectedBusId(e.target.value)}
          className="border rounded p-2"
        >
          <option value="bus_201">Bus 201</option>
          <option value="bus_202">Bus 202</option>
          <option value="bus_203">Bus 203</option>
          <option value="bus_204">Bus 204</option>
          <option value="bus_205">Bus 205</option>
        </select>
      </div>

      {/* Distance Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2">🚌 Distance Traveled (Daily)</h3>
        <LineChart width={700} height={300} data={distanceData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Km', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="distance" stroke="#f87171" name="Distance (km)" />
        </LineChart>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
