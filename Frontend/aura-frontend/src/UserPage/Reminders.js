import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rem-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f7f4;
    padding: 40px 28px;
    position: relative;
  }

  .rem-blob {
    position: fixed; border-radius: 50%;
    filter: blur(72px); opacity: 0.32;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .rem-blob-1 { width: 480px; height: 480px; background: #a8e6cf; top: -120px; left: -100px; }
  .rem-blob-2 { width: 320px; height: 320px; background: #b5ead7; bottom: -60px; right: -60px; animation-delay: 2s; }
  .rem-blob-3 { width: 200px; height: 200px; background: #ffd6a5; top: 40%; right: 12%; animation-delay: 4s; }
  @keyframes blobFloat {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(16px,24px) scale(1.05); }
  }

  .rem-inner {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .rem-page-header { margin-bottom: 32px; }
  .rem-page-label {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
  }
  .rem-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 600;
    color: #0d2e20; letter-spacing: -0.5px;
  }
  .rem-page-sub { font-size: 14px; color: #7aaa92; margin-top: 4px; }

  .rem-clock-bar {
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 18px; padding: 18px 24px;
    box-shadow: 0 4px 20px rgba(10,60,40,0.07);
    margin-bottom: 28px; flex-wrap: wrap; gap: 14px;
  }
  .rem-clock-time {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 600; color: #0d2e20;
    letter-spacing: -1px; line-height: 1;
  }
  .rem-clock-date { font-size: 13px; color: #7aaa92; margin-top: 4px; }
  .rem-current-slot-badge {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 12px;
    font-size: 13px; font-weight: 500;
  }
  .rem-current-slot-badge.morning   { background:rgba(253,203,110,0.2); color:#b7791f; border:1px solid rgba(253,203,110,0.4); }
  .rem-current-slot-badge.afternoon { background:rgba(253,121,168,0.12); color:#b83280; border:1px solid rgba(253,121,168,0.3); }
  .rem-current-slot-badge.evening   { background:rgba(162,155,254,0.15); color:#553c9a; border:1px solid rgba(162,155,254,0.35); }
  .rem-current-slot-badge.night     { background:rgba(45,52,54,0.08); color:#2d3436; border:1px solid rgba(45,52,54,0.15); }
  .rem-slot-dot { width:8px; height:8px; border-radius:50%; animation: vPulse 1.8s ease-in-out infinite; }
  .rem-current-slot-badge.morning .rem-slot-dot   { background:#fdcb6e; }
  .rem-current-slot-badge.afternoon .rem-slot-dot { background:#fd79a8; }
  .rem-current-slot-badge.evening .rem-slot-dot   { background:#a29bfe; }
  .rem-current-slot-badge.night .rem-slot-dot     { background:#636e72; }
  @keyframes vPulse {
    0%,100% { box-shadow: 0 0 0 0 currentColor; }
    70%      { box-shadow: 0 0 0 5px transparent; }
  }

  .rem-stats { display: flex; gap: 14px; margin-bottom: 28px; flex-wrap: wrap; }
  .rem-stat-pill {
    flex: 1; min-width: 100px;
    background: rgba(255,255,255,0.82);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 16px; padding: 16px 20px;
    display: flex; flex-direction: column; gap: 4px;
    box-shadow: 0 4px 16px rgba(10,60,40,0.06);
    backdrop-filter: blur(12px);
  }
  .rem-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 600; color: #0d2e20;
  }
  .rem-stat-label { font-size: 11px; color: #7aaa92; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .rem-stat-pill.pending .rem-stat-num { color: #b7791f; }
  .rem-stat-pill.done    .rem-stat-num { color: #1a6b4a; }

  .rem-section { margin-bottom: 32px; }
  .rem-section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .rem-section-icon {
    width: 38px; height: 38px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .rem-section-icon.current  { background: linear-gradient(135deg,#1a6b4a,#2d9e6e); }
  .rem-section-icon.upcoming { background: linear-gradient(135deg,#4a90d9,#2b6cb0); }
  .rem-section-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; color: #0d2e20; }
  .rem-section-count {
    font-size: 12px; color: #7aaa92; font-weight: 500;
    background: rgba(26,107,74,0.08); padding: 3px 10px; border-radius: 99px;
  }
  .rem-section-line { flex:1; height:1px; background:#d4e8de; }

  .rem-cards { display: flex; flex-direction: column; gap: 12px; }

  /* ── KEY FIX: removed overflow:hidden so dropdown isn't clipped ── */
  .rem-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 18px; padding: 18px 20px;
    display: flex; align-items: center; gap: 16px;
    box-shadow: 0 4px 20px rgba(10,60,40,0.07);
    transition: transform 0.18s, box-shadow 0.18s;
    position: relative;
  }
  /* accent bar via pseudo-element — overflow only applies here */
  .rem-card::before {
    content:''; position:absolute; left:0; top:0; bottom:0;
    width:4px; border-radius:4px 0 0 4px;
    overflow:hidden;
  }
  .rem-card.current::before  { background:linear-gradient(180deg,#1a6b4a,#2d9e6e); }
  .rem-card.upcoming::before { background:linear-gradient(180deg,#4a90d9,#2b6cb0); }
  .rem-card.done::before     { background:linear-gradient(180deg,#b2d8c8,#d4e8de); }
  .rem-card:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(10,60,40,0.12); }
  .rem-card.done { opacity: 0.6; }

  .rem-card-icon {
    width: 44px; height: 44px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .rem-card-icon.current  { background: rgba(26,107,74,0.1);  color: #1a6b4a; }
  .rem-card-icon.upcoming { background: rgba(74,144,217,0.1); color: #2b6cb0; }
  .rem-card-icon.done     { background: rgba(178,216,200,0.3); color: #7aaa92; }

  .rem-card-body { flex:1; min-width:0; }
  .rem-card-name {
    font-size:15px; font-weight:500; color:#0d2e20; margin-bottom:4px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .rem-card-name.done { text-decoration: line-through; color:#7aaa92; }
  .rem-card-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .rem-card-dose {
    font-size:12px; color:#5a8a72; font-weight:500;
    background:rgba(26,107,74,0.08); padding:2px 9px; border-radius:99px;
  }
  .rem-card-disease { font-size:12px; color:#7aaa92; display:flex; align-items:center; gap:4px; }

  .rem-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }

  .rem-slot-badge {
    font-size:11px; font-weight:500; padding:4px 10px; border-radius:99px; white-space:nowrap;
  }
  .rem-slot-badge.morning   { background:rgba(253,203,110,0.2); color:#b7791f; }
  .rem-slot-badge.afternoon { background:rgba(253,121,168,0.12); color:#b83280; }
  .rem-slot-badge.evening   { background:rgba(162,155,254,0.15); color:#553c9a; }
  .rem-slot-badge.night     { background:rgba(45,52,54,0.08); color:#636e72; }

  .rem-done-badge {
    display:flex; align-items:center; gap:5px;
    font-size:12px; font-weight:500; color:#1a6b4a;
    background:rgba(26,107,74,0.08); padding:5px 12px; border-radius:99px;
  }

  /* ── KEY FIX: z-index:1000 ensures dropdown renders above all cards ── */
  .rem-status-wrap { position: relative; }
  .rem-mark-btn {
    display:flex; align-items:center; gap:6px;
    padding:8px 14px; border-radius:10px;
    background:linear-gradient(135deg,#1a6b4a,#2d9e6e);
    border:none; color:#fff;
    font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500;
    cursor:pointer; position:relative; overflow:hidden;
    box-shadow:0 3px 10px rgba(26,107,74,0.3);
    transition:transform 0.15s, box-shadow 0.15s;
  }
  .rem-mark-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent); }
  .rem-mark-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 16px rgba(26,107,74,0.4); }
  .rem-mark-btn:disabled { opacity:0.7; cursor:not-allowed; }
  .rem-mark-btn span { position:relative; z-index:1; display:flex; align-items:center; gap:6px; }

  .rem-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    background: #fff;
    border: 1px solid #d4e8de;
    border-radius: 12px;
    box-shadow: 0 8px 28px rgba(10,60,40,0.18);
    overflow: hidden;
    z-index: 1000;
    min-width: 160px;
    animation: menuIn 0.18s ease;
  }
  @keyframes menuIn {
    from { opacity:0; transform:translateY(-6px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .rem-dropdown-opt {
    display:flex; align-items:center; gap:10px;
    padding:13px 16px; cursor:pointer;
    font-size:13px; font-weight:500; color:#3d7a5f;
    transition:background 0.12s;
  }
  .rem-dropdown-opt:hover { background:#f0f7f4; color:#1a6b4a; }

  .rem-empty {
    display:flex; flex-direction:column; align-items:center;
    padding:52px 24px; gap:12px;
    background:rgba(255,255,255,0.7);
    border:1px dashed #b5d9cb; border-radius:20px; text-align:center;
  }
  .rem-empty-icon {
    width:56px; height:56px; border-radius:50%;
    background:rgba(26,107,74,0.08);
    display:flex; align-items:center; justify-content:center; color:#2d9e6e;
  }
  .rem-empty-title { font-family:'Playfair Display',serif; font-size:20px; color:#0d2e20; }
  .rem-empty-sub   { font-size:13px; color:#7aaa92; max-width:260px; line-height:1.6; }

  @keyframes spin { to { transform:rotate(360deg); } }
`;

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const TIMING_SLOTS = {
  Morning:   [6,  12],
  Afternoon: [12, 17],
  Evening:   [17, 20],
  Night:     [20, 23],
};
const SLOT_ORDER = ['Morning', 'Afternoon', 'Evening', 'Night'];
const slotCls = (slot) => (slot || '').toLowerCase();

/* ─────────────────────────────────────────
   Icons
───────────────────────────────────────── */
const PillIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ─────────────────────────────────────────
   Hooks
───────────────────────────────────────── */
const useNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

const getCurrentSlot = (hour) => {
  for (const [slot, [start, end]] of Object.entries(TIMING_SLOTS)) {
    if (hour >= start && hour < end) return slot;
  }
  return null;
};

/* ─────────────────────────────────────────
   ✅ ReminderCard defined OUTSIDE Reminder
   so it is never redefined on re-render,
   preventing remount that killed the dropdown
───────────────────────────────────────── */
const ReminderCard = ({ r, type, dropdownOpen, setDropdownOpen, marking, markAsDone }) => (
  <div className={`rem-card ${type}`}>
    <div className={`rem-card-icon ${type}`}>
      <PillIcon />
    </div>

    <div className="rem-card-body">
      <div className={`rem-card-name${type === 'done' ? ' done' : ''}`}>{r.medName}</div>
      <div className="rem-card-meta">
        {r.dose && <span className="rem-card-dose">{r.dose}</span>}
        <span className="rem-card-disease">
          <HeartIcon /> {r.disease}
        </span>
      </div>
    </div>

    <div className="rem-card-right">
      <span className={`rem-slot-badge ${slotCls(r.slot)}`}>{r.slot}</span>

      {type === 'current' && (
        <div className="rem-status-wrap">
          <button
            className="rem-mark-btn"
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevents global close handler from firing
              setDropdownOpen(dropdownOpen === r._id ? null : r._id);
            }}
            disabled={marking === r._id}
          >
            <span>
              {marking === r._id ? (
                <>
                  <div style={{width:12,height:12,border:'2px solid rgba(255,255,255,0.35)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}} />
                  Saving…
                </>
              ) : (
                <>Pending <ChevronIcon /></>
              )}
            </span>
          </button>

          {dropdownOpen === r._id && (
            <div className="rem-dropdown">
              <div
                className="rem-dropdown-opt"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevents global close from firing before markAsDone
                  markAsDone(r);
                }}
              >
                <CheckIcon /> Mark as done
              </div>
            </div>
          )}
        </div>
      )}

      {type === 'upcoming' && (
        <div className="rem-done-badge" style={{background:'rgba(74,144,217,0.1)', color:'#2b6cb0'}}>
          <ClockIcon /> Upcoming
        </div>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
const Reminder = () => {
  const { email } = useAuth();
  const [reminders, setReminders]               = useState([]);
  const [currentReminders, setCurrentReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [dropdownOpen, setDropdownOpen]           = useState(null);
  const [marking, setMarking]                     = useState(null);
  const now = useNow();

  const hour        = now.getHours();
  const currentSlot = getCurrentSlot(hour);
  const timeStr     = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
  const dateStr     = now.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });

  /* ✅ Global click handler closes dropdown when clicking anywhere outside */
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchReminders = async () => {
    if (!email) return;
    try {
      const res = await fetch(
        `https://aura-wo8f.vercel.app/api/user/fetch-reminders?email=${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const data = await res.json();
      setReminders(data.reminders || []);
    } catch (err) { console.error('Error fetching reminders:', err); }
  };

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const current = [], upcoming = [];
    reminders.forEach((med) => {
      med.timing.forEach((slot) => {
        if (slot.status !== 'pending') return;
        const [start, end] = TIMING_SLOTS[slot.slot] || [0, 0];
        const base = {
          ...slot,
          medName:      med.medName,
          dose:         med.dose,
          disease:      med.diseaseName || med.name,
          medicationId: med._id,
          diseaseId:    med.diseaseId || med._id,
        };
        if (hour >= start && hour < end) current.push(base);
        else if (hour < start)           upcoming.push(base);
      });
    });
    upcoming.sort((a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot));
    setCurrentReminders(current);
    setUpcomingReminders(upcoming);
  }, [reminders, hour]);

  const markAsDone = async (reminder) => {
    setMarking(reminder._id);
    try {
      const res = await fetch('https://aura-wo8f.vercel.app/api/user/update-reminder-status', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          diseaseId:    reminder.diseaseId,
          medicationId: reminder.medicationId,
          slot:         reminder.slot,
          status:       'done',
        }),
      });
      if (!res.ok) throw new Error();
      setReminders(prev =>
        prev.map(med => {
          if (med._id !== reminder.medicationId) return med;
          return {
            ...med,
            timing: med.timing.map(t =>
              t._id === reminder._id ? { ...t, status: 'done' } : t
            ),
          };
        })
      );
      setDropdownOpen(null);
    } catch {
      alert('Failed to mark as done. Please try again.');
    } finally {
      setMarking(null);
    }
  };

  const totalPending = currentReminders.length + upcomingReminders.length;
  const doneToday    = reminders.reduce(
    (acc, med) => acc + med.timing.filter(t => t.status === 'done').length, 0
  );

  return (
    <>
      <style>{styles}</style>
      <div className="rem-root">
        <div className="rem-blob rem-blob-1" />
        <div className="rem-blob rem-blob-2" />
        <div className="rem-blob rem-blob-3" />

        <div className="rem-inner">

          {/* Header */}
          <div className="rem-page-header">
            <div className="rem-page-label">Daily schedule</div>
            <div className="rem-page-title">Medication Reminders</div>
            <div className="rem-page-sub">Stay on track with your treatment plan.</div>
          </div>

          {/* Live clock */}
          <div className="rem-clock-bar">
            <div>
              <div className="rem-clock-time">{timeStr}</div>
              <div className="rem-clock-date">{dateStr}</div>
            </div>
            {currentSlot && (
              <div className={`rem-current-slot-badge ${slotCls(currentSlot)}`}>
                <div className="rem-slot-dot" />
                {currentSlot} window active
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="rem-stats">
            <div className="rem-stat-pill pending">
              <div className="rem-stat-num">{totalPending}</div>
              <div className="rem-stat-label">Pending today</div>
            </div>
            <div className="rem-stat-pill done">
              <div className="rem-stat-num">{doneToday}</div>
              <div className="rem-stat-label">Completed</div>
            </div>
            <div className="rem-stat-pill">
              <div className="rem-stat-num">{currentReminders.length}</div>
              <div className="rem-stat-label">Due now</div>
            </div>
          </div>

          {/* Current reminders */}
          <div className="rem-section">
            <div className="rem-section-header">
              <div className="rem-section-icon current">
                <BellIcon />
              </div>
              <div className="rem-section-title">Due now</div>
              <div className="rem-section-count">{currentReminders.length}</div>
              <div className="rem-section-line" />
            </div>
            <div className="rem-cards">
              {currentReminders.length === 0 ? (
                <div className="rem-empty">
                  <div className="rem-empty-icon"><CheckIcon /></div>
                  <div className="rem-empty-title">All clear!</div>
                  <div className="rem-empty-sub">No medications due in the current time window.</div>
                </div>
              ) : currentReminders.map(r => (
                <ReminderCard
                  key={r._id}
                  r={r}
                  type="current"
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  marking={marking}
                  markAsDone={markAsDone}
                />
              ))}
            </div>
          </div>

          {/* Upcoming reminders */}
          <div className="rem-section">
            <div className="rem-section-header">
              <div className="rem-section-icon upcoming">
                <ClockIcon />
              </div>
              <div className="rem-section-title">Coming up</div>
              <div className="rem-section-count">{upcomingReminders.length}</div>
              <div className="rem-section-line" />
            </div>
            <div className="rem-cards">
              {upcomingReminders.length === 0 ? (
                <div className="rem-empty">
                  <div className="rem-empty-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d9e6e" strokeWidth="2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="rem-empty-title">Nothing ahead</div>
                  <div className="rem-empty-sub">No more medications scheduled for the rest of today.</div>
                </div>
              ) : upcomingReminders.map(r => (
                <ReminderCard
                  key={r._id}
                  r={r}
                  type="upcoming"
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  marking={marking}
                  markAsDone={markAsDone}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Reminder;