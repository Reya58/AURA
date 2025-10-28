import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Only import BrowserRouter once
import { AuthProvider } from './AuthContext';
import Login from './AuthPage/Login';
import Register from './AuthPage/Register';
import Dashboard from './UserPage/Dashboard';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
