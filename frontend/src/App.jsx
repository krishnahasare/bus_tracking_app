import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AttendanceDashboard from "./components/AttendanceDashboard";
import StudentLogs from './components/StudentLogs';
import SearchLocation from './components/SearchLocation';
import AlertsPage from './components/AlertsPage';
import AddBus from './components/AddBus';
import LiveStream from './components/LiveStream'; 
import Navbar from './components/navbar';
import Footer from './components/Footer';

// ✅ New components
import Login from './components/Login';
import Signup from './components/Signup';

// ✅ Auth context
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/attendance" element={<AttendanceDashboard />} />
          <Route path="/buslocation" element={<SearchLocation />} />
          <Route path="/student-logs" element={<StudentLogs />} />
          <Route path="/addbus" element={<AddBus />} />
          <Route path="/live-streams" element={<LiveStream />} />
          <Route path="/analytics" element={<h1>Analytics Dashboard (To be implemented)</h1>} />
          <Route path="/emergencies-overspeeding" element={<div>Emergencies/Overspeeding Page (To be implemented)</div>} />
          <Route path="/api/alerts" element={<AlertsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}
