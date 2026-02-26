/**
 * dashboard.js — Profile & Dashboard
 * GDG Campus CSMU
 *
 * All data comes from the backend API (/api/auth/me, /api/user/*).
 * No Appwrite SDK usage here.
 */

import {
    getCurrentUser, logout, updateName, updatePassword,
    getAvatarURL, getCachedAvatarURL, refreshAvatarCache,
    setFormStatus, setButtonLoading,
    getGoogleClientId, syncGoogleAvatar,
} from './auth.js';
import { api } from './appwrite.js';

const QUIZ_COLORS = {
    javascript: '#FBBC04', python: '#4285F4', webdev: '#34A853',
    cloud: '#EA4335', android: '#34A853',
};
const QUIZ_ICONS = {
    javascript: '⚡', python: '🐍', webdev: '🌐', cloud: '☁️', android: '📱',
};
const QUIZ_NAMES = {
    javascript: 'JavaScript', python: 'Python', webdev: 'Web Dev',
    cloud: 'Cloud & GCP', android: 'Android',
};
const QUIZ_LABELS = {
    javascript: '⚡ JavaScript', python: '🐍 Python', webdev: '🌐 Web Dev',
    cloud: '☁️ Cloud & GCP', android: '📱 Android',
};

// ─── Navbar user state (runs on every page) ─────────────────────────────────

