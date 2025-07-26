// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupDisabled, setIsSignupDisabled] = useState(false);

  // ✅ Check session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/admin/session', { withCredentials: true });
        setIsLoggedIn(res.data.loggedIn);
        setIsSignupDisabled(res.data.signupDisabled); // optional flag from backend
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isSignupDisabled }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
