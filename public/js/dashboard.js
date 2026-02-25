/**
 * dashboard.js — Profile & Dashboard
 * GDG Campus CSMU
 *
 * Handles:
 *  - Rendering the logged-in user's info & avatar
 *  - Updating display name
 *  - Updating password
 *  - Logout
 *  - Updating navbar across all pages when logged in
 */

import {
  getCurrentUser, logout, updateName, updatePassword,
  getAvatarURL, setFormStatus, setButtonLoading
} from './auth.js';
import { databases, APPWRITE_DB_ID, APPWRITE_USERS_COL } from './appwrite.js';

// ─── Navbar user state (runs on every page) ─────────────────────────────────

export async function initNavbarUserState() {
  const user = await getCurrentUser();
  const navCta = document.querySelector('.nav-cta');
  if (!navCta) return;

  if (user) {
    const avatarUrl = getAvatarURL(user.name);
    navCta.innerHTML = `
      <a href="dashboard.html" class="nav-user-btn" title="${user.name}" aria-label="My profile">
        <img src="${avatarUrl}" alt="${user.name}" class="nav-avatar" />
        <span class="nav-username">${user.name.split(' ')[0]}</span>
      </a>
      <button class="btn btn-ghost" id="nav-logout-btn">Sign Out</button>
    `;
    document.getElementById('nav-logout-btn')?.addEventListener('click', logout);
  }
}

// ─── Dashboard page init ─────────────────────────────────────────────────────

export async function initDashboard() {
  const user = await getCurrentUser();
  if (!user) { window.location.href = 'login.html'; return; }

  // Avatar + initials
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  setText('user-initials', initials);
  const avatarEl = document.getElementById('user-avatar');
  if (avatarEl) {
    avatarEl.src = getAvatarURL(user.name, 120);
    avatarEl.alt = user.name;
    avatarEl.style.display = 'none'; // show only after load
    avatarEl.onload = () => {
      avatarEl.style.display = 'block';
      const ini = document.getElementById('user-initials');
      if (ini) ini.style.display = 'none';
    };
    avatarEl.onerror = () => { avatarEl.style.display = 'none'; };
  }

  // Basic info — populate all IDs that reference name/email/role
  setText('user-name',         user.name);
  setText('user-name-display', user.name);
  setText('user-email',        user.email);

  // Load extra profile from DB
  try {
    const doc = await databases.getDocument(APPWRITE_DB_ID, APPWRITE_USERS_COL, user.$id);
    setText('user-college',      doc.college || '—');
    setText('user-role',         doc.role    || 'member');
    setText('user-role-display', doc.role    || 'member');
    setText('user-joined',  doc.joinedAt ? new Date(doc.joinedAt).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' }) : '—');
  } catch {
    // Document may not exist for OAuth users, that's fine
    setText('user-role',         'member');
    setText('user-role-display', 'member');
  }

  // Logout btn
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  // Update name form
  const nameForm = document.getElementById('update-name-form');
  if (nameForm) {
    nameForm.querySelector('input').value = user.name;
    nameForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn  = nameForm.querySelector('button[type=submit]');
      const name = nameForm.querySelector('input').value.trim();
      if (!name) return;
      setButtonLoading(btn, true, 'Update Name');
      try {
        await updateName(name);
        setFormStatus(nameForm, '✓ Name updated successfully!');
        setText('user-name', name);
        setText('user-name-display', name);
        const av = document.getElementById('user-avatar');
        if (av) av.src = getAvatarURL(name, 120);
      } catch (err) {
        setFormStatus(nameForm, err.message, true);
      } finally {
        setButtonLoading(btn, false, 'Update Name');
      }
    });
  }

  // Change password form
  const pwdForm = document.getElementById('update-password-form');
  if (pwdForm) {
    pwdForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn     = pwdForm.querySelector('button[type=submit]');
      const oldPwd  = pwdForm.querySelector('#old-password').value;
      const newPwd  = pwdForm.querySelector('#new-password').value;
      const confirm = pwdForm.querySelector('#confirm-password').value;
      if (newPwd !== confirm) { setFormStatus(pwdForm, 'Passwords do not match.', true); return; }
      if (newPwd.length < 8)  { setFormStatus(pwdForm, 'Password must be at least 8 characters.', true); return; }
      setButtonLoading(btn, true, 'Update Password');
      try {
        await updatePassword(newPwd, oldPwd);
        setFormStatus(pwdForm, '✓ Password updated! Please log in again.');
        setTimeout(logout, 2000);
      } catch (err) {
        setFormStatus(pwdForm, err.message, true);
      } finally {
        setButtonLoading(btn, false, 'Update Password');
      }
    });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
