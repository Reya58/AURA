import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hd-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f7f4;
    padding: 40px 28px;
    position: relative;
  }

  .hd-blob {
    position: fixed; border-radius: 50%;
    filter: blur(72px); opacity: 0.32;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .hd-blob-1 { width: 480px; height: 480px; background: #a8e6cf; top: -120px; left: -100px; }
  .hd-blob-2 { width: 320px; height: 320px; background: #b5ead7; bottom: -60px; right: -60px; animation-delay: 2s; }
  .hd-blob-3 { width: 220px; height: 220px; background: #ffd6a5; top: 35%; right: 10%; animation-delay: 4s; }
  @keyframes blobFloat {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(16px,24px) scale(1.05); }
  }

  .hd-inner {
    position: relative; z-index: 1;
    max-width: 900px; margin: 0 auto;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Page header ── */
  .hd-page-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 32px; gap: 16px; flex-wrap: wrap;
  }
  .hd-page-label {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
  }
  .hd-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 600;
    color: #0d2e20; letter-spacing: -0.5px;
  }
  .hd-page-sub { font-size: 14px; color: #7aaa92; margin-top: 4px; }

  /* Live badge */
  .hd-live-badge {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 12px;
    background: rgba(26,107,74,0.08);
    border: 1px solid rgba(26,107,74,0.15);
    font-size: 13px; font-weight: 500; color: #1a6b4a;
    white-space: nowrap;
  }
  .hd-live-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #2d9e6e;
    animation: livePulse 1.8s ease-in-out infinite;
  }
  @keyframes livePulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(45,158,110,0.5); }
    70%      { box-shadow: 0 0 0 6px transparent; }
  }

  /* ── Status hero card ── */
  .hd-hero {
    border-radius: 24px; overflow: hidden;
    margin-bottom: 24px;
    box-shadow: 0 8px 40px rgba(10,60,40,0.12);
  }
  .hd-hero-bg {
    padding: 32px 36px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 24px; flex-wrap: wrap;
  }
  .hd-hero-bg.normal { background: linear-gradient(135deg,#1a6b4a 0%,#2d9e6e 100%); }
  .hd-hero-bg.critical { background: linear-gradient(135deg,#a32d2d 0%,#e05252 100%); }

  .hd-hero-left {}
  .hd-hero-status-label {
    font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.7);
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;
  }
  .hd-hero-status-val {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 600; color: #fff;
    letter-spacing: -0.5px; line-height: 1;
  }
  .hd-hero-status-sub { font-size: 13px; color: rgba(255,255,255,0.65); margin-top: 6px; }

  .hd-hero-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .hd-hero-icon svg { animation: heartbeat 1.4s ease-in-out infinite; }
  @keyframes heartbeat {
    0%,100% { transform: scale(1); }
    14%      { transform: scale(1.18); }
    28%      { transform: scale(1); }
    42%      { transform: scale(1.1); }
    56%      { transform: scale(1); }
  }

  /* Timestamp strip */
  .hd-hero-footer {
    background: rgba(0,0,0,0.15);
    padding: 12px 36px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
  }
  .hd-hero-footer-item {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; color: rgba(255,255,255,0.75); font-weight: 400;
  }
  .hd-hero-footer-val { color: #fff; font-weight: 500; }

  /* ── Vitals grid ── */
  .hd-vitals {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .hd-vital-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(10,60,40,0.07);
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .hd-vital-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(10,60,40,0.13); }

  .hd-vital-accent { height: 4px; }
  .hd-vital-accent.ecg  { background: linear-gradient(90deg,#1a6b4a,#2d9e6e); }
  .hd-vital-accent.bpm  { background: linear-gradient(90deg,#c0392b,#e05252); }
  .hd-vital-accent.temp { background: linear-gradient(90deg,#b7791f,#f5a623); }
  .hd-vital-accent.spo2 { background: linear-gradient(90deg,#2b6cb0,#4a90d9); }

  .hd-vital-body { padding: 20px; }
  .hd-vital-icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px; flex-shrink: 0;
  }
  .hd-vital-icon.ecg  { background: rgba(26,107,74,0.1);  color: #1a6b4a; }
  .hd-vital-icon.bpm  { background: rgba(192,57,43,0.1);  color: #c0392b; }
  .hd-vital-icon.temp { background: rgba(183,121,31,0.1); color: #b7791f; }
  .hd-vital-icon.spo2 { background: rgba(43,108,176,0.1); color: #2b6cb0; }

  .hd-vital-label {
    font-size: 11px; font-weight: 500; color: #7aaa92;
    letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;
  }
  .hd-vital-val {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 600; color: #0d2e20;
    line-height: 1; letter-spacing: -0.5px;
  }
  .hd-vital-unit {
    font-size: 13px; font-weight: 400; color: #7aaa92; margin-left: 4px;
  }
  .hd-vital-range {
    font-size: 11px; color: #a0c4b4; margin-top: 6px;
  }

  /* ── ECG waveform strip ── */
  .hd-ecg-strip {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(10,60,40,0.07);
    margin-bottom: 24px;
  }
  .hd-ecg-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 22px 0; flex-wrap: wrap; gap: 8px;
  }
  .hd-ecg-title {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 1.8px; text-transform: uppercase;
  }
  .hd-ecg-val {
    font-size: 13px; font-weight: 500; color: #0d2e20;
    background: rgba(26,107,74,0.08); padding: 4px 12px; border-radius: 99px;
  }
  .hd-ecg-canvas { display: block; width: 100%; height: 80px; padding: 0 22px 18px; }

  /* ── Refresh button ── */
  .hd-refresh-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 13px 22px;
    background: linear-gradient(135deg,#1a6b4a,#2d9e6e);
    color: #fff; border: none; border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer; position: relative; overflow: hidden;
    box-shadow: 0 4px 20px rgba(26,107,74,0.35);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .hd-refresh-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent); }
  .hd-refresh-btn:hover  { transform:translateY(-1px); box-shadow:0 8px 28px rgba(26,107,74,0.42); }
  .hd-refresh-btn span   { position:relative; z-index:1; display:flex; align-items:center; gap:8px; }
  .hd-refresh-btn.spinning svg { animation: spinIcon 0.8s linear infinite; }
  @keyframes spinIcon { to { transform: rotate(360deg); } }

  /* ── Full-screen states ── */
  .hd-fullscreen {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    min-height:60vh; gap:14px; font-family:'DM Sans',sans-serif;
  }
  .hd-spinner {
    width:44px; height:44px;
    border:3px solid #d4e8de; border-top-color:#1a6b4a;
    border-radius:50%; animation:spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  .hd-spinner-text { font-size:14px; color:#7aaa92; }
`;

/* ── Mini ECG canvas ── */
const ECGWave = ({ value }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 800;
    const H = 60;
    canvas.width  = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(26,107,74,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 15) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // ECG waveform (one repeating PQRST cycle)
    const cycle = (x, offset = 0) => {
      const t = ((x + offset) % 120) / 120;
      if (t < 0.1)  return Math.sin(t / 0.1 * Math.PI) * 6;
      if (t < 0.35) return 0;
      if (t < 0.4)  return -((t - 0.35) / 0.05) * 4;
      if (t < 0.45) return ((t - 0.4) / 0.05) * 28;
      if (t < 0.5)  return 28 - ((t - 0.45) / 0.05) * 32;
      if (t < 0.55) return -4 + ((t - 0.5) / 0.05) * 8;
      if (t < 0.7)  return Math.sin((t - 0.55) / 0.15 * Math.PI) * 7;
      return 0;
    };

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0,   'rgba(26,107,74,0.2)');
    grad.addColorStop(0.5, 'rgba(45,158,110,1)');
    grad.addColorStop(1,   'rgba(26,107,74,0.2)');

    ctx.beginPath();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.lineJoin  = 'round';
    for (let x = 0; x <= W; x++) {
      const y = H / 2 - cycle(x);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [value]);

  return <canvas ref={canvasRef} className="hd-ecg-canvas" />;
};

/* ── Icons ── */
const HeartIcon = ({ size = 32, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="0">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const ECGIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const TempIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
  </svg>
);
const BPMIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IdIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
  </svg>
);

const HealthDataDisplay = () => {
  const { email }  = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]     = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async (isRefresh = false) => {
    const token = localStorage.getItem('token');
    if (!token)  { setError('Authentication token not found. Please log in.'); setLoading(false); return; }
    if (!email)  { setError('User email not found. Please log in.');           setLoading(false); return; }
    if (isRefresh) setRefreshing(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/latest-health-data?email=${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data.latest);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.response?.status === 401
        ? 'Unauthorized. Please check your token.'
        : 'Failed to fetch data. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [email]);

  const formatTimestamp = (ts) =>
    new Date(ts).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });

  const isNoBeat  = data?.STATUS === 'NO BEAT';
  const isCritical = isNoBeat;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="hd-fullscreen">
        <div className="hd-spinner" />
        <div className="hd-spinner-text">Fetching your health data…</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{styles}</style>
      <div className="hd-fullscreen">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div style={{fontSize:'14px',color:'#c0392b',textAlign:'center',maxWidth:280}}>{error}</div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="hd-root">
        <div className="hd-blob hd-blob-1" />
        <div className="hd-blob hd-blob-2" />
        <div className="hd-blob hd-blob-3" />

        <div className="hd-inner">

          {/* Header */}
          <div className="hd-page-header">
            <div>
              <div className="hd-page-label">Real-time monitoring</div>
              <div className="hd-page-title">Health Monitor</div>
              <div className="hd-page-sub">Live vitals from your connected device.</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <div className="hd-live-badge">
                <div className="hd-live-dot" />
                Live
              </div>
              <button
                className={`hd-refresh-btn${refreshing?' spinning':''}`}
                onClick={() => fetchData(true)}
                disabled={refreshing}
              >
                <span><RefreshIcon /> {refreshing ? 'Refreshing…' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Status hero */}
          <div className="hd-hero">
            <div className={`hd-hero-bg ${isCritical ? 'critical' : 'normal'}`}>
              <div className="hd-hero-left">
                <div className="hd-hero-status-label">Current status</div>
                <div className="hd-hero-status-val">{data.STATUS}</div>
                <div className="hd-hero-status-sub">
                  {isCritical
                    ? 'Critical — no heartbeat detected. Seek immediate help.'
                    : 'All vitals within expected range.'}
                </div>
              </div>
              <div className="hd-hero-icon">
                <HeartIcon size={38} color={isCritical ? '#fca5a5' : '#fff'} />
              </div>
            </div>
            <div className="hd-hero-footer">
              <div className="hd-hero-footer-item">
                <ClockIcon />
                Last reading: <span className="hd-hero-footer-val">{formatTimestamp(data.timestamp)}</span>
              </div>
              {lastUpdated && (
                <div className="hd-hero-footer-item">
                  Fetched: <span className="hd-hero-footer-val">{lastUpdated.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true})}</span>
                </div>
              )}
              <div className="hd-hero-footer-item">
                <IdIcon />
                <span className="hd-hero-footer-val" style={{fontSize:11,letterSpacing:'0.5px'}}>{data._id}</span>
              </div>
            </div>
          </div>

          {/* Vitals grid */}
          <div className="hd-vitals">

            {/* ECG */}
            <div className="hd-vital-card">
              <div className="hd-vital-accent ecg" />
              <div className="hd-vital-body">
                <div className="hd-vital-icon ecg"><ECGIcon /></div>
                <div className="hd-vital-label">ECG reading</div>
                <div className="hd-vital-val">
                  {data.ECG}
                </div>
                <div className="hd-vital-range">Electrocardiogram signal</div>
              </div>
            </div>

            {/* BPM */}
            <div className="hd-vital-card">
              <div className="hd-vital-accent bpm" />
              <div className="hd-vital-body">
                <div className="hd-vital-icon bpm"><BPMIcon /></div>
                <div className="hd-vital-label">Heart rate</div>
                <div className="hd-vital-val">
                  {data.BPM}
                  <span className="hd-vital-unit">bpm</span>
                </div>
                <div className="hd-vital-range">Normal: 60 – 100 bpm</div>
              </div>
            </div>

            {/* Temperature */}
            <div className="hd-vital-card">
              <div className="hd-vital-accent temp" />
              <div className="hd-vital-body">
                <div className="hd-vital-icon temp"><TempIcon /></div>
                <div className="hd-vital-label">Body temperature</div>
                <div className="hd-vital-val">
                  {data.TEMP}
                  <span className="hd-vital-unit">°C</span>
                </div>
                <div className="hd-vital-range">Normal: 36.1 – 37.2 °C</div>
              </div>
            </div>

          </div>

          {/* ECG waveform strip */}
          <div className="hd-ecg-strip">
            <div className="hd-ecg-header">
              <div className="hd-ecg-title">ECG waveform</div>
              <div className="hd-ecg-val">Lead II · {data.BPM} bpm</div>
            </div>
            <ECGWave value={data.ECG} />
          </div>

        </div>
      </div>
    </>
  );
};

export default HealthDataDisplay;