import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  MapPin,
  BarChart3,
  Users,
  AlertCircle,
  BusFront,
  LogOut,
  Video,
  PlusCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const menu = [
    { label: "Add Bus", icon: PlusCircle, path: "addbus" },
    { label: "Student Logs", icon: Users, path: "student-logs" },
    { label: "Track Location", icon: MapPin, path: "buslocation" },
    { label: "Analytics", icon: BarChart3, path: "analytics" },
    { label: "Alerts", icon: AlertCircle, path: "/api/alerts" },
    { label: "Live Video", icon: Video, path: "live-streams" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg border-r min-h-screen flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold p-6 text-indigo-600">BusTrack Admin</h1>
            <nav className="px-4">
              {menu.map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 p-3 my-1 rounded-lg hover:bg-indigo-50 cursor-pointer text-gray-700 hover:text-indigo-600"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
           
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-semibold mb-6">Welcome, Admin</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              icon={<Users className="text-green-600" />}
              title="Student Logs"
              desc="Attendance & pickup records."
              onClick={() => navigate("/student-logs")}
            />
            <DashboardCard
              icon={<BusFront className="text-purple-600" />}
              title="Attendance Dashboard"
              desc="Monitor student attendance."
              onClick={() => navigate("/attendance")}
            />
            <DashboardCard
              icon={<Video className="text-indigo-600" />}
              title="Live Video"
              desc="View bus camera streams."
              onClick={() => navigate("/live-streams")}
            />
            <DashboardCard
              icon={<MapPin className="text-yellow-600" />}
              title="Live Tracking"
              desc="Track bus in real-time."
              onClick={() => navigate("/buslocation")}
            />
            <DashboardCard
              icon={<BarChart3 className="text-blue-600" />}
              title="Analytics"
              desc="Check route & timing analytics."
              onClick={() => navigate("/analytics")}
            />
            <DashboardCard
              icon={<AlertCircle className="text-red-600" />}
              title="Alerts"
              desc="View emergency or geo-fence alerts."
              onClick={() => navigate("/api/alerts")}
            />
            <DashboardCard
              icon={<PlusCircle className="text-purple-600" />}
              title="Add Bus"
              desc="Register a new bus to the system."
              onClick={() => navigate("/addbus")}
            />
            
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="p-5 bg-white shadow-md rounded-2xl cursor-pointer hover:shadow-xl transition border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div className="text-xl font-bold text-gray-800">{title}</div>
      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
        {icon}
      </div>
    </div>
    <p className="text-gray-500 mt-2 text-sm">{desc}</p>
  </div>
);

export default AdminDashboard;
