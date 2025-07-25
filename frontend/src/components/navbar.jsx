// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { Bus, Video, Map, BarChart3, PlusCircle } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", path: "/", icon: <Bus size={20} /> },
    { name: "Live Stream", path: "/live-streams", icon: <Video size={20} /> },
    { name: "Track Bus", path: "/buslocation", icon: <Map size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={20} /> },
    { name: "Add Bus", path: "/addbus", icon: <PlusCircle size={20} /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Smart Bus</h1>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
