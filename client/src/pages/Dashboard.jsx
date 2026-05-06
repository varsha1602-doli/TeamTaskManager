import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FolderKanban, CheckSquare, Clock, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#6B7280', '#2563EB', '#D97706', '#059669'];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}14`, color }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/member';
    api.get(endpoint)
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [user.role]);

  if (loading) return (
    <div>
      <div className="page-header"><div className="skeleton" style={{ width: 200, height: 28 }} /></div>
      <div className="grid-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12 }} />)}
      </div>
    </div>
  );

  if (!data) return null;

  const statusData = data.statusCounts ? [
    { name: 'Todo', value: data.statusCounts.TODO || 0 },
    { name: 'In Progress', value: data.statusCounts.IN_PROGRESS || 0 },
    { name: 'Review', value: data.statusCounts.REVIEW || 0 },
    { name: 'Completed', value: data.statusCounts.COMPLETED || 0 },
  ] : [];

  const isAdmin = user.role === 'ADMIN';

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user.name.split(' ')[0]}</h1>
        <p>{isAdmin ? 'Here\'s an overview of your team\'s progress' : 'Here\'s a summary of your tasks'}</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        {isAdmin ? (
          <>
            <StatCard icon={FolderKanban} label="Total Projects" value={data.totalProjects} color="#4F46E5" />
            <StatCard icon={CheckSquare} label="Total Tasks" value={data.totalTasks} color="#2563EB" />
            <StatCard icon={TrendingUp} label="Completed" value={data.completedTasks} color="#059669" />
            <StatCard icon={AlertTriangle} label="Overdue" value={data.overdueTasks} color="#DC2626" />
          </>
        ) : (
          <>
            <StatCard icon={CheckSquare} label="Assigned Tasks" value={data.assignedTasks} color="#4F46E5" />
            <StatCard icon={TrendingUp} label="Completed" value={data.completedTasks} color="#059669" />
            <StatCard icon={AlertTriangle} label="Overdue" value={data.overdueTasks} color="#DC2626" />
            <StatCard icon={Clock} label="In Progress" value={data.statusCounts?.IN_PROGRESS || 0} color="#D97706" />
          </>
        )}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3 className="card-title">Tasks by Status</h3></div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Distribution</h3></div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={3} stroke="none">
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
            {statusData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAdmin && data.recentTasks?.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header"><h3 className="card-title">Recent Tasks</h3></div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr><th>Task</th><th>Project</th><th>Assignee</th><th>Status</th></tr>
              </thead>
              <tbody>
                {data.recentTasks.map(task => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 500 }}>{task.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{task.project?.name}</td>
                    <td>
                      {task.assignee ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar avatar-sm">{task.assignee.name.charAt(0)}</div>
                          {task.assignee.name}
                        </div>
                      ) : <span style={{ color: 'var(--text-tertiary)' }}>Unassigned</span>}
                    </td>
                    <td><span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>{task.status.replace('_', ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
