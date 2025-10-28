import React, { useState } from 'react';
import './Login.css'; // Reuse the same CSS for consistency (or create a separate Register.css)
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
    const { setEmail } = useAuth();
const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Register validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    console.log('Registering with:', formData);
     // Simulate API call (replace with real fetch to your backend)
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', { // Example endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email:formData.email,password:formData.password,name:formData.name}),
      });
      const data = await response.json();
      if (response.ok) {
        setEmail(formData.email); // Store email in global context
        navigate('/login'); // Redirect to a protected page (adjust as needed)
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  
  };

  return (
    <div className="login-container"> {/* Reuse container class */}
      <div className="login-card"> {/* Reuse card class */}
        <img
          src="https://media.giphy.com/media/3o7TKz9bX9v9Kz9b9K/giphy.gif" // Same logo (replace with your own)
          alt="Health App Logo"
          className="logo"
        />
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-btn">Register</button>
        </form>
        <p className="toggle-mode">Already have an account? <a href="/login">Login here</a></p> {/* Link back to login */}
      </div>
    </div>
  );
};

export default Register;