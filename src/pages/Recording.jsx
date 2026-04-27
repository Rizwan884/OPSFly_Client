import 'regenerator-runtime/runtime';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import Header from '../components/Header';

/**
 * Recording Page — Now uses Browser Web Speech API via react-speech-recognition
 * as a temporary replacement for OpenAI Whisper.
 */
export default function Recording() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle'); // idle | recording | processing | error
  const [elapsed, setElapsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (phase === 'recording') {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase]);

  // Start listening logic — triggered by user click
  const handleStart = async () => {
    if (!browserSupportsSpeechRecognition) {
      setPhase('error');
      setErrorMsg("Your browser doesn't support speech recognition.");
      return;
    }

    try {
      // Manual trigger for mobile browsers
      await navigator.mediaDevices.getUserMedia({ audio: true });
      resetTranscript();
      setPhase('recording');
      // Set continuous to true and keep it alive
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    } catch (err) {
      console.error('Mic access error:', err);
      setPhase('error');
      setErrorMsg("Mic access denied. Please allow mic in settings.");
    }
  };

  const handleStop = () => {
    setPhase('processing');
    SpeechRecognition.stopListening();
    
    setTimeout(() => {
      navigate('/analysis', {
        state: { 
          transcript: transcript || "(No speech detected.)", 
          source: 'voice' 
        },
        replace: true,
      });
    }, 800);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-shell">
      <Header showBack onBack={() => navigate('/')} title="Recording" />

      <main className="recording-page">
        {phase === 'processing' ? (
          <div className="recording-status">
             <Loader2 size={18} className="spinner" color="var(--primary)" />
             Processing...
          </div>
        ) : phase === 'idle' ? (
          <div className="recording-status">
            <div className="recording-dot" style={{ backgroundColor: 'var(--text-muted)' }}></div>
            Ready to Record
          </div>
        ) : (
          <div className="recording-status">
            <div className="recording-dot"></div>
            {listening ? 'Recording...' : 'Mic Active'}
          </div>
        )}

        <div className="recording-timer" style={{ opacity: phase === 'idle' ? 0.3 : 1 }}>
          {formatTime(elapsed)}
        </div>

        {phase === 'error' && (
          <div style={{ color: 'var(--staffing)', marginBottom: '24px', textAlign: 'center' }}>
            <p>{errorMsg}</p>
          </div>
        )}

        {phase === 'idle' ? (
          <button className="stop-btn pulse" onClick={handleStart} style={{ background: 'var(--primary)', border: 'none' }}>
            <Mic size={32} color="#fff" />
          </button>
        ) : phase === 'recording' ? (
          <button className="stop-btn" onClick={handleStop}>
            <Square size={32} fill="#fff" color="#fff" />
          </button>
        ) : phase === 'error' ? (
          <button className="stop-btn" onClick={() => window.location.reload()} style={{ background: 'var(--primary)' }}>
            <Mic size={32} color="#fff" />
          </button>
        ) : (
          <button className="stop-btn loading" disabled>
            <Loader2 size={32} className="spinner" />
          </button>
        )}

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '16px' }}>
          {phase === 'idle' ? 'Tap mic to start' : 
           phase === 'recording' ? 'Tap square to stop' : 
           'Processing...'}
        </p>

        {/* Live Preview */}
        <div style={{ marginTop: '40px', padding: '0 30px', textAlign: 'center', opacity: 0.6, fontSize: '0.85rem' }}>
          {transcript.length > 0 ? `"${transcript}"` : phase === 'recording' ? "Listening..." : ""}
        </div>
      </main>
    </div>
  );
}
