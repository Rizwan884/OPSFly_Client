import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic, PenLine, Camera, Users, DollarSign, Wrench, ClipboardCheck } from 'lucide-react';
import Header from '../components/Header';
import { getNotes, saveNote } from '../services/api';

/**
 * Home Page — Updated with Lucide icons for a professional look.
 */
export default function Home() {
  const [notes, setNotes] = useState([]);
  const [textNote, setTextNote] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data.slice(0, 3)); // Only show latest 3 on home
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!textNote.trim()) return;
    try {
      await saveNote({ transcript: textNote, source: 'text' });
      setTextNote('');
      fetchNotes();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  return (
    <div className="app-shell">
      <Header />
      
      <main className="page">
        {/* Greeting Section */}
        <section className="greeting-block">
          <h1>Good morning, Mike 👋</h1>
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
          
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>OR</div>
          
          <div className="input-group">
            {/* Type a note row */}
            <div className="input-row" onClick={() => document.getElementById('text-input')?.focus()}>
              <PenLine size={20} />
              <form onSubmit={handleTextSubmit} style={{ flex: 1 }}>
                <input 
                  id="text-input"
                  placeholder="Type a note" 
                  className="home-text-input"
                  value={textNote}
                  onChange={(e) => setTextNote(e.target.value)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    outline: 'none', 
                    color: '#fff', 
                    width: '100%',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                />
              </form>
            </div>
            
            {/* Add Photo row */}
            <div className="input-row">
              <Camera size={20} />
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Add Photo</span>
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
            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading notes...</p>
            ) : notes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <ClipboardCheck size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No notes yet today.</p>
              </div>
            ) : (
              notes.map(note => (
                <div key={note._id} className="note-item">
                  <span className="time">
                    {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="dot" style={{ backgroundColor: 'var(--primary)' }}></div>
                  <span className="text">{note.transcript}</span>
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
              }}>3</span>
            </div>
            <Link to="/tasks" className="view-all">View all</Link>
          </div>
          
          <div className="tasks-mini-list">
            <div className="task-item">
              <div className="task-icon-box" style={{ background: 'rgba(255, 77, 106, 0.15)', color: 'var(--staffing)' }}>
                <Users size={16} />
              </div>
              <span className="task-title">Review staffing coverage</span>
              <span className="task-badge badge-high">High</span>
            </div>
            <div className="task-item">
              <div className="task-icon-box" style={{ background: 'rgba(255, 184, 0, 0.15)', color: 'var(--cost)' }}>
                <DollarSign size={16} />
              </div>
              <span className="task-title">Check bar pour control</span>
              <span className="task-badge badge-medium">Medium</span>
            </div>
            <div className="task-item">
              <div className="task-icon-box" style={{ background: 'rgba(0, 214, 143, 0.15)', color: 'var(--maintenance)' }}>
                <Wrench size={16} />
              </div>
              <span className="task-title">Replace entrance plant</span>
              <span className="task-badge badge-low">Low</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
