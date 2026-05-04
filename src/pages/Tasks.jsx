import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Wrench, Info, CheckCircle2, Trash2, Edit3, Save, X, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { useNotes } from '../context/NotesContext';

/**
 * Tasks Page — Manage all AI-detected issues.
 */
export default function Tasks() {
  const navigate = useNavigate();
  const { notes, tasks, loading, updateNoteIssues } = useNotes();
  const [editingTask, setEditingTask] = useState(null); // { noteId, index, type, severity, suggestedTask }
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleEditClick = (task, index) => {
    setEditingTask({ ...task, index });
  };

  const handleUpdate = async () => {
    if (!editingTask) return;
    setIsUpdating(true);
    try {
      const note = notes.find(n => n._id === editingTask.noteId);
      if (!note) throw new Error('Note not found');
      
      const newIssues = [...note.issues];
      newIssues[editingTask.index] = {
        type: editingTask.type,
        severity: editingTask.severity,
        quote: editingTask.quote,
        suggestedTask: editingTask.suggestedTask
      };
      
      await updateNoteIssues(editingTask.noteId, newIssues);
      setEditingTask(null);
    } catch (err) {
      alert('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (noteId, index) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const note = notes.find(n => n._id === noteId);
      if (!note) throw new Error('Note not found');
      
      const newIssues = note.issues.filter((_, i) => i !== index);
      await updateNoteIssues(noteId, newIssues);
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <div className="app-shell">
      <Header showBack onBack={() => navigate('/')} title="Open Tasks" />
      
      <main className="page">
        {loading && tasks.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
             <Loader2 size={24} className="spinner" color="var(--primary)" />
             <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px', opacity: 0.5 }}>
            <CheckCircle2 size={48} style={{ marginBottom: '16px' }} />
            <p>No open tasks. Everything is running smooth!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '100px' }}>
            {tasks.map((task, idx) => {
              // Find the original index of this issue in the note
              const note = notes.find(n => n._id === task.noteId);
              const originalIndex = note?.issues.findIndex(i => i.quote === task.quote && i.suggestedTask === task.suggestedTask);
              
              const isEditing = editingTask && editingTask.noteId === task.noteId && editingTask.index === originalIndex;

              return (
                <div key={`${task.noteId}-${idx}`} className="task-item" style={{ 
                  flexDirection: 'column', 
                  alignItems: 'stretch', 
                  padding: '16px',
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)'
                }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                         <select 
                           value={editingTask.type}
                           onChange={(e) => setEditingTask({...editingTask, type: e.target.value})}
                           style={{ flex: 1, background: 'var(--bg-card-alt)', color: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 8px' }}
                         >
                           <option value="Staffing">Staffing</option>
                           <option value="Cost Risk">Cost Risk</option>
                           <option value="Maintenance">Maintenance</option>
                           <option value="Other">Other</option>
                         </select>
                         <select 
                           value={editingTask.severity}
                           onChange={(e) => setEditingTask({...editingTask, severity: e.target.value})}
                           style={{ flex: 1, background: 'var(--bg-card-alt)', color: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 8px' }}
                         >
                           <option value="High">High</option>
                           <option value="Medium">Medium</option>
                           <option value="Low">Low</option>
                         </select>
                      </div>
                      <input 
                        value={editingTask.suggestedTask}
                        onChange={(e) => setEditingTask({...editingTask, suggestedTask: e.target.value})}
                        placeholder="Task title"
                        style={{ background: 'var(--bg-card-alt)', color: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button className="btn btn-primary" onClick={handleUpdate} disabled={isUpdating} style={{ flex: 1, padding: '8px' }}>
                          {isUpdating ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                          Save
                        </button>
                        <button className="btn btn-ghost" onClick={() => setEditingTask(null)} style={{ padding: '8px' }}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div className="task-icon-box" style={{ background: `${getSeverityColor(task.severity)}15`, color: getSeverityColor(task.severity) }}>
                          {getIssueIcon(task.type)}
                        </div>
                        <div style={{ flex: 1 }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{task.type}</span>
                             <span className="task-badge" style={{ 
                                background: `${getSeverityColor(task.severity)}20`, 
                                color: getSeverityColor(task.severity),
                                border: `1px solid ${getSeverityColor(task.severity)}40`
                             }}>{task.severity}</span>
                           </div>
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '4px' }}>{task.suggestedTask}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '12px' }}>"{task.quote}"</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                         <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                           {new Date(task.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                         <div style={{ display: 'flex', gap: '12px' }}>
                           <button onClick={() => handleEditClick(task, originalIndex)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                             <Edit3 size={16} />
                           </button>
                           <button onClick={() => handleDelete(task.noteId, originalIndex)} style={{ background: 'none', border: 'none', color: 'var(--staffing)', cursor: 'pointer' }}>
                             <Trash2 size={16} />
                           </button>
                         </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
