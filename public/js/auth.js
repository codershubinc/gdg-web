/**
 * auth.js — Login / Signup / Logout / Session
 * GDG Campus CSMU
 *
 * Handles all Appwrite authentication flows:
 *   - Email+Password signup & login
 *   - Google OAuth
 *   - Session check / logout
 *   - Avatar URL helper
 */

import {
  account, avatars, databases,
  APPWRITE_DB_ID, APPWRITE_USERS_COL,
  ID
} from './appwrite.js';

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
  failureUrl  = `${location.origin}/login.html`
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
