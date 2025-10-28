import React, { useState } from 'react';
import { useAuth } from '../AuthContext'; // For accessing logout
import './Dashboard.css'; // Separate CSS file

// Import the modular components
import ProfileSection from './ProfileSection';
import Reminders from './Reminders';
import Medications from './Medications';
import Appointments from './Appointments';
import HealthRecords from './HealthRecords';
import EmergencySOS from './EmergencySOS'; // New component

const Dashboard = () => {
  const { clearEmail } = useAuth(); // Assuming logout is available from AuthContext
  const [activeSection, setActiveSection] = useState('profile'); // Track active sidebar section
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992); // Sidebar open by default on desktop

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    closeSidebar(); // Close sidebar on nav item click
  };

  const handleSOSClick = () => {
    setActiveSection('emergency'); // Switch to emergency section
    closeSidebar(); // Close sidebar if open
  };

  const handleLogout = () => {
     clearEmail();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'reminders':
        return <Reminders />;
      case 'medications':
        return <Medications />;
      case 'appointments':
        return <Appointments />;
      case 'records':
        return <HealthRecords />;
      case 'emergency':
        return <EmergencySOS />;
      default:
        return <div className="profile-content"><h3>Select a section</h3></div>;
    }
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Health App</h2>
          <button className="close-btn" onClick={closeSidebar}>&times;</button> {/* Cross button */}
        </div>
        <nav>
          <ul>
            <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => handleNavClick('profile')}>Profile</li>
            <li className={activeSection === 'reminders' ? 'active' : ''} onClick={() => handleNavClick('reminders')}>Reminders</li>
            <li className={activeSection === 'medications' ? 'active' : ''} onClick={() => handleNavClick('medications')}>Medications</li>
            <li className={activeSection === 'appointments' ? 'active' : ''} onClick={() => handleNavClick('appointments')}>Appointments</li>
            <li className={activeSection === 'records' ? 'active' : ''} onClick={() => handleNavClick('records')}>Health Records</li>
            <li onClick={handleLogout}>Logout</li> {/* Logout option */}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile/tablet */}
      {isSidebarOpen && window.innerWidth < 992 && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Main Content */}
      <main className="main-content">
        {/* Header with hamburger icon and SOS icon */}
        <div className="main-header">
          <button className="hamburger" onClick={toggleSidebar}>
            &#9776; {/* Hamburger icon */}
          </button>
          <span className="sos-icon" onClick={handleSOSClick} title="Emergency SOS">🚨</span> {/* SOS icon */}
          <h1>Dashboard</h1>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;