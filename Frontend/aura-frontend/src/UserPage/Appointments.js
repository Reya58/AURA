// Appointment.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // ✅ Import your AuthContext

const Appointment = () => {
  const { email } = useAuth(); // ✅ Get logged-in user’s email
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .appointment-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: 'Arial', sans-serif;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .appointment-title {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
        font-size: 2em;
      }

      .no-appointments {
        text-align: center;
        color: #666;
        font-style: italic;
      }

      .appointment-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .appointment-card {
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
      }

      .appointment-card:hover {
        transform: translateY(-5px);
      }

      .appointment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .disease-name {
        margin: 0;
        color: #2c3e50;
        font-size: 1.5em;
      }

      .status {
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 0.9em;
        font-weight: bold;
        text-transform: uppercase;
      }

      .status.ongoing {
        background-color: #27ae60;
        color: white;
      }

      .status.paused {
        background-color: #f39c12;
        color: white;
      }

      .disease-summary {
        color: #555;
        margin-bottom: 15px;
      }

      .appointment-details p {
        margin: 5px 0;
        color: #333;
      }

      .medications-list {
        list-style-type: disc;
        margin-left: 20px;
        color: #555;
      }

      .loading {
        text-align: center;
        color: #666;
      }

      .error {
        text-align: center;
        color: #e74c3c;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ✅ Fetch patient data by email
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(
          `https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/diseases?email=${encodeURIComponent(email)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch patient details');

        const data = await response.json();
        if (!data || !data.diseases) throw new Error('Invalid data received');
        setDiseases(data.diseases);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchPatientDetails();
  }, [email]);

  const now = new Date();

  // ✅ Filter out past appointments (including earlier today)
  const upcomingAppointments = diseases
    .filter(d => {
      if (!d.nextAppointment) return false;
      const appointmentDate = new Date(d.nextAppointment);
      return appointmentDate.getTime() > now.getTime(); // strictly future
    })
    .sort((a, b) => new Date(a.nextAppointment) - new Date(b.nextAppointment));

  const getAppointmentId = (date) =>
    new Date(date).toISOString().replace(/[:.]/g, '-');

  // ✅ Loading & error states
  if (loading)
    return (
      <div className="appointment-container">
        <p className="loading">Loading appointments...</p>
      </div>
    );

  if (error)
    return (
      <div className="appointment-container">
        <p className="error">Error: {error}</p>
      </div>
    );

  // ✅ Main UI
  return (
    <div className="appointment-container">
      <h2 className="appointment-title">Upcoming Appointments</h2>
      {upcomingAppointments.length === 0 ? (
        <p className="no-appointments">No upcoming appointments.</p>
      ) : (
        <div className="appointment-list">
          {upcomingAppointments.map((disease) => (
            <div
              key={getAppointmentId(disease.nextAppointment)}
              className="appointment-card"
            >
              <div className="appointment-header">
                <h3 className="disease-name">{disease.name}</h3>
                <span className={`status ${disease.status?.toLowerCase()}`}>
                  {disease.status}
                </span>
              </div>

              <p className="disease-summary">{disease.summary}</p>

              <div className="appointment-details">
                <p>
                  <strong>Assigned Doctor:</strong>{' '}
                  {disease.assignedDoctor || 'N/A'}
                </p>
                <p>
                  <strong>Next Appointment:</strong>{' '}
                  {new Date(disease.nextAppointment).toLocaleString()}
                </p>
                <p>
                  <strong>Medications:</strong>
                </p>
                <ul className="medications-list">
                  {disease.medications?.map((med, index) => (
                    <li key={index}>
                      {med.name} – {med.dose} ({med.duration})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointment;
