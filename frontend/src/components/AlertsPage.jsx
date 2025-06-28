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
    const interval = setInterval(fetchAlerts, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Get border color based on type
  const getBorderColor = (type) => {
    switch (type) {
      case 'Emergency':
        return '#DC2626'; // red
      case 'SpeedViolation':
        return '#F59E0B'; // orange
      case 'GeoFence':
        return '#3B82F6'; // blue
      case 'Delay':
        return '#8B5CF6'; // purple
      case 'Idle':
        return '#10B981'; // green
      default:
        return '#9CA3AF'; // gray
    }
  };

  // Badge color based on severity
  const getSeverityBadge = (severity) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Alerts & Notifications</h2>

        {error && (
          <div className="text-red-600 mb-4 bg-red-100 p-3 rounded">{error}</div>
        )}

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-gray-500">No alerts at the moment.</p>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={index}
                className="bg-white border-l-4 shadow p-4 rounded-md flex flex-col gap-1"
                style={{
                  borderColor: getBorderColor(alert.type),
                }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {alert.type} Alert
                  </h3>
                  <span className={`text-sm px-2 py-1 rounded ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity?.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-700">{alert.message}</p>

                <div className="text-sm text-gray-500">
                  <strong>Bus ID:</strong> {alert.busId} &nbsp;|&nbsp;
                  <strong>Time:</strong> {new Date(alert.timestamp).toLocaleString()}
                </div>

                {alert.location?.latitude && (
                  <p className="text-xs text-gray-400">
                    Location: {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
