// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Smart Bus Tracker | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
