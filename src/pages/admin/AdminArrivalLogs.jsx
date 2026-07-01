import { useEffect, useState } from 'react';
import { arrivalLogService } from '../../api/services';
import { useToast } from '../../context/ToastContext';
import { ClipboardList } from 'lucide-react';

const STATUS_BADGE = { ON_TIME: 'badge-success', DELAYED: 'badge-warning', CANCELLED: 'badge-error' };

export default function AdminArrivalLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await arrivalLogService.getAll();
        const data = res.data;
        setLogs(data.content ?? (Array.isArray(data) ? data : []));
      } catch { toast.error('Failed to load arrival logs'); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Arrival Logs</h1>
          <p className="page-subtitle">Historical record of all bus arrivals</p>
        </div>
        <div className="badge badge-muted" style={{ fontSize: 13, padding: '6px 14px' }}>
          <ClipboardList size={13} /> {logs.length} records
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={48} />
          <h3>No logs recorded yet</h3>
          <p>Bus arrivals logged by operators will appear here</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Bus</th>
                <th>Bus Stop</th>
                <th>Arrival Time</th>
                <th>Departure Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id}>
                  <td style={{ color: 'var(--color-text-faint)' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{log.bus?.plateNumber ?? log.busId ?? '—'}</td>
                  <td>{log.busStop?.name ?? log.busStopId ?? '—'}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{log.arrivalTime ? new Date(log.arrivalTime).toLocaleString() : '—'}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{log.departureTime ? new Date(log.departureTime).toLocaleString() : '—'}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[log.status] || 'badge-muted'}`}>{log.status ?? '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
