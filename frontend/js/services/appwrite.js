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

// Production API domain
const PROD_API = 'https://gdg-api.codershubinc.com/api';

// Backend URL resolution:
//   1. ?backend=<url>   → developer override
//   2. localhost / 127.0.0.1 on port 3001 → relative /api (same-origin local server)
//   3. localhost / 127.0.0.1 on any other port → http://localhost:3001/api
//   4. Any real domain (online) → PROD_API
const _apiBase = (() => {
    if (typeof window === 'undefined') return '/api';
    // Developer override via query param
    const param = new URLSearchParams(window.location.search).get('backend');
    if (param) return param.replace(/\/$/, '') + '/api';
    const { hostname, port } = window.location;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isLocal) return PROD_API;                          // online → production API
    if (port === '3001' || port === '') return '/api';       // same-origin local
    // Dev static server (e.g. Live Server on :5500) → local backend
    return `${window.location.protocol}//${hostname}:3001/api`;
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

