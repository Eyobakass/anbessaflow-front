import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { routeService, busStopService } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosClient';
import { Clock, Route, MapPin, UserCheck } from 'lucide-react';

export default function PassengerDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [routes, setRoutes] = useState([]);
  const [waitingData, setWaitingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const displayName = user?.user?.name || user?.name || 'Passenger';

  useEffect(() => {
    (async () => {
      try {
        const [routeRes] = await Promise.allSettled([routeService.getAll()]);
        if (routeRes.status === 'fulfilled') {
          const data = routeRes.value.data;
          setRoutes((data.content ?? (Array.isArray(data) ? data : [])).slice(0, 4));
        }
        // Get waiting time
        try {
          const wt = await api.get('/queue/waiting-time');
          setWaitingData(wt.data);
        } catch { setWaitingData({ estimatedMinutes: '—' }); }
      } catch { }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hi, {displayName} 👋</h1>
          <p className="page-subtitle">Here's your real-time transport dashboard</p>
        </div>
        <div className="badge badge-success" style={{ padding: '6px 14px', fontSize: 13 }}>
          <UserCheck size={13} /> PASSENGER
        </div>
      </div>

      {/* Waiting time hero card */}
      <div className="card" style={{
        background: 'var(--gradient-brand)', border: 'none', marginBottom: 'var(--space-6)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-8)',
        padding: 'var(--space-8)'
      }}>
        <div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginBottom: 4 }}>
            ESTIMATED WAIT TIME
          </div>
          <div style={{ fontSize: '4rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
            {loading ? '…' : `${waitingData?.estimatedMinutes ?? '—'}`}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>minutes</div>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <Clock size={64} style={{ color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }} />
        </div>
      </div>

      <div className="grid grid-3 gap-4 mb-8">
        {[
          { label: 'Join Queue', href: '/passenger/queue', icon: UserCheck, color: 'orange', desc: 'Get in line at your stop' },
          { label: 'My Wait Time', href: '/passenger/waiting', icon: Clock, color: 'yellow', desc: 'Check your position' },
          { label: 'Browse Routes', href: '/passenger/routes', icon: Route, color: 'green', desc: 'Find your route' },
        ].map((card) => (
          <Link key={card.href} to={card.href} style={{
            display: 'block', padding: 'var(--space-6)',
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', textDecoration: 'none',
            transition: 'all var(--transition-base)'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div className={`stat-icon ${card.color}`} style={{ marginBottom: 'var(--space-3)', width: 44, height: 44 }}>
              <card.icon size={20} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--color-text)', marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{card.desc}</div>
          </Link>
        ))}
      </div>

      {/* Available routes */}
      <div className="card">
        <div className="section-header mb-4">
          <span className="section-title">Available Routes</span>
          <Link to="/passenger/routes" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-light)', fontWeight: 600 }}>View all →</Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 56, borderRadius: 'var(--radius-md)' }} />)}
          </div>
        ) : routes.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <Route size={32} />
            <p>No routes available</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {routes.map((r) => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                <MapPin size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>{r.name}</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  {r.startPoint} → {r.endPoint}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
