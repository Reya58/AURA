import React, { useState } from 'react';

const EmergencySOS = () => {
  const [alertSent, setAlertSent] = useState(false);

  const handleCallEmergency = () => {
    // Simulate calling emergency services (in a real app, this would use device APIs or redirect to tel:)
    window.location.href = 'tel:911'; // This works on mobile devices
  };

  const handleSendSOSAlert = () => {
    // Simulate sending an SOS alert (in a real app, this could integrate with messaging or location services)
    setAlertSent(true);
    alert('SOS Alert sent! Help is on the way.'); // Placeholder alert
    // You could add logic to send to contacts, share location, etc.
  };

  return (
    <>
      <style>
        {`
          .emergency-sos-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            font-family: Arial, sans-serif;
          }

          .emergency-title {
            color: #d9534f; /* Red color for urgency */
            font-size: 24px;
            margin-bottom: 10px;
          }

          .emergency-description {
            color: #666;
            font-size: 16px;
            margin-bottom: 20px;
          }

          .emergency-buttons {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .emergency-button {
            padding: 15px 20px;
            font-size: 18px;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .emergency-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .call-button {
            background-color: #d9534f; /* Red for call */
            color: white;
          }

          .call-button:hover:not(:disabled) {
            background-color: #c9302c;
          }

          .alert-button {
            background-color: #f0ad4e; /* Orange for alert */
            color: white;
          }

          .alert-button:hover:not(:disabled) {
            background-color: #ec971f;
          }

          .alert-confirmation {
            margin-top: 20px;
            color: #5cb85c; /* Green for success */
            font-weight: bold;
          }
        `}
      </style>
      <div className="emergency-sos-container">
        <h3 className="emergency-title">Emergency SOS</h3>
        <p className="emergency-description">Access emergency contacts, call for help, or send alerts.</p>
        <div className="emergency-buttons">
          <button className="emergency-button call-button" onClick={handleCallEmergency}>
            Call Emergency Services
          </button>
          <button className="emergency-button alert-button" onClick={handleSendSOSAlert} disabled={alertSent}>
            {alertSent ? 'Alert Sent' : 'Send SOS Alert'}
          </button>
        </div>
        {alertSent && <p className="alert-confirmation">Your SOS alert has been sent successfully.</p>}
      </div>
    </>
  );
};

export default EmergencySOS;
