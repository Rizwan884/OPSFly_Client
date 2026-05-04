"use client";
import Header from '@/src/components/Header';

export default function TasksPage() {
  return (
    <div className="page-wrapper">
      <Header title="Task Manager" />
      <main className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏗️</div>
        <h2 style={{ marginBottom: '8px' }}>Task Manager</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '250px' }}>
          This feature is coming soon in Milestone 3.
        </p>
      </main>
    </div>
  );
}
