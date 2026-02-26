/**
 * auth.js — Login / Signup / Logout / Session
 * GDG Campus CSMU
 *
 * All authentication is handled by the backend REST API (JWT + MongoDB).
 * The JWT is stored in an httpOnly cookie by the server — this file never
 * reads or writes the token directly.
 *
 * API endpoints:
 *   GET  /api/auth/me        — get current user
 *   POST /api/auth/register  — create account
 *   POST /api/auth/login     — login
 *   POST /api/auth/logout    — invalidate session cookie
 *   PATCH /api/user/name     — update display name
 *   PATCH /api/user/password — change password
 */

import { api } from './appwrite.js';

// ─── Session ─────────────────────────────────────────────────────────────────

export async function getCurrentUser() {
    try {
        const { user } = await api.get('/auth/me');
        return user;
    } catch {
        return null;
    }
}

export async function redirectIfLoggedIn(dest = 'dashboard.html') {
    const user = await getCurrentUser();
    if (user) window.location.href = dest;
}

export async function requireAuth(dest = 'login.html') {
    const user = await getCurrentUser();
    if (!user) window.location.href = dest;
    return user;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export function getAvatarURL(name = 'GDG User', size = 80) {
    const encoded = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encoded}&size=${size}&background=4285F4&color=fff&bold=true&rounded=true`;
}

// Returns a cached avatar URL (localStorage, 24hr TTL).
// Falls back to ui-avatars if the original URL is unavailable.
const AVATAR_CACHE_KEY = 'gdg_avatar';
const AVATAR_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function getCachedAvatarURL(user, size = 80) {
    const fallback = getAvatarURL(user?.name || 'GDG User', size);
    if (!user?.avatar) return fallback;

    try {
        const raw = localStorage.getItem(AVATAR_CACHE_KEY);
        if (raw) {
            const cached = JSON.parse(raw);
            if (cached.url === user.avatar && Date.now() - cached.ts < AVATAR_CACHE_TTL) {
                return cached.dataUrl || cached.url;
            }
        }
        // Cache miss — store the remote URL with a timestamp
        localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify({ url: user.avatar, ts: Date.now() }));
    } catch { /* storage unavailable — use live URL */ }

    return user.avatar;
}

// Call this after a successful avatar load to store the result and extend TTL.
export function refreshAvatarCache(remoteUrl) {
    if (!remoteUrl) return;
    try {
        const raw = localStorage.getItem(AVATAR_CACHE_KEY);
        const cached = raw ? JSON.parse(raw) : {};
        localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify({ ...cached, url: remoteUrl, ts: Date.now() }));
    } catch { /* ignore */ }
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp(name, email, password, college = '') {
    const { user } = await api.post('/auth/register', { name, email, password, college });
    return user;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(email, password) {
    const { user } = await api.post('/auth/login', { email, password });
    return user;
}

// ─── Google OAuth ───────────────────────────────────────────────────────────────
// Called by the GSI callback after Google verifies the user and returns a credential.
// Sends the ID token to the backend, which verifies it with Google, then issues a
// JWT session cookie and returns the user object.

export async function handleGoogleCredential(credential) {
    const { user } = await api.post('/auth/google', { credential });
    return user;
}
// Fetches the Google OAuth Client ID from the backend config endpoint.
export async function getGoogleClientId() {
    try {
        const { googleClientId } = await api.get('/auth/config');
        return googleClientId;
    } catch {
        return null;
    }
}

// Syncs the Google profile picture to the user's avatar.
// Passes a fresh GSI credential to the backend which verifies and saves the picture.
export async function syncGoogleAvatar(credential) {
    const { user } = await api.patch('/user/sync-avatar', { credential });
    return user;
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    window.location.href = 'login.html';
}

// ─── Profile updates ─────────────────────────────────────────────────────────

export async function updateName(newName) {
    const { user } = await api.patch('/user/name', { name: newName });
    return user;
}

export async function updatePassword(newPassword, oldPassword) {
    return api.patch('/user/password', { oldPassword, newPassword });
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

export function setFormStatus(form, msg, isError = false) {
    let el = form.querySelector('.auth-status');
    if (!el) {
        el = document.createElement('p');
        el.className = 'auth-status';
        form.prepend(el);
    }
    el.style.cssText = `
        padding: 12px 16px;
        border-radius: 10px;
        margin-bottom: 16px;
        font-size: 0.875rem;
        font-weight: 500;
        background: ${isError ? 'rgba(234,67,53,0.12)' : 'rgba(52,168,83,0.12)'};
        border: 1px solid ${isError ? 'rgba(234,67,53,0.3)' : 'rgba(52,168,83,0.3)'};
        color: ${isError ? '#EA4335' : '#34A853'};
    `;
    el.textContent = msg;
}

export function setButtonLoading(btn, loading, defaultText = 'Submit') {
    btn.disabled = loading;
    btn.textContent = loading ? 'Please wait…' : defaultText;
}
