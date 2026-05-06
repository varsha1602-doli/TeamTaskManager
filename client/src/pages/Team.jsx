import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users as UsersIcon, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Team() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data.data)).catch(() => toast.error('Failed to load team')).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <div className="page-header"><div className="skeleton" style={{ width: 100, height: 28 }} /></div>
      <div className="grid-3">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 12 }} />)}</div>
    </div>
  );

  return (
    <div>
      <div className="page-header"><h1>Team</h1><p>{users.length} team member{users.length !== 1 ? 's' : ''}</p></div>
      {users.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon"><UsersIcon size={28} /></div><h3>No team members</h3><p>Members will appear here once they register.</p></div>
      ) : (
        <div className="grid-3">
          {users.map(u => (
            <div key={u.id} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 32 }}>
              <div className="avatar avatar-lg" style={{ marginBottom: 16, fontSize: '1.125rem' }}>{u.name.charAt(0)}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>{u.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 12 }}><Mail size={12} />{u.email}</div>
              <span className={`badge ${u.role === 'ADMIN' ? 'badge-in-progress' : 'badge-todo'}`}>{u.role}</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 12 }}>Joined {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
