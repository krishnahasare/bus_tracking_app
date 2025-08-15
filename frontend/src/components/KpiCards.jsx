// src/components/KPICard.jsx
export default function KPICard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
