import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home        from './pages/Home';
import Recording   from './pages/Recording';
import NoteAnalysis from './pages/NoteAnalysis';
import NotesList   from './pages/NotesList';
import Tasks       from './pages/Tasks';
import BottomNav   from './components/BottomNav';
import ComingSoon  from './components/ComingSoon';
import { NotesProvider } from './context/NotesContext';

/**
 * App — root component with React Router setup.
 */
function App() {
  return (
    <NotesProvider>
      <Router>
        <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recording" element={<Recording />} />
          <Route path="/analysis" element={<NoteAnalysis />} />
          <Route path="/notes" element={<NotesList />} />
          <Route path="/tasks" element={<Tasks />} />
          
          {/* Coming Soon Placeholders */}
          <Route path="/reports" element={<ComingSoon title="Reports" />} />
          <Route path="/more" element={<ComingSoon title="Settings & Profile" />} />
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
      </Router>
    </NotesProvider>
  );
}

export default App;
