// src/pages/Dashboard.jsx
import KPICard from "../components/KpiCards";
import LiveMap from "../components/Livemap";
import AttendanceChart from "../components/AttendanceChart";
import AlertsChart from "../components/AlertsChart";
import AlertsTable from "../components/Alertstable";

export default function Dashboard() {
  const buses = [{ lat: 17.57, lng: 74.2 }];
  const attendanceData = [
    { date: "Mon", present: 120 },
    { date: "Tue", present: 130 },
    { date: "Wed", present: 125 },
  ];
  const alertsData = [
    { date: "Mon", alerts: 3 },
    { date: "Tue", alerts: 5 },
    { date: "Wed", alerts: 2 },
  ];
  const alerts = [
    { time: "10:00 AM", type: "Geofence Violation", busId: "Bus-12" },
    { time: "10:15 AM", type: "Delay", busId: "Bus-5" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard title="Total Buses Running" value="8" />
        <KPICard title="Students Present Today" value="120" />
        <KPICard title="Active Alerts" value="3" />
      </div>

      {/* Live Map */}
      <LiveMap buses={buses} />

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <AttendanceChart data={attendanceData} />
        <AlertsChart data={alertsData} />
      </div>

      {/* Alerts Table */}
      <AlertsTable alerts={alerts} />
    </div>
  );
}
