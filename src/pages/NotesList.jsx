import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, PenLine, ChevronRight, Calendar, Search } from 'lucide-react';
import Header from '../components/Header';
import { getNotes } from '../services/api';

/**
 * NotesList — Pretty, compact list of all notes.
 */
export default function NotesList() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.transcript.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouping logic
  const grouped = filteredNotes.reduce((acc, note) => {
    const date = new Date(note.createdAt).toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    const today = new Date().toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    const label = date === today ? 'Today' : date;
    if (!acc[label]) acc[label] = [];
    acc[label].push(note);
    return acc;
  }, {});

  return (
    <div className="app-shell">
      <Header showBack onBack={() => navigate('/')} title="All Notes" />
      
      <main className="page">
        {/* Search Bar */}
        <div className="search-container">
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>Loading your notes...</p>
        ) : filteredNotes.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <Calendar size={48} color="var(--bg-card-alt)" style={{ marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>No notes found.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([label, groupNotes]) => (
            <div key={label} className="date-group">
              <div className="date-label">{label}</div>
              <div className="compact-list">
                {groupNotes.map(note => (
                  <div 
                    key={note._id} 
                    className="compact-note-item"
                    onClick={() => navigate('/analysis', { state: { ...note } })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="note-icon-circle">
                      {note.source === 'voice' ? <Mic size={14} /> : <PenLine size={14} />}
                    </div>
                    
                    <div className="note-content">
                      <div className="note-time" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {note.issues?.length > 0 && (
                          <span style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            color: '#EF4444', 
                            fontSize: '0.65rem', 
                            padding: '0px 4px', 
                            borderRadius: '3px',
                            fontWeight: '700',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}>
                            {note.issues.length} {note.issues.length === 1 ? 'issue' : 'issues'}
                          </span>
                        )}
                      </div>
                      <div className="note-text-preview" style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {note.transcript}
                      </div>
                    </div>
                    
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
