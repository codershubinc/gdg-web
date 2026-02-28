import { signUp, handleGoogleCredential, getGoogleClientId, redirectIfLoggedIn } from '../services/auth.js';

await redirectIfLoggedIn('dashboard.html');

/* ── status banner ── */
const statusEl = document.getElementById('status-msg');
const statusTxt = document.getElementById('status-text');
const statusSvg = statusEl.querySelector('svg');

const SVG_ERROR = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
const SVG_SUCCESS = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>';

function showStatus(msg, isError = false) {
    statusEl.className = 'auth-status-msg';
    void statusEl.offsetWidth;
    statusEl.className = 'auth-status-msg show ' + (isError ? 'error' : 'success');
    statusSvg.innerHTML = isError ? SVG_ERROR : SVG_SUCCESS;
    statusTxt.textContent = msg;
}

function friendlyError(err) {
    if (!navigator.onLine) return 'No internet connection. Check your network.';
    const m = err?.message || '';
    if (m.includes('Failed to fetch') || m.includes('NetworkError') || m.includes('Load failed'))
        return 'Something went wrong. Please try again.';
    if (m.toLowerCase().includes('already exists'))
        return 'An account with this email already exists. Try signing in instead.';
    if (m.includes('429'))
        return 'Too many attempts. Please wait a moment and try again.';
    return m || 'Something went wrong. Please try again.';
}

function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.innerHTML = loading
        ? '<span class="spinner"></span> Creating account…'
        : 'Create Account';
}

/* ── clear banner when user starts typing ── */
document.getElementById('signup-form').addEventListener('input', () => {
    if (statusEl.classList.contains('show')) statusEl.className = 'auth-status-msg';
}, { passive: true });

/* ── password toggle helpers ── */
function makeToggle(btnId, inputId, showId, hideId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    btn.addEventListener('click', () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        document.getElementById(showId).style.display = show ? 'none' : '';
        document.getElementById(hideId).style.display = show ? '' : 'none';
    });
}
makeToggle('pw-toggle-1', 'password', 'eye-show-1', 'eye-hide-1');
makeToggle('pw-toggle-2', 'confirm-password', 'eye-show-2', 'eye-hide-2');

/* ── password strength ── */
const pwInput = document.getElementById('password');
const bars = [1, 2, 3, 4].map(i => document.getElementById('sb' + i));
const lblEl = document.getElementById('pw-strength-label');
const strengthMap = [
    { label: '', cls: '' },
    { label: 'Weak', cls: 'filled-1' },
    { label: 'Fair', cls: 'filled-2' },
    { label: 'Good', cls: 'filled-3' },
    { label: 'Strong', cls: 'filled-4' },
];
pwInput.addEventListener('input', () => {
    const v = pwInput.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    bars.forEach((b, i) => {
        b.className = 'pw-strength-bar' + (i < score ? ' ' + strengthMap[score].cls : '');
    });
    lblEl.textContent = strengthMap[score].label;
    lblEl.className = 'pw-strength-label ' + strengthMap[score].cls;
});

/* ── confirm password match ── */
const confirmInput = document.getElementById('confirm-password');
const matchMsg = document.getElementById('pw-match-msg');
confirmInput.addEventListener('input', () => {
    if (!confirmInput.value) { matchMsg.textContent = ''; return; }
    const ok = confirmInput.value === pwInput.value;
    matchMsg.textContent = ok ? '✓ Passwords match' : '✗ Passwords don\u2019t match';
    matchMsg.className = 'pw-match-msg ' + (ok ? 'ok' : 'err');
});

/* ── form submit ── */
const form = document.getElementById('signup-form');
const btn = document.getElementById('signup-submit');

form.addEventListener('submit', async e => {
    e.preventDefault();
    statusEl.className = 'auth-status-msg';
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const college = document.getElementById('college').value.trim();
    const password = pwInput.value;
    const confirm = confirmInput.value;
    const terms = document.getElementById('terms').checked;

    if (!name || !email || !password) { showStatus('Please fill in all required fields.', true); return; }
    if (password.length < 8) { showStatus('Password must be at least 8 characters.', true); return; }
    if (password !== confirm) { showStatus('Passwords do not match.', true); return; }
    if (!terms) { showStatus('Please agree to the terms of service.', true); return; }

    setLoading(btn, true);
    try {
        await signUp(name, email, password, college);
        showStatus('✓ Account created! Redirecting…');
        setTimeout(() => window.location.href = 'dashboard.html', 900);
    } catch (err) {
        showStatus(friendlyError(err), true);
        setLoading(btn, false);
    }
});

/* ── Google OAuth ── */
const googleBtn = document.getElementById('google-btn');
const googleBtnHTML = googleBtn.innerHTML;

async function initGSI() {
    if (typeof google === 'undefined' || !google?.accounts?.id) return;
    const clientId = await getGoogleClientId();
    if (!clientId) return;
    google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
            googleBtn.disabled = true;
            googleBtn.innerHTML = '<span class="spinner"></span> Signing in with Google…';
            try {
                await handleGoogleCredential(credential);
                showStatus('✓ Account created via Google! Redirecting…');
                setTimeout(() => window.location.href = 'dashboard.html', 900);
            } catch (err) {
                showStatus(friendlyError(err), true);
                googleBtn.disabled = false;
                googleBtn.innerHTML = googleBtnHTML;
            }
        },
    });
}

initGSI();
window.addEventListener('load', initGSI);

googleBtn.addEventListener('click', () => {
    if (typeof google !== 'undefined' && google?.accounts?.id) {
        google.accounts.id.prompt();
    } else {
        showStatus('Google Sign-In is still loading, please try again in a moment.', true);
    }
});

/* ── Brand word morph ── */
(function () {
    const el = document.getElementById('brand-morphword');
    if (!el) return;
    const words = ['Builds.', 'Learns.', 'Grows.', 'Connects.', 'Creates.'];
    const colors = ['#4285F4', '#34A853', '#34A853', '#FBBC04', '#EA4335'];
    let wi = 0;
    function next() {
        el.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease';
        el.style.transform = 'translateY(-110%)';
        el.style.opacity = '0';
        setTimeout(() => {
            wi = (wi + 1) % words.length;
            el.textContent = words[wi];
            el.style.color = colors[wi];
            el.style.transition = 'none';
            el.style.transform = 'translateY(70%)';
            el.style.opacity = '0';
            requestAnimationFrame(() => requestAnimationFrame(() => {
                el.style.transition = 'transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.38s ease';
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
            }));
        }, 380);
    }
    setInterval(next, 2800);
})();
