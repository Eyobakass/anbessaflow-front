import { useEffect, useState } from 'react';
import { routeService } from '../../api/services';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2, X, Route } from 'lucide-react';

function RouteModal({ route, onSave, onClose }) {
  const [form, setForm] = useState(route || { name: '', startPoint: '', endPoint: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (route?.id) await routeService.update(route.id, form);
      else await routeService.create(form);
      toast.success(route?.id ? 'Route updated!' : 'Route created!');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save route');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{route?.id ? 'Edit Route' : 'New Route'}</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Route Name</label>
            <input className="form-input" placeholder="e.g. Piassa - Kality" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Start Point</label>
            <input className="form-input" placeholder="e.g. Piassa" required value={form.startPoint}
              onChange={(e) => setForm({ ...form, startPoint: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">End Point</label>
            <input className="form-input" placeholder="e.g. Kality" required value={form.endPoint}
              onChange={(e) => setForm({ ...form, endPoint: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" /> Saving…</> : 'Save Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await routeService.getAll();
      const data = res.data;
      setRoutes(data.content ?? (Array.isArray(data) ? data : []));
    } catch { toast.error('Failed to load routes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this route?')) return;
    try {
      await routeService.delete(id);
      toast.success('Route deleted');
      load();
    } catch { toast.error('Failed to delete route'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Routes</h1>
          <p className="page-subtitle">Manage bus routes across the city</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('create')}><Plus size={16} /> Add Route</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : routes.length === 0 ? (
        <div className="empty-state">
          <Route size={48} />
          <h3>No routes yet</h3>
          <p>Create your first route to get started</p>
          <button className="btn btn-primary" onClick={() => setModal('create')}><Plus size={16} /> Add Route</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Route Name</th>
                <th>Start Point</th>
                <th>End Point</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--color-text-faint)' }}>{i + 1}</td>
                  <td><span style={{ fontWeight: 700 }}>{r.name}</span></td>
                  <td>{r.startPoint}</td>
                  <td>{r.endPoint}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                      <button className="btn btn-icon btn-ghost" onClick={() => setModal(r)}><Pencil size={14} /></button>
                      <button className="btn btn-icon btn-danger" onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <RouteModal
          route={modal === 'create' ? null : modal}
          onSave={() => { setModal(null); load(); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
