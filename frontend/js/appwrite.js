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

// Backend URL — override via ?backend=http://host:port in the URL for local dev
// On production (Vercel) both frontend and backend share the same origin,
// so relative /api always works.
const _apiBase = (() => {
    if (typeof window === 'undefined') return '/api';
    // Allow developer override: ?backend=http://localhost:3001
    const param = new URLSearchParams(window.location.search).get('backend');
    if (param) return param.replace(/\/$/, '') + '/api';
    // Same-origin (production or running directly from port 3001)
    if (window.location.port === '3001' || window.location.port === '') return '/api';
    // Default: dev frontend on any other port → backend on :3001
    // Use the same hostname the browser used (127.0.0.1 vs localhost matters for CORS)
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

