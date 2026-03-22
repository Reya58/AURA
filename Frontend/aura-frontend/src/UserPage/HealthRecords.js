import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dis-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f7f4;
    padding: 40px 28px;
    position: relative;
  }

  .dis-blob {
    position: fixed; border-radius: 50%;
    filter: blur(72px); opacity: 0.32;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .dis-blob-1 { width: 480px; height: 480px; background: #a8e6cf; top: -120px; left: -100px; }
  .dis-blob-2 { width: 320px; height: 320px; background: #b5ead7; bottom: -60px; right: -60px; animation-delay: 2s; }
  .dis-blob-3 { width: 200px; height: 200px; background: #ffd6a5; top: 40%; right: 12%; animation-delay: 4s; }
  @keyframes blobFloat {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(16px,24px) scale(1.05); }
  }

  .dis-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Page header ── */
  .dis-page-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 32px; gap: 16px; flex-wrap: wrap;
  }
  .dis-page-header-left {}
  .dis-page-label {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
  }
  .dis-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 600;
    color: #0d2e20; letter-spacing: -0.5px;
  }
  .dis-page-sub { font-size: 14px; color: #7aaa92; margin-top: 4px; }

  .dis-add-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 13px 22px;
    background: linear-gradient(135deg, #1a6b4a 0%, #2d9e6e 100%);
    color: #fff; border: none; border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer; position: relative; overflow: hidden;
    box-shadow: 0 4px 20px rgba(26,107,74,0.35);
    transition: transform 0.15s, box-shadow 0.15s;
    white-space: nowrap;
  }
  .dis-add-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent); }
  .dis-add-btn:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(26,107,74,0.42); }
  .dis-add-btn span { position:relative; z-index:1; display:flex; align-items:center; gap:8px; }

  /* ── Summary stats ── */
  .dis-stats {
    display: flex; gap: 14px; margin-bottom: 32px; flex-wrap: wrap;
  }
  .dis-stat-pill {
    flex: 1; min-width: 110px;
    background: rgba(255,255,255,0.8);
    border: 1px solid rgba(255,255,255,0.7);
    border-radius: 16px; padding: 16px 20px;
    display: flex; flex-direction: column; gap: 4px;
    box-shadow: 0 4px 16px rgba(10,60,40,0.06);
    backdrop-filter: blur(12px);
  }
  .dis-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 600; color: #0d2e20;
  }
  .dis-stat-label { font-size: 11px; color: #7aaa92; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .dis-stat-pill.ongoing .dis-stat-num { color: #1a6b4a; }
  .dis-stat-pill.paused  .dis-stat-num { color: #4a90d9; }
  .dis-stat-pill.stopped .dis-stat-num { color: #c0392b; }

  /* ── Grid ── */
  .dis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  /* ── Empty state ── */
  .dis-empty {
    grid-column: 1/-1;
    display: flex; flex-direction: column; align-items: center;
    padding: 64px 24px; gap: 14px;
    background: rgba(255,255,255,0.7);
    border: 1px dashed #b5d9cb;
    border-radius: 24px; text-align: center;
  }
  .dis-empty-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(26,107,74,0.08);
    display: flex; align-items: center; justify-content: center;
    color: #2d9e6e;
  }
  .dis-empty-title { font-family:'Playfair Display',serif; font-size:22px; color:#0d2e20; }
  .dis-empty-sub   { font-size:14px; color:#7aaa92; max-width:280px; line-height:1.6; }

  /* ── Disease card ── */
  .dis-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(10,60,40,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; flex-direction: column;
  }
  .dis-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(10,60,40,0.13); }

  /* Card accent bar */
  .dis-card-accent {
    height: 5px;
    background: linear-gradient(90deg,#1a6b4a,#2d9e6e);
  }
  .dis-card-accent.paused       { background: linear-gradient(90deg,#3b6eb4,#4a90d9); }
  .dis-card-accent.discontinued { background: linear-gradient(90deg,#a32d2d,#e05252); }

  .dis-card-body { padding: 22px 22px 20px; flex:1; display:flex; flex-direction:column; gap:14px; }

  /* Card top row */
  .dis-card-top {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
  }
  .dis-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 19px; font-weight: 600; color: #0d2e20;
    line-height: 1.2;
  }

  /* Status badge + dropdown */
  .dis-status-wrap { position: relative; flex-shrink: 0; }
  .dis-status-badge {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 99px;
    font-size: 12px; font-weight: 500; cursor: pointer; border: none;
    transition: opacity 0.15s;
    white-space: nowrap;
  }
  .dis-status-badge:hover { opacity: 0.85; }
  .dis-status-badge.ongoing      { background:rgba(26,107,74,0.12);  color:#1a6b4a; }
  .dis-status-badge.paused       { background:rgba(74,144,217,0.12); color:#2b6cb0; }
  .dis-status-badge.discontinued { background:rgba(192,57,43,0.1);   color:#c0392b; }
  .dis-status-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .dis-status-badge.ongoing .dis-status-dot      { background:#2d9e6e; }
  .dis-status-badge.paused  .dis-status-dot      { background:#4a90d9; }
  .dis-status-badge.discontinued .dis-status-dot { background:#e05252; }

  .dis-status-menu {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: #fff;
    border: 1px solid #d4e8de;
    border-radius: 12px;
    box-shadow: 0 8px 28px rgba(10,60,40,0.14);
    overflow: hidden; z-index: 20; min-width: 140px;
    animation: menuIn 0.18s ease;
  }
  @keyframes menuIn {
    from { opacity:0; transform:translateY(-6px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .dis-status-option {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 16px; cursor: pointer;
    font-size: 13px; font-weight: 500; color: #3d7a5f;
    transition: background 0.12s;
  }
  .dis-status-option:hover { background: #f0f7f4; }
  .dis-status-option.active { color: #1a6b4a; background: rgba(26,107,74,0.06); }
  .dis-status-option-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }

  /* Summary */
  .dis-summary {
    font-size: 13px; color: #5a8a72; line-height: 1.65;
    font-style: italic;
  }

  /* Medications */
  .dis-meds-label {
    font-size: 10px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;
  }
  .dis-med-list { display: flex; flex-direction: column; gap: 8px; }
  .dis-med-item {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(26,107,74,0.05);
    border: 1px solid rgba(26,107,74,0.1);
    border-radius: 10px; padding: 10px 12px;
  }
  .dis-med-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(26,107,74,0.1);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #1a6b4a;
  }
  .dis-med-name { font-size:13px; font-weight:500; color:#0d2e20; }
  .dis-med-detail { font-size:12px; color:#7aaa92; margin-top:2px; }

  /* Timing chips */
  .dis-timing-chips { display:flex; gap:5px; flex-wrap:wrap; margin-top:5px; }
  .dis-timing-chip {
    font-size:11px; padding:2px 8px; border-radius:99px;
    background: rgba(26,107,74,0.1); color:#1a6b4a; font-weight:500;
  }

  /* Doctor info */
  .dis-card-footer {
    display: flex; gap: 12px; flex-wrap: wrap;
    padding-top: 14px;
    border-top: 1px solid #e8f4ee;
    margin-top: auto;
  }
  .dis-info-chip {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #5a8a72;
  }
  .dis-info-chip svg { flex-shrink:0; opacity:0.7; }

  /* ── Full-screen states ── */
  .dis-fullscreen {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    min-height:60vh; gap:16px; font-family:'DM Sans',sans-serif; color:#3d7a5f;
  }
  .dis-spinner {
    width:44px; height:44px;
    border:3px solid #d4e8de; border-top-color:#1a6b4a;
    border-radius:50%; animation:spin 0.8s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }
  .dis-spinner-text { font-size:14px; color:#7aaa92; }

  /* ═══════════════════════
     MODAL
  ═══════════════════════ */
  .dis-overlay {
    position:fixed; inset:0;
    background:rgba(8,46,31,0.45);
    backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:100; padding:16px;
    animation:fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .dis-modal {
    background:#fff;
    border-radius:26px;
    width:100%; max-width:680px;
    max-height:92vh; overflow-y:auto;
    box-shadow:0 24px 80px rgba(8,46,31,0.28);
    animation:modalIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes modalIn {
    from { opacity:0; transform:translateY(30px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  .dis-modal-header {
    background:linear-gradient(135deg,#1a6b4a,#2d9e6e);
    padding:28px 30px 24px;
    border-radius:26px 26px 0 0;
    position:relative; overflow:hidden;
  }
  .dis-modal-header::before {
    content:'';
    position:absolute; inset:0;
    background:url("data:image/svg+xml,%3Csvg width='400' height='160' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='350' cy='80' r='130' fill='none' stroke='%23ffffff08' stroke-width='1'/%3E%3Ccircle cx='350' cy='80' r='80' fill='none' stroke='%23ffffff0a' stroke-width='1'/%3E%3C/svg%3E") right center/auto no-repeat;
    pointer-events:none;
  }
  .dis-modal-title {
    font-family:'Playfair Display',serif;
    font-size:24px; font-weight:600; color:#fff;
    position:relative; z-index:1;
  }
  .dis-modal-sub { font-size:13px; color:#a8d8c2; margin-top:4px; position:relative; z-index:1; }
  .dis-modal-close {
    position:absolute; top:20px; right:20px;
    width:32px; height:32px; border-radius:50%;
    background:rgba(255,255,255,0.15); border:none;
    color:#fff; cursor:pointer; font-size:18px;
    display:flex; align-items:center; justify-content:center;
    transition:background 0.15s; z-index:1;
  }
  .dis-modal-close:hover { background:rgba(255,255,255,0.25); }

  .dis-modal-body { padding:28px 30px 30px; }

  /* Form elements */
  .dis-form-section { margin-bottom:26px; }
  .dis-form-section-title {
    font-size:10px; font-weight:500; color:#1a6b4a;
    letter-spacing:1.8px; text-transform:uppercase;
    margin-bottom:14px; display:flex; align-items:center; gap:10px;
  }
  .dis-form-section-title::after { content:''; flex:1; height:1px; background:#d4e8de; }

  .dis-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media(max-width:520px) { .dis-form-row { grid-template-columns:1fr; } }

  .dis-field { display:flex; flex-direction:column; gap:7px; margin-bottom:14px; }
  .dis-field:last-child { margin-bottom:0; }
  .dis-field-label {
    font-size:11px; font-weight:500; color:#3d7a5f;
    letter-spacing:0.8px; text-transform:uppercase;
  }
  .dis-input, .dis-textarea, .dis-select {
    width:100%; padding:12px 14px;
    border:1.5px solid #c8e0d4; border-radius:11px;
    font-family:'DM Sans',sans-serif; font-size:14px; color:#0d2e20;
    background:rgba(240,247,244,0.6); outline:none;
    transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
    appearance:none;
  }
  .dis-textarea { resize:vertical; min-height:76px; }
  .dis-input:focus, .dis-textarea:focus, .dis-select:focus {
    border-color:#1a6b4a; background:#fff;
    box-shadow:0 0 0 4px rgba(26,107,74,0.1);
  }

  /* Med card in modal */
  .dis-med-card {
    background:rgba(240,247,244,0.6);
    border:1.5px solid #c8e0d4; border-radius:16px;
    padding:18px; margin-bottom:14px;
  }
  .dis-med-card-header {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:14px;
  }
  .dis-med-card-title {
    font-size:13px; font-weight:500; color:#1a6b4a;
    letter-spacing:0.5px;
  }
  .dis-remove-btn {
    display:flex; align-items:center; gap:5px;
    padding:5px 11px; border-radius:8px;
    background:rgba(192,57,43,0.08); border:1px solid rgba(192,57,43,0.2);
    color:#c0392b; font-size:12px; font-weight:500;
    cursor:pointer; transition:background 0.15s;
  }
  .dis-remove-btn:hover { background:rgba(192,57,43,0.15); }

  /* Timing chips (modal) */
  .dis-timing-row { display:flex; gap:8px; flex-wrap:wrap; }
  .dis-timing-toggle {
    padding:8px 16px; border-radius:99px;
    background:rgba(255,255,255,0.9);
    border:1.5px solid #c8e0d4;
    font-size:13px; font-weight:500; color:#5a8a72;
    cursor:pointer; transition:all 0.18s;
  }
  .dis-timing-toggle:hover { border-color:#1a6b4a; color:#1a6b4a; }
  .dis-timing-toggle.on {
    background:linear-gradient(135deg,#1a6b4a,#2d9e6e);
    border-color:transparent; color:#fff;
    box-shadow:0 3px 10px rgba(26,107,74,0.28);
  }

  .dis-add-med-btn {
    width:100%; padding:12px;
    border:1.5px dashed #b5d9cb; border-radius:12px;
    background:none; color:#1a6b4a;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    cursor:pointer; transition:background 0.15s, border-color 0.15s;
    display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .dis-add-med-btn:hover { background:rgba(26,107,74,0.05); border-color:#1a6b4a; }

  /* Modal actions */
  .dis-modal-actions {
    display:flex; gap:12px; margin-top:28px; padding-top:22px;
    border-top:1px solid #d4e8de;
  }
  .dis-modal-cancel {
    flex:1; padding:13px;
    border:1.5px solid #c8e0d4; border-radius:12px;
    background:none; color:#5a8a72;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    cursor:pointer; transition:background 0.15s;
  }
  .dis-modal-cancel:hover { background:rgba(26,107,74,0.05); }
  .dis-modal-submit {
    flex:2; padding:13px;
    background:linear-gradient(135deg,#1a6b4a,#2d9e6e);
    border:none; border-radius:12px; color:#fff;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    cursor:pointer; position:relative; overflow:hidden;
    box-shadow:0 4px 16px rgba(26,107,74,0.35);
    transition:transform 0.15s, box-shadow 0.15s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .dis-modal-submit::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent); }
  .dis-modal-submit:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(26,107,74,0.42); }
  .dis-modal-submit span { position:relative; z-index:1; display:flex; align-items:center; gap:8px; }
`;

const TIMING_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Night'];

const STATUS_CONFIG = {
  ongoing:      { dot: '#2d9e6e', label: 'Ongoing' },
  paused:       { dot: '#4a90d9', label: 'Paused' },
  discontinued: { dot: '#e05252', label: 'Discontinued' },
};

const BLANK_MED = () => ({ name: '', dose: '', timing: [], duration: '', status: 'pending' });
const BLANK_DISEASE = () => ({
  name: '', summary: '', medications: [BLANK_MED()],
  assignedDoctor: '', nextAppointment: '', status: 'ongoing',
});

const Diseases = () => {
  const { email } = useAuth();
  const [diseases, setDiseases]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [openDropId, setOpenDropId]     = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [newDisease, setNewDisease]     = useState(BLANK_DISEASE());

  const fetchDiseases = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/diseases?email=${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDiseases(data.diseases || []);
    } catch { setError('Error loading health conditions.'); }
    finally   { setLoading(false); }
  };

  useEffect(() => {
    if (!email) { setError('Email not found. Please log in again.'); setLoading(false); return; }
    fetchDiseases();
  }, [email]);

  // Med handlers
  const addMed    = () => setNewDisease(d => ({ ...d, medications: [...d.medications, BLANK_MED()] }));
  const removeMed = (i) => setNewDisease(d => ({ ...d, medications: d.medications.filter((_,j) => j!==i) }));
  const setMed    = (i, field, val) => setNewDisease(d => ({
    ...d,
    medications: d.medications.map((m,j) => j===i ? {...m,[field]:val} : m),
  }));
  const toggleTiming = (mi, slot) => {
    const meds = [...newDisease.medications];
    const med  = {...meds[mi]};
    const idx  = med.timing.findIndex(t => t.slot === slot);
    idx === -1 ? med.timing.push({ slot, status:'pending' }) : med.timing.splice(idx,1);
    meds[mi] = med;
    setNewDisease(d => ({...d, medications: meds}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDisease.name || !newDisease.summary) return;
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/user/update-patient', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease: newDisease, email }),
      });
      if (!res.ok) throw new Error();
      await fetchDiseases();
      setNewDisease(BLANK_DISEASE());
      setShowModal(false);
    } catch { alert('Error adding condition. Please try again.'); }
    finally  { setSubmitting(false); }
  };

  const handleStatusChange = async (diseaseId, newStatus) => {
    try {
      await fetch('http://localhost:5000/api/user/update-med-status', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, email, diseaseId }),
      });
      await fetchDiseases();
      setOpenDropId(null);
    } catch { alert('Error updating status.'); }
  };

  const counts = {
    total:        diseases.length,
    ongoing:      diseases.filter(d => (d.status||'ongoing') === 'ongoing').length,
    paused:       diseases.filter(d => d.status === 'paused').length,
    discontinued: diseases.filter(d => d.status === 'discontinued').length,
  };

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="dis-fullscreen">
        <div className="dis-spinner" />
        <div className="dis-spinner-text">Loading your health conditions…</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{styles}</style>
      <div className="dis-fullscreen">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div style={{fontSize:'14px',color:'#c0392b'}}>{error}</div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="dis-root">
        <div className="dis-blob dis-blob-1" />
        <div className="dis-blob dis-blob-2" />
        <div className="dis-blob dis-blob-3" />

        <div className="dis-inner">

          {/* Header */}
          <div className="dis-page-header">
            <div className="dis-page-header-left">
              <div className="dis-page-label">Health Overview</div>
              <div className="dis-page-title">Diseases & Medications</div>
              <div className="dis-page-sub">Track your conditions and treatment plans.</div>
            </div>
            <button className="dis-add-btn" onClick={() => setShowModal(true)}>
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add condition
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="dis-stats">
            <div className="dis-stat-pill">
              <div className="dis-stat-num">{counts.total}</div>
              <div className="dis-stat-label">Total</div>
            </div>
            <div className="dis-stat-pill ongoing">
              <div className="dis-stat-num">{counts.ongoing}</div>
              <div className="dis-stat-label">Ongoing</div>
            </div>
            <div className="dis-stat-pill paused">
              <div className="dis-stat-num">{counts.paused}</div>
              <div className="dis-stat-label">Paused</div>
            </div>
            <div className="dis-stat-pill stopped">
              <div className="dis-stat-num">{counts.discontinued}</div>
              <div className="dis-stat-label">Discontinued</div>
            </div>
          </div>

          {/* Grid */}
          <div className="dis-grid">
            {diseases.length === 0 ? (
              <div className="dis-empty">
                <div className="dis-empty-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <div className="dis-empty-title">No conditions recorded</div>
                <div className="dis-empty-sub">Add your first health condition to start tracking your treatment plan.</div>
              </div>
            ) : diseases.map((disease) => {
              const status = disease.status || 'ongoing';
              const cfg    = STATUS_CONFIG[status] || STATUS_CONFIG.ongoing;
              return (
                <div key={disease._id} className="dis-card">
                  <div className={`dis-card-accent ${status}`} />
                  <div className="dis-card-body">

                    {/* Top */}
                    <div className="dis-card-top">
                      <div className="dis-card-name">{disease.name}</div>
                      <div className="dis-status-wrap">
                        <button
                          className={`dis-status-badge ${status}`}
                          onClick={() => setOpenDropId(openDropId === disease._id ? null : disease._id)}
                        >
                          <div className="dis-status-dot" />
                          {cfg.label}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        {openDropId === disease._id && (
                          <div className="dis-status-menu">
                            {Object.entries(STATUS_CONFIG).map(([key, c]) => (
                              <div
                                key={key}
                                className={`dis-status-option${status===key?' active':''}`}
                                onClick={() => handleStatusChange(disease._id, key)}
                              >
                                <div className="dis-status-option-dot" style={{background:c.dot}} />
                                {c.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="dis-summary">{disease.summary}</div>

                    {/* Meds */}
                    {disease.medications?.length > 0 && (
                      <div>
                        <div className="dis-meds-label">Medications</div>
                        <div className="dis-med-list">
                          {disease.medications.map((med, i) => (
                            <div key={i} className="dis-med-item">
                              <div className="dis-med-icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                              </div>
                              <div>
                                <div className="dis-med-name">{med.name} {med.dose && <span style={{fontWeight:400,color:'#7aaa92'}}>· {med.dose}</span>}</div>
                                {med.duration && <div className="dis-med-detail">{med.duration}</div>}
                                {med.timing?.length > 0 && (
                                  <div className="dis-timing-chips">
                                    {med.timing.map((t,ti) => (
                                      <span key={ti} className="dis-timing-chip">{typeof t==='string'?t:t.slot}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="dis-card-footer">
                      <div className="dis-info-chip">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {disease.assignedDoctor || 'No doctor assigned'}
                      </div>
                      {disease.nextAppointment && (
                        <div className="dis-info-chip">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {new Date(disease.nextAppointment).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Modal ── */}
        {showModal && (
          <div className="dis-overlay" onClick={() => setShowModal(false)}>
            <div className="dis-modal" onClick={e => e.stopPropagation()}>

              <div className="dis-modal-header">
                <div className="dis-modal-title">Add health condition</div>
                <div className="dis-modal-sub">Fill in the details for the new condition and its medications.</div>
                <button className="dis-modal-close" onClick={() => setShowModal(false)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="dis-modal-body">

                {/* Basic info */}
                <div className="dis-form-section">
                  <div className="dis-form-section-title">Basic information</div>
                  <div className="dis-field">
                    <label className="dis-field-label">Condition name *</label>
                    <input className="dis-input" placeholder="e.g. Type 2 Diabetes"
                      value={newDisease.name}
                      onChange={e => setNewDisease(d => ({...d, name:e.target.value}))} required />
                  </div>
                  <div className="dis-field">
                    <label className="dis-field-label">Summary *</label>
                    <textarea className="dis-textarea" placeholder="Brief description of the condition…"
                      value={newDisease.summary}
                      onChange={e => setNewDisease(d => ({...d, summary:e.target.value}))} required />
                  </div>
                  <div className="dis-form-row">
                    <div className="dis-field">
                      <label className="dis-field-label">Assigned doctor</label>
                      <input className="dis-input" placeholder="Dr. Name"
                        value={newDisease.assignedDoctor}
                        onChange={e => setNewDisease(d => ({...d, assignedDoctor:e.target.value}))} />
                    </div>
                    <div className="dis-field">
                      <label className="dis-field-label">Next appointment</label>
                      <input className="dis-input" type="datetime-local"
                        value={newDisease.nextAppointment}
                        onChange={e => setNewDisease(d => ({...d, nextAppointment:e.target.value}))} />
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="dis-form-section">
                  <div className="dis-form-section-title">Medications</div>
                  {newDisease.medications.map((med, i) => (
                    <div key={i} className="dis-med-card">
                      <div className="dis-med-card-header">
                        <div className="dis-med-card-title">Medication {i+1}</div>
                        {newDisease.medications.length > 1 && (
                          <button className="dis-remove-btn" type="button" onClick={() => removeMed(i)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="dis-form-row" style={{marginBottom:'12px'}}>
                        <div className="dis-field" style={{marginBottom:0}}>
                          <label className="dis-field-label">Name</label>
                          <input className="dis-input" placeholder="e.g. Metformin"
                            value={med.name} onChange={e => setMed(i,'name',e.target.value)} />
                        </div>
                        <div className="dis-field" style={{marginBottom:0}}>
                          <label className="dis-field-label">Dose</label>
                          <input className="dis-input" placeholder="e.g. 500mg"
                            value={med.dose} onChange={e => setMed(i,'dose',e.target.value)} />
                        </div>
                      </div>
                      <div className="dis-field" style={{marginBottom:'12px'}}>
                        <label className="dis-field-label">Duration</label>
                        <input className="dis-input" placeholder="e.g. 30 days"
                          value={med.duration} onChange={e => setMed(i,'duration',e.target.value)} />
                      </div>
                      <div className="dis-field" style={{marginBottom:0}}>
                        <label className="dis-field-label">Timing</label>
                        <div className="dis-timing-row">
                          {TIMING_OPTIONS.map(slot => (
                            <button key={slot} type="button"
                              className={`dis-timing-toggle${med.timing.some(t=>t.slot===slot)?' on':''}`}
                              onClick={() => toggleTiming(i, slot)}>
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="dis-add-med-btn" type="button" onClick={addMed}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add another medication
                  </button>
                </div>

                {/* Actions */}
                <div className="dis-modal-actions">
                  <button className="dis-modal-cancel" type="button" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="dis-modal-submit" type="button" onClick={handleSubmit} disabled={submitting}>
                    <span>
                      {submitting
                        ? <><div className="dis-spinner" style={{width:15,height:15,borderWidth:2}} />Saving…</>
                        : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Add condition</>
                      }
                    </span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Diseases;