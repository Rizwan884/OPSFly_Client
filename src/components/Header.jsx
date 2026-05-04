"use client";
import { Bell, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header({ title = 'OpsFly', showBack = false, onBack }) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <header className="header">
      <div className="header-left">
        {showBack && (
          <button onClick={handleBack} className="back-btn" style={{ background: 'none', border: 'none', color: '#fff', padding: 0, marginRight: '12px' }}>
            <ChevronLeft size={24} />
          </button>
        )}
        <span className="brand-name">{title}</span>
      </div>
      <div className="header-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="user-avatar">F</div>
      </div>
    </header>
  );
}
