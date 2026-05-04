"use client";
import 'regenerator-runtime/runtime';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, Square, Loader2 } from 'lucide-react';
import Header from '@/src/components/Header';
import { analyzeNote } from '@/src/services/api';

/**
 * Recording Page — Converted to Next.js
 */
export default function RecordingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState('idle'); // idle | recording | processing | error
  const [elapsed, setElapsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

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

  const handleStart = async () => {
    if (!browserSupportsSpeechRecognition) {
      setPhase('error');
      setErrorMsg("Your browser doesn't support speech recognition.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      resetTranscript();
      setPhase('recording');
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    } catch (err) {
      setPhase('error');
      setErrorMsg("Mic access denied.");
    }
  };

  const handleStop = async () => {
    setPhase('processing');
    setAnalysisStatus('Analyzing note...');
    SpeechRecognition.stopListening();
    
    const finalTranscript = transcript || "(No speech detected.)";

    try {
      const analysisResult = await analyzeNote(finalTranscript);
      
      const analysisData = { 
        transcript: finalTranscript, 
        source: 'voice',
        issues: analysisResult.issues,
        analyzedAt: new Date()
      };
      sessionStorage.setItem('lastAnalysis', JSON.stringify(analysisData));
      router.push('/analysis');
    } catch (err) {
      console.error('Analysis failed:', err);
      const fallbackData = { 
        transcript: finalTranscript, 
        source: 'voice',
        issues: []
      };
      sessionStorage.setItem('lastAnalysis', JSON.stringify(fallbackData));
      router.push('/analysis');
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-wrapper">
      <Header showBack title="Recording" />

      <main className="recording-page">
        {phase === 'processing' ? (
          <div className="recording-status">
             <Loader2 size={18} className="spinner" color="var(--primary)" />
             {analysisStatus || 'Processing...'}
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

        <div style={{ marginTop: '40px', padding: '0 30px', textAlign: 'center', opacity: 0.6, fontSize: '0.85rem' }}>
          {transcript.length > 0 ? `"${transcript}"` : phase === 'recording' ? "Listening..." : ""}
        </div>
      </main>
    </div>
  );
}
