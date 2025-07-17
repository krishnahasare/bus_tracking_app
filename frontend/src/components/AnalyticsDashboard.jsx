import React, { useEffect, useState } from 'react';
import axios from 'axios';


const AnalyticsDashboard = () => {
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [distanceSummary, setDistanceSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const BUS_ID = 'bus_201'; // Later make this dynamic

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [attendanceRes, distanceRes] = await Promise.all([
          axios.get('https://bus-tracking-app-wt0f.onrender.com/analytics/attendance/weekly-summary'),
          axios.get(`https://bus-tracking-app-wt0f.onrender.com/analytics/distance/weekly-summary/${BUS_ID}`)
        ]);

        setAttendanceSummary(Array.isArray(attendanceRes.data) ? attendanceRes.data : []);
        setDistanceSummary(Array.isArray(distanceRes.data) ? distanceRes.data : []);
      } catch (err) {
        console.error('❌ Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        📊 Weekly Analytics Dashboard
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Fetching analytics data...</p>
      ) : (
        <div className="space-y-10">

          {/* Attendance Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">🧍 Attendance Summary (7 Days)</h2>
            {attendanceSummary.length === 0 ? (
              <p className="text-gray-500">No attendance data available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {attendanceSummary.map((day, i) => (
                  <div key={i} className="bg-white rounded-xl shadow border p-4">
                    <h4 className="font-semibold text-lg">{day.date}</h4>
                    <p className="text-green-600">✅ Check-ins: {day.checkIn}</p>
                    <p className="text-red-500">🚪 Check-outs: {day.checkOut}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Distance Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-purple-700">🚌 Distance Travelled by {BUS_ID}</h2>
            {distanceSummary.length === 0 ? (
              <p className="text-gray-500">No distance data found for this bus.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {distanceSummary.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl shadow border p-4">
                    <h4 className="font-semibold text-lg">{item.date}</h4>
                    <p className="text-blue-600">📏 Distance: {item.distance} km</p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