export async function initNavbarUserState() {
    const user = await getCurrentUser();
    const navCta = document.querySelector('.nav-cta');
    if (!navCta) return;

    if (user) {
        const avatarUrl = getCachedAvatarURL(user);
        const fallbackUrl = getAvatarURL(user.name);
        navCta.innerHTML = `
      <a href="dashboard.html" class="nav-user-btn" title="${user.name}" aria-label="My profile">
        <img src="${avatarUrl}" alt="${user.name}" class="nav-avatar"
             onerror="this.onerror=null;this.src='${fallbackUrl}'" />
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
        const cachedUrl = getCachedAvatarURL(user, 120);
        const fallbackUrl = getAvatarURL(user.name, 120);
        avatarEl.src = cachedUrl;
        avatarEl.alt = user.name;
        avatarEl.style.display = 'none';
        avatarEl.onload = () => {
            avatarEl.style.display = 'block';
            refreshAvatarCache(user.avatar);
            const ini = document.getElementById('user-initials');
            if (ini) ini.style.display = 'none';
        };
        avatarEl.onerror = () => {
            if (avatarEl.src !== fallbackUrl) {
                avatarEl.src = fallbackUrl;
            } else {
                avatarEl.style.display = 'none';
            }
        };
    }

    // Show sync-avatar card only if user has no avatar
    const syncCard = document.getElementById('sync-avatar-card');
    if (syncCard && !user.avatar) {
        syncCard.style.display = 'block';
        const syncBtn = document.getElementById('sync-avatar-btn');
        const syncBtnHTML = syncBtn.innerHTML;
        let gsiReady = false;

        async function initSyncGSI() {
            if (typeof google === 'undefined' || !google?.accounts?.id) return;
            const clientId = await getGoogleClientId();
            if (!clientId) return;
            google.accounts.id.initialize({
                client_id: clientId,
                callback: async ({ credential }) => {
                    syncBtn.disabled = true;
                    syncBtn.innerHTML = '<span class="spinner"></span> Syncing…';
                    try {
                        const updated = await syncGoogleAvatar(credential);
                        if (avatarEl && updated.avatar) {
                            avatarEl.src = updated.avatar;
                            avatarEl.style.display = 'block';
                            document.getElementById('user-initials').style.display = 'none';
                        }
                        syncCard.style.display = 'none';
                        setFormStatus(document.getElementById('update-name-form'), '✓ Google avatar synced!', false);
                    } catch (err) {
                        syncBtn.disabled = false;
                        syncBtn.innerHTML = syncBtnHTML;
                        setFormStatus(syncCard, err.message || 'Failed to sync avatar.', true);
                    }
                },
            });
            gsiReady = true;
        }

        initSyncGSI();
        window.addEventListener('load', initSyncGSI);

        syncBtn.addEventListener('click', () => {
            if (gsiReady && typeof google !== 'undefined') {
                google.accounts.id.prompt();
            } else {
                setFormStatus(syncCard, 'Google Sign-In is still loading, please try again.', true);
            }
        });
    }

    // Basic info — populate all IDs that reference name/email/role
    setText('user-name', user.name);
    setText('user-name-display', user.name);
    setText('user-email', user.email);
    setText('user-college', user.college || '—');
    setText('user-role', user.role || 'member');
    setText('user-role-display', user.role || 'member');
    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';
    setText('user-joined', joinedDate);

    // Welcome header + overview strip
    setText('dash-welcome-name', user.name.split(' ')[0]);
    const badge = document.getElementById('dash-welcome-badge');
    if (badge) badge.textContent = user.role || 'Member';
    setText('dash-ov-role', user.role || 'Member');
    setText('dash-ov-joined', user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
        : '—');

    // Logout btn
    document.getElementById('logout-btn')?.addEventListener('click', logout);

    // Update name form
    const nameForm = document.getElementById('update-name-form');
    if (nameForm) {
        nameForm.querySelector('input').value = user.name;
        nameForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = nameForm.querySelector('button[type=submit]');
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
            const btn = pwdForm.querySelector('button[type=submit]');
            const oldPwd = pwdForm.querySelector('#old-password').value;
            const newPwd = pwdForm.querySelector('#new-password').value;
            const confirm = pwdForm.querySelector('#confirm-password').value;
            if (newPwd !== confirm) { setFormStatus(pwdForm, 'Passwords do not match.', true); return; }
            if (newPwd.length < 8) { setFormStatus(pwdForm, 'Password must be at least 8 characters.', true); return; }
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

// ─── Dashboard quiz scores ────────────────────────────────────────────────────

export async function loadDashboardQuizScores() {
    const container = document.getElementById('dash-quiz-scores');
    if (!container) return;

    try {
        const [{ scores }, rankData] = await Promise.all([
            api.get('/quiz/scores'),
            api.get('/quiz/global-rank').catch(() => null),
        ]);

        if (!scores || scores.length === 0) {
            container.innerHTML = `
              <div class="dash-quiz-empty">
                <div class="dash-quiz-empty-icon">🧠</div>
                <h3>No quizzes attempted yet</h3>
                <p>Test your skills across JavaScript, Python, Cloud & more. Your best scores will appear here.</p>
                <a href="quiz.html" class="btn-auth" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;max-width:200px">⚡ Take a Quiz</a>
              </div>
            `;
            return;
        }

        // ── rank banner ──
        let rankBanner = '';
        if (rankData && rankData.rank) {
            const { rank, total, stats, top10 } = rankData;
            const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅';
            const top10Rows = (top10 || []).map((u, i) => {
                const isMe = u.name === (stats && stats.name);
                const rowMedal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${u.rank}`;
                return `
                  <div class="dash-lb-row${isMe ? ' dash-lb-row--me' : ''}">
                    <span class="dash-lb-rank">${rowMedal}</span>
                    <span class="dash-lb-name">${u.name}</span>
                    <span class="dash-lb-rating">${u.rating} pts</span>
                  </div>
                `;
            }).join('');

            rankBanner = `
              <div class="dash-rank-banner">
                <div class="dash-rank-left">
                  <span class="dash-rank-medal">${medalEmoji}</span>
                  <div>
                    <p class="dash-rank-label">Your Global Rank</p>
                    <p class="dash-rank-pos">#${rank} <span>of ${total}</span></p>
                  </div>
                  ${stats ? `<div class="dash-rank-rating">${stats.rating} <span>pts</span></div>` : ''}
                </div>
                <details class="dash-lb-details">
                  <summary>Top 10 Leaderboard</summary>
                  <div class="dash-lb-list">${top10Rows}</div>
                </details>
              </div>
            `;
        }

        container.innerHTML = `
          ${rankBanner}
          <div class="dash-quiz-grid">
            ${scores.map(s => {
            const pct = Math.round((s.score / s.total) * 100);
            const color = QUIZ_COLORS[s._id] || '#4285F4';
            const icon = QUIZ_ICONS[s._id] || '📝';
            const name = QUIZ_NAMES[s._id] || s._id;
            const grade = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '💪' : '📚';
            return `
                  <div class="dash-qscore-card" style="--qc:${color}">
                    <div class="dash-qscore-top">
                      <span class="dash-qscore-icon">${icon}</span>
                      <span class="dash-qscore-grade">${grade}</span>
                    </div>
                    <p class="dash-qscore-name">${name}</p>
                    <div class="dash-qscore-pct" style="color:${color}">${pct}<span>%</span></div>
                    <div class="dash-qscore-bar-wrap">
                      <div class="dash-qscore-bar" style="width:${pct}%;background:${color}"></div>
                    </div>
                    <p class="dash-qscore-meta">${s.score}/${s.total} correct · ${s.attempts} attempt${s.attempts === 1 ? '' : 's'}</p>
                    <a href="quiz.html" class="dash-qscore-retry">Play again →</a>
                  </div>
                `;
        }).join('')}
          </div>
          <div style="margin-top:20px;text-align:right">
            <a href="quiz.html" class="btn-auth" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;max-width:180px">⚡ More Quizzes</a>
          </div>
        `;
    } catch {
        container.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;padding:16px">Could not load scores.</p>`;
    }
}
