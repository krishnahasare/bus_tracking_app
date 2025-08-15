// src/components/AlertsChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AlertsChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Alerts Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="alerts" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
