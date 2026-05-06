import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, User, LogOut, Sun, Moon, ListChecks } from 'lucide-react';
import './Layout.css';

export default function Sidebar({ isOpen }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ to: '/team', icon: Users, label: 'Team' });
  }

  navItems.push({ to: '/profile', icon: User, label: 'Profile' });

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-top">
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon"><ListChecks size={20} /></div>
          <span>Task Manager</span>
        </Link>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <div className="sidebar-user">
          <div className="avatar avatar-sm">{user?.name?.charAt(0)}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name truncate">{user?.name}</span>
            <span className="sidebar-user-role">{user?.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
