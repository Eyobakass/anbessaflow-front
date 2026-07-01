import { useEffect, useState } from 'react';
import { busService, routeService, busStopService, arrivalLogService } from '../../api/services';
import { Bus, Route, MapPin, ClipboardList, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function StatCard({ icon: Icon, label, value, color, change }) {
  return (
    <div className="stat-card card-glow">
      <div className={`stat-icon ${color}`}><Icon size={22} /></div>
      <div className="stat-value">{value ?? <span className="skeleton" style={{ width: 60, height: 36, display: 'block' }} />}</div>
      <div className="stat-label">{label}</div>
      {change && <div className={`stat-change ${change > 0 ? 'up' : 'down'}`}>
        <TrendingUp size={12} /> {Math.abs(change)}% this week
      </div>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ buses: null, routes: null, stops: null, logs: null });

  useEffect(() => {
    async function load() {
      try {
        const [busRes, routeRes, stopRes, logRes] = await Promise.allSettled([
          busService.getAll(),
          routeService.getAll(),
          busStopService.getAll(),
          arrivalLogService.getAll(),
        ]);
        setStats({
          buses: busRes.status === 'fulfilled' ? (busRes.value.data.totalElements ?? busRes.value.data.content?.length ?? busRes.value.data.length ?? '—') : '—',
          routes: routeRes.status === 'fulfilled' ? (routeRes.value.data.totalElements ?? routeRes.value.data.content?.length ?? routeRes.value.data.length ?? '—') : '—',
          stops: stopRes.status === 'fulfilled' ? (stopRes.value.data.totalElements ?? stopRes.value.data.content?.length ?? stopRes.value.data.length ?? '—') : '—',
          logs: logRes.status === 'fulfilled' ? (logRes.value.data.totalElements ?? logRes.value.data.content?.length ?? logRes.value.data.length ?? '—') : '—',
        });
      } catch { /* ignore */ }
    }
    load();
  }, []);

  const displayName = user?.user?.name || user?.name || 'Admin';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome back, {displayName} — here's what's happening today.</p>
        </div>
        <div className="badge badge-primary" style={{ padding: '6px 14px', fontSize: 13 }}>
          <AlertCircle size={13} /> ADMIN
        </div>
      </div>

      <div className="grid grid-4 gap-4 mb-8">
        <StatCard icon={Bus} label="Total Buses" value={stats.buses} color="orange" change={5} />
        <StatCard icon={Route} label="Active Routes" value={stats.routes} color="yellow" change={2} />
        <StatCard icon={MapPin} label="Bus Stops" value={stats.stops} color="green" />
        <StatCard icon={ClipboardList} label="Arrival Logs" value={stats.logs} color="blue" />
      </div>

      <div className="grid grid-2 gap-6">
        <div className="card">
          <div className="section-header mb-4">
            <span className="section-title">Quick Actions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { label: 'Manage Users', href: '/admin/users', color: 'var(--color-primary)' },
              { label: 'Add New Bus', href: '/admin/buses', color: 'var(--color-secondary)' },
              { label: 'Create Route', href: '/admin/routes', color: 'var(--color-success)' },
              { label: 'Add Bus Stop', href: '/admin/bus-stops', color: 'var(--color-info)' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                  color: action.color, fontWeight: 600, fontSize: 'var(--font-size-sm)',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = action.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: action.color }} />
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-header mb-4">
            <span className="section-title">System Info</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { label: 'API Endpoint', value: 'Render Cloud' },
              { label: 'Database', value: 'PostgreSQL 18' },
              { label: 'Auth', value: 'JWT Bearer' },
              { label: 'Version', value: '1.0.0' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{item.label}</span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
