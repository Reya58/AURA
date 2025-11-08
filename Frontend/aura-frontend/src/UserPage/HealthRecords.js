import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // For accessing email

const Diseases = () => {
  const { email } = useAuth(); // Get email from global context
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [newDisease, setNewDisease] = useState({
    name: '',
    summary: '',
    medications: [{ name: '', dose: '', timing: [], duration: '', status: 'pending' }],
    assignedDoctor: '',
    nextAppointment: '',
    status: 'ongoing',
  });

  const timingOptions = ['Morning', 'Afternoon', 'Evening', 'Night'];

  // ✅ Fetch diseases from API
  useEffect(() => {
    if (!email) {
      setError('Email not found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchDiseases = async () => {
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

        if (!response.ok) throw new Error('Failed to fetch diseases');
        const data = await response.json();
        setDiseases(data.diseases || []);
      } catch (err) {
        setError('Error loading diseases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, [email]);

  // ✅ Medication handlers
  const addMedication = () => {
    setNewDisease({
      ...newDisease,
      medications: [
        ...newDisease.medications,
        { name: '', dose: '', timing: [], duration: '', status: 'pending' },
      ],
    });
  };

  const removeMedication = (index) => {
    setNewDisease({
      ...newDisease,
      medications: newDisease.medications.filter((_, i) => i !== index),
    });
  };

  const handleMedChange = (index, field, value) => {
    const updatedMeds = newDisease.medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setNewDisease({ ...newDisease, medications: updatedMeds });
  };

  const toggleTiming = (medIndex, option) => {
    const updatedMeds = [...newDisease.medications];
    const med = updatedMeds[medIndex];
    const existingIndex = med.timing.findIndex((t) => t.slot === option);
    if (existingIndex !== -1) {
      med.timing.splice(existingIndex, 1);
    } else {
      med.timing.push({ slot: option, status: 'pending' });
    }
    setNewDisease({ ...newDisease, medications: updatedMeds });
  };

  // ✅ Add Disease
  const handleAddDisease = async (e) => {
    e.preventDefault();
    console.log('Adding disease:', newDisease);

    if (!newDisease.name || !newDisease.summary) {
      alert('Please fill in name and summary.');
      return;
    }

    try {
      const response = await fetch(`https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/update-patient`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease: newDisease, email }),
      });

      if (!response.ok) throw new Error('Failed to add disease');

      const fetchResponse = await fetch(
        `https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/diseases?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await fetchResponse.json();
      setDiseases(data.diseases || []);

      // Reset form
      setNewDisease({
        name: '',
        summary: '',
        medications: [{ name: '', dose: '', timing: [], duration: '', status: 'pending' }],
        assignedDoctor: '',
        nextAppointment: '',
        status: 'ongoing',
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding disease:', err);
      alert('Error adding disease. Please try again.');
    }
  };

  // ✅ Update Disease Status
  const handleStatusChange = async (diseaseId, newStatus) => {
    try {
      const response = await fetch(`https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/update-med-status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, email, diseaseId }),
      });

      if (!response.ok) throw new Error('Failed to update disease status');

      const fetchResponse = await fetch(
        `https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/diseases?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await fetchResponse.json();
      setDiseases(data.diseases || []);
      setOpenDropdownId(null);
    //  alert('Disease status updated successfully!');
    } catch (err) {
      console.error('Error updating disease status:', err);
      alert('Error updating disease status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'green';
      case 'paused':
        return 'blue';
      case 'discontinued':
        return 'red';
      default:
        return 'gray';
    }
  };

if (loading) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your diseases & medications...</p>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          text-align: center;
          color: #555;
          font-size: 18px;
        }

        .spinner {
          width: 45px;
          height: 45px;
          border: 4px solid #d0d7e2;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

  

 if (error) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p>{error}</p>

      <style jsx>{`
        .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 60vh;
          text-align: center;
          color: #d9534f;
          font-size: 18px;
          padding: 0 20px;
        }

        .error-icon {
          font-size: 45px;
          margin-bottom: 10px;
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}


  return (
    <div className="profile-content">
      <div className="diseases-header">
        <h3>Diseases & Medications</h3>
        <button className="add-disease-btn" onClick={() => setShowAddForm(true)}>
          ➕ Add Disease
        </button>
      </div>
      <p>Track your health conditions and associated medications.</p>

      <div className="diseases-grid">
        {diseases.length === 0 ? (
          <p>No diseases recorded. Consult your doctor for updates!</p>
        ) : (
          diseases.map((disease) => (
            <div key={disease._id} className="disease-card">
              <div className="disease-header">
                <h4>{disease.name}</h4>
                <span className="disease-icon">🩺</span>
                <div
                  className="status-container"
                  style={{ marginLeft: 'auto', position: 'relative' }}
                >
                  <button
                    className="status-btn"
                    style={{
                      background: getStatusColor(disease.status || 'ongoing'),
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                    onClick={() =>
                      setOpenDropdownId(openDropdownId === disease._id ? null : disease._id)
                    }
                  >
                    {disease.status || 'ongoing'} ▼
                  </button>
                  {openDropdownId === disease._id && (
                    <div
                      className="status-dropdown"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        zIndex: 10,
                        minWidth: '120px',
                      }}
                    >
                      {['ongoing', 'paused', 'discontinued'].map((option) => (
                        <div
                          key={option}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            background: disease.status === option ? '#f0f0f0' : 'white',
                          }}
                          onClick={() => handleStatusChange(disease._id, option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className="summary">{disease.summary}</p>
              <div className="medications-section">
                <h5>Medications:</h5>
                {disease.medications && disease.medications.length > 0 ? (
                  <ul>
                    {disease.medications.map((med, index) => (
                      <li key={index}>
                        <strong>{med.name}</strong> - {med.dose} (
                        {Array.isArray(med.timing)
                          ? med.timing.map((t) => (typeof t === 'string' ? t : t.slot)).join(', ')
                          : ''}
                        , {med.duration})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No medications listed.</p>
                )}
              </div>

              <div className="doctor-info">
                <p>
                  <strong>Assigned Doctor:</strong>{' '}
                  {disease.assignedDoctor || 'Not assigned'}
                </p>
                <p>
                  <strong>Next Appointment:</strong>{' '}
                  {disease.nextAppointment
                    ? new Date(disease.nextAppointment).toLocaleString()
                    : 'Not scheduled'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Disease Popup */}
      {showAddForm && (
        <div className="popup-overlay" onClick={() => setShowAddForm(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h4>Add New Disease</h4>
            <form onSubmit={handleAddDisease}>
              <div className="form-group">
                <label>Disease Name:</label>
                <input
                  type="text"
                  value={newDisease.name}
                  onChange={(e) =>
                    setNewDisease({ ...newDisease, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Summary:</label>
                <textarea
                  value={newDisease.summary}
                  onChange={(e) =>
                    setNewDisease({ ...newDisease, summary: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Medications:</label>
                {newDisease.medications.map((med, index) => (
                  <div key={index} className="medication-card">
                    <div className="medication-header">
                      <h5>Medication {index + 1}</h5>
                      <button
                        type="button"
                        className="remove-med-btn"
                        onClick={() => removeMedication(index)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="medication-fields">
                      <div className="field-group">
                        <label>Name:</label>
                        <input
                          type="text"
                          placeholder="e.g., Aspirin"
                          value={med.name}
                          onChange={(e) =>
                            handleMedChange(index, 'name', e.target.value)
                          }
                        />
                      </div>
                      <div className="field-group">
                        <label>Dose:</label>
                        <input
                          type="text"
                          placeholder="e.g., 100mg"
                          value={med.dose}
                          onChange={(e) =>
                            handleMedChange(index, 'dose', e.target.value)
                          }
                        />
                      </div>
                      <div className="field-group">
                        <label>Duration:</label>
                        <input
                          type="text"
                          placeholder="e.g., 30 days"
                          value={med.duration}
                          onChange={(e) =>
                            handleMedChange(index, 'duration', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="timing-selector">
                      <label>Timing:</label>
                      <div className="timing-options">
                        {timingOptions.map((option) => (
                          <div
                            key={option}
                            className={`timing-option ${
                              med.timing.some((t) => t.slot === option)
                                ? 'selected'
                                : ''
                            }`}
                            onClick={() => toggleTiming(index, option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-med-btn"
                  onClick={addMedication}
                >
                  + Add Another Medication
                </button>
              </div>

              <div className="form-group">
                <label>Assigned Doctor:</label>
                <input
                  type="text"
                  value={newDisease.assignedDoctor}
                  onChange={(e) =>
                    setNewDisease({
                      ...newDisease,
                      assignedDoctor: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Next Appointment:</label>
                <input
                  type="datetime-local"
                  value={newDisease.nextAppointment}
                  onChange={(e) =>
                    setNewDisease({
                      ...newDisease,
                      nextAppointment: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Add Disease
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced CSS Styles for Better Design and Mobile Responsiveness */}
           {/* Enhanced CSS Styles for Better Design and Mobile Responsiveness */}
      <style jsx>{`
        .profile-content {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .diseases-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .diseases-header h3 {
          margin: 0;
          font-size: 24px;
          color: #2c3e50;
        }

        .add-disease-btn {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 18px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
        }

        .add-disease-btn:hover {
          background: linear-gradient(135deg, #0056b3, #004085);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 123, 255, 0.4);
        }

        .diseases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .disease-card {
          border: 1px solid #e0e4ea;
          border-radius: 12px;
          padding: 20px;
          background: linear-gradient(135deg, #fafbfc, #f1f3f4);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .disease-card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .disease-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .disease-header h4 {
          margin: 0;
          font-size: 20px;
          flex: 1;
          color: #34495e;
        }

        .disease-icon {
          font-size: 24px;
          margin-left: 10px;
        }

        .status-container {
          position: relative;
        }

        .status-btn {
          font-size: 14px;
          font-weight: 600;
        }

        .status-dropdown {
          min-width: 120px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .summary {
          margin-bottom: 15px;
          color: #555;
          font-style: italic;
        }

        .medications-section h5 {
          margin-bottom: 10px;
          color: #333;
          font-size: 18px;
        }

        .medications-section ul {
          list-style: none;
          padding: 0;
        }

        .medications-section li {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          color: #555;
        }

        .doctor-info p {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }

        /* Popup Styles */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .popup-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          max-width: 700px;
          width: 95%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .popup-card h4 {
          margin-top: 0;
          text-align: center;
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #34495e;
          font-size: 16px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e4ea;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .medication-card {
          border: 1px solid #e0e4ea;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          background: #f9f9f9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.3s ease;
        }

        .medication-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .medication-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .medication-header h5 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .remove-med-btn {
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .remove-med-btn:hover {
          background: #c0392b;
        }

        .medication-fields {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
        }

        .field-group label {
          margin-bottom: 5px;
          font-weight: 600;
          color: #555;
          font-size: 14px;
        }

        .field-group input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .field-group input:focus {
          border-color: #007bff;
          outline: none;
        }

        .timing-selector {
          margin-top: 15px;
          text-align: center;
        }

        .timing-selector label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #34495e;
        }

        .timing-options {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .timing-option {
          padding: 10px 18px;
          border-radius: 20px;
          background: #f1f3f6;
          color: #444;
          border: 1px solid #e0e4ea;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: inset 0 0 0 0 transparent;
        }

        .timing-option:hover {
          background: #eef5ff;
          color: #007bff;
          transform: translateY(-2px);
        }

        .timing-option.selected {
          background: linear-gradient(135deg, #007bff, #00b4d8);
          color: #fff;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
          transform: translateY(-1px);
        }

        .add-med-btn {
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
          transition: background 0.3s ease;
          width: 100%;
        }

        .add-med-btn:hover {
          background: #218838;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          gap: 10px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #28a745, #218838);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 24px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          flex: 1;
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #218838, #1e7e34);
          transform: translateY(-2px);
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 24px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          flex: 1;
        }

        .cancel-btn:hover {
          background: #545b62;
          transform: translateY(-2px);
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .profile-content {
            padding: 15px;
          }

          .diseases-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .diseases-header h3 {
            font-size: 20px;
            margin-bottom: 10px;
          }

          .add-disease-btn {
            align-self: stretch;
            padding: 14px;
            font-size: 18px;
          }

          .diseases-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .disease-card {
            padding: 15px;
          }

          .disease-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .disease-header h4 {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .status-container {
            align-self: flex-end;
          }

          .popup-card {
            padding: 20px;
            width: 100%;
            max-width: none;
            margin: 10px;
            max-height: 95vh;
          }

          .popup-card h4 {
            font-size: 20px;
          }

          .form-group input,
          .form-group textarea {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .medication-fields {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .timing-options {
            gap: 8px;
          }

          .timing-option {
            padding: 8px 14px;
            font-size: 13px;
          }

          .form-actions {
            flex-direction: column;
          }

          .submit-btn,
          .cancel-btn {
            width: 100%;
            margin-bottom: 10px;
          }
        }

        @media (max-width: 480px) {
          .popup-card {
            padding: 15px;
          }

          .medication-card {
            padding: 15px;
          }

          .timing-options {
            flex-direction: column;
            align-items: center;
          }

          .timing-option {
            width: 100%;
            max-width: 200px;
          }
            .profile-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  text-align: center;
  color: #4E74F9;
  font-size: 18px;
  letter-spacing: 0.5px;
}

/* Circle spinning loader */
.loader {
  width: 55px;
  height: 55px;
  border: 5px solid #cdd9ff;
  border-top-color: #4E74F9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

        }
      `}</style>
    </div>
  );
};

export default Diseases;
