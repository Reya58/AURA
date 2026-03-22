import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
// import echoLogo from "./ECHO_LOGO.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .echo-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #f0f7f4;
    overflow: hidden;
    position: relative;
  }

  .echo-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(72px);
    opacity: 0.45;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }
  .echo-blob-1 { width: 520px; height: 520px; background: #a8e6cf; top: -140px; left: -120px; animation-delay: 0s; }
  .echo-blob-2 { width: 380px; height: 380px; background: #b5ead7; bottom: -80px; right: -80px; animation-delay: 2s; }
  .echo-blob-3 { width: 260px; height: 260px; background: #ffd6a5; top: 30%; right: 20%; animation-delay: 4s; }

  @keyframes blobFloat {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(20px, 30px) scale(1.06); }
  }

  .echo-left {
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
  @media (min-width: 900px) { .echo-left { display: flex; } }

  .echo-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='600' height='700' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='300' cy='350' r='280' fill='none' stroke='%23ffffff08' stroke-width='1'/%3E%3Ccircle cx='300' cy='350' r='200' fill='none' stroke='%23ffffff0a' stroke-width='1'/%3E%3Ccircle cx='300' cy='350' r='120' fill='none' stroke='%23ffffff0c' stroke-width='1'/%3E%3C/svg%3E") center/cover no-repeat;
  }

  .echo-brand { position: relative; z-index: 2; }
  .echo-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1;
  }
  .echo-brand-tag {
    font-size: 13px;
    font-weight: 300;
    color: #a8d8c2;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-top: 6px;
  }

  .echo-left-art {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .echo-heartbeat { width: 100%; opacity: 0.9; }
  .echo-hb-line {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    animation: drawLine 2.5s ease forwards, pulseGlow 2s ease-in-out 2.5s infinite;
  }
  @keyframes drawLine { to { stroke-dashoffset: 0; } }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.9; }
    50%       { opacity: 0.5; }
  }

  .echo-left-headline {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 600;
    color: #fff;
    line-height: 1.2;
    letter-spacing: -1px;
  }
  .echo-left-headline em { color: #6eddb0; font-style: normal; }

  .echo-left-sub {
    font-size: 15px;
    font-weight: 300;
    color: #a8d8c2;
    line-height: 1.65;
    max-width: 320px;
  }

  .echo-stats {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 32px;
    padding-top: 32px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  .echo-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: #fff;
    font-weight: 600;
  }
  .echo-stat-label { font-size: 12px; color: #80c4a8; font-weight: 400; margin-top: 2px; letter-spacing: 0.5px; }

  .echo-right {
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    position: relative;
    z-index: 1;
  }
  @media (min-width: 900px) { .echo-right { flex: 0 0 480px; max-width: 480px; } }

  .echo-card {
    width: 100%;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(24px);
    border-radius: 28px;
    padding: 48px 44px 40px;
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

  .echo-logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }
  .echo-logo-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #1a6b4a, #2d9e6e);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(26,107,74,0.35);
    flex-shrink: 0;
  }
  .echo-logo-img { width: 48px; height: 48px; border-radius: 14px; object-fit: cover; }

  .echo-welcome-label {
    font-size: 11px;
    font-weight: 500;
    color: #1a6b4a;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .echo-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 600;
    color: #0d2e20;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }

  .echo-divider {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 28px;
  }
  .echo-divider-line { flex: 1; height: 1px; background: #d4e8de; }
  .echo-divider-text { font-size: 12px; color: #7aaa92; font-weight: 400; white-space: nowrap; }

  .echo-field { margin-bottom: 20px; }
  .echo-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #3d7a5f;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .echo-input-wrap { position: relative; }
  .echo-input-icon {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    color: #7aaa92; display: flex; align-items: center; pointer-events: none;
  }
  .echo-input {
    width: 100%;
    padding: 14px 16px 14px 44px;
    border: 1.5px solid #c8e0d4;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #0d2e20;
    background: rgba(240,247,244,0.6);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .echo-input::placeholder { color: #a0c4b4; }
  .echo-input:focus {
    border-color: #1a6b4a;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(26,107,74,0.1);
  }

  .echo-pw-toggle {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #7aaa92; display: flex; align-items: center; padding: 4px;
    transition: color 0.2s;
  }
  .echo-pw-toggle:hover { color: #1a6b4a; }

  .echo-row {
    display: flex; justify-content: flex-end;
    margin-bottom: 28px; margin-top: -8px;
  }
  .echo-forgot {
    font-size: 13px; color: #3d7a5f; text-decoration: none; font-weight: 500;
    transition: color 0.2s;
  }
  .echo-forgot:hover { color: #1a6b4a; }

  .echo-error {
    background: #fff0f0;
    border: 1px solid #f5c6c6;
    color: #c0392b;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }

  .echo-btn {
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
  }
  .echo-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  }
  .echo-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(26,107,74,0.45); }
  .echo-btn:active:not(:disabled) { transform: translateY(0); }
  .echo-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .echo-btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; z-index: 1; }

  .echo-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .echo-card-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: #7aaa92;
  }
  .echo-card-footer a {
    color: #1a6b4a; font-weight: 500; text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }
  .echo-card-footer a:hover { border-color: #1a6b4a; }

  .echo-vitals {
    display: flex; gap: 10px; margin-bottom: 28px;
  }
  .echo-vital-pill {
    flex: 1; background: rgba(26,107,74,0.07);
    border: 1px solid rgba(26,107,74,0.12);
    border-radius: 10px; padding: 10px 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .echo-vital-dot {
    width: 8px; height: 8px; border-radius: 50%;
    animation: vitalPulse 1.8s ease-in-out infinite;
    flex-shrink: 0;
  }
  .echo-vital-dot.green  { background: #2d9e6e; animation-delay: 0s; }
  .echo-vital-dot.orange { background: #f5a623; animation-delay: 0.6s; }
  .echo-vital-dot.blue   { background: #4a90d9; animation-delay: 1.2s; }
  @keyframes vitalPulse {
    0%,100% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
    70%      { box-shadow: 0 0 0 6px transparent; opacity: 0.8; }
  }
  .echo-vital-text { font-size: 11px; color: #3d7a5f; font-weight: 500; line-height: 1.3; }
  .echo-vital-val  { font-size: 14px; font-weight: 600; color: #0d2e20; }
`;

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Login = () => {
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in both fields.'); return; }
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://aura-wo8f.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setEmail(email);
        if (data.token) localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
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
      <div className="echo-root">
        <div className="echo-blob echo-blob-1" />
        <div className="echo-blob echo-blob-2" />
        <div className="echo-blob echo-blob-3" />

        {/* Left panel */}
        <div className="echo-left">
          <div className="echo-brand">
            <div className="echo-brand-name">ECHO</div>
            <div className="echo-brand-tag">Health Platform</div>
          </div>

          <div className="echo-left-art">
            <svg className="echo-heartbeat" viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                className="echo-hb-line"
                d="M0 40 L60 40 L75 15 L90 65 L105 25 L120 55 L135 40 L320 40"
                stroke="#6eddb0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            <div className="echo-left-headline">
              Your health,<br /><em>always</em> in focus.
            </div>
            <div className="echo-left-sub">
              Track vitals, monitor trends, and stay connected with your care team — all in one place.
            </div>
          </div>

          <div className="echo-stats">
            <div>
              <div className="echo-stat-num">98%</div>
              <div className="echo-stat-label">Accuracy rate</div>
            </div>
            <div>
              <div className="echo-stat-num">24/7</div>
              <div className="echo-stat-label">Monitoring</div>
            </div>
            <div>
              <div className="echo-stat-num">50k+</div>
              <div className="echo-stat-label">Active users</div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="echo-right">
          <div className="echo-card">
            <div className="echo-logo-wrap">
              {/* Swap this div for your logo: <img src={echoLogo} className="echo-logo-img" alt="Echo" /> */}
              <div className="echo-logo-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <div className="echo-welcome-label">Welcome back</div>
                <div className="echo-card-title">Sign in</div>
              </div>
            </div>

            <div className="echo-vitals">
              <div className="echo-vital-pill">
                <div className="echo-vital-dot green" />
                <div>
                  <div className="echo-vital-val">72 bpm</div>
                  <div className="echo-vital-text">Heart rate</div>
                </div>
              </div>
              <div className="echo-vital-pill">
                <div className="echo-vital-dot orange" />
                <div>
                  <div className="echo-vital-val">98%</div>
                  <div className="echo-vital-text">SpO₂</div>
                </div>
              </div>
              <div className="echo-vital-pill">
                <div className="echo-vital-dot blue" />
                <div>
                  <div className="echo-vital-val">120/80</div>
                  <div className="echo-vital-text">Blood pressure</div>
                </div>
              </div>
            </div>

            <div className="echo-divider">
              <div className="echo-divider-line" />
              <div className="echo-divider-text">Sign in to your account</div>
              <div className="echo-divider-line" />
            </div>

            {error && (
              <div className="echo-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div className="echo-field">
              <label className="echo-label" htmlFor="email">Email address</label>
              <div className="echo-input-wrap">
                <span className="echo-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input
                  className="echo-input"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="echo-field">
              <label className="echo-label" htmlFor="password">Password</label>
              <div className="echo-input-wrap">
                <span className="echo-input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  className="echo-input"
                  type={showPw ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="echo-pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <div className="echo-row">
              <a href="/forgot-password" className="echo-forgot">Forgot password?</a>
            </div>

            <button
              className="echo-btn"
              onClick={handleSubmit}
              disabled={loading}
              type="button"
            >
              <span className="echo-btn-inner">
                {loading ? (
                  <><div className="echo-spinner" /> Signing in…</>
                ) : (
                  <>Sign in
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </>
                )}
              </span>
            </button>

            <div className="echo-card-footer">
              New here? <a href="/register">Create an account</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;