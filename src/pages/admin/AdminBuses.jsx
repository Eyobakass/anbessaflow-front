import { useEffect, useState } from 'react';
import { busService, routeService } from '../../api/services';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2, X, Bus } from 'lucide-react';

function BusModal({ bus, routes, onSave, onClose }) {
  const [form, setForm] = useState(bus || { plateNumber: '', capacity: '', status: 'ACTIVE', routeId: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (bus?.id) await busService.update(bus.id, payload);
      else await busService.create(payload);
      toast.success(bus?.id ? 'Bus updated!' : 'Bus created!');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{bus?.id ? 'Edit Bus' : 'Add New Bus'}</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Plate Number</label>
            <input className="form-input" placeholder="e.g. AA-12345" required value={form.plateNumber}
              onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Capacity</label>
            <input className="form-input" type="number" min={1} placeholder="e.g. 80" required value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Route (Optional)</label>
            <select className="form-select" value={form.routeId || ''} onChange={(e) => setForm({ ...form, routeId: e.target.value })}>
              <option value="">-- No Route --</option>
              {routes.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.startPoint} → {r.endPoint})</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" /> Saving…</> : 'Save Bus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const STATUS_BADGE = { ACTIVE: 'badge-success', IN_TRANSIT: 'badge-info', MAINTENANCE: 'badge-warning' };

export default function AdminBuses() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | bus object
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [busRes, routeRes] = await Promise.all([busService.getAll(), routeService.getAll()]);
      const busData = busRes.data;
      const routeData = routeRes.data;
      setBuses(busData.content ?? (Array.isArray(busData) ? busData : []));
      setRoutes(routeData.content ?? (Array.isArray(routeData) ? routeData : []));
    } catch { toast.error('Failed to load buses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this bus?')) return;
    try {
      await busService.delete(id);
      toast.success('Bus deleted');
      load();
    } catch { toast.error('Failed to delete bus'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fleet Management</h1>
          <p className="page-subtitle">Manage your entire bus fleet</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('create')}>
          <Plus size={16} /> Add Bus
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : buses.length === 0 ? (
        <div className="empty-state">
          <Bus size={48} />
          <h3>No buses yet</h3>
          <p>Add your first bus to get started</p>
          <button className="btn btn-primary" onClick={() => setModal('create')}><Plus size={16} /> Add Bus</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Plate Number</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Route</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td><span style={{ fontWeight: 700 }}>{bus.plateNumber}</span></td>
                  <td>{bus.capacity} seats</td>
                  <td><span className={`badge ${STATUS_BADGE[bus.status] || 'badge-muted'}`}>{bus.status}</span></td>
                  <td>{bus.route ? `${bus.route.name}` : <span className="text-muted">—</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                      <button className="btn btn-icon btn-ghost" onClick={() => setModal(bus)}><Pencil size={14} /></button>
                      <button className="btn btn-icon btn-danger" onClick={() => handleDelete(bus.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <BusModal
          bus={modal === 'create' ? null : modal}
          routes={routes}
          onSave={() => { setModal(null); load(); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
