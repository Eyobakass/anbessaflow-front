import { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import { Clock, RefreshCw } from 'lucide-react';

export default function PassengerWaiting() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [wt, qs] = await Promise.allSettled([
        api.get('/queue/waiting-time'),
        api.get('/queue/status'),
      ]);
      if (wt.status === 'fulfilled') setData(wt.value.data);
      if (qs.status === 'fulfilled') setQueueStatus(qs.value.data);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const minutes = data?.estimatedMinutes;

  const urgency = minutes === '—' || minutes === undefined ? 'blue'
    : minutes <= 5 ? 'green'
    : minutes <= 15 ? 'yellow'
    : 'orange';

  const urgencyColor = { green: 'var(--color-success)', yellow: 'var(--color-secondary)', orange: 'var(--color-primary)', blue: 'var(--color-info)' }[urgency];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Waiting Time</h1>
          <p className="page-subtitle">Your estimated time to board</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        {/* Big clock card */}
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', marginBottom: 'var(--space-6)' }}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <Clock size={48} style={{ color: urgencyColor, margin: '0 auto', opacity: 0.8 }} />
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
            Estimated Wait
          </div>
          {loading ? (
            <div className="skeleton" style={{ width: 120, height: 80, borderRadius: 'var(--radius-md)', margin: '0 auto' }} />
          ) : (
            <div style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, color: urgencyColor }}>
              {minutes ?? '—'}
            </div>
          )}
          <div style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontWeight: 500 }}>
            minutes
          </div>

          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: urgencyColor, fontWeight: 600 }}>
              {minutes <= 5 ? '🟢 Bus arriving soon!'
                : minutes <= 15 ? '🟡 Moderate wait'
                : minutes === '—' ? 'ℹ️ No queue data yet'
                : '🟠 Longer wait expected'}
            </span>
          </div>
        </div>

        {/* Queue info */}
        {queueStatus && (
          <div className="card">
            <div className="section-title mb-4">Your Queue Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Bus Stop', value: queueStatus.busStop || '—' },
                { label: 'Your Position', value: `#${queueStatus.position ?? '—'}` },
                { label: 'People Ahead', value: queueStatus.peopleAhead ?? '—' },
                { label: 'Total in Queue', value: queueStatus.totalInQueue ?? '—' },
              ].map((item) => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)'
                }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{item.label}</span>
                  <span style={{ fontWeight: 700 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
