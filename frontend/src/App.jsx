import AdminDashboard from './components/AdminDashboard';
import StudentLogs from './components/StudentLogs';

export default function App() {
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <StudentLogs />
      <hr className="my-6" />
      <AdminDashboard />
    </div>
  );
}
