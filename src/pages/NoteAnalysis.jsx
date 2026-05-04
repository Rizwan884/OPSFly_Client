import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Save, Edit3, Trash2, Loader2, Users, DollarSign, Wrench, Info } from 'lucide-react';
import Header from '../components/Header';
import { saveNote } from '../services/api';
import { useNotes } from '../context/NotesContext';

/**
 * NoteAnalysis Page — Review transcript and save.
 */
export default function NoteAnalysis() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { refreshData } = useNotes();
  
  const [transcript, setTranscript] = useState(state?.transcript || '');
  const [issues, setIssues] = useState(state?.issues || []);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

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
        source: state?.source || 'voice',
        issues: issues,
        analyzedAt: state?.analyzedAt || new Date()
      });
      // Refresh global state so Home and Tasks screens have new data
      await refreshData();
      navigate('/');
    } catch (err) {
      alert('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (isDiscarding) {
      navigate('/');
    } else {
      setIsDiscarding(true);
      setTimeout(() => setIsDiscarding(false), 3000);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#FF8A00';
      case 'low': return '#22C55E';
      default: return 'var(--text-muted)';
    }
  };

  const getIssueIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'staffing': return <Users size={16} />;
      case 'cost risk': return <DollarSign size={16} />;
      case 'maintenance': return <Wrench size={16} />;
      default: return <Info size={16} />;
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
            <div className="status-check"><CheckCircle2 size={14} /></div>
            Analyzed
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

        {/* Detected Issues */}
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
           <h3 style={{ fontSize: '0.9rem', marginBottom: '16px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
             Detected Issues ({issues.length})
           </h3>
           
           {issues.length > 0 ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {issues.map((issue, idx) => (
                 <div key={idx} className="task-item" style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                     <div className="task-icon-box" style={{ background: 'rgba(255,255,255,0.05)', color: getSeverityColor(issue.severity) }}>
                       {getIssueIcon(issue.type)}
                     </div>
                     <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{issue.type}</span>
                         <span className="task-badge" style={{ background: `${getSeverityColor(issue.severity)}20`, color: getSeverityColor(issue.severity), border: `1px solid ${getSeverityColor(issue.severity)}40` }}>
                           {issue.severity}
                         </span>
                       </div>
                     </div>
                   </div>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '8px 0' }}>
                     "{issue.quote}"
                   </p>
                   <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <CheckCircle2 size={12} />
                     Suggested: {issue.suggestedTask}
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-card-alt)', borderRadius: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
               No operational issues detected.
             </div>
           )}
        </div>

        <div className="analysis-actions" style={{ marginTop: 'auto', gap: '12px', display: 'flex', flexDirection: 'column' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={isSaving || !transcript.trim()}
          >
            {isSaving ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
            {isSaving ? 'Saving Note...' : 'Confirm & Save'}
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setIsEditing(!isEditing)}>
              <Edit3 size={16} />
              {isEditing ? 'Done Editing' : 'Edit Transcript'}
            </button>
            <button 
              className="btn btn-ghost" 
              style={{ 
                color: isDiscarding ? '#fff' : 'var(--staffing)', 
                background: isDiscarding ? 'var(--staffing)' : 'transparent',
                borderColor: isDiscarding ? 'var(--staffing)' : 'var(--border)',
                flex: isDiscarding ? 1.5 : 0.5,
                transition: 'all 0.2s ease'
              }} 
              onClick={handleDiscard}
            >
              {isDiscarding ? 'Confirm Discard?' : <Trash2 size={18} />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
