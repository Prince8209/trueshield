import axios from 'axios';

/**
 * Axios instance configured for TrueShield API
 * In development, Vite proxy forwards /api → localhost:5000
 * In production, set VITE_API_URL environment variable
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

/**
 * Request interceptor — attach JWT token if available
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('trueshield_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor — handle 401 (expired token)
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('trueshield_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
