import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Lock, User, Bus } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'PASSENGER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🚌</div>
          <h1 className="auth-hero-title">Join AnbesaFlow</h1>
          <p className="auth-hero-subtitle">Get started with smart<br />bus queue management</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-container">
          <div className="auth-logo">
            <div className="auth-logo-icon"><Bus size={24} color="#fff" /></div>
            <div>
              <div className="auth-title">Create account</div>
              <div className="auth-subtitle">Join the AnbesaFlow network</div>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} id="register-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Abebe Bekele"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">I am registering as</label>
              <select id="reg-role" name="role" className="form-select" value={form.role} onChange={handleChange}>
                <option value="PASSENGER">Passenger</option>
                <option value="OPERATOR">Bus Operator</option>
              </select>
            </div>

            <button id="register-submit" type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" />Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
