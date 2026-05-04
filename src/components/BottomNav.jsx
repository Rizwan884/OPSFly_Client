"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, CheckSquare, MoreHorizontal } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ClipboardList, label: 'Notes', path: '/notes' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: MoreHorizontal, label: 'More', path: '/more' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link key={item.path} href={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
