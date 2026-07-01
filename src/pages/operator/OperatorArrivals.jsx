import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosClient';
import { Bus, CheckCircle } from 'lucide-react';

export default function OperatorArrivals() {
  const toast = useToast();
  const [form, setForm] = useState({ busPlate: '', status: 'ON_TIME' });
  const [loading, setLoading] = useState(false);
  const [lastLog, setLastLog] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/operator/bus-arrivals', form);
      toast.success('Arrival recorded!');
      setLastLog({ ...form, time: new Date().toLocaleTimeString(), response: res.data?.message });
      setForm({ busPlate: '', status: 'ON_TIME' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record arrival');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Log Bus Arrival</h1>
          <p className="page-subtitle">Record when a bus arrives at its stop</p>
        </div>
      </div>

      <div className="grid grid-2 gap-6">
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Arrival Form</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Bus Plate Number</label>
              <div className="input-wrapper">
                <Bus size={16} className="input-icon" />
                <input
                  className="form-input"
                  placeholder="e.g. AA-12345"
                  required
                  value={form.busPlate}
                  onChange={(e) => setForm({ ...form, busPlate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Arrival Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="ON_TIME">On Time</option>
                <option value="DELAYED">Delayed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" /> Recording…</> : '✓ Record Arrival'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Last Recorded</h2>
          {lastLog ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-4)', background: 'rgba(46,204,113,0.1)',
                border: '1px solid rgba(46,204,113,0.3)', borderRadius: 'var(--radius-md)'
              }}>
                <CheckCircle size={20} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700 }}>Bus {lastLog.busPlate}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Logged at {lastLog.time}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span className={`badge ${lastLog.status === 'ON_TIME' ? 'badge-success' : lastLog.status === 'DELAYED' ? 'badge-warning' : 'badge-error'}`}>
                    {lastLog.status}
                  </span>
                </div>
              </div>
              {lastLog.response && (
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{lastLog.response}</p>
              )}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <Bus size={32} />
              <p>No arrival logged yet this session</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
