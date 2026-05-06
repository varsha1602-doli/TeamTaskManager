import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Plus, FolderKanban, Calendar, Users as UsersIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_COLORS = { ACTIVE: 'var(--success)', COMPLETED: 'var(--primary)', ARCHIVED: 'var(--text-tertiary)' };

function CreateProjectModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/projects', { name, description, deadline: deadline || null });
      toast.success('Project created!');
      onCreated(data.data);
      onClose();
      setName(''); setDescription(''); setDeadline('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>New Project</h2>
            <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="E.g. Website Redesign" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Brief description..." style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Project'}</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data.data)).catch(() => toast.error('Failed to load projects')).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <div className="page-header"><div className="skeleton" style={{ width: 160, height: 28 }} /></div>
      <div className="grid-3">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 12 }} />)}</div>
    </div>
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Projects</h1><p>{projects.length} project{projects.length !== 1 ? 's' : ''}</p></div>
        {user.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> New Project</button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FolderKanban size={28} /></div>
          <h3>No projects yet</h3>
          <p>Create your first project to start organizing tasks.</p>
        </div>
      ) : (
        <div className="grid-3">
          {projects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id}>
              <motion.div className="card" whileHover={{ y: -2 }} style={{ cursor: 'pointer', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[project.status] }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{project.status}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8, letterSpacing: '-0.01em' }}>{project.name}</h3>
                {project.description && <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <UsersIcon size={14} /> {project.members?.length || 0}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <FolderKanban size={14} /> {project._count?.tasks || 0} tasks
                  </div>
                  {project.deadline && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                      <Calendar size={14} /> {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal open={showModal} onClose={() => setShowModal(false)} onCreated={(p) => setProjects([p, ...projects])} />
    </div>
  );
}
