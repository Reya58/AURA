import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .med-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f7f4;
    padding: 40px 28px;
    position: relative;
  }

  .med-blob {
    position: fixed; border-radius: 50%;
    filter: blur(72px); opacity: 0.32;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .med-blob-1 { width: 480px; height: 480px; background: #a8e6cf; top: -120px; left: -100px; }
  .med-blob-2 { width: 320px; height: 320px; background: #b5ead7; bottom: -60px; right: -60px; animation-delay: 2s; }
  .med-blob-3 { width: 200px; height: 200px; background: #ffd6a5; top: 40%; right: 12%; animation-delay: 4s; }
  @keyframes blobFloat {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(16px,24px) scale(1.05); }
  }

  .med-inner {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Page header ── */
  .med-page-header { margin-bottom: 32px; }
  .med-page-label {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
  }
  .med-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 600;
    color: #0d2e20; letter-spacing: -0.5px;
  }
  .med-page-sub { font-size: 14px; color: #7aaa92; margin-top: 4px; }

  /* ── Stats pills ── */
  .med-stats {
    display: flex; gap: 14px; margin-bottom: 32px; flex-wrap: wrap;
  }
  .med-stat-pill {
    flex: 1; min-width: 110px;
    background: rgba(255,255,255,0.82);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 16px; padding: 16px 20px;
    display: flex; flex-direction: column; gap: 4px;
    box-shadow: 0 4px 16px rgba(10,60,40,0.06);
    backdrop-filter: blur(12px);
  }
  .med-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 600; color: #0d2e20;
  }
  .med-stat-label {
    font-size: 11px; color: #7aaa92; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* ── Filter bar ── */
  .med-filter-bar {
    display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap;
  }
  .med-filter-btn {
    padding: 8px 18px; border-radius: 99px;
    border: 1.5px solid #c8e0d4;
    background: rgba(255,255,255,0.7);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; color: #5a8a72;
    cursor: pointer; transition: all 0.18s;
    backdrop-filter: blur(8px);
  }
  .med-filter-btn:hover { border-color: #1a6b4a; color: #1a6b4a; background: rgba(255,255,255,0.9); }
  .med-filter-btn.active {
    background: linear-gradient(135deg,#1a6b4a,#2d9e6e);
    border-color: transparent; color: #fff;
    box-shadow: 0 3px 12px rgba(26,107,74,0.3);
  }

  /* ── Time-of-day sections ── */
  .med-section { margin-bottom: 32px; }
  .med-section-header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 16px;
  }
  .med-section-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .med-section-icon.morning  { background: linear-gradient(135deg,#ffeaa7,#fdcb6e); }
  .med-section-icon.afternoon{ background: linear-gradient(135deg,#fd79a8,#e84393); }
  .med-section-icon.evening  { background: linear-gradient(135deg,#a29bfe,#6c5ce7); }
  .med-section-icon.night    { background: linear-gradient(135deg,#2d3436,#636e72); }
  .med-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 600; color: #0d2e20;
  }
  .med-section-count {
    font-size: 12px; color: #7aaa92; font-weight: 500;
    background: rgba(26,107,74,0.08);
    padding: 3px 10px; border-radius: 99px;
  }
  .med-section-line { flex: 1; height: 1px; background: #d4e8de; }

  /* ── Medication cards ── */
  .med-cards { display: flex; flex-direction: column; gap: 12px; }

  .med-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 18px;
    padding: 18px 20px;
    display: flex; align-items: center; gap: 16px;
    box-shadow: 0 4px 20px rgba(10,60,40,0.07);
    transition: transform 0.18s, box-shadow 0.18s;
    position: relative; overflow: hidden;
  }
  .med-card::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 4px;
    background: linear-gradient(180deg,#1a6b4a,#2d9e6e);
    border-radius: 4px 0 0 4px;
  }
  .med-card.morning::before  { background: linear-gradient(180deg,#fdcb6e,#e67e22); }
  .med-card.afternoon::before{ background: linear-gradient(180deg,#fd79a8,#e84393); }
  .med-card.evening::before  { background: linear-gradient(180deg,#a29bfe,#6c5ce7); }
  .med-card.night::before    { background: linear-gradient(180deg,#636e72,#2d3436); }
  .med-card:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(10,60,40,0.12); }

  .med-card-icon {
    width: 44px; height: 44px; border-radius: 13px;
    background: rgba(26,107,74,0.08);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #1a6b4a;
  }

  .med-card-body { flex: 1; min-width: 0; }
  .med-card-name {
    font-size: 15px; font-weight: 500; color: #0d2e20;
    margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .med-card-meta {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }
  .med-card-dose {
    font-size: 12px; color: #5a8a72; font-weight: 500;
    background: rgba(26,107,74,0.08);
    padding: 2px 9px; border-radius: 99px;
  }
  .med-card-duration {
    font-size: 12px; color: #7aaa92;
    display: flex; align-items: center; gap: 4px;
  }

  .med-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
  .med-disease-badge {
    font-size: 11px; font-weight: 500; color: #3d7a5f;
    background: rgba(26,107,74,0.08);
    border: 1px solid rgba(26,107,74,0.15);
    padding: 4px 10px; border-radius: 99px;
    white-space: nowrap; max-width: 140px;
    overflow: hidden; text-overflow: ellipsis;
  }

  /* ── Empty / full screen states ── */
  .med-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 72px 24px; gap: 14px;
    background: rgba(255,255,255,0.7);
    border: 1px dashed #b5d9cb;
    border-radius: 24px; text-align: center;
  }
  .med-empty-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(26,107,74,0.08);
    display: flex; align-items: center; justify-content: center;
    color: #2d9e6e;
  }
  .med-empty-title { font-family:'Playfair Display',serif; font-size:22px; color:#0d2e20; }
  .med-empty-sub   { font-size:14px; color:#7aaa92; max-width:280px; line-height:1.6; }

  .med-fullscreen {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    min-height:60vh; gap:14px;
    font-family:'DM Sans',sans-serif;
  }
  .med-spinner {
    width:44px; height:44px;
    border:3px solid #d4e8de; border-top-color:#1a6b4a;
    border-radius:50%; animation:spin 0.8s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }
  .med-spinner-text { font-size:14px; color:#7aaa92; }
`;

const SLOTS = ['Morning','Afternoon','Evening','Night'];

const SLOT_CONFIG = {
  Morning:   { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b7791f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, cls: 'morning' },
  Afternoon: { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/></svg>, cls: 'afternoon' },
  Evening:   { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>, cls: 'evening' },
  Night:     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, cls: 'night' },
};

const PillIcon = ({ color = '#1a6b4a' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const MedicationFetcher = ({ apiBaseUrl = "http://localhost:5000" }) => {
  const { email } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [filter, setFilter]           = useState('All');

  useEffect(() => {
    if (!email) { setError("Email not found. Please log in again."); setLoading(false); return; }

    const fetchMeds = async () => {
      try {
        const res = await fetch(
          `${apiBaseUrl}/api/user/diseases?email=${encodeURIComponent(email)}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
        );
        if (!res.ok) throw new Error("Failed to fetch medications");
        const data = await res.json();
        const diseases = data.diseases || [];

        const ongoing = diseases.flatMap((disease) =>
          disease.status !== 'ongoing' ? [] :
          (disease.medications || []).map((m) => ({
            _id: m._id || `${disease._id}-${m.name}-${Math.random()}`,
            name:        m.name || 'Unnamed',
            dose:        m.dose || '',
            timing:      m.timing || [],
            duration:    m.duration || '',
            diseaseName: disease.name || '',
          }))
        );
        setMedications(ongoing);
      } catch (err) { setError(err.message); }
      finally       { setLoading(false); }
    };

    fetchMeds();
  }, [email, apiBaseUrl]);

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="med-fullscreen">
        <div className="med-spinner" />
        <div className="med-spinner-text">Loading your medications…</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{styles}</style>
      <div className="med-fullscreen">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div style={{fontSize:'14px',color:'#c0392b'}}>{error}</div>
      </div>
    </>
  );

  // Group by slot
  const bySlot = SLOTS.reduce((acc, slot) => {
    acc[slot] = medications.filter(m =>
      m.timing.some(t => (typeof t === 'string' ? t : t.slot) === slot)
    );
    return acc;
  }, {});

  // Filter
  const activeSlots = filter === 'All'
    ? SLOTS.filter(s => bySlot[s].length > 0)
    : SLOTS.filter(s => s === filter && bySlot[s].length > 0);

  const totalMeds = medications.length;
  const uniqueDiseases = [...new Set(medications.map(m => m.diseaseName))].length;

  return (
    <>
      <style>{styles}</style>
      <div className="med-root">
        <div className="med-blob med-blob-1" />
        <div className="med-blob med-blob-2" />
        <div className="med-blob med-blob-3" />

        <div className="med-inner">

          {/* Header */}
          <div className="med-page-header">
            <div className="med-page-label">Treatment plan</div>
            <div className="med-page-title">Ongoing Medications</div>
            <div className="med-page-sub">Your active prescriptions, organised by time of day.</div>
          </div>

          {/* Stats */}
          <div className="med-stats">
            <div className="med-stat-pill">
              <div className="med-stat-num">{totalMeds}</div>
              <div className="med-stat-label">Active meds</div>
            </div>
            <div className="med-stat-pill">
              <div className="med-stat-num">{uniqueDiseases}</div>
              <div className="med-stat-label">Conditions</div>
            </div>
            <div className="med-stat-pill">
              <div className="med-stat-num">{bySlot.Morning.length + bySlot.Night.length}</div>
              <div className="med-stat-label">Daily doses</div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="med-filter-bar">
            {['All', ...SLOTS].map(f => (
              <button
                key={f}
                className={`med-filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {medications.length === 0 ? (
            <div className="med-empty">
              <div className="med-empty-icon">
                <PillIcon color="#2d9e6e" />
              </div>
              <div className="med-empty-title">No ongoing medications</div>
              <div className="med-empty-sub">All clear! Your active medications will appear here once added under a condition.</div>
            </div>
          ) : (

            /* Time-of-day sections */
            activeSlots.length === 0 ? (
              <div className="med-empty">
                <div className="med-empty-icon"><PillIcon color="#2d9e6e" /></div>
                <div className="med-empty-title">No {filter} medications</div>
                <div className="med-empty-sub">You have no medications scheduled for this time slot.</div>
              </div>
            ) : (
              activeSlots.map(slot => {
                const cfg  = SLOT_CONFIG[slot];
                const meds = bySlot[slot];
                return (
                  <div key={slot} className="med-section">
                    <div className="med-section-header">
                      <div className={`med-section-icon ${cfg.cls}`}>{cfg.icon}</div>
                      <div className="med-section-title">{slot}</div>
                      <div className="med-section-count">{meds.length} med{meds.length !== 1 ? 's':''}</div>
                      <div className="med-section-line" />
                    </div>

                    <div className="med-cards">
                      {meds.map(med => (
                        <div key={med._id} className={`med-card ${cfg.cls}`}>
                          <div className="med-card-icon">
                            <PillIcon />
                          </div>
                          <div className="med-card-body">
                            <div className="med-card-name">{med.name}</div>
                            <div className="med-card-meta">
                              {med.dose && <span className="med-card-dose">{med.dose}</span>}
                              {med.duration && (
                                <span className="med-card-duration">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                  {med.duration}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="med-card-right">
                            <div className="med-disease-badge">{med.diseaseName}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )
          )}

        </div>
      </div>
    </>
  );
};

export default MedicationFetcher;