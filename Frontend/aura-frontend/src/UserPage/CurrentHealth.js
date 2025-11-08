import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Adjust the import path to where your useAuth hook is defined

// This component fetches health data using Axios with token authentication and email from useAuth in query params,
// displays it in a classy layout using inline styles.

const HealthDataDisplay = () => {
  const { email } = useAuth(); // Assuming useAuth returns { email } (and possibly other properties)
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve token from localStorage
      const token = localStorage.getItem('token'); 
      try {
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }
        if (!email) {
          setError('User email not found. Please log in.');
          setLoading(false);
          return;
        }

        // Replace with your actual API endpoint, including email in query params
        const response = await axios.get(`http://localhost:5000/api/user/latest-health-data?email=${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}` // Add token to Authorization header
          }
        });
        
        const fetchedData = response.data.latest;
        setData(fetchedData);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please check your token.');
        } else {
          setError('Failed to fetch data. Please try again.');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [email]); // Only depend on email; token is retrieved inside and doesn't need to trigger re-runs

  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Formats to a readable date-time string
  };

  // Determine status color and icon based on value
  const getStatusDetails = (status) => {
    if (status === 'NO BEAT') return { color: '#ef4444', icon: '⚠️' }; // Red for critical
    return { color: '#10b981', icon: '✅' }; // Green for normal
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #faf5ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          height: '8rem',
          width: '8rem',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #faf5ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#ef4444', fontWeight: '600' }}>{error}</p>
        </div>
      </div>
    );
  }

  const statusDetails = getStatusDetails(data.STATUS);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #dbeafe, #faf5ff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '32rem',
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '1rem',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{
          background: 'linear-gradient(to right, #2563eb, #7c3aed)',
          padding: '1.5rem'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ marginRight: '0.5rem' }}>🏥</span> Health Monitor
          </h2>
        </div>
        <div style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🫀</span>
            <div>
              <p style={{ color: '#6b7280', fontWeight: '500' }}>ECG</p>
              <p style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '1.25rem' }}>{data.ECG}</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <span style={{ fontSize: '1.5rem' }}>💓</span>
            <div>
              <p style={{ color: '#6b7280', fontWeight: '500' }}>BPM</p>
              <p style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '1.25rem' }}>{data.BPM}</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🌡️</span>
            <div>
              <p style={{ color: '#6b7280', fontWeight: '500' }}>Temperature</p>
              <p style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '1.25rem' }}>{data.TEMP} °C</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <span style={{ fontSize: '1.5rem' }}>{statusDetails.icon}</span>
            <div>
              <p style={{ color: '#6b7280', fontWeight: '500' }}>Status</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.25rem', color: statusDetails.color }}>{data.STATUS}</p>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#6b7280', fontWeight: '500' }}>Timestamp:</span>
            <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '0.875rem' }}>{formatTimestamp(data.timestamp)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem'
          }}>
            <span style={{ color: '#6b7280', fontWeight: '500' }}>ID:</span>
            <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '0.875rem' }}>{data._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDataDisplay;
