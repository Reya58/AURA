import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the custom hook
import './Login.css';

const Login = () => {
  const [email, setEmailInput] = useState(''); // Local state for the email input
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setEmail } = useAuth(); // Access setEmail from the global context
  const navigate = useNavigate(); // For redirection after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    // Simulate API call (replace with real fetch to your backend)
    try {
      const response = await fetch('https://aura-pz3yexz22-shreyas-projects-f842d25f.vercel.app/api/auth/login', { // Example endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setEmail(email); // Store email in global context
        // Save the token from the backend response
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        navigate('/dashboard'); // Redirect to a protected page (adjust as needed)
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="https://media.giphy.com/media/3o7TKz9bX9v9Kz9b9K/giphy.gif" // Example beating heart GIF (replace with your own)
          alt="Health App Logo"
          className="logo"
        />
        <h2>Health App Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmailInput(e.target.value)} // Update local state
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="forgot-password">Forgot password? <a href="#">Reset here</a></p>
        <p className="toggle-mode">New user? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default Login;
