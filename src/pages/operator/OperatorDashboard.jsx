import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { busService } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Bus, Activity, TrendingUp } from 'lucide-react';

export default function OperatorDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayName = user?.user?.name || user?.name || 'Operator';

  useEffect(() => {
    (async () => {
      try {
        const res = await busService.getAll();
        const data = res.data;
        setBuses(data.content ?? (Array.isArray(data) ? data : []));
      } catch { toast.error('Could not load bus data'); }
      finally { setLoading(false); }
    })();
  }, []);

  const active = buses.filter(b => b.status === 'ACTIVE').length;
  const inTransit = buses.filter(b => b.status === 'IN_TRANSIT').length;
  const maintenance = buses.filter(b => b.status === 'MAINTENANCE').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Operator Dashboard</h1>
          <p className="page-subtitle">Welcome, {displayName} — manage your fleet operations</p>
        </div>
        <div className="badge badge-warning" style={{ padding: '6px 14px', fontSize: 13 }}>
          <Activity size={13} /> OPERATOR
        </div>
      </div>

      <div className="grid grid-3 gap-4 mb-8">
        {[
          { label: 'Active Buses', value: loading ? '…' : active, icon: Bus, color: 'green' },
          { label: 'In Transit', value: loading ? '…' : inTransit, icon: TrendingUp, color: 'yellow' },
          { label: 'In Maintenance', value: loading ? '…' : maintenance, icon: Activity, color: 'orange' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}><s.icon size={22} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header mb-4">
          <span className="section-title">Quick Actions</span>
        </div>
        <div className="grid grid-2 gap-4">
          {[
            { label: '🚌 Log Bus Arrival', href: '/operator/arrivals', desc: 'Record when a bus arrives at a stop' },
            { label: '📋 View Queue Status', href: '/operator/queues', desc: 'Check current queue lengths at stops' },
          ].map((a) => (
            <Link key={a.href} to={a.href} style={{
              display: 'block', padding: '20px', borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
              textDecoration: 'none', transition: 'all var(--transition-base)'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>{a.label}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
