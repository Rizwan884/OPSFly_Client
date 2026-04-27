import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, BarChart3, MoreHorizontal } from 'lucide-react';

/**
 * BottomNav — navigation bar with Lucide icons.
 */
export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} className="nav-icon" />
        <span className="nav-label">Home</span>
      </NavLink>
      
      <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ClipboardList size={22} className="nav-icon" />
        <span className="nav-label">Tasks</span>
      </NavLink>
      
      <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <BarChart3 size={22} className="nav-icon" />
        <span className="nav-label">Reports</span>
      </NavLink>
      
      <NavLink to="/more" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MoreHorizontal size={22} className="nav-icon" />
        <span className="nav-label">More</span>
      </NavLink>
    </nav>
  );
}
