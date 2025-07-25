import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('https://bus-tracking-app-wt0f.onrender.com/api/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch alerts.');
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const getBorderColor = (type) => {
    switch (type) {
      case 'Emergency': return '#EF4444'; // Red
      case 'SpeedViolation': return '#F97316'; // Orange
      case 'GeoFence': return '#3B82F6'; // Blue
      case 'Delay': return '#8B5CF6'; // Purple
      case 'Idle': return '#10B981'; // Green
      default: return '#D1D5DB'; // Gray
    }
  };

  const getSeverityBadge = (severity) => {
    const map = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    };
    return map[severity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Alerts & Notifications</h1>
          <p className="text-gray-500 mt-1">Monitor all alerts triggered from buses in real-time.</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow mb-6">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {alerts.length === 0 ? (
            <div className="text-gray-500">No alerts at the moment.</div>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md border-l-[6px] p-5 transition hover:shadow-lg"
                style={{ borderColor: getBorderColor(alert.type) }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{alert.type} Alert</h2>
                    <p className="text-gray-600 mt-1">{alert.message}</p>
                  </div>
                  <div className={`text-sm font-medium px-3 py-1 rounded-full ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity?.toUpperCase()}
                  </div>
                </div>

                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  <p><strong>Bus ID:</strong> {alert.busId}</p>
                  <p><strong>Time:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
                  {alert.location?.latitude && (
                    <p className="text-xs text-gray-400">
                      Location: {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
