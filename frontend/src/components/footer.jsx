// src/components/Footer.jsx
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Smart Bus Tracker</h3>
          <p className="text-sm leading-relaxed">
            A next-gen platform for safe, real-time school bus tracking with 
            smart analytics and live monitoring.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/analytics" className="hover:text-white">Analytics</a></li>
            <li><a href="/students" className="hover:text-white">Student Logs</a></li>
            <li><a href="/track" className="hover:text-white">Track Bus</a></li>
            <li><a href="/admin" className="hover:text-white">Admin Dashboard</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-sm">📍 Kolhapur, Maharashtra</p>
          <p className="text-sm flex items-center gap-2 mt-2">
            <Mail size={16} /> support@smartbus.com
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-blue-400"><Facebook size={20} /></a>
            <a href="#" className="hover:text-sky-400"><Twitter size={20} /></a>
            <a href="#" className="hover:text-blue-600"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Smart Bus Tracker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
