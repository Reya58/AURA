import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .apt-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f7f4;
    padding: 40px 28px;
    position: relative;
  }

  .apt-blob {
    position: fixed; border-radius: 50%;
    filter: blur(72px); opacity: 0.32;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .apt-blob-1 { width: 480px; height: 480px; background: #a8e6cf; top: -120px; left: -100px; }
  .apt-blob-2 { width: 320px; height: 320px; background: #b5ead7; bottom: -60px; right: -60px; animation-delay: 2s; }
  .apt-blob-3 { width: 200px; height: 200px; background: #ffd6a5; top: 40%; right: 12%; animation-delay: 4s; }
  @keyframes blobFloat {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(16px,24px) scale(1.05); }
  }

  .apt-inner {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Page header ── */
  .apt-page-header { margin-bottom: 32px; }
  .apt-page-label {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
  }
  .apt-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 600;
    color: #0d2e20; letter-spacing: -0.5px;
  }
  .apt-page-sub { font-size: 14px; color: #7aaa92; margin-top: 4px; }

  /* ── Stats ── */
  .apt-stats {
    display: flex; gap: 14px; margin-bottom: 28px; flex-wrap: wrap;
  }
  .apt-stat-pill {
    flex: 1; min-width: 110px;
    background: rgba(255,255,255,0.82);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 16px; padding: 16px 20px;
    display: flex; flex-direction: column; gap: 4px;
    box-shadow: 0 4px 16px rgba(10,60,40,0.06);
    backdrop-filter: blur(12px);
  }
  .apt-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 600; color: #0d2e20;
  }
  .apt-stat-label { font-size: 11px; color: #7aaa92; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .apt-stat-pill.soon .apt-stat-num { color: #b7791f; }

  /* ── Timeline ── */
  .apt-timeline { position: relative; padding-left: 28px; }
  .apt-timeline::before {
    content: '';
    position: absolute; left: 10px; top: 8px; bottom: 8px;
    width: 2px;
    background: linear-gradient(180deg, #2d9e6e, rgba(45,158,110,0.1));
    border-radius: 2px;
  }

  /* ── Appointment card ── */
  .apt-card-wrap {
    position: relative; margin-bottom: 24px;
  }
  .apt-timeline-dot {
    position: absolute; left: -23px; top: 22px;
    width: 12px; height: 12px; border-radius: 50%;
    background: #2d9e6e;
    border: 2px solid #fff;
    box-shadow: 0 0 0 3px rgba(45,158,110,0.2);
  }
  .apt-timeline-dot.soon {
    background: #f5a623;
    box-shadow: 0 0 0 3px rgba(245,166,35,0.25);
    animation: dotPulse 2s ease-in-out infinite;
  }
  @keyframes dotPulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(245,166,35,0.25); }
    50%      { box-shadow: 0 0 0 7px rgba(245,166,35,0.1); }
  }

  .apt-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(10,60,40,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .apt-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(10,60,40,0.13); }

  .apt-card-accent {
    height: 5px;
    background: linear-gradient(90deg, #1a6b4a, #2d9e6e);
  }
  .apt-card-accent.soon   { background: linear-gradient(90deg, #b7791f, #f5a623); }
  .apt-card-accent.paused { background: linear-gradient(90deg, #2b6cb0, #4a90d9); }

  .apt-card-body { padding: 22px 24px; }

  /* Card top */
  .apt-card-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 12px; margin-bottom: 14px;
  }
  .apt-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 600; color: #0d2e20; line-height: 1.2;
  }
  .apt-status-badge {
    font-size: 11px; font-weight: 500; padding: 5px 12px;
    border-radius: 99px; white-space: nowrap; flex-shrink: 0;
  }
  .apt-status-badge.ongoing      { background:rgba(26,107,74,0.1);  color:#1a6b4a; }
  .apt-status-badge.paused       { background:rgba(74,144,217,0.12); color:#2b6cb0; }
  .apt-status-badge.discontinued { background:rgba(192,57,43,0.1);  color:#c0392b; }

  /* Countdown banner */
  .apt-countdown {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 12px; margin-bottom: 16px;
    font-size: 13px; font-weight: 500;
  }
  .apt-countdown.soon    { background:rgba(245,166,35,0.12); color:#b7791f; border:1px solid rgba(245,166,35,0.25); }
  .apt-countdown.normal  { background:rgba(26,107,74,0.07);  color:#1a6b4a; border:1px solid rgba(26,107,74,0.15); }

  /* Summary */
  .apt-summary { font-size:13px; color:#5a8a72; line-height:1.65; font-style:italic; margin-bottom:16px; }

  /* Details grid */
  .apt-details-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    margin-bottom: 16px;
  }
  @media(max-width:520px) { .apt-details-grid { grid-template-columns:1fr; } }

  .apt-detail-item {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(26,107,74,0.05);
    border: 1px solid rgba(26,107,74,0.1);
    border-radius: 12px; padding: 12px 14px;
  }
  .apt-detail-icon {
    width: 30px; height: 30px; border-radius: 9px;
    background: rgba(26,107,74,0.1);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #1a6b4a;
  }
  .apt-detail-label { font-size:11px; color:#7aaa92; font-weight:500; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:3px; }
  .apt-detail-val   { font-size:14px; color:#0d2e20; font-weight:500; }

  /* Meds */
  .apt-meds-label {
    font-size:11px; font-weight:500; color:#1a6b4a;
    letter-spacing:1.5px; text-transform:uppercase; margin-bottom:10px;
  }
  .apt-meds-list { display:flex; flex-direction:column; gap:8px; }
  .apt-med-row {
    display:flex; align-items:center; gap:10px;
    background:rgba(26,107,74,0.05); border:1px solid rgba(26,107,74,0.1);
    border-radius:10px; padding:9px 12px;
  }
  .apt-med-dot { width:7px; height:7px; border-radius:50%; background:#2d9e6e; flex-shrink:0; }
  .apt-med-name { font-size:13px; font-weight:500; color:#0d2e20; }
  .apt-med-meta { font-size:12px; color:#7aaa92; margin-left:auto; }

  /* ── Empty ── */
  .apt-empty {
    display:flex; flex-direction:column; align-items:center;
    padding:72px 24px; gap:14px;
    background:rgba(255,255,255,0.7);
    border:1px dashed #b5d9cb; border-radius:24px; text-align:center;
  }
  .apt-empty-icon {
    width:64px; height:64px; border-radius:50%;
    background:rgba(26,107,74,0.08);
    display:flex; align-items:center; justify-content:center; color:#2d9e6e;
  }
  .apt-empty-title { font-family:'Playfair Display',serif; font-size:22px; color:#0d2e20; }
  .apt-empty-sub   { font-size:14px; color:#7aaa92; max-width:280px; line-height:1.6; }

  /* ── Full-screen states ── */
  .apt-fullscreen {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    min-height:60vh; gap:14px; font-family:'DM Sans',sans-serif;
  }
  .apt-spinner {
    width:44px; height:44px;
    border:3px solid #d4e8de; border-top-color:#1a6b4a;
    border-radius:50%; animation:spin 0.8s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }
  .apt-spinner-text { font-size:14px; color:#7aaa92; }
`;

const getCountdown = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  if (diff <= 0) return null;
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  if (days > 0)  return { text: `In ${days} day${days > 1 ? 's' : ''}`, soon: days <= 3 };
  if (hours > 0) return { text: `In ${hours} hour${hours > 1 ? 's' : ''}`, soon: true };
  return { text: `In ${mins} min${mins !== 1 ? 's' : ''}`, soon: true };
};

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const DoctorIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const Appointment = () => {
  const { email } = useAuth();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [now, setNow]           = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!email) return;
    const fetch_ = async () => {
      try {
        const res = await fetch(
          `https://aura-wo8f.vercel.app/api/user/diseases?email=${encodeURIComponent(email)}`,
          { headers: { Authorization:`Bearer ${localStorage.getItem('token')}`, 'Content-Type':'application/json' } }
        );
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        if (!data?.diseases) throw new Error('Invalid data');
        setDiseases(data.diseases);
      } catch (err) { setError(err.message); }
      finally       { setLoading(false); }
    };
    fetch_();
  }, [email]);

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="apt-fullscreen">
        <div className="apt-spinner" />
        <div className="apt-spinner-text">Loading your appointments…</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{styles}</style>
      <div className="apt-fullscreen">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div style={{fontSize:'14px',color:'#c0392b'}}>{error}</div>
      </div>
    </>
  );

  const upcoming = diseases
    .filter(d => d.nextAppointment && new Date(d.nextAppointment) > now)
    .sort((a,b) => new Date(a.nextAppointment) - new Date(b.nextAppointment));

  const soonCount = upcoming.filter(d => {
    const diff = new Date(d.nextAppointment) - now;
    return diff < 3 * 86400000;
  }).length;

  return (
    <>
      <style>{styles}</style>
      <div className="apt-root">
        <div className="apt-blob apt-blob-1" />
        <div className="apt-blob apt-blob-2" />
        <div className="apt-blob apt-blob-3" />

        <div className="apt-inner">

          {/* Header */}
          <div className="apt-page-header">
            <div className="apt-page-label">Schedule</div>
            <div className="apt-page-title">Upcoming Appointments</div>
            <div className="apt-page-sub">Your next visits, sorted by date.</div>
          </div>

          {/* Stats */}
          <div className="apt-stats">
            <div className="apt-stat-pill">
              <div className="apt-stat-num">{upcoming.length}</div>
              <div className="apt-stat-label">Scheduled</div>
            </div>
            <div className="apt-stat-pill soon">
              <div className="apt-stat-num">{soonCount}</div>
              <div className="apt-stat-label">Within 3 days</div>
            </div>
            <div className="apt-stat-pill">
              <div className="apt-stat-num">
                {upcoming.length > 0
                  ? new Date(upcoming[0].nextAppointment).toLocaleDateString('en-IN',{day:'numeric',month:'short'})
                  : '—'}
              </div>
              <div className="apt-stat-label">Next visit</div>
            </div>
          </div>

          {/* Timeline */}
          {upcoming.length === 0 ? (
            <div className="apt-empty">
              <div className="apt-empty-icon">
                <CalendarIcon />
              </div>
              <div className="apt-empty-title">No upcoming appointments</div>
              <div className="apt-empty-sub">Your future appointments will appear here once added to a health condition.</div>
            </div>
          ) : (
            <div className="apt-timeline">
              {upcoming.map((disease) => {
                const status   = (disease.status || 'ongoing').toLowerCase();
                const countdown = getCountdown(disease.nextAppointment);
                const isSoon   = countdown?.soon;
                const accentCls = isSoon ? 'soon' : status === 'paused' ? 'paused' : '';

                return (
                  <div key={disease._id} className="apt-card-wrap">
                    <div className={`apt-timeline-dot${isSoon ? ' soon' : ''}`} />

                    <div className="apt-card">
                      <div className={`apt-card-accent ${accentCls}`} />
                      <div className="apt-card-body">

                        {/* Top row */}
                        <div className="apt-card-top">
                          <div className="apt-card-name">{disease.name}</div>
                          <span className={`apt-status-badge ${status}`}>
                            {disease.status}
                          </span>
                        </div>

                        {/* Countdown */}
                        {countdown && (
                          <div className={`apt-countdown ${isSoon ? 'soon' : 'normal'}`}>
                            <ClockIcon />
                            {countdown.text}
                            {isSoon && <span style={{marginLeft:'auto',fontSize:'11px',opacity:0.8}}>Coming soon</span>}
                          </div>
                        )}

                        {/* Summary */}
                        {disease.summary && (
                          <div className="apt-summary">{disease.summary}</div>
                        )}

                        {/* Details grid */}
                        <div className="apt-details-grid">
                          <div className="apt-detail-item">
                            <div className="apt-detail-icon"><DoctorIcon /></div>
                            <div>
                              <div className="apt-detail-label">Doctor</div>
                              <div className="apt-detail-val">{disease.assignedDoctor || 'Not assigned'}</div>
                            </div>
                          </div>
                          <div className="apt-detail-item">
                            <div className="apt-detail-icon"><CalendarIcon /></div>
                            <div>
                              <div className="apt-detail-label">Date & time</div>
                              <div className="apt-detail-val">
                                {new Date(disease.nextAppointment).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                                <span style={{display:'block',fontSize:'12px',color:'#7aaa92',fontWeight:400}}>
                                  {new Date(disease.nextAppointment).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Medications */}
                        {disease.medications?.length > 0 && (
                          <div>
                            <div className="apt-meds-label">Current medications</div>
                            <div className="apt-meds-list">
                              {disease.medications.map((med, i) => (
                                <div key={i} className="apt-med-row">
                                  <div className="apt-med-dot" />
                                  <div className="apt-med-name">{med.name}</div>
                                  <div className="apt-med-meta">{med.dose}{med.duration ? ` · ${med.duration}` : ''}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Appointment;