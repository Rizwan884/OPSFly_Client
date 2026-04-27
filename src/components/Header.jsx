import { Link } from 'react-router-dom';

/**
 * Header — sticky top bar with OpsFly logo and notification bell.
 * @param {{ showBack?: boolean, title?: string, onBack?: () => void }} props
 */
import { Bell, ArrowLeft } from 'lucide-react';

export default function Header({ showBack = false, title = '', onBack }) {
  return (
    <header className="header">
      {showBack ? (
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
      ) : (
        <div className="header-logo-group">
          <svg className="header-logo-icon" viewBox="0 0 32 32" fill="none">
             <path d="M4 10L28 14L4 18V10Z" fill="#1D7BFF"/>
             <path d="M4 18L28 14L4 22V18Z" fill="#00D4FF" opacity="0.7"/>
          </svg>
          <span className="header-logo-text">OpsFly</span>
        </div>
      )}

      {title && <span className="page-title">{title}</span>}

      <div className="header-bell">
        <Bell size={22} color="var(--text-secondary)" />
        <div className="header-bell-dot"></div>
      </div>
    </header>
  );
}
