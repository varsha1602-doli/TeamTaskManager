import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ListChecks, CheckSquare, FolderKanban, Users, BarChart3, Shield, ArrowRight } from 'lucide-react';

const features = [
  { icon: FolderKanban, title: 'Project Management', desc: 'Create, organize, and track projects with deadlines and team assignments.' },
  { icon: CheckSquare, title: 'Task Tracking', desc: 'Manage tasks with priorities, statuses, and due dates across your projects.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Invite members, assign responsibilities, and track team activity.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time insights into project progress and team productivity.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Admin and member roles with granular permission controls.' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.03em' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ListChecks size={18} /></div>
          Task Manager
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hi, <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong></span>
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 32px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 24 }}>
          ✨ Built for modern teams
        </div>
        {user ? (
          <>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20, color: 'var(--text-primary)' }}>
              Welcome back,<br /><span style={{ color: 'var(--primary)' }}>{user.name}</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
              Your team is waiting. Jump back into your projects and tasks.
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard <ArrowRight size={16} /></Link>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20, color: 'var(--text-primary)' }}>
              Manage tasks,<br />ship products <span style={{ color: 'var(--primary)' }}>faster</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
              A lightweight yet powerful task management platform for teams that want clarity, speed, and focus.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link to="/signup" className="btn btn-primary btn-lg">Start Free <ArrowRight size={16} /></Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
            </div>
          </>
        )}
      </section>

      {/* Features */}
      <section style={{ padding: '60px 32px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 48 }}>Everything you need</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} className="card" style={{ padding: 28 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><f.icon size={20} /></div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
        © 2026 Team Task Manager. Built with ❤️
      </footer>
    </div>
  );
}
