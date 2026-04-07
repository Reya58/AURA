import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

import ProfileSection from './ProfileSection';
import Reminders from './Reminders';
import Medications from './Medications';
import Appointments from './Appointments';
import HealthRecords from './HealthRecords';
import EmergencySOS from './EmergencySOS';
import Health from './CurrentHealth';
// import auraLogo from "../AuthPage/AURA_LOGO.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .db-root {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #f0f7f4;
    overflow: hidden;
  }

  /* ═══════════════════════════
     SIDEBAR
  ═══════════════════════════ */
  .db-sidebar {
    width: 260px;
    flex-shrink: 0;
    background: linear-gradient(170deg, #1a6b4a 0%, #0d4a32 55%, #082e1f 100%);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
    overflow: hidden;
  }
  .db-sidebar::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='300' height='800' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='260' cy='200' r='200' fill='none' stroke='%23ffffff06' stroke-width='1'/%3E%3Ccircle cx='260' cy='200' r='130' fill='none' stroke='%23ffffff08' stroke-width='1'/%3E%3C/svg%3E") right top/auto no-repeat;
    pointer-events: none;
  }
  .db-sidebar.open { transform: translateX(0); }
  @media (min-width: 992px) {
    .db-sidebar { transform: translateX(0); position: sticky; top: 0; height: 100vh; }
    .db-root { padding-left: 0; }
  }

  /* Brand */
  .db-brand {
    padding: 32px 28px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: space-between;
    position: relative; z-index: 1;
  }
  .db-brand-inner { display: flex; flex-direction: column; }
  .db-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 600;
    color: #fff; letter-spacing: -0.5px; line-height: 1;
  }
  .db-brand-tag {
    font-size: 10px; font-weight: 400;
    color: #80c4a8; letter-spacing: 2.5px;
    text-transform: uppercase; margin-top: 4px;
  }
  .db-close-btn {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.1); border: none;
    color: #fff; cursor: pointer; font-size: 18px; line-height: 1;
    transition: background 0.15s;
  }
  .db-close-btn:hover { background: rgba(255,255,255,0.18); }
  @media (min-width: 992px) { .db-close-btn { display: none; } }

  /* User pill */
  .db-user-pill {
    margin: 20px 20px 8px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
    position: relative; z-index: 1;
  }
  .db-user-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg,#2d9e6e,#6eddb0);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 600; color: #fff;
    flex-shrink: 0;
  }
  .db-user-name { font-size: 13px; font-weight: 500; color: #fff; }
  .db-user-status {
    font-size: 11px; color: #80c4a8; display: flex; align-items: center; gap: 5px; margin-top: 2px;
  }
  .db-user-dot { width: 6px; height: 6px; border-radius: 50%; background: #6eddb0; flex-shrink: 0; }

  /* Nav */
  .db-nav { flex: 1; padding: 16px 14px; overflow-y: auto; position: relative; z-index: 1; }
  .db-nav-label {
    font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.35);
    letter-spacing: 2px; text-transform: uppercase;
    padding: 0 10px; margin-bottom: 8px; margin-top: 16px;
  }
  .db-nav-label:first-child { margin-top: 0; }

  .db-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 12px;
    cursor: pointer; margin-bottom: 3px;
    color: rgba(255,255,255,0.65);
    font-size: 14px; font-weight: 400;
    transition: background 0.15s, color 0.15s;
    user-select: none;
    border: 1px solid transparent;
  }
  .db-nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .db-nav-item.active {
    background: rgba(110,221,176,0.15);
    border-color: rgba(110,221,176,0.2);
    color: #fff; font-weight: 500;
  }
  .db-nav-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: rgba(255,255,255,0.08);
    transition: background 0.15s;
  }
  .db-nav-item.active .db-nav-icon { background: rgba(110,221,176,0.2); }
  .db-nav-item:hover .db-nav-icon { background: rgba(255,255,255,0.12); }

  /* SOS nav item */
  .db-nav-item.sos {
    background: rgba(224,82,82,0.15);
    border-color: rgba(224,82,82,0.25);
    color: #ffa8a8;
  }
  .db-nav-item.sos:hover { background: rgba(224,82,82,0.25); color: #fff; }
  .db-nav-item.sos.active { background: rgba(224,82,82,0.3); border-color: rgba(224,82,82,0.5); color: #fff; }
  .db-nav-item.sos .db-nav-icon { background: rgba(224,82,82,0.2); }

  /* Sidebar footer */
  .db-sidebar-footer {
    padding: 16px 14px 24px;
    border-top: 1px solid rgba(255,255,255,0.08);
    position: relative; z-index: 1;
  }
  .db-logout-btn {
    width: 100%;
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; border-radius: 12px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 400;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .db-logout-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

  /* Overlay */
  .db-overlay {
    position: fixed; inset: 0;
    background: rgba(8,46,31,0.5);
    backdrop-filter: blur(4px);
    z-index: 40;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @media (min-width: 992px) { .db-overlay { display: none; } }

  /* ═══════════════════════════
     MAIN
  ═══════════════════════════ */
  .db-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 100vh;
  }

  /* Top bar */
  .db-topbar {
    height: 64px;
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(26,107,74,0.08);
    display: flex; align-items: center;
    padding: 0 24px; gap: 16px;
    position: sticky; top: 0; z-index: 30;
  }

  .db-hamburger {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: rgba(26,107,74,0.08);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #1a6b4a; flex-shrink: 0;
    transition: background 0.15s;
  }
  .db-hamburger:hover { background: rgba(26,107,74,0.15); }
  @media (min-width: 992px) { .db-hamburger { display: none; } }

  .db-topbar-title {
    flex: 1;
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 600;
    color: #0d2e20; letter-spacing: -0.3px;
  }
  @media (min-width: 992px) { .db-topbar-title { display: block; } }

  .db-topbar-right { display: flex; align-items: center; gap: 10px; }

  .db-topbar-logo {
    height: 32px; object-fit: contain;
  }

  .db-sos-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 10px;
    background: linear-gradient(135deg, #c0392b, #e05252);
    border: none; cursor: pointer;
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    box-shadow: 0 3px 12px rgba(192,57,43,0.35);
    transition: transform 0.15s, box-shadow 0.15s;
    animation: sosPulse 2.5s ease-in-out infinite;
  }
  .db-sos-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(192,57,43,0.45); }
  @keyframes sosPulse {
    0%,100% { box-shadow: 0 3px 12px rgba(192,57,43,0.35); }
    50%      { box-shadow: 0 3px 20px rgba(192,57,43,0.6); }
  }

  /* Content area */
  .db-content {
    flex: 1;
    overflow-y: auto;
    padding: 0;
  }

  /* Breadcrumb */
  .db-breadcrumb {
    padding: 14px 28px 0;
    font-size: 12px; color: #7aaa92;
    display: flex; align-items: center; gap: 6px;
  }
  .db-breadcrumb-sep { opacity: 0.5; }
  .db-breadcrumb-cur { color: #1a6b4a; font-weight: 500; }
`;

const NAV_ITEMS = [
  {
    section: 'profile', label: 'Profile',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
  {
    section: 'health', label: 'Health',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
  {
    section: 'medications', label: 'Medications',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  },
  {
    section: 'reminders', label: 'Reminders',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
  {
    section: 'appointments', label: 'Appointments',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    section: 'records', label: 'Health Records',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
];

const SECTION_LABELS = {
  profile: 'Profile', health: 'Health', medications: 'Medications',
  reminders: 'Reminders', appointments: 'Appointments',
  records: 'Health Records', emergency: 'Emergency SOS',
};

const Dashboard = () => {
  const { clearEmail } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 992) setIsSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (window.innerWidth < 992) setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':      return <ProfileSection />;
      case 'reminders':    return <Reminders />;
      case 'medications':  return <Medications />;
      case 'appointments': return <Appointments />;
      case 'records':      return <HealthRecords />;
      case 'health':       return <Health />;
      case 'emergency':    return <EmergencySOS />;
      default:             return null;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="db-root">

        {/* Overlay (mobile) */}
        {isSidebarOpen && (
          <div className="db-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <aside className={`db-sidebar${isSidebarOpen ? ' open' : ''}`}>

          {/* Brand */}
          <div className="db-brand">
            <div className="db-brand-inner">
              <div className="db-brand-name">AURA</div>
              <div className="db-brand-tag">Health Platform</div>
            </div>
            <button className="db-close-btn" onClick={() => setIsSidebarOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* User pill */}
          <div className="db-user-pill">
            <div className="db-user-avatar">U</div>
            <div>
              <div className="db-user-name">My Account</div>
              <div className="db-user-status">
                <div className="db-user-dot" />
                Active session
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="db-nav">
            <div className="db-nav-label">Main</div>

            {NAV_ITEMS.map(({ section, label, icon }) => (
              <div
                key={section}
                className={`db-nav-item${activeSection === section ? ' active' : ''}`}
                onClick={() => handleNavClick(section)}
              >
                <div className="db-nav-icon">{icon}</div>
                {label}
              </div>
            ))}

            <div className="db-nav-label">Emergency</div>
            <div
              className={`db-nav-item sos${activeSection === 'emergency' ? ' active' : ''}`}
              onClick={() => handleNavClick('emergency')}
            >
              <div className="db-nav-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              Emergency SOS
            </div>
          </nav>

          {/* Footer */}
          <div className="db-sidebar-footer">
            <button className="db-logout-btn" onClick={clearEmail}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="db-main">

          {/* Top bar */}
          <div className="db-topbar">
            <button className="db-hamburger" onClick={() => setIsSidebarOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>

            <div className="db-topbar-title">{SECTION_LABELS[activeSection]}</div>

            <div className="db-topbar-right">
              {/* Uncomment to show logo: <img src={auraLogo} alt="Aura" className="db-topbar-logo" /> */}
              <button className="db-sos-btn" onClick={() => handleNavClick('emergency')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                SOS
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="db-breadcrumb">
            <span>AURA</span>
            <span className="db-breadcrumb-sep">›</span>
            <span className="db-breadcrumb-cur">{SECTION_LABELS[activeSection]}</span>
          </div>

          {/* Content */}
          <div className="db-content">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;