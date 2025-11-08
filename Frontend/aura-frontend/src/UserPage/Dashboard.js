import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import './Dashboard.css';

import ProfileSection from './ProfileSection';
import Reminders from './Reminders';
import Medications from './Medications';
import Appointments from './Appointments';
import HealthRecords from './HealthRecords';
import EmergencySOS from './EmergencySOS';
import Health from './CurrentHealth';
import echoLogo from "../AuthPage/ECHO_LOGO.png";

const Dashboard = () => {
  const { clearEmail } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNavClick = (section) => {
    setActiveSection(section);
    closeSidebar();
  };

  const handleSOSClick = () => {
    setActiveSection('emergency');
    closeSidebar();
  };

  const handleLogout = () => {
    clearEmail();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSection />;
      case 'reminders': return <Reminders />;
      case 'medications': return <Medications />;
      case 'appointments': return <Appointments />;
      case 'records': return <HealthRecords />;
      case 'health': return <Health />;
      case 'emergency': return <EmergencySOS />;
      default: return <div className="profile-content"><h3>Select a section</h3></div>;
    }
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>AURA</h2>
          <button className="close-btn" onClick={closeSidebar}>&times;</button>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-menu">
          <ul>
            <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => handleNavClick('profile')}>Profile</li>
            <li className={activeSection === 'reminders' ? 'active' : ''} onClick={() => handleNavClick('reminders')}>Reminders</li>
            <li className={activeSection === 'medications' ? 'active' : ''} onClick={() => handleNavClick('medications')}>Medications</li>
            <li className={activeSection === 'appointments' ? 'active' : ''} onClick={() => handleNavClick('appointments')}>Appointments</li>
            <li className={activeSection === 'records' ? 'active' : ''} onClick={() => handleNavClick('records')}>Health Records</li>
            <li className={activeSection === 'health' ? 'active' : ''} onClick={() => handleNavClick('health')}>Health</li>
          </ul>
        </nav>

        {/* ✅ Logout placed separately */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

      </aside>

      {isSidebarOpen && window.innerWidth < 992 && <div className="overlay" onClick={closeSidebar}></div>}

      <main className="main-content">
        <div className="main-header">
          <button className="hamburger" onClick={toggleSidebar}>&#9776;</button>
          <span className="sos-icon" onClick={handleSOSClick} title="Emergency SOS">🚨</span>
          <img src={echoLogo} alt="App Logo" className="dashboard-logo" />
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
