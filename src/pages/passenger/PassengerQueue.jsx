import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosClient';
import { UserCheck, Hash, Users, Clock, LogOut } from 'lucide-react';

export default function PassengerQueue() {
  const toast = useToast();
  const [busStop, setBusStop] = useState('');
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inQueue, setInQueue] = useState(false);

  const joinQueue = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/queue/join', { busStop });
      setQueueData(res.data);
      setInQueue(true);
      toast.success(`Joined queue at ${busStop}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join queue');
    } finally { setLoading(false); }
  };

  const leaveQueue = async () => {
    setLoading(true);
    try {
      await api.delete('/queue/leave');
      setQueueData(null);
      setInQueue(false);
      setBusStop('');
      toast.info('Left the queue');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave queue');
    } finally { setLoading(false); }
  };

  const refreshStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get('/queue/status');
      setQueueData(res.data);
    } catch (err) {
      toast.error('Could not fetch queue status');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Join Queue</h1>
          <p className="page-subtitle">Enter a bus stop name to join the virtual queue</p>
        </div>
      </div>

      {!inQueue ? (
        <div style={{ maxWidth: 480 }}>
          <div className="card">
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Select Your Stop</h2>
            <form onSubmit={joinQueue} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Bus Stop Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. Merkato, Piassa, Mexico…"
                  required
                  value={busStop}
                  onChange={(e) => setBusStop(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? <><div className="spinner spinner-sm" /> Joining…</> : <><UserCheck size={18} /> Join Queue</>}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 520 }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%', border: '4px solid var(--color-border)',
              borderTopColor: 'var(--color-primary)', borderRightColor: 'var(--color-secondary)',
              margin: '0 auto var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                #{queueData?.position ?? '?'}
              </div>
            </div>

            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              You are in queue!
            </div>
            <div style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
              At stop: <strong style={{ color: 'var(--color-text)' }}>{queueData?.busStop || busStop}</strong>
            </div>

            <div className="grid grid-3 gap-3" style={{ marginBottom: 'var(--space-8)' }}>
              {[
                { label: 'Position', value: `#${queueData?.position ?? '—'}`, icon: Hash },
                { label: 'Ahead', value: queueData?.peopleAhead ?? '—', icon: Users },
                { label: 'Total', value: queueData?.totalInQueue ?? '—', icon: Users },
              ].map((s) => (
                <div key={s.label} style={{
                  padding: 'var(--space-4)', background: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
                }}>
                  <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={refreshStatus} disabled={loading}>
                {loading ? <div className="spinner spinner-sm" /> : '↻ Refresh'}
              </button>
              <button className="btn btn-danger" onClick={leaveQueue} disabled={loading}>
                <LogOut size={16} /> Leave Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
