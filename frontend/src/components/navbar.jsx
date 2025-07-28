// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bus, Video, Map, BarChart3, PlusCircle, LogIn, UserPlus, LogOut } from "lucide-react";
import axios from "../api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignupAllowed, setIsSignupAllowed] = useState(true); // controls Signup visibility

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/admin/me', { withCredentials: true });
        setIsAuthenticated(res.data.loggedIn);

        const signupDoneThisSession = sessionStorage.getItem("signupDone") === "true";
        setIsSignupAllowed(res.data.allowSignup && !signupDoneThisSession);
      } catch (error) {
        setIsAuthenticated(false);
        const signupDoneThisSession = sessionStorage.getItem("signupDone") === "true";
        setIsSignupAllowed(!signupDoneThisSession); // fallback
      }
    };
    checkAuth();
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Bus size={20} /> },
    { name: "Live Stream", path: "/live-streams", icon: <Video size={20} /> },
    { name: "Track Bus", path: "/buslocation", icon: <Map size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={20} /> },
    { name: "Add Bus", path: "/addbus", icon: <PlusCircle size={20} /> },
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

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/login"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <LogIn size={20} />
                Login
              </Link>

          
                <Link
                  to="/signup"
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/signup"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <UserPlus size={20} />
                  Signup
                </Link>

            
            </>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <LogOut size={20} />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
