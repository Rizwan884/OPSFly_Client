import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getNotes();
      setNotes(data);
      
      // Aggregate issues from all notes into tasks
      const allTasks = data.flatMap(note => 
        (note.issues || []).map(issue => ({
          ...issue,
          noteId: note._id,
          createdAt: note.createdAt
        }))
      );
      
      // Sort tasks by severity (High -> Medium -> Low) and then by date
      const severityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      allTasks.sort((a, b) => {
        const sevDiff = (severityOrder[a.severity] || 3) - (severityOrder[b.severity] || 3);
        if (sevDiff !== 0) return sevDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setTasks(allTasks);
    } catch (err) {
      console.error('Failed to fetch data in NotesContext', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateNoteIssues = async (noteId, newIssues) => {
    try {
      const response = await api.updateNote(noteId, { issues: newIssues });
      if (response.success) {
        // Update local state without full refetch
        const updatedNotes = notes.map(n => n._id === noteId ? response.note : n);
        setNotes(updatedNotes);
        
        // Re-aggregate tasks
        const allTasks = updatedNotes.flatMap(note => 
          (note.issues || []).map(issue => ({
            ...issue,
            noteId: note._id,
            createdAt: note.createdAt
          }))
        );
        setTasks(allTasks);
      }
      return response;
    } catch (err) {
      console.error('Failed to update note issues', err);
      throw err;
    }
  };

  const value = {
    notes,
    tasks,
    loading,
    refreshData,
    updateNoteIssues
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
