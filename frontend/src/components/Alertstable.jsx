// src/components/AlertsTable.jsx
export default function AlertsTable({ alerts }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Latest Alerts</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Time</th>
            <th>Type</th>
            <th>Bus ID</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, idx) => (
            <tr key={idx} className="border-b">
              <td>{alert.time}</td>
              <td>{alert.type}</td>
              <td>{alert.busId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
