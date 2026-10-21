const DEFAULT_API_BASE = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:8080'
    : '';

export const API_BASE = import.meta.env.VITE_API_BASE || DEFAULT_API_BASE || '';

export const apiUrl = (path) => {
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return `${API_BASE}${path}`;
};

export const jsonHeaders = { 'Content-Type': 'application/json' };
