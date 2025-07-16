import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnalyticsDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [distanceData, setDistanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const busId = 'bus_201'; // You can make this dynamic if needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, distanceRes] = await Promise.all([
          axios.get('https://bus-tracking-app-wt0f.onrender.com/analytics/attendance/weekly-summary'),
          axios.get(`https://bus-tracking-app-wt0f.onrender.com/analytics/distance/weekly-summary/${busId}`)
        ]);

        if (Array.isArray(attendanceRes.data)) {
          setAttendanceData(attendanceRes.data);
        } else {
          console.warn('Attendance data not in array format:', attendanceRes.data);
          setAttendanceData([]);
        }

        if (Array.isArray(distanceRes.data)) {
          setDistanceData(distanceRes.data);
        } else {
          console.warn('Distance data not in array format:', distanceRes.data);
          setDistanceData([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">📊 Weekly Analytics Dashboard</h2>

      {loading && <p className="text-center text-gray-500">Loading data...</p>}

      {!loading && (
        <>
          {/* Attendance Summary */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">🧍 Student Attendance (Last 7 Days)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attendanceData.map((day, i) => (
                <div key={i} className="p-4 bg-gray-100 rounded-lg shadow-sm border">
                  <h4 className="font-semibold">{day.date}</h4>
                  <p>✅ Check-ins: {day.checkIn}</p>
                  <p>🚪 Check-outs: {day.checkOut}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Distance Summary */}
          <div>
            <h3 className="text-xl font-semibold mb-4">🚌 Distance Travelled by {busId}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {distanceData.map((day, i) => (
                <div key={i} className="p-4 bg-blue-50 rounded-lg shadow-sm border">
                  <h4 className="font-semibold">{day.date}</h4>
                  <p>📏 Distance: {day.distance} km</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
