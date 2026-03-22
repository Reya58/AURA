import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  
const navigate = useNavigate();
  const [email, setEmailState] = useState(() => localStorage.getItem('email') || null);

  // Load from localStorage on mount (for persistence)
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmailState(storedEmail);
    }
  }, []);

  // Set email function
  const setEmail = (newEmail) => {
    setEmailState(newEmail);
    localStorage.setItem('email', newEmail);
  };

  // Clear email function (e.g., for logout)
  const clearEmail = () => {
    setEmailState(null);
    localStorage.removeItem('email');
    localStorage.removeItem('token'); // Also clear token on logout
    navigate('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ email, setEmail, clearEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};