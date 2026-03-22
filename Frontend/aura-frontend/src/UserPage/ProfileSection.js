import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .prof-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f7f4;
    padding: 40px 24px;
    position: relative;
    overflow-x: hidden;
  }

  /* Background blobs */
  .prof-blob {
    position: fixed; border-radius: 50%;
    filter: blur(72px); opacity: 0.35;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .prof-blob-1 { width: 480px; height: 480px; background: #a8e6cf; top: -120px; left: -100px; }
  .prof-blob-2 { width: 340px; height: 340px; background: #b5ead7; bottom: -60px; right: -60px; animation-delay: 2s; }
  .prof-blob-3 { width: 220px; height: 220px; background: #ffd6a5; top: 40%; right: 15%; animation-delay: 4s; }
  @keyframes blobFloat {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(16px,24px) scale(1.05); }
  }

  .prof-inner {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Page header */
  .prof-header { margin-bottom: 32px; }
  .prof-header-label {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
  }
  .prof-header-title {
    font-family: 'Playfair Display', serif;
    font-size: 34px; font-weight: 600;
    color: #0d2e20; letter-spacing: -0.5px;
  }

  /* Main card */
  .prof-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    border: 1px solid rgba(255,255,255,0.75);
    box-shadow: 0 2px 0 rgba(255,255,255,0.9) inset, 0 20px 60px rgba(10,60,40,0.1);
    overflow: hidden;
  }

  /* Top hero strip */
  .prof-hero {
    background: linear-gradient(135deg, #1a6b4a 0%, #2d9e6e 100%);
    padding: 36px 40px 80px;
    position: relative;
    overflow: hidden;
  }
  .prof-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='600' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='500' cy='100' r='180' fill='none' stroke='%23ffffff0a' stroke-width='1'/%3E%3Ccircle cx='500' cy='100' r='120' fill='none' stroke='%23ffffff0c' stroke-width='1'/%3E%3C/svg%3E") right center/auto no-repeat;
  }
  .prof-hero-text { position: relative; z-index: 1; }
  .prof-hero-name {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 600; color: #fff;
    letter-spacing: -0.3px; margin-bottom: 4px;
  }
  .prof-hero-email { font-size: 14px; font-weight: 300; color: #a8d8c2; }

  /* Avatar floating over hero/body boundary */
  .prof-avatar-wrap {
    position: absolute;
    bottom: -48px; left: 40px;
    z-index: 2;
  }
  .prof-avatar {
    width: 96px; height: 96px;
    border-radius: 50%;
    border: 4px solid #fff;
    object-fit: cover;
    box-shadow: 0 8px 24px rgba(10,60,40,0.18);
    background: #d4e8de;
    display: block;
  }
  .prof-avatar-badge {
    position: absolute; bottom: 4px; right: 4px;
    width: 26px; height: 26px;
    background: linear-gradient(135deg,#1a6b4a,#2d9e6e);
    border: 2px solid #fff;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .prof-avatar-badge:hover { transform: scale(1.1); }

  /* Body */
  .prof-body {
    padding: 68px 40px 40px;
  }

  /* Stats row */
  .prof-stats {
    display: flex; gap: 0;
    background: rgba(26,107,74,0.05);
    border: 1px solid rgba(26,107,74,0.1);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 36px;
  }
  .prof-stat {
    flex: 1; padding: 18px 20px;
    display: flex; flex-direction: column; align-items: center;
    border-right: 1px solid rgba(26,107,74,0.1);
    transition: background 0.2s;
  }
  .prof-stat:last-child { border-right: none; }
  .prof-stat:hover { background: rgba(26,107,74,0.06); }
  .prof-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 600; color: #0d2e20;
  }
  .prof-stat-label { font-size: 11px; color: #7aaa92; font-weight: 500; margin-top: 3px; letter-spacing: 0.5px; text-transform: uppercase; }

  /* Section title */
  .prof-section-title {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 10px;
  }
  .prof-section-title::after {
    content: ''; flex: 1; height: 1px; background: #d4e8de;
  }

  /* Fields grid */
  .prof-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 600px) { .prof-fields { grid-template-columns: 1fr; } }

  .prof-field { display: flex; flex-direction: column; gap: 7px; }
  .prof-label {
    font-size: 11px; font-weight: 500; color: #3d7a5f;
    letter-spacing: 1px; text-transform: uppercase;
    display: flex; align-items: center; justify-content: space-between;
  }

  .prof-edit-btn {
    background: none; border: none; cursor: pointer;
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 0.5px; padding: 2px 8px;
    border-radius: 6px;
    border: 1px solid rgba(26,107,74,0.25);
    transition: background 0.15s, color 0.15s;
    display: flex; align-items: center; gap: 4px;
  }
  .prof-edit-btn:hover { background: rgba(26,107,74,0.08); }

  .prof-input-wrap { position: relative; }
  .prof-input, .prof-select {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #c8e0d4;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; color: #0d2e20;
    background: rgba(240,247,244,0.55);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    appearance: none;
  }
  .prof-input:focus, .prof-select:focus {
    border-color: #1a6b4a;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(26,107,74,0.1);
  }
  .prof-input[readonly], .prof-select:disabled {
    background: rgba(212,232,222,0.25);
    color: #5a8a72;
    cursor: default;
  }
  .prof-input.active, .prof-select.active {
    border-color: #1a6b4a;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(26,107,74,0.08);
  }

  /* Email locked badge */
  .prof-locked {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: #7aaa92; font-weight: 500;
  }

  /* Select arrow */
  .prof-select-wrap { position: relative; }
  .prof-select-arrow {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    pointer-events: none; color: #7aaa92;
  }

  /* Actions bar */
  .prof-actions {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 32px; padding-top: 28px;
    border-top: 1px solid #d4e8de;
    gap: 16px; flex-wrap: wrap;
  }

  .prof-changes-badge {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: #3d7a5f; font-weight: 500;
  }
  .prof-changes-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #f5a623;
    animation: vitalPulse 1.8s ease-in-out infinite;
  }
  @keyframes vitalPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(245,166,35,0.5); }
    70%      { box-shadow: 0 0 0 6px transparent; }
  }

  .prof-btn-group { display: flex; gap: 12px; }

  .prof-btn-ghost {
    padding: 12px 22px;
    border: 1.5px solid #c8e0d4;
    border-radius: 12px;
    background: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    color: #3d7a5f; cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .prof-btn-ghost:hover { background: rgba(26,107,74,0.05); border-color: #1a6b4a; }

  .prof-btn-save {
    padding: 12px 28px;
    background: linear-gradient(135deg, #1a6b4a 0%, #2d9e6e 100%);
    color: #fff; border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer; position: relative; overflow: hidden;
    box-shadow: 0 4px 16px rgba(26,107,74,0.35);
    transition: transform 0.15s, box-shadow 0.15s;
    display: flex; align-items: center; gap: 8px;
  }
  .prof-btn-save::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  }
  .prof-btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(26,107,74,0.42); }
  .prof-btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
  .prof-btn-save span { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; }

  .prof-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Toast */
  .prof-toast {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    padding: 14px 24px;
    border-radius: 14px;
    font-size: 14px; font-weight: 500;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    animation: toastIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
    z-index: 100;
    white-space: nowrap;
  }
  .prof-toast.success { background: #1a6b4a; color: #fff; }
  .prof-toast.error   { background: #c0392b; color: #fff; }
  @keyframes toastIn {
    from { opacity:0; transform: translateX(-50%) translateY(16px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }

  /* Loading / Error screens */
  .prof-fullscreen {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 16px;
    font-family: 'DM Sans', sans-serif;
    color: #3d7a5f;
  }
  .prof-load-spinner {
    width: 44px; height: 44px;
    border: 3px solid #d4e8de;
    border-top-color: #1a6b4a;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .prof-load-text { font-size: 15px; color: #7aaa92; }
  .prof-error-icon { font-size: 40px; }
  .prof-error-text { font-size: 15px; color: #c0392b; }
`;

const ProfileSection = () => {
  const { email } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', gender: '', age: '', photo: '' });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    if (!email) { setError('Email not found. Please log in again.'); setLoading(false); return; }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://aura-wo8f.vercel.app/api/user/diseases?email=${encodeURIComponent(email)}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const fetched = {
          name:   data.name   || '',
          gender: data.gender || '',
          age:    data.age    || '',
          photo:  data.photo  || 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png',
        };
        setProfileData(fetched);
        setOriginalData(fetched);
      } catch { setError('Error loading profile data'); }
      finally  { setLoading(false); }
    };
    fetchProfile();
  }, [email]);

  useEffect(() => {
    setHasChanges(JSON.stringify(profileData) !== JSON.stringify(originalData));
  }, [profileData, originalData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscard = () => {
    setProfileData(originalData);
    setEditingField(null);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const res = await fetch('https://aura-wo8f.vercel.app/api/user/update', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: profileData.name, age: profileData.age, gender: profileData.gender, photo: profileData.photo }),
      });
      if (!res.ok) throw new Error();
      setOriginalData(profileData);
      setHasChanges(false);
      setEditingField(null);
      showToast('Profile updated successfully!', 'success');
    } catch {
      showToast('Error saving changes. Please try again.', 'error');
    } finally { setSaveLoading(false); }
  };

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="prof-fullscreen">
        <div className="prof-load-spinner" />
        <div className="prof-load-text">Loading your profile…</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{styles}</style>
      <div className="prof-fullscreen">
        <div className="prof-error-icon">⚠️</div>
        <div className="prof-error-text">{error}</div>
      </div>
    </>
  );

  const initials = profileData.name
    ? profileData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
    : '?';

  return (
    <>
      <style>{styles}</style>

      <div className="prof-root">
        <div className="prof-blob prof-blob-1" />
        <div className="prof-blob prof-blob-2" />
        <div className="prof-blob prof-blob-3" />

        <div className="prof-inner">
          {/* Page header */}
          <div className="prof-header">
            <div className="prof-header-label">Account</div>
            <div className="prof-header-title">Your Profile</div>
          </div>

          <div className="prof-card">
            {/* Hero strip */}
            <div className="prof-hero">
              <div className="prof-hero-text">
                <div className="prof-hero-name">{profileData.name || 'Your Name'}</div>
                <div className="prof-hero-email">{email}</div>
              </div>

              {/* Floating avatar */}
              <div className="prof-avatar-wrap">
                <img
                  src={profileData.photo || 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png'}
                  alt="Profile"
                  className="prof-avatar"
                  onError={e => { e.target.style.display='none'; }}
                />
                <div className="prof-avatar-badge" title="Change photo">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="prof-body">

              {/* Stats row */}
              <div className="prof-stats">
                <div className="prof-stat">
                  <div className="prof-stat-val">{profileData.age || '—'}</div>
                  <div className="prof-stat-label">Age</div>
                </div>
                <div className="prof-stat">
                  <div className="prof-stat-val">{profileData.gender || '—'}</div>
                  <div className="prof-stat-label">Gender</div>
                </div>
                <div className="prof-stat">
                  <div className="prof-stat-val">Active</div>
                  <div className="prof-stat-label">Status</div>
                </div>
              </div>

              {/* Fields */}
              <div className="prof-section-title">Personal information</div>

              <div className="prof-fields">

                {/* Name */}
                <div className="prof-field">
                  <div className="prof-label">
                    Full name
                    <button className="prof-edit-btn" type="button" onClick={() => setEditingField(editingField === 'name' ? null : 'name')}>
                      {editingField === 'name'
                        ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Done</>
                        : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</>
                      }
                    </button>
                  </div>
                  <input
                    className={`prof-input${editingField === 'name' ? ' active' : ''}`}
                    type="text" name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    readOnly={editingField !== 'name'}
                    placeholder="Your full name"
                  />
                </div>

                {/* Email (locked) */}
                <div className="prof-field">
                  <div className="prof-label">Email address</div>
                  <div className="prof-input-wrap">
                    <input className="prof-input" type="email" value={email} readOnly style={{ paddingRight: '80px' }} />
                    <div className="prof-locked">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Locked
                    </div>
                  </div>
                </div>

                {/* Age */}
                <div className="prof-field">
                  <div className="prof-label">
                    Age
                    <button className="prof-edit-btn" type="button" onClick={() => setEditingField(editingField === 'age' ? null : 'age')}>
                      {editingField === 'age'
                        ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Done</>
                        : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</>
                      }
                    </button>
                  </div>
                  <input
                    className={`prof-input${editingField === 'age' ? ' active' : ''}`}
                    type="number" name="age"
                    value={profileData.age}
                    onChange={handleInputChange}
                    readOnly={editingField !== 'age'}
                    placeholder="Your age"
                    min="1" max="120"
                  />
                </div>

                {/* Gender */}
                <div className="prof-field">
                  <div className="prof-label">
                    Gender
                    <button className="prof-edit-btn" type="button" onClick={() => setEditingField(editingField === 'gender' ? null : 'gender')}>
                      {editingField === 'gender'
                        ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Done</>
                        : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</>
                      }
                    </button>
                  </div>
                  <div className="prof-select-wrap">
                    <select
                      className={`prof-select${editingField === 'gender' ? ' active' : ''}`}
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      disabled={editingField !== 'gender'}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="prof-select-arrow">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Actions */}
              {hasChanges && (
                <div className="prof-actions">
                  <div className="prof-changes-badge">
                    <div className="prof-changes-dot" />
                    Unsaved changes
                  </div>
                  <div className="prof-btn-group">
                    <button className="prof-btn-ghost" type="button" onClick={handleDiscard}>
                      Discard
                    </button>
                    <button className="prof-btn-save" type="button" onClick={handleSave} disabled={saveLoading}>
                      <span>
                        {saveLoading
                          ? <><div className="prof-spinner" />Saving…</>
                          : <>Save changes <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></>
                        }
                      </span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`prof-toast ${toast.type}`}>
            {toast.type === 'success'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileSection;