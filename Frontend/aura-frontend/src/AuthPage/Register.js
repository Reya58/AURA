import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
// import auraLogo from "./AURA_LOGO.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .aura-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #f0f7f4;
    overflow: hidden;
    position: relative;
  }

  .aura-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(72px);
    opacity: 0.45;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }
  .aura-blob-1 { width: 520px; height: 520px; background: #a8e6cf; top: -140px; left: -120px; animation-delay: 0s; }
  .aura-blob-2 { width: 380px; height: 380px; background: #b5ead7; bottom: -80px; right: -80px; animation-delay: 2s; }
  .aura-blob-3 { width: 260px; height: 260px; background: #ffd6a5; top: 30%; right: 20%; animation-delay: 4s; }

  @keyframes blobFloat {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(20px, 30px) scale(1.06); }
  }

  /* ── Left panel ── */
  .aura-left {
    display: none;
    flex: 1;
    position: relative;
    background: linear-gradient(155deg, #1a6b4a 0%, #0d4a32 60%, #082e1f 100%);
    padding: 60px 52px;
    flex-direction: column;
    justify-content: space-between;
    z-index: 1;
    overflow: hidden;
  }
  @media (min-width: 900px) { .aura-left { display: flex; } }

  .aura-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='600' height='700' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='300' cy='350' r='280' fill='none' stroke='%23ffffff08' stroke-width='1'/%3E%3Ccircle cx='300' cy='350' r='200' fill='none' stroke='%23ffffff0a' stroke-width='1'/%3E%3Ccircle cx='300' cy='350' r='120' fill='none' stroke='%23ffffff0c' stroke-width='1'/%3E%3C/svg%3E") center/cover no-repeat;
  }

  .aura-brand { position: relative; z-index: 2; }
  .aura-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1;
  }
  .aura-brand-tag {
    font-size: 13px;
    font-weight: 300;
    color: #a8d8c2;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-top: 6px;
  }

  .aura-left-art {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .aura-steps { display: flex; flex-direction: column; gap: 20px; }
  .aura-step {
    display: flex; align-items: flex-start; gap: 16px;
  }
  .aura-step-num {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(110,221,176,0.18);
    border: 1px solid rgba(110,221,176,0.4);
    color: #6eddb0;
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .aura-step-title { font-size: 15px; font-weight: 500; color: #fff; margin-bottom: 3px; }
  .aura-step-sub   { font-size: 13px; font-weight: 300; color: #a8d8c2; line-height: 1.5; }

  .aura-left-headline {
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    font-weight: 600;
    color: #fff;
    line-height: 1.2;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }
  .aura-left-headline em { color: #6eddb0; font-style: normal; }

  .aura-left-sub {
    font-size: 15px;
    font-weight: 300;
    color: #a8d8c2;
    line-height: 1.65;
    max-width: 320px;
    margin-bottom: 8px;
  }

  .aura-stats {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 32px;
    padding-top: 32px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  .aura-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: #fff;
    font-weight: 600;
  }
  .aura-stat-label { font-size: 12px; color: #80c4a8; font-weight: 400; margin-top: 2px; letter-spacing: 0.5px; }

  /* ── Right panel ── */
  .aura-right {
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 32px;
    position: relative;
    z-index: 1;
  }
  @media (min-width: 900px) { .aura-right { flex: 0 0 500px; max-width: 500px; } }

  .aura-card {
    width: 100%;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(24px);
    border-radius: 28px;
    padding: 44px 44px 36px;
    box-shadow:
      0 2px 0 rgba(255,255,255,0.9) inset,
      0 24px 80px rgba(10, 60, 40, 0.12),
      0 4px 16px rgba(10, 60, 40, 0.06);
    border: 1px solid rgba(255,255,255,0.7);
    animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .aura-logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
  }
  .aura-logo-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #1a6b4a, #2d9e6e);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(26,107,74,0.35);
    flex-shrink: 0;
  }
  .aura-logo-img { width: 48px; height: 48px; border-radius: 14px; object-fit: cover; }

  .aura-welcome-label {
    font-size: 11px;
    font-weight: 500;
    color: #1a6b4a;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .aura-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 600;
    color: #0d2e20;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }

  /* Progress bar */
  .aura-progress-wrap { margin-bottom: 28px; }
  .aura-progress-label {
    display: flex; justify-content: space-between;
    font-size: 12px; color: #7aaa92; margin-bottom: 8px;
  }
  .aura-progress-track {
    height: 4px; background: #d4e8de; border-radius: 99px; overflow: hidden;
  }
  .aura-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1a6b4a, #2d9e6e);
    border-radius: 99px;
    transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* Two-column row */
  .aura-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .aura-field { margin-bottom: 16px; }
  .aura-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #3d7a5f;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-bottom: 7px;
  }
  .aura-input-wrap { position: relative; }
  .aura-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: #7aaa92; display: flex; align-items: center; pointer-events: none;
  }
  .aura-input {
    width: 100%;
    padding: 13px 14px 13px 42px;
    border: 1.5px solid #c8e0d4;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #0d2e20;
    background: rgba(240,247,244,0.6);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .aura-input::placeholder { color: #a0c4b4; }
  .aura-input:focus {
    border-color: #1a6b4a;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(26,107,74,0.1);
  }
  .aura-input.valid { border-color: #2d9e6e; }
  .aura-input.invalid { border-color: #e05252; }

  .aura-pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #7aaa92; display: flex; align-items: center; padding: 4px;
    transition: color 0.2s;
  }
  .aura-pw-toggle:hover { color: #1a6b4a; }

  /* Password strength */
  .aura-strength { margin-top: 8px; }
  .aura-strength-bars { display: flex; gap: 4px; margin-bottom: 4px; }
  .aura-strength-bar {
    flex: 1; height: 3px; border-radius: 99px;
    background: #d4e8de;
    transition: background 0.3s;
  }
  .aura-strength-bar.weak   { background: #e05252; }
  .aura-strength-bar.fair   { background: #f5a623; }
  .aura-strength-bar.good   { background: #2d9e6e; }
  .aura-strength-bar.strong { background: #1a6b4a; }
  .aura-strength-text { font-size: 11px; color: #7aaa92; }

  .aura-error {
    background: #fff0f0;
    border: 1px solid #f5c6c6;
    color: #c0392b;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }

  .aura-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #1a6b4a 0%, #2d9e6e 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.3px;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 20px rgba(26,107,74,0.38);
    margin-top: 8px;
  }
  .aura-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  }
  .aura-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(26,107,74,0.45); }
  .aura-btn:active:not(:disabled) { transform: translateY(0); }
  .aura-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .aura-btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; z-index: 1; }

  .aura-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .aura-card-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #7aaa92;
  }
  .aura-card-footer a {
    color: #1a6b4a; font-weight: 500; text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }
  .aura-card-footer a:hover { border-color: #1a6b4a; }

  .aura-terms {
    font-size: 12px; color: #7aaa92; text-align: center;
    margin-top: 14px; line-height: 1.5;
  }
  .aura-terms a { color: #3d7a5f; text-decoration: none; font-weight: 500; }
  .aura-terms a:hover { color: #1a6b4a; }
`;

const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d9e6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', bars: [] };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = ['', 'weak', 'fair', 'good', 'strong'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const bars = Array.from({ length: 4 }, (_, i) => i < score ? levels[score] : '');
  return { score, label: labels[score], bars };
};

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { setEmail } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filledCount = Object.values(formData).filter(Boolean).length;
  const progress = Math.round((filledCount / 4) * 100);
  const strength = getPasswordStrength(formData.password);
  const pwMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://aura-wo8f.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, name: formData.name }),
      });
      const data = await response.json();
      if (response.ok) {
        setEmail(formData.email);
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="aura-root">
        <div className="aura-blob aura-blob-1" />
        <div className="aura-blob aura-blob-2" />
        <div className="aura-blob aura-blob-3" />

        {/* ── Left panel ── */}
        <div className="aura-left">
          <div className="aura-brand">
            <div className="aura-brand-name">AURA</div>
            <div className="aura-brand-tag">Health Platform</div>
          </div>

          <div className="aura-left-art">
            <div className="aura-left-headline">
              Start your<br /><em>wellness</em> journey.
            </div>
            <div className="aura-left-sub">
              Join thousands who trust AURA to monitor their health — every heartbeat, every day.
            </div>
            <div className="aura-steps">
              {[
                { n: '1', title: 'Create your account', sub: 'Set up your secure profile in under a minute.' },
                { n: '2', title: 'Connect your devices', sub: 'Sync wearables and health monitors seamlessly.' },
                { n: '3', title: 'Track & improve', sub: 'Get personalised insights from your vitals data.' },
              ].map(s => (
                <div className="aura-step" key={s.n}>
                  <div className="aura-step-num">{s.n}</div>
                  <div>
                    <div className="aura-step-title">{s.title}</div>
                    <div className="aura-step-sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="aura-stats">
            <div><div className="aura-stat-num">24/7</div><div className="aura-stat-label">Monitoring</div></div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="aura-right">
          <div className="aura-card">

            {/* Header */}
            <div className="aura-logo-wrap">
              {/* Swap for your logo: <img src={auraLogo} className="aura-logo-img" alt="Aura" /> */}
              <div className="aura-logo-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <div className="aura-welcome-label">Get started</div>
                <div className="aura-card-title">Create account</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="aura-progress-wrap">
              <div className="aura-progress-label">
                <span>Profile completion</span>
                <span>{progress}%</span>
              </div>
              <div className="aura-progress-track">
                <div className="aura-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="aura-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* Full name */}
            <div className="aura-field">
              <label className="aura-label" htmlFor="name">Full name</label>
              <div className="aura-input-wrap">
                <span className="aura-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  className={`aura-input${formData.name ? ' valid' : ''}`}
                  type="text" id="name" name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jane Smith"
                  required autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="aura-field">
              <label className="aura-label" htmlFor="email">Email address</label>
              <div className="aura-input-wrap">
                <span className="aura-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input
                  className={`aura-input${formData.email ? ' valid' : ''}`}
                  type="email" id="email" name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required autoComplete="email"
                />
              </div>
            </div>

            {/* Password + Confirm side by side */}
            <div className="aura-field-row">
              <div className="aura-field" style={{ marginBottom: 0 }}>
                <label className="aura-label" htmlFor="password">Password</label>
                <div className="aura-input-wrap">
                  <span className="aura-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    className="aura-input"
                    type={showPw ? 'text' : 'password'}
                    id="password" name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min. 8 chars"
                    required autoComplete="new-password"
                    style={{ paddingRight: '38px' }}
                  />
                  <button type="button" className="aura-pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              <div className="aura-field" style={{ marginBottom: 0 }}>
                <label className="aura-label" htmlFor="confirmPassword">Confirm</label>
                <div className="aura-input-wrap">
                  <span className="aura-input-icon">
                    {pwMatch
                      ? <CheckIcon />
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    }
                  </span>
                  <input
                    className={`aura-input${formData.confirmPassword ? (pwMatch ? ' valid' : ' invalid') : ''}`}
                    type={showConfirm ? 'text' : 'password'}
                    id="confirmPassword" name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repeat password"
                    required autoComplete="new-password"
                    style={{ paddingRight: '38px' }}
                  />
                  <button type="button" className="aura-pw-toggle" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm">
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength */}
            {formData.password && (
              <div className="aura-strength" style={{ marginBottom: '16px', marginTop: '10px' }}>
                <div className="aura-strength-bars">
                  {strength.bars.map((cls, i) => (
                    <div key={i} className={`aura-strength-bar ${cls}`} />
                  ))}
                </div>
                <div className="aura-strength-text">
                  {strength.label && `Password strength: ${strength.label}`}
                </div>
              </div>
            )}

            <button className="aura-btn" onClick={handleSubmit} disabled={loading} type="button">
              <span className="aura-btn-inner">
                {loading ? (
                  <><div className="aura-spinner" /> Creating account…</>
                ) : (
                  <>Create account
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </>
                )}
              </span>
            </button>

            <div className="aura-terms">
              By registering you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
            </div>

            <div className="aura-card-footer">
              Already have an account? <a href="/login">Sign in</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;