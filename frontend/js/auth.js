/**
 * auth.js — Login / Signup / Logout / Session
 * GDG Campus CSMU
 *
 * All authentication is handled by the backend REST API (JWT + MongoDB).
 * The JWT is stored in an httpOnly cookie by the server — this file never
 * reads or writes the token directly.
 *
 * API endpoints used:
 *   GET  /api/auth/me        — get current user
 *   POST /api/auth/register  — create account
 *   POST /api/auth/login     — login
 *   POST /api/auth/logout    — invalidate session cookie
 */

import { api } from './appwrite.js';

// ─── Session helpers ────────────────────────────────────────────────────────

/** Returns the current logged-in user object, or null if not authenticated. */
export async function getCurrentUser() {
    try {
        const { user } = await api.get('/auth/me');
        return user;
    } catch {
        return null;
    }
}

/** Redirect to `dest` if the user is already logged in. */
export async function redirectIfLoggedIn(dest = 'dashboard.html') {
    const user = await getCurrentUser();
    if (user) window.location.href = dest;
}

/** Redirect to `dest` if the user is NOT logged in. Returns user if valid. */
export async function requireAuth(dest = 'login.html') {
    const user = await getCurrentUser();
    if (!user) window.location.href = dest;
    return user;
}

// ─── Avatar URL ──────────────────────────────────────────────────────────────

/**
 * Returns a colourful initials avatar URL (uses ui-avatars.com — free, no key).
 * Falls back gracefully if the service is unavailable.
 */
export function getAvatarURL(name = 'GDG User', size = 80) {
    const encoded = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encoded}&size=${size}&background=4285F4&color=fff&bold=true&rounded=true`;
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

/**
 * Register a new account. On success the server sets a JWT cookie
 * and returns the user object.
 */
export async function signUp(name, email, password, college = '') {
    const { user } = await api.post('/auth/register', { name, email, password, college });
    return user;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(email, password) {
    const { user } = await api.post('/auth/login', { email, password });
    return user;
}

// ─── Google OAuth (stub) ──────────────────────────────────────────────────────

/** Google OAuth is not yet wired up. Shows a friendly notice. */
export function loginWithGoogle() {
    alert('Google sign-in is coming soon! Please use email & password for now.');
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
    await api.post('/auth/logout');
    window.location.href = 'login.html';
}

// ─── Update Profile ───────────────────────────────────────────────────────────

export async function updateName(newName) {
    const { user } = await api.patch('/user/name', { name: newName });
    return user;
}

export async function updatePassword(newPassword, oldPassword) {
    return api.patch('/user/password', { oldPassword, newPassword });
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

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


// ─── Session helpers ────────────────────────────────────────────────────────

/** Returns the current logged-in user or null */
export async function getCurrentUser() {
    try {
        return await account.get();
    } catch {
        return null;
    }
}

/** Redirect to dashboard if already logged in */
export async function redirectIfLoggedIn(dest = 'dashboard.html') {
    const user = await getCurrentUser();
    if (user) window.location.href = dest;
}

/** Redirect to login if NOT logged in */
export async function requireAuth(dest = 'login.html') {
    const user = await getCurrentUser();
    if (!user) window.location.href = dest;
    return user;
}

// ─── Get avatar URL ─────────────────────────────────────────────────────────

/**
 * Returns a colourful avatar URL for the given name using Appwrite's
 * built-in initials avatar generator.
 */
export function getAvatarURL(name = 'GDG User', size = 80) {
    return avatars.getInitials(name, size, size);
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────

/**
 * Create a new account with email/password, then store profile in DB.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} college  - optional college / branch info
 */
export async function signUp(name, email, password, college = '') {
    // 1. Create Appwrite account
    const user = await account.create(ID.unique(), email, password, name);

    // 2. Auto-login
    await account.createEmailPasswordSession(email, password);

    // 3. Store extra profile data in database
    try {
        await databases.createDocument(
            APPWRITE_DB_ID,
            APPWRITE_USERS_COL,
            user.$id,
            {
                name,
                email,
                college,
                role: 'member',
                joinedAt: new Date().toISOString(),
            }
        );
    } catch (dbErr) {
        // Non-fatal — auth still succeeded
        console.warn('Profile DB write failed:', dbErr.message);
    }

    return user;
}

// ─── Login ───────────────────────────────────────────────────────────────────

/**
 * Login with email and password.
 */
export async function login(email, password) {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

/**
 * Kick off Google OAuth flow.
 * Appwrite will redirect back to `successUrl` after authentication.
 */
export function loginWithGoogle(
    successUrl = `${location.origin}/dashboard.html`,
    failureUrl = `${location.origin}/login.html`
) {
    account.createOAuth2Session('google', successUrl, failureUrl);
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
    await account.deleteSession('current');
    window.location.href = 'login.html';
}

// ─── Update Profile ──────────────────────────────────────────────────────────

export async function updateName(newName) {
    return account.updateName(newName);
}

export async function updatePassword(newPassword, oldPassword) {
    return account.updatePassword(newPassword, oldPassword);
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

/**
 * Show a status message inside a `.auth-status` element adjacent to `form`.
 */
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

/**
 * Set the loading state on the submit button.
 */
export function setButtonLoading(btn, loading, defaultText = 'Submit') {
    btn.disabled = loading;
    btn.textContent = loading ? 'Please wait…' : defaultText;
}
