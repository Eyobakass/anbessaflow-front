import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosClient';
import { Activity, Users, Clock } from 'lucide-react';

export default function OperatorQueues() {
  const toast = useToast();
  const [busPlate, setBusPlate] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);

  const checkQueue = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get queue status
      const res = await api.get('/queue/status');
      setQueueData(res.data);
    } catch (err) {
      // If no queue exists, show a friendly message
      setQueueData({ busStop: 'N/A', position: 0, peopleAhead: 0, totalInQueue: 0 });
    } finally { setLoading(false); }
  };

  const updateStatus = async () => {
    if (!busPlate) { toast.error('Enter a bus plate first'); return; }
    setLoading(true);
    try {
      await api.put('/operator/bus-status', { busPlate, status });
      toast.success(`Bus ${busPlate} status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update bus status');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Queue & Bus Status</h1>
          <p className="page-subtitle">Monitor queue lengths and update bus status</p>
        </div>
      </div>

      <div className="grid grid-2 gap-6">
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Update Bus Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Bus Plate Number</label>
              <input
                className="form-input"
                placeholder="e.g. AA-12345"
                value={busPlate}
                onChange={(e) => setBusPlate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={updateStatus} disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" /> Updating…</> : 'Update Status'}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Queue Status</h2>
          <form onSubmit={checkQueue} style={{ marginBottom: 'var(--space-4)' }}>
            <button type="submit" className="btn btn-ghost w-full" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" /> Loading…</> : '↻ Refresh Queue Status'}
            </button>
          </form>

          {queueData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              {[
                { label: 'Bus Stop', value: queueData.busStop || '—', icon: Activity },
                { label: 'Your Position', value: queueData.position ?? '—', icon: Users },
                { label: 'People Ahead', value: queueData.peopleAhead ?? '—', icon: Clock },
                { label: 'Total In Queue', value: queueData.totalInQueue ?? '—', icon: Users },
              ].map((item) => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    <item.icon size={14} />
                    {item.label}
                  </div>
                  <span style={{ fontWeight: 700 }}>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <Activity size={32} />
              <p>Click refresh to see queue status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
