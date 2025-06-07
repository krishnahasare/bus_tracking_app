import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import StudentLogs from './components/StudentLogs';
import SearchLocation from './components/SearchLocation';

function AppLayout() {
  const location = useLocation();

  return (
    <div className="max-w-6xl mx-auto mt-8">
      {/* Show "Go to Bus Location Search" only on home */}
      {location.pathname === '/' && (
        <Link to="/searchlocation">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Go to Bus Location Search
          </button>
        </Link>
      )}

      {/* Show Back button only on /searchlocation */}
      {location.pathname === '/searchlocation' && (
        <Link to="/">
          <button className="bg-green-500 text-white px-4 py-2 rounded mb-4">
            ← Back to Student Logs
          </button>
        </Link>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <StudentLogs />
              <hr className="my-6" />
              <AdminDashboard />
            </>
          }
        />
        <Route path="/searchlocation" element={<SearchLocation />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
