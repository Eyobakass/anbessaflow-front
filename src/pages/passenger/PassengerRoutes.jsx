import { useEffect, useState } from 'react';
import { routeService } from '../../api/services';
import { useToast } from '../../context/ToastContext';
import { Route, MapPin, Search } from 'lucide-react';

export default function PassengerRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await routeService.getAll();
        const data = res.data;
        setRoutes(data.content ?? (Array.isArray(data) ? data : []));
      } catch { toast.error('Failed to load routes'); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = routes.filter(r => 
    r.name?.toLowerCase().includes(search.toLowerCase()) || 
    r.startPoint?.toLowerCase().includes(search.toLowerCase()) || 
    r.endPoint?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Available Routes</h1>
          <p className="page-subtitle">Find your destination across the city</p>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-6)', maxWidth: 400 }}>
        <div className="input-wrapper">
          <Search size={16} className="input-icon" />
          <input 
            className="form-input" 
            placeholder="Search by name or location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Route size={48} />
          <h3>No routes found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-3 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="card card-glow" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--font-size-md)' }}>{r.name}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>Route ID: {r.id}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)' }} />
                  <span style={{ color: 'var(--color-text-muted)' }}>From:</span>
                  <strong style={{ marginLeft: 'auto' }}>{r.startPoint}</strong>
                </div>
                <div style={{ borderLeft: '1px dashed var(--color-border)', height: 10, marginLeft: 3, margin: '2px 0 2px 3px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-error)' }} />
                  <span style={{ color: 'var(--color-text-muted)' }}>To:</span>
                  <strong style={{ marginLeft: 'auto' }}>{r.endPoint}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
