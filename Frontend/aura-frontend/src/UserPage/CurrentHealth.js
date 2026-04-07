import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    display: flex;
    align-items: center;
    justify-content: center;
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
    width: 100%; max-width: 600px;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Page header ── */
  .hd-page-header {
    text-align: center;
    margin-bottom: 28px;
  }
  .hd-page-label {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
  }
  .hd-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px; font-weight: 600;
    color: #0d2e20; letter-spacing: -0.5px;
  }
  .hd-page-sub { font-size: 14px; color: #7aaa92; margin-top: 6px; }

  /* ── Voice Assistant Panel ── */
  .hd-voice-panel {
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 28px;
    box-shadow: 0 8px 48px rgba(10,60,40,0.12);
    padding: 32px;
  }

  .hd-voice-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
  }
  .hd-voice-title {
    display: flex; align-items: center; gap: 8px;
  }
  .hd-voice-title-label {
    font-size: 11px; font-weight: 500; color: #1a6b4a;
    letter-spacing: 1.8px; text-transform: uppercase;
  }

  /* Speak toggle */
  .hd-speak-toggle {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: #7aaa92; cursor: pointer;
    user-select: none;
  }
  .hd-speak-toggle input { accent-color: #1a6b4a; }

  /* Mic button */
  .hd-mic-area {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    margin-bottom: 28px;
  }

  .hd-mic-ring {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    width: 100px; height: 100px;
  }

  .hd-mic-ring-pulse {
    position: absolute; inset: 0;
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
  }
  .hd-mic-ring-pulse.recording {
    border: 2px solid rgba(163,45,45,0.4);
    animation: ringPulse 1.5s ease-out infinite;
    opacity: 1;
  }
  .hd-mic-ring-pulse.recording.delay {
    animation-delay: 0.5s;
  }
  @keyframes ringPulse {
    0%   { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.7); opacity: 0; }
  }

  .hd-mic-btn {
    width: 80px; height: 80px; border-radius: 50%;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.15s, box-shadow 0.2s;
    position: relative; z-index: 1; flex-shrink: 0;
  }
  .hd-mic-btn.idle {
    background: linear-gradient(135deg,#1a6b4a,#2d9e6e);
    box-shadow: 0 8px 28px rgba(26,107,74,0.38);
  }
  .hd-mic-btn.idle:hover {
    transform: scale(1.06);
    box-shadow: 0 12px 36px rgba(26,107,74,0.48);
  }
  .hd-mic-btn.recording {
    background: linear-gradient(135deg,#a32d2d,#e05252);
    box-shadow: 0 8px 28px rgba(163,45,45,0.45);
  }
  .hd-mic-btn.speaking {
    background: linear-gradient(135deg,#b7791f,#f5a623);
    box-shadow: 0 8px 28px rgba(183,121,31,0.4);
  }
  .hd-mic-btn.processing {
    background: linear-gradient(135deg,#2b6cb0,#4a90d9);
    box-shadow: 0 8px 28px rgba(43,108,176,0.38);
    cursor: not-allowed;
  }

  .hd-mic-status {
    font-size: 13px; font-weight: 500; color: #1a6b4a; text-align: center;
    min-height: 20px;
  }
  .hd-mic-status.recording  { color: #a32d2d; }
  .hd-mic-status.speaking   { color: #b7791f; }
  .hd-mic-status.processing { color: #2b6cb0; }

  /* Transcript area */
  .hd-transcript {
    display: flex; flex-direction: column; gap: 12px;
    max-height: 320px; overflow-y: auto;
    padding-right: 4px;
    margin-bottom: 20px;
  }
  .hd-transcript::-webkit-scrollbar { width: 4px; }
  .hd-transcript::-webkit-scrollbar-track { background: transparent; }
  .hd-transcript::-webkit-scrollbar-thumb { background: #b5ead7; border-radius: 4px; }

  .hd-msg {
    display: flex; gap: 10px; align-items: flex-start;
    animation: msgIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes msgIn {
    from { opacity:0; transform: translateY(8px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .hd-msg-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; flex-shrink: 0; margin-top: 2px;
  }
  .hd-msg-avatar.user { background: rgba(26,107,74,0.12); color: #1a6b4a; }
  .hd-msg-avatar.ai   { background: rgba(43,108,176,0.12); color: #2b6cb0; }

  .hd-msg-bubble {
    padding: 10px 14px; border-radius: 14px;
    font-size: 13px; line-height: 1.65; max-width: calc(100% - 44px);
  }
  .hd-msg-bubble.user {
    background: rgba(26,107,74,0.08); color: #0d2e20;
    border-bottom-left-radius: 4px;
  }
  .hd-msg-bubble.ai {
    background: rgba(43,108,176,0.07); color: #0d2e20;
    border-bottom-left-radius: 4px;
  }

  /* Text input row */
  .hd-text-row {
    display: flex; gap: 10px;
    border-top: 1px solid rgba(26,107,74,0.1);
    padding-top: 20px;
  }
  .hd-text-input {
    flex: 1; padding: 12px 16px;
    background: rgba(240,247,244,0.8);
    border: 1px solid rgba(26,107,74,0.15);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #0d2e20;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .hd-text-input::placeholder { color: #a0c4b4; }
  .hd-text-input:focus {
    border-color: rgba(26,107,74,0.4);
    box-shadow: 0 0 0 3px rgba(26,107,74,0.08);
  }
  .hd-text-input:disabled { opacity: 0.6; cursor: not-allowed; }

  .hd-send-btn {
    padding: 12px 18px;
    background: linear-gradient(135deg,#1a6b4a,#2d9e6e);
    color: #fff; border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(26,107,74,0.32);
    transition: transform 0.15s, box-shadow 0.15s;
    display: flex; align-items: center;
  }
  .hd-send-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,74,0.42); }
  .hd-send-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* Typing dots */
  .hd-typing { display: flex; gap: 4px; align-items: center; padding: 2px 0; }
  .hd-typing span {
    width: 6px; height: 6px; border-radius: 50%;
    background: #7aaa92;
    animation: typingBounce 1.2s ease-in-out infinite;
  }
  .hd-typing span:nth-child(2) { animation-delay: 0.2s; }
  .hd-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%,60%,100% { transform: translateY(0); }
    30%          { transform: translateY(-6px); }
  }

  /* Sound wave bars */
  .hd-soundwave { display:flex; gap:3px; align-items:center; height:24px; }
  .hd-soundwave span {
    width:3px; border-radius:2px; background:#fff;
    animation: waveBar 0.8s ease-in-out infinite alternate;
  }
  .hd-soundwave span:nth-child(1) { height:6px;  animation-delay:0s; }
  .hd-soundwave span:nth-child(2) { height:14px; animation-delay:0.1s; }
  .hd-soundwave span:nth-child(3) { height:10px; animation-delay:0.2s; }
  .hd-soundwave span:nth-child(4) { height:18px; animation-delay:0.05s; }
  .hd-soundwave span:nth-child(5) { height:8px;  animation-delay:0.15s; }
  @keyframes waveBar {
    from { transform: scaleY(0.4); }
    to   { transform: scaleY(1.2); }
  }

  /* Processing spinner inside btn */
  .hd-btn-spinner {
    width: 22px; height: 22px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Error toast */
  .hd-error-banner {
    background: rgba(192,57,43,0.08);
    border: 1px solid rgba(192,57,43,0.2);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px; color: #a32d2d;
    margin-bottom: 16px;
    text-align: center;
  }
`;

/* ── Icons ── */
const MicIcon = ({ size = 28, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const StopIcon = ({ size = 26, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <rect x="6" y="6" width="12" height="12" rx="2"/>
  </svg>
);

const SpeakerIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

/* ── Speech synthesis hook ── */
const useSpeech = () => {
  const synthRef = useRef(window.speechSynthesis);

  const speak = useCallback((text, onEnd) => {
    if (!synthRef.current) { onEnd?.(); return; }
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    const applyVoice = () => {
      const voices = synthRef.current.getVoices();
      const preferred =
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
    };

    if (synthRef.current.getVoices().length === 0) {
      synthRef.current.addEventListener('voiceschanged', applyVoice, { once: true });
    } else {
      applyVoice();
    }

    utterance.onend   = () => onEnd?.();
    utterance.onerror = (e) => { console.error('Speech synthesis error:', e); onEnd?.(); };
    synthRef.current.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
  }, []);

  return { speak, stop };
};

/* ── Main component ── */
const VoiceAssistant = () => {
  
  
  const voices = speechSynthesis.getVoices();
  console.log(voices);
  
  const { email } = useAuth();

  const [micState, setMicState]   = useState('idle'); // idle | recording | processing | speaking
  const [messages, setMessages]   = useState([]);
  const [textInput, setTextInput] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isTyping, setIsTyping]   = useState(false);
  const [bannerErr, setBannerErr] = useState('');

  const recognitionRef = useRef(null);
  const transcriptRef  = useRef(null);
  const micStateRef    = useRef('idle'); // keep ref in sync for use inside callbacks
  const { speak, stop } = useSpeech();

  // Keep ref in sync
  useEffect(() => { micStateRef.current = micState; }, [micState]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* ── Send to backend ── */
  const sendPrompt = useCallback(async (promptText) => {
    if (!promptText.trim()) return;
    setBannerErr('');

    const token = localStorage.getItem('token');

    setMessages(prev => [...prev, { role: 'user', text: promptText }]);
    setMicState('processing');
    setIsTyping(true);

    try {
      const res = await axios.post(
        'https://aura-wo8f.vercel.app/api/user/health',
        { prompt: promptText, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reply = res.data?.response?.reply || "I couldn't understand that.";

      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);

      if (autoSpeak) {
        setMicState('speaking');
        speak(reply, () => setMicState('idle'));
      } else {
        setMicState('idle');
      }
    } catch (err) {
      console.error('API error:', err.response?.data || err.message);
      setIsTyping(false);

      const errMsg = err.response?.data?.message || 'Server error. Please try again.';
      setMessages(prev => [...prev, { role: 'ai', text: errMsg }]);

      if (autoSpeak) {
        setMicState('speaking');
        speak(errMsg, () => setMicState('idle'));
      } else {
        setMicState('idle');
      }
    }
  }, [email, autoSpeak, speak]);

  /* ── Mic helpers ── */
  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBannerErr('Speech recognition is not supported. Please use Chrome or Edge.');
      return;
    }

    // Stop any ongoing speech first
    stop();

    const rec = new SpeechRecognition();
    rec.lang            = 'en-IN';
    rec.interimResults  = false;
    rec.maxAlternatives = 1;
    rec.continuous      = false;

    rec.onstart = () => {
      setMicState('recording');
    };

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      recognitionRef.current = null;
      sendPrompt(transcript);
    };

    rec.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
      recognitionRef.current = null;
      setMicState('idle');
      if (e.error === 'not-allowed') {
        setBannerErr('Microphone access denied. Please allow mic permission in your browser.');
      } else if (e.error !== 'aborted') {
        setBannerErr(`Mic error: ${e.error}`);
      }
    };

    rec.onend = () => {
      // Only reset if still in recording state (not already moved to processing)
      if (micStateRef.current === 'recording') {
        setMicState('idle');
      }
      recognitionRef.current = null;
    };

    recognitionRef.current = rec;

    try {
      rec.start();
    } catch (err) {
      console.error('Recognition start error:', err);
      setMicState('idle');
      setBannerErr('Could not start microphone. Try again.');
    }
  }, [stop, sendPrompt]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setMicState('idle');
  }, []);

  const handleMicClick = () => {
    setBannerErr('');
    if (micState === 'recording') {
      stopRecording();
    } else if (micState === 'speaking') {
      stop();
      setMicState('idle');
    } else if (micState === 'idle') {
      startRecording();
    }
    // processing: do nothing (btn visually disabled via pointer-events)
  };

  /* ── Text input ── */
  const handleTextSend = () => {
    if (!textInput.trim() || micState === 'processing' || micState === 'recording') return;
    sendPrompt(textInput.trim());
    setTextInput('');
  };

  const handleTextKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSend(); }
  };

  const micStatusText = {
    idle:       'Tap the mic to ask a question',
    recording:  'Listening… tap to stop',
    processing: 'Processing…',
    speaking:   'Speaking… tap to stop',
  }[micState] || '';

  const isBusy = micState === 'processing';

  return (
    <>
      <style>{styles}</style>
      <div className="hd-root">
        <div className="hd-blob hd-blob-1"/>
        <div className="hd-blob hd-blob-2"/>
        <div className="hd-blob hd-blob-3"/>

        <div className="hd-inner">
          {/* Header */}
          <div className="hd-page-header">
            <div className="hd-page-label">AI-powered</div>
            <div className="hd-page-title">Health Assistant</div>
            <div className="hd-page-sub">Ask about your vitals by voice or text.</div>
          </div>

          {/* Panel */}
          <div className="hd-voice-panel">
            <div className="hd-voice-header">
              <div className="hd-voice-title">
                <SpeakerIcon size={15} color="#1a6b4a"/>
                <span className="hd-voice-title-label">Voice Assistant</span>
              </div>
              <label className="hd-speak-toggle">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={e => setAutoSpeak(e.target.checked)}
                />
                Auto-speak
              </label>
            </div>

            {/* Error banner */}
            {bannerErr && <div className="hd-error-banner">{bannerErr}</div>}

            {/* Mic */}
            <div className="hd-mic-area">
              <div className="hd-mic-ring">
                <div className={`hd-mic-ring-pulse ${micState === 'recording' ? 'recording' : ''}`}/>
                <div className={`hd-mic-ring-pulse ${micState === 'recording' ? 'recording delay' : ''}`}/>
                <button
                  className={`hd-mic-btn ${micState}`}
                  onClick={handleMicClick}
                  title={micStatusText}
                  style={{ pointerEvents: isBusy ? 'none' : 'auto' }}
                >
                  {micState === 'speaking' ? (
                    <div className="hd-soundwave">
                      <span/><span/><span/><span/><span/>
                    </div>
                  ) : micState === 'recording' ? (
                    <StopIcon size={24}/>
                  ) : micState === 'processing' ? (
                    <div className="hd-btn-spinner"/>
                  ) : (
                    <MicIcon size={26}/>
                  )}
                </button>
              </div>
              <div className={`hd-mic-status ${micState}`}>{micStatusText}</div>
            </div>

            {/* Transcript */}
            {(messages.length > 0 || isTyping) && (
              <div className="hd-transcript" ref={transcriptRef}>
                {messages.map((msg, i) => (
                  <div key={i} className="hd-msg">
                    <div className={`hd-msg-avatar ${msg.role}`}>
                      {msg.role === 'user' ? 'You' : 'AI'}
                    </div>
                    <div className={`hd-msg-bubble ${msg.role}`}>{msg.text}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="hd-msg">
                    <div className="hd-msg-avatar ai">AI</div>
                    <div className="hd-msg-bubble ai">
                      <div className="hd-typing"><span/><span/><span/></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Text input */}
            <div className="hd-text-row">
              <input
                className="hd-text-input"
                type="text"
                placeholder="Or type your question here…"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={handleTextKey}
                disabled={isBusy}
              />
              <button
                className="hd-send-btn"
                onClick={handleTextSend}
                disabled={!textInput.trim() || isBusy}
              >
                <SendIcon/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceAssistant;