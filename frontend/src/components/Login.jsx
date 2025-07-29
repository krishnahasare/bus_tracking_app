import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPasswordValid = (password) =>
    password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValidEmail(form.email) || !isPasswordValid(form.password)) {
      return;
    }

    try {
      await adminLogin(form);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                touched.email
                  ? isValidEmail(form.email)
                    ? "border-green-500 focus:ring-green-500"
                    : "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {touched.email && isValidEmail(form.email) && (
              <p className="text-green-600 text-sm mt-1">Looks good!</p>
            )}
            {touched.email && !isValidEmail(form.email) && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid Email.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                touched.password
                  ? isPasswordValid(form.password)
                    ? "border-green-500 focus:ring-green-500"
                    : "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {touched.password && isPasswordValid(form.password) && (
              <p className="text-green-600 text-sm mt-1">Looks good!</p>
            )}
            {touched.password && !isPasswordValid(form.password) && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 6 characters.
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
