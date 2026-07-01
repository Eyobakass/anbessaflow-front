import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check expiry
        if (decoded.exp * 1000 > Date.now()) {
          const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
          setUser({ ...decoded, ...savedUser, token });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    const token = data.token || data.accessToken || data.jwt;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    const userData = { ...decoded, ...data, token };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (registrationData) => {
    const { data } = await authService.register(registrationData);
    return data;
  };

  const logout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const getRole = () => {
    if (!user) return null;
    // JWT role can be in different fields
    return (user.role || user.roles?.[0] || user.authorities?.[0]?.authority || '').replace('ROLE_', '');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
