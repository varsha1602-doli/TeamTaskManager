import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ArrowLeft, Plus, Trash2, UserPlus, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function AddTaskModal({ open, onClose, projectId, members, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/tasks', { title, description, priority, assigneeId: assigneeId || null, dueDate: dueDate || null, projectId });
      toast.success('Task created!');
      onCreated(data.data);
      onClose();
      setTitle(''); setDescription(''); setPriority('MEDIUM'); setAssigneeId(''); setDueDate('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
          <div className="modal-header"><h2>New Task</h2><button className="btn btn-icon btn-ghost" onClick={onClose}><X size={18} /></button></div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Task title" /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Details..." style={{ resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div>
                <div className="form-group"><label className="form-label">Due Date</label><input className="form-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Assignee</label><select className="form-select" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}><option value="">Unassigned</option>{members.map(m => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}</select></div>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</button></div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AddMemberModal({ open, onClose, projectId, existingMembers, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) api.get('/users').then(r => setUsers(r.data.data)).catch(() => {}); }, [open]);

  const available = users.filter(u => !existingMembers.some(m => m.user.id === u.id) && u.role === 'MEMBER');

  const addMember = async (userId) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/projects/${projectId}/members`, { userId });
      toast.success('Member added!');
      onAdded(data.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
          <div className="modal-header"><h2>Add Member</h2><button className="btn btn-icon btn-ghost" onClick={onClose}><X size={18} /></button></div>
          <div className="modal-body">
            {available.length === 0 ? <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>No available members to add</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {available.map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm">{u.name.charAt(0)}</div>
                      <div><div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{u.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{u.email}</div></div>
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={() => addMember(u.id)} disabled={loading}>Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const isAdmin = user.role === 'ADMIN';

  const fetchProject = () => {
    api.get(`/projects/${id}`).then(r => setProject(r.data.data)).catch(() => toast.error('Project not found')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProject(); }, [id]);

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setProject(p => ({ ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t) }));
      toast.success('Status updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setProject(p => ({ ...p, tasks: p.tasks.filter(t => t.id !== taskId) }));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const removeMember = async (userId) => {
    if (!confirm('Remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      fetchProject();
      toast.success('Member removed');
    } catch { toast.error('Failed to remove'); }
  };

  if (loading) return <div className="page-header"><div className="skeleton" style={{ width: 200, height: 28 }} /></div>;
  if (!project) return <p>Project not found</p>;

  const statuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')} style={{ marginBottom: 12 }}><ArrowLeft size={16} /> Back to Projects</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>{project.name}</h1>
            {project.description && <p style={{ color: 'var(--text-secondary)', marginTop: 4, maxWidth: 600 }}>{project.description}</p>}
          </div>
          {isAdmin && <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}><Plus size={16} /> Add Task</button>}
        </div>
      </div>

      {/* Tasks by Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {statuses.map(status => {
          const tasks = project.tasks?.filter(t => t.status === status) || [];
          return (
            <div key={status} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className={`badge badge-${status.toLowerCase().replace('_', '-')}`}>{status.replace('_', ' ')}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{tasks.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tasks.map(task => (
                  <motion.div key={task.id} layout style={{ padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', fontSize: '0.8125rem' }}>
                    <div style={{ fontWeight: 500, marginBottom: 6 }}>{task.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span className={`badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '0.6875rem' }}>{task.priority}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {(isAdmin || task.assigneeId === user.id) && (
                          <select className="form-select" value={task.status} onChange={e => updateTaskStatus(task.id, e.target.value)} style={{ padding: '2px 6px', fontSize: '0.6875rem', minWidth: 'auto', width: 'auto' }}>
                            {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                          </select>
                        )}
                        {isAdmin && <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 2 }}><Trash2 size={12} /></button>}
                      </div>
                    </div>
                    {task.assignee && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div className="avatar" style={{ width: 18, height: 18, fontSize: '0.5rem' }}>{task.assignee.name.charAt(0)}</div>
                        {task.assignee.name}
                      </div>
                    )}
                    {task.dueDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: '0.6875rem', color: new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' ? 'var(--danger)' : 'var(--text-tertiary)' }}>
                        <Calendar size={10} />{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Members */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Team Members ({project.members?.length || 0})</h3>
          {isAdmin && <button className="btn btn-sm btn-secondary" onClick={() => setShowMemberModal(true)}><UserPlus size={14} /> Add Member</button>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {project.members?.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar avatar-md">{m.user.name.charAt(0)}</div>
                <div><div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{m.user.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{m.user.email}</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-todo">{m.user.role}</span>
                {isAdmin && <button className="btn btn-icon btn-ghost btn-sm" onClick={() => removeMember(m.user.id)}><Trash2 size={14} /></button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddTaskModal open={showTaskModal} onClose={() => setShowTaskModal(false)} projectId={id} members={project.members || []} onCreated={(task) => setProject(p => ({ ...p, tasks: [task, ...(p.tasks || [])] }))} />
      <AddMemberModal open={showMemberModal} onClose={() => setShowMemberModal(false)} projectId={id} existingMembers={project.members || []} onAdded={() => fetchProject()} />
    </div>
  );
}
