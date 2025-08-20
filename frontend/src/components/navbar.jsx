import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Bus,
  Video,
  Map,
  BarChart3,
  PlusCircle,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import axios from "../api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/admin/me", {
          withCredentials: true,
        });
        if (res.status === 200) setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Bus size={18} /> },
    { name: "Live Stream", path: "/live-streams", icon: <Video size={18} /> },
    { name: "Track Bus", path: "/buslocation", icon: <Map size={18} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={18} /> },
    { name: "Add Bus", path: "/addbus", icon: <PlusCircle size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      await axios.get("/api/admin/logout", { withCredentials: true });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-lg shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Branding */}
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
          SmartBus
        </h1>

        {/* Navigation Items */}
        <div className="flex gap-2 items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-105"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}

          {/* Auth buttons */}
          {isAuthenticated === false && (
            <>
              <Link
                to="/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === "/login"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-105"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LogIn size={18} />
                Login
              </Link>

              <Link
                to="/signup"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === "/signup"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-105"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <UserPlus size={18} />
                Signup
              </Link>
            </>
          )}

          {isAuthenticated === true && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md transition-all duration-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
