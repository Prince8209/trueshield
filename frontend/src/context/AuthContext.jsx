import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a configured Axios instance
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('trueshield_token'));
  const [loading, setLoading] = useState(true);

  // Sync token to axios on mount or token change
  useEffect(() => {
    if (token) {
      localStorage.setItem('trueshield_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      localStorage.removeItem('trueshield_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setUser(res.data.data);
    } catch (err) {
      console.error('Session expired or invalid token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
