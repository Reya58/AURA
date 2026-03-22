import React, { useState, useEffect } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sos-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f7f4;
    padding: 40px 28px;
    position: relative;
  }

  .sos-blob {
    position: fixed; border-radius: 50%;
    filter: blur(72px); opacity: 0.28;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .sos-blob-1 { width: 420px; height: 420px; background: #fca5a5; top: -100px; left: -100px; }
  .sos-blob-2 { width: 300px; height: 300px; background: #fcd34d; bottom: -60px; right: -60px; animation-delay: 2s; }
  .sos-blob-3 { width: 200px; height: 200px; background: #a8e6cf; top: 40%; right: 10%; animation-delay: 4s; }
  @keyframes blobFloat {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(14px,20px) scale(1.05); }
  }

  .sos-inner {
    position: relative; z-index: 1;
    max-width: 680px; margin: 0 auto;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Page header ── */
  .sos-page-label {
    font-size: 11px; font-weight: 500; color: #c0392b;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
  }
  .sos-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 600;
    color: #0d2e20; letter-spacing: -0.5px;
  }
  .sos-page-sub { font-size: 14px; color: #7aaa92; margin-top: 4px; margin-bottom: 32px; }

  /* ── Big SOS button ── */
  .sos-hero {
    display: flex; flex-direction: column; align-items: center;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 28px; padding: 44px 32px;
    box-shadow: 0 8px 40px rgba(192,57,43,0.1);
    margin-bottom: 24px; text-align: center;
  }

  .sos-ring-wrap {
    position: relative; margin-bottom: 28px;
  }
  .sos-ring {
    position: absolute; inset: -14px;
    border-radius: 50%;
    border: 2px solid rgba(192,57,43,0.25);
    animation: ringPulse 2s ease-in-out infinite;
  }
  .sos-ring-2 {
    position: absolute; inset: -28px;
    border-radius: 50%;
    border: 2px solid rgba(192,57,43,0.12);
    animation: ringPulse 2s ease-in-out infinite 0.4s;
  }
  @keyframes ringPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(1.06); }
  }

  .sos-big-btn {
    width: 140px; height: 140px; border-radius: 50%;
    background: linear-gradient(145deg, #c0392b, #e05252);
    border: none; cursor: pointer; color: #fff;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 6px;
    box-shadow:
      0 0 0 6px rgba(192,57,43,0.15),
      0 16px 48px rgba(192,57,43,0.45);
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative; z-index: 1;
  }
  .sos-big-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(192,57,43,0.2), 0 20px 56px rgba(192,57,43,0.55);
  }
  .sos-big-btn:active { transform: scale(0.97); }
  .sos-big-btn-label {
    font-size: 13px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
  }

  .sos-big-btn.sent {
    background: linear-gradient(145deg,#1a6b4a,#2d9e6e);
    box-shadow: 0 0 0 6px rgba(26,107,74,0.15), 0 16px 48px rgba(26,107,74,0.4);
    animation: none;
  }
  .sos-big-btn.sent:hover {
    box-shadow: 0 0 0 8px rgba(26,107,74,0.2), 0 20px 56px rgba(26,107,74,0.5);
  }

  .sos-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 600; color: #0d2e20; margin-bottom: 6px;
  }
  .sos-hero-sub { font-size: 13px; color: #7aaa92; max-width: 320px; line-height: 1.6; }

  /* Success toast */
  .sos-success {
    display: flex; align-items: center; gap: 10px;
    background: rgba(26,107,74,0.1);
    border: 1px solid rgba(26,107,74,0.2);
    border-radius: 12px; padding: 12px 18px;
    margin-top: 20px;
    font-size: 13px; font-weight: 500; color: #1a6b4a;
    animation: fadeUp 0.3s ease;
  }

  /* ── Action cards ── */
  .sos-actions { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }

  .sos-action-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(10,60,40,0.07);
    transition: transform 0.18s, box-shadow 0.18s;
    cursor: pointer;
    display: flex; align-items: center; gap: 18px;
    padding: 20px 22px;
    text-align: left;
    width: 100%; border: none;
  }
  .sos-action-card:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(10,60,40,0.12); }

  .sos-action-icon {
    width: 50px; height: 50px; border-radius: 15px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .sos-action-icon.call   { background: linear-gradient(135deg,#c0392b,#e05252); }
  .sos-action-icon.police { background: linear-gradient(135deg,#2b6cb0,#4a90d9); }
  .sos-action-icon.fire   { background: linear-gradient(135deg,#b7791f,#f5a623); }
  .sos-action-icon.amb    { background: linear-gradient(135deg,#1a6b4a,#2d9e6e); }

  .sos-action-body { flex: 1; min-width: 0; }
  .sos-action-title { font-size: 15px; font-weight: 500; color: #0d2e20; margin-bottom: 2px; }
  .sos-action-sub   { font-size: 12px; color: #7aaa92; }
  .sos-action-number {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 600; color: #0d2e20; flex-shrink: 0;
  }

  /* ── Info card ── */
  .sos-info-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 20px; padding: 22px 24px;
    box-shadow: 0 4px 20px rgba(10,60,40,0.07);
  }
  .sos-info-title {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 1.8px; text-transform: uppercase;
    margin-bottom: 14px; display: flex; align-items: center; gap: 10px;
  }
  .sos-info-title::after { content:''; flex:1; height:1px; background:#d4e8de; }

  .sos-tips { display: flex; flex-direction: column; gap: 10px; }
  .sos-tip {
    display: flex; align-items: flex-start; gap: 12px;
    font-size: 13px; color: #5a8a72; line-height: 1.55;
  }
  .sos-tip-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #2d9e6e;
    flex-shrink: 0; margin-top: 5px;
  }

  /* ── Countdown ── */
  .sos-countdown {
    font-size: 12px; color: rgba(255,255,255,0.8);
    margin-top: 4px; letter-spacing: 0.5px;
  }
`;

const PhoneIcon = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 5.42 5.42l.88-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const AlertIcon = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CheckIcon = ({ size = 20, color = '#1a6b4a' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const FireIcon = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);
const ShieldIcon = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const AmbIcon = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8e0d4" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const EMERGENCY_NUMBERS = [
  { label: 'Ambulance',       sub: 'Medical emergency',    number: '102', icon: <AmbIcon />,    cls: 'amb',    tel: '102' },
  { label: 'Police',          sub: 'Law enforcement',      number: '100', icon: <ShieldIcon />, cls: 'police', tel: '100' },
  { label: 'Fire brigade',    sub: 'Fire & rescue',        number: '101', icon: <FireIcon />,   cls: 'fire',   tel: '101' },
  { label: 'National helpline',sub: 'All emergencies',     number: '112', icon: <PhoneIcon />,  cls: 'call',   tel: '112' },
];

const TIPS = [
  'Stay calm and speak clearly when calling emergency services.',
  'Share your exact location — nearest landmark, street name, or GPS coordinates.',
  'Do not hang up until the operator tells you to.',
  'If unsafe to speak, text or use the SOS alert button above.',
  'Keep emergency contacts saved and regularly updated.',
];

const EmergencySOS = () => {
  const [alertSent, setAlertSent]     = useState(false);
  const [countdown, setCountdown]     = useState(null);
  const [confirming, setConfirming]   = useState(false);

  // 3-second hold-to-confirm countdown
  useEffect(() => {
    if (!confirming) { setCountdown(null); return; }
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setAlertSent(true);
          setConfirming(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [confirming]);

  const handleSOSPress = () => {
    if (alertSent) return;
    if (confirming) { setConfirming(false); return; } // cancel
    setConfirming(true);
  };

  const handleCall = (tel) => {
    window.location.href = `tel:${tel}`;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sos-root">
        <div className="sos-blob sos-blob-1" />
        <div className="sos-blob sos-blob-2" />
        <div className="sos-blob sos-blob-3" />

        <div className="sos-inner">

          {/* Header */}
          <div className="sos-page-label">Emergency</div>
          <div className="sos-page-title">Emergency SOS</div>
          <div className="sos-page-sub">Quick access to emergency services and alerts.</div>

          {/* Hero SOS button */}
          <div className="sos-hero">
            <div className="sos-ring-wrap">
              {!alertSent && <><div className="sos-ring" /><div className="sos-ring-2" /></>}
              <button
                className={`sos-big-btn${alertSent ? ' sent' : ''}`}
                onClick={handleSOSPress}
              >
                {alertSent
                  ? <><CheckIcon size={36} color="#fff" /><span className="sos-big-btn-label">Sent</span></>
                  : confirming
                    ? <><AlertIcon size={32} /><span className="sos-big-btn-label">Cancel</span></>
                    : <><AlertIcon size={32} /><span className="sos-big-btn-label">SOS</span></>
                }
                {confirming && countdown && (
                  <span className="sos-countdown">Sending in {countdown}…</span>
                )}
              </button>
            </div>

            <div className="sos-hero-title">
              {alertSent ? 'Alert sent successfully' : confirming ? 'Hold on — sending SOS…' : 'Tap to send SOS alert'}
            </div>
            <div className="sos-hero-sub">
              {alertSent
                ? 'Your SOS alert has been dispatched. Help is on the way. Stay calm.'
                : confirming
                  ? 'Tap again to cancel. Alert will send automatically.'
                  : 'Sends an emergency alert. Tap once to start the countdown, tap again to cancel.'
              }
            </div>

            {alertSent && (
              <div className="sos-success">
                <CheckIcon size={16} />
                SOS alert dispatched — emergency contacts notified.
              </div>
            )}
          </div>

          {/* Emergency numbers */}
          <div className="sos-actions">
            {EMERGENCY_NUMBERS.map(({ label, sub, number, icon, cls, tel }) => (
              <button
                key={label}
                className="sos-action-card"
                onClick={() => handleCall(tel)}
              >
                <div className={`sos-action-icon ${cls}`}>{icon}</div>
                <div className="sos-action-body">
                  <div className="sos-action-title">{label}</div>
                  <div className="sos-action-sub">{sub}</div>
                </div>
                <div className="sos-action-number">{number}</div>
                <ChevronIcon />
              </button>
            ))}
          </div>

          {/* Safety tips */}
          <div className="sos-info-card">
            <div className="sos-info-title">Safety tips</div>
            <div className="sos-tips">
              {TIPS.map((tip, i) => (
                <div key={i} className="sos-tip">
                  <div className="sos-tip-dot" />
                  {tip}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default EmergencySOS;