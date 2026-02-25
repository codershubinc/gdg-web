/**
 * api.js (was appwrite.js — kept same filename to preserve all imports)
 *
 * Thin fetch wrapper for the GDG backend REST API.
 * Auth state is maintained via httpOnly JWT cookies set by the server —
 * the frontend never touches the token directly.
 *
 * Usage (in auth.js, dashboard.js, etc.):
 *   import { api } from './appwrite.js';
 *   const { user } = await api.get('/auth/me');
 *   const { user } = await api.post('/auth/login', { email, password });
 */

const BASE = '/api';

// When frontend is served separately (different port than backend),
// point API calls to the backend directly.
// Backend default port is 3001; frontend default port is 3000.
const _apiBase = (() => {
    if (typeof window === 'undefined') return BASE;
    // If served by the backend itself, use relative path
    if (window.location.port === '3001' || window.location.port === '') return BASE;
    // Otherwise (e.g. frontend dev server on :3000) point to backend
    return `${window.location.protocol}//${window.location.hostname}:3001/api`;
})();

async function _request(method, path, body) {
    const opts = {
        method,
        credentials: 'include',            // send/receive httpOnly cookies
        headers: { 'Content-Type': 'application/json' },
    };
    if (body !== undefined) opts.body = JSON.stringify(body);

    const res = await fetch(_apiBase + path, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
}

export const api = {
    get: (path) => _request('GET', path),
    post: (path, body) => _request('POST', path, body),
    patch: (path, body) => _request('PATCH', path, body),
    delete: (path) => _request('DELETE', path),
};

