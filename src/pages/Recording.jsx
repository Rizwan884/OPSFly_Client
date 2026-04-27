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
  const [phase, setPhase] = useState('recording'); // recording | processing | error
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

  // Start listening on mount
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setPhase('error');
      setErrorMsg("Your browser doesn't support speech recognition. Please try Chrome or Safari.");
      return;
    }
    
    SpeechRecognition.startListening({ continuous: true });
    
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  const handleStop = () => {
    setPhase('processing');
    SpeechRecognition.stopListening();
    
    // Simulate a brief "processing" delay for premium feel
    setTimeout(() => {
      navigate('/analysis', {
        state: { 
          transcript: transcript || "(No speech detected. Try speaking closer to the mic.)", 
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

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="app-shell">
        <Header showBack onBack={() => navigate('/')} title="Recording" />
        <main className="recording-page">
           <AlertCircle size={48} color="var(--staffing)" />
           <p style={{ marginTop: '20px', textAlign: 'center', padding: '0 40px' }}>
             Speech recognition is not supported in this browser.
           </p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header showBack onBack={() => navigate('/')} title="Recording" />

      <main className="recording-page">
        {phase === 'processing' ? (
          <div className="recording-status">
             <Loader2 size={18} className="spinner" color="var(--primary)" />
             Transcribing...
          </div>
        ) : phase === 'error' ? (
          <div className="recording-status">
             <AlertCircle size={18} color="var(--staffing)" />
             <span style={{ color: 'var(--staffing)', fontWeight: '600' }}>Error Occurred</span>
          </div>
        ) : (
          <div className="recording-status">
            <div className="recording-dot"></div>
            {listening ? 'Recording Note' : 'Mic Paused'}
          </div>
        )}

        <div className="recording-timer" style={{ opacity: phase === 'error' ? 0.5 : 1 }}>
          {formatTime(elapsed)}
        </div>

        {phase === 'error' && (
          <div style={{ color: 'var(--staffing)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', textAlign: 'center', padding: '0 20px', maxWidth: '300px' }}>
            <p>{errorMsg}</p>
          </div>
        )}

        {phase === 'error' ? (
          <button className="stop-btn" onClick={() => window.location.reload()} style={{ background: 'var(--primary)', border: 'none' }}>
            <Mic size={32} color="#fff" />
          </button>
        ) : (
          <button 
            className={`stop-btn ${phase === 'processing' ? 'loading' : ''}`} 
            onClick={handleStop}
            disabled={phase === 'processing'}
          >
            {phase === 'processing' ? (
              <Loader2 size={32} className="spinner" />
            ) : (
              <Square size={32} fill="#fff" color="#fff" />
            )}
          </button>
        )}

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '16px' }}>
          {phase === 'processing' ? 'Processing your speech...' : 
           phase === 'error' ? 'Tap to retry' : 'Tap to stop recording'}
        </p>

        {/* Live Preview (Subtle) */}
        <div style={{ marginTop: '40px', padding: '0 30px', textAlign: 'center', opacity: 0.6, fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxHeight: '60px', overflow: 'hidden' }}>
          {transcript.length > 0 ? `"${transcript.substring(0, 80)}..."` : "Start speaking to see transcription..."}
        </div>
      </main>
    </div>
  );
}
