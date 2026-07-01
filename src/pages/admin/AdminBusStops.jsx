import { useEffect, useState } from 'react';
import { busStopService, routeService } from '../../api/services';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2, X, MapPin } from 'lucide-react';

function BusStopModal({ stop, routes, onSave, onClose }) {
  const [form, setForm] = useState(stop || { name: '', location: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (stop?.id) await busStopService.update(stop.id, form);
      else await busStopService.create(form);
      toast.success(stop?.id ? 'Bus stop updated!' : 'Bus stop created!');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bus stop');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{stop?.id ? 'Edit Bus Stop' : 'New Bus Stop'}</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Stop Name</label>
            <input className="form-input" placeholder="e.g. Merkato Station" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Location / Address</label>
            <input className="form-input" placeholder="e.g. Addis Ababa, Merkato" required value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" /> Saving…</> : 'Save Stop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBusStops() {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [stopRes, routeRes] = await Promise.all([busStopService.getAll(), routeService.getAll()]);
      const stopData = stopRes.data;
      const routeData = routeRes.data;
      setStops(stopData.content ?? (Array.isArray(stopData) ? stopData : []));
      setRoutes(routeData.content ?? (Array.isArray(routeData) ? routeData : []));
    } catch { toast.error('Failed to load bus stops'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this bus stop?')) return;
    try {
      await busStopService.delete(id);
      toast.success('Bus stop deleted');
      load();
    } catch { toast.error('Failed to delete bus stop'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bus Stops</h1>
          <p className="page-subtitle">Manage all bus stop locations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('create')}><Plus size={16} /> Add Stop</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : stops.length === 0 ? (
        <div className="empty-state">
          <MapPin size={48} />
          <h3>No bus stops yet</h3>
          <p>Add the first stop to get started</p>
          <button className="btn btn-primary" onClick={() => setModal('create')}><Plus size={16} /> Add Stop</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Location</th>
                <th>Route</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stops.map((s, i) => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--color-text-faint)' }}>{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{s.name}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{s.location}</td>
                  <td>{s.route ? s.route.name : <span className="text-muted">—</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                      <button className="btn btn-icon btn-ghost" onClick={() => setModal(s)}><Pencil size={14} /></button>
                      <button className="btn btn-icon btn-danger" onClick={() => handleDelete(s.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <BusStopModal
          stop={modal === 'create' ? null : modal}
          routes={routes}
          onSave={() => { setModal(null); load(); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
