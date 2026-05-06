import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header"><h1>Profile</h1><p>Your account details</p></div>
      <div className="card" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div className="avatar avatar-lg" style={{ width: 72, height: 72, fontSize: '1.5rem' }}>{user?.name?.charAt(0)}</div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.name}</h2>
            <span className={`badge ${user?.role === 'ADMIN' ? 'badge-in-progress' : 'badge-todo'}`} style={{ marginTop: 4 }}>{user?.role}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <User size={18} style={{ color: 'var(--text-tertiary)' }} />
            <div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 2 }}>Full Name</div><div style={{ fontWeight: 500 }}>{user?.name}</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <Mail size={18} style={{ color: 'var(--text-tertiary)' }} />
            <div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 2 }}>Email</div><div style={{ fontWeight: 500 }}>{user?.email}</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <Shield size={18} style={{ color: 'var(--text-tertiary)' }} />
            <div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 2 }}>Role</div><div style={{ fontWeight: 500 }}>{user?.role}</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
            <Calendar size={18} style={{ color: 'var(--text-tertiary)' }} />
            <div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 2 }}>Joined</div><div style={{ fontWeight: 500 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
