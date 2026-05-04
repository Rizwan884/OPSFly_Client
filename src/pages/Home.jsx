import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic, PenLine, Camera, Users, DollarSign, Wrench, ClipboardCheck, ChevronRight, Loader2, Info } from 'lucide-react';
import Header from '../components/Header';
import { analyzeNote } from '../services/api';
import { useNotes } from '../context/NotesContext';

/**
 * Home Page — Updated with Lucide icons for a professional look.
 */
export default function Home() {
  const { notes, tasks, loading, refreshData } = useNotes();
  const [textNote, setTextNote] = useState('');
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);
  const navigate = useNavigate();

  // Greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleTextSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!textNote.trim() || isAnalyzingText) return;

    setIsAnalyzingText(true);
    try {
      const result = await analyzeNote(textNote);
      navigate('/analysis', { 
        state: { 
          transcript: textNote, 
          source: 'text',
          issues: result.issues,
          analyzedAt: new Date()
        } 
      });
      setTextNote('');
    } catch (err) {
      console.error('Analysis failed', err);
      navigate('/analysis', { 
        state: { 
          transcript: textNote, 
          source: 'text',
          issues: []
        } 
      });
    } finally {
      setIsAnalyzingText(false);
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
      <Header />
      
      <main className="page">
        {/* Greeting Section */}
        <section className="greeting-block">
          <h1>{getGreeting()}, Fred 👋</h1>
          <p>Let's keep your operations running smooth.</p>
        </section>

        {/* Main Action Card */}
        <div className="action-card">
          <div className="mic-container" onClick={() => navigate('/recording')}>
            <div className="mic-glow"></div>
            <div className="mic-circle">
              <Mic size={32} color="#fff" strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="tap-label">Tap to record note</div>
          
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', margin: '8px 0' }}>OR</div>
          
          <div className="input-group">
            {/* Type a note row */}
            <div className="input-row">
              {isAnalyzingText ? <Loader2 size={20} className="spinner" /> : <PenLine size={20} />}
              <form 
                onSubmit={handleTextSubmit}
                style={{ flex: 1, display: 'flex', alignItems: 'center' }}
              >
                <input 
                  id="text-input"
                  placeholder={isAnalyzingText ? "Analyzing..." : "Type a note"} 
                  className="home-text-input"
                  value={textNote}
                  onChange={(e) => setTextNote(e.target.value)}
                  disabled={isAnalyzingText}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    outline: 'none', 
                    color: '#fff', 
                    flex: 1,
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                />
                {textNote.trim() && !isAnalyzingText && (
                  <button 
                    type="submit"
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </form>
            </div>
            
            {/* Add Photo row */}
            <div className="input-row" style={{ opacity: 0.5 }}>
              <Camera size={20} />
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Add Photo (M4)</span>
            </div>
          </div>
        </div>

        {/* Today's Notes Section */}
        <section>
          <div className="section-head">
            <h3>Today's Notes</h3>
            <Link to="/notes" className="view-all">View all</Link>
          </div>
          
          <div className="notes-mini-list">
            {loading && notes.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px' }}>
                <Loader2 size={16} className="spinner" />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-card-alt)', borderRadius: '16px' }}>
                <ClipboardCheck size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No notes yet today.</p>
              </div>
            ) : (
              notes.slice(0, 5).map(note => (
                <div key={note._id} className="note-item" onClick={() => navigate('/notes')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '45px' }}>
                    <span className="time" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="dot" style={{ backgroundColor: note.issues?.length > 0 ? 'var(--staffing)' : 'var(--primary)' }}></div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' }}>
                    <span className="text" style={{ 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize: '0.9rem',
                      color: '#fff'
                    }}>
                      {note.transcript}
                    </span>
                    {note.issues?.length > 0 && (
                      <span style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: '#EF4444', 
                        fontSize: '0.7rem', 
                        padding: '1px 6px', 
                        borderRadius: '4px',
                        fontWeight: '700',
                        marginLeft: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}>
                        {note.issues.length}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Open Tasks Section */}
        <section>
          <div className="section-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3>Open Tasks</h3>
              <span style={{ 
                fontSize: '0.75rem', 
                background: 'var(--bg-card-alt)', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                color: 'var(--text-secondary)',
                fontWeight: '700'
              }}>{tasks.length}</span>
            </div>
            <Link to="/tasks" className="view-all">View all</Link>
          </div>
          
          <div className="tasks-mini-list">
            {loading && tasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-card-alt)', borderRadius: '16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>All clear! No open tasks.</p>
              </div>
            ) : (
              tasks.slice(0, 3).map((task, idx) => (
                <div key={`${task.noteId}-${idx}`} className="task-item" onClick={() => navigate('/tasks')} style={{ cursor: 'pointer' }}>
                  <div className="task-icon-box" style={{ background: `${getSeverityColor(task.severity)}15`, color: getSeverityColor(task.severity) }}>
                    {getIssueIcon(task.type)}
                  </div>
                  <span className="task-title" style={{ flex: 1 }}>{task.suggestedTask}</span>
                  <span className="task-badge" style={{ 
                    background: `${getSeverityColor(task.severity)}20`, 
                    color: getSeverityColor(task.severity),
                    border: `1px solid ${getSeverityColor(task.severity)}40`
                  }}>{task.severity}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
