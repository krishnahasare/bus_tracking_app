// src/components/Footer.jsx
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white mt-12 shadow-2xl rounded-t-2xl">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-6 py-10"
      >
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold">Smart Bus Tracker</h2>
            <p className="text-sm text-gray-200 mt-2">
              Real-time school bus tracking with safety, reliability, and smart analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-200">
              <li className="hover:text-white transition">Dashboard</li>
              <li className="hover:text-white transition">Analytics</li>
              <li className="hover:text-white transition">Track Bus</li>
              <li className="hover:text-white transition">Contact</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold text-lg mb-3">Connect With Us</h3>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30"
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30"
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-6"></div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-200">
          © {new Date().getFullYear()} Smart Bus Tracker | All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
