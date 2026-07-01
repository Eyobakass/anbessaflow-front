import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  LayoutDashboard, Bus, MapPin, Route, Users, LogOut,
  ClipboardList, Clock, UserCheck, Activity
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Buses', to: '/admin/buses', icon: Bus },
  { label: 'Routes', to: '/admin/routes', icon: Route },
  { label: 'Bus Stops', to: '/admin/bus-stops', icon: MapPin },
  { label: 'Arrival Logs', to: '/admin/arrival-logs', icon: ClipboardList },
];

const OPERATOR_NAV = [
  { label: 'Dashboard', to: '/operator', icon: LayoutDashboard, end: true },
  { label: 'Bus Arrivals', to: '/operator/arrivals', icon: Bus },
  { label: 'Queue Status', to: '/operator/queues', icon: Activity },
];

const PASSENGER_NAV = [
  { label: 'Dashboard', to: '/passenger', icon: LayoutDashboard, end: true },
  { label: 'Join Queue', to: '/passenger/queue', icon: UserCheck },
  { label: 'My Wait Time', to: '/passenger/waiting', icon: Clock },
  { label: 'Routes', to: '/passenger/routes', icon: Route },
];

const ROLE_NAV = { ADMIN: ADMIN_NAV, OPERATOR: OPERATOR_NAV, PASSENGER: PASSENGER_NAV };

export default function Sidebar() {
  const { user, logout, getRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const role = getRole();
  const navItems = ROLE_NAV[role] || [];
  const displayName = user?.user?.name || user?.name || user?.sub || 'User';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">A</div>
        <div>
          <div className="sidebar-logo-text">AnbesaFlow</div>
          <div className="sidebar-logo-sub">Smart Bus System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">{role}</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name truncate">{displayName}</div>
            <div className="user-role">{role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-icon btn-ghost"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
