import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Save, Edit3, Trash2, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { saveNote, deleteNote } from '../services/api';

/**
 * NoteAnalysis Page — Review transcript and save.
 */
export default function NoteAnalysis() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [transcript, setTranscript] = useState(state?.transcript || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!state?.transcript) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  const handleSave = async () => {
    if (!transcript.trim()) return;
    setIsSaving(true);
    try {
      await saveNote({
        transcript,
        source: state?.source || 'voice'
      });
      navigate('/');
    } catch (err) {
      alert('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = async () => {
    if (isDiscarding) {
      if (state?._id) {
        setIsDeleting(true);
        try {
          await deleteNote(state._id);
          navigate('/');
        } catch (err) {
          alert('Failed to delete note');
          setIsDeleting(false);
          setIsDiscarding(false);
        }
      } else {
        // Not saved yet, just go home
        navigate('/');
      }
    } else {
      setIsDiscarding(true);
      setTimeout(() => setIsDiscarding(false), 3000);
    }
  };

  return (
    <div className="app-shell">
      <Header showBack onBack={() => navigate('/')} title="Note Analysis" />
      
      <main className="page">
        {/* Success Checks */}
        <div className="status-list">
          <div className="status-item">
            <div className="status-check"><CheckCircle2 size={14} /></div>
            Note processed successfully
          </div>
          <div className="status-item">
            <div className="status-check"><CheckCircle2 size={14} /></div>
            Transcribed
          </div>
          <div className="status-item">
            <div className="status-check" style={{ background: 'var(--bg-card-alt)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>–</div>
            Analyzed (M2 placeholder)
          </div>
        </div>

        {/* Transcript Area */}
        <div className="transcript-card">
          <div className="transcript-label">Transcript</div>
          {isEditing ? (
            <textarea 
              className="home-text-input"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              autoFocus
              style={{ 
                width: '100%', 
                height: '140px', 
                background: 'var(--bg-card-alt)', 
                padding: '12px', 
                borderRadius: '12px',
                border: '1px solid var(--primary)',
                color: '#fff',
                outline: 'none',
                resize: 'none'
              }}
            />
          ) : (
            <p className="transcript-text">{transcript || 'No transcript available.'}</p>
          )}
        </div>

        {/* M2 Placeholders for Issues */}
        <div style={{ opacity: 0.5, marginTop: '12px' }}>
           <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: '700' }}>Detected Issues (M2)</h3>
           <div className="task-item" style={{ marginBottom: '8px', opacity: 0.8 }}>
             <div className="task-icon-box" style={{ background: 'rgba(255, 77, 106, 0.15)', color: 'var(--staffing)' }}><AlertCircle size={16} /></div>
             <span className="task-title">Sample issue detected...</span>
             <span className="task-badge badge-high">High</span>
           </div>
        </div>

        <div className="analysis-actions" style={{ marginTop: 'auto', gap: '12px', display: 'flex', flexDirection: 'column' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={isSaving || !transcript.trim()}
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Confirm & Save'}
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setIsEditing(!isEditing)}>
              <Edit3 size={16} />
              {isEditing ? 'Done Editing' : 'Edit Note'}
            </button>
            <button 
              className="btn btn-ghost" 
              style={{ 
                width: isDiscarding ? 'auto' : 'fit-content', 
                color: 'var(--staffing)', 
                borderColor: isDiscarding ? 'var(--staffing)' : 'var(--border)',
                flex: isDiscarding ? 2 : 'none',
                padding: isDiscarding ? '0 16px' : '0 12px'
              }} 
              onClick={handleDiscard}
            >
              {isDiscarding ? <span style={{ fontSize: '0.85rem' }}>Confirm Discard?</span> : <Trash2 size={18} />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
