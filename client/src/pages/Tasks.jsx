import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { CheckSquare, Calendar, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (priorityFilter) params.set('priority', priorityFilter);
    api.get(`/tasks?${params}`).then(r => setTasks(r.data.data)).catch(() => toast.error('Failed to load tasks')).finally(() => setLoading(false));
  }, [statusFilter, priorityFilter]);

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
      toast.success('Updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const statuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

  if (loading) return (
    <div>
      <div className="page-header"><div className="skeleton" style={{ width: 120, height: 28 }} /></div>
      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 8, marginBottom: 8 }} />)}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1>Tasks</h1>
        <p>{user.role === 'ADMIN' ? 'All tasks across projects' : 'Your assigned tasks'}</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={16} style={{ color: 'var(--text-tertiary)' }} />
        <select className="form-select" style={{ width: 'auto', minWidth: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select className="form-select" style={{ width: 'auto', minWidth: 140 }} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option>
        </select>
        {(statusFilter || priorityFilter) && <button className="btn btn-ghost btn-sm" onClick={() => { setStatusFilter(''); setPriorityFilter(''); }}>Clear</button>}
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon"><CheckSquare size={28} /></div><h3>No tasks found</h3><p>Try adjusting your filters or create tasks from a project page.</p></div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Task</th><th>Project</th><th>Priority</th><th>Status</th><th>Assignee</th><th>Due Date</th></tr></thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td><div style={{ fontWeight: 500 }}>{task.title}</div>{task.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }} className="truncate">{task.description}</div>}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{task.project?.name}</td>
                  <td><span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                  <td>
                    {(user.role === 'ADMIN' || task.assigneeId === user.id) ? (
                      <select className="form-select" value={task.status} onChange={e => updateStatus(task.id, e.target.value)} style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto', minWidth: 110 }}>
                        {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                    ) : <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>{task.status.replace('_', ' ')}</span>}
                  </td>
                  <td>{task.assignee ? (<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div className="avatar avatar-sm">{task.assignee.name.charAt(0)}</div><span style={{ fontSize: '0.8125rem' }}>{task.assignee.name}</span></div>) : <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>—</span>}</td>
                  <td>{task.dueDate ? (<span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' ? 'var(--danger)' : 'var(--text-secondary)' }}><Calendar size={12} />{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>) : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
