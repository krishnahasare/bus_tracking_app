import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">School Name</h1>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-200 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome + CTA */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
          <h2 className="text-xl font-semibold">Welcome to the Admin Dashboard</h2>
          <button
            onClick={() => navigate('/addbus')}
            className="bg-green-600 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            ➕ Add New Bus
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Attendance Dashboard',
              desc: 'View and manage student attendance logs.',
              route: '/attendance',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              ),
            },
            {
              title: 'Bus Location',
              desc: 'Track the real-time location of buses.',
              route: '/buslocation',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M17.657 16.243l-4.243-4.243m0 0l-4.243 4.243m4.243-4.243l4.243-4.243m-4.243 4.243l-4.243-4.243m0 0a6 6 0 1112 0 6 6 0 01-12 0z" />
              ),
            },
            {
              title: 'Student Logs',
              desc: 'View and log individual student records.',
              route: '/student-logs',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              ),
            },
            {
              title: 'Alert Notifications',
              desc: 'Monitor emergencies and overspeeding incidents.',
              route: '/emergencies-overspeeding',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 9v2m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z" />
              ),
            },
            {
              title: 'Live Streams',
              desc: 'Watch live bus camera footage',
              route: '/live-streams',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 10l4.553-2.276A2 2 0 0122 9.618v4.764a2 2 0 01-2.447 1.894L15 14M4 6h8M4 10h8M4 14h4" />
              ),
            },
          ].map((card, idx) => (
            <div
              key={idx}
              onClick={() => navigate(card.route)}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-200 p-6 flex flex-col items-center text-center cursor-pointer transition group"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {card.icon}
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-6 border-t mt-12">
        © {new Date().getFullYear()} @ all rights reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;
