import { login, handleGoogleCredential, getGoogleClientId, redirectIfLoggedIn } from '../services/auth.js';

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
    if (m.toLowerCase().includes('invalid email or password'))
        return 'Incorrect email or password. Please try again.';
    if (m.includes('429'))
        return 'Too many attempts. Please wait a moment and try again.';
    return m || 'Something went wrong. Please try again.';
}

function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.innerHTML = loading
        ? '<span class="spinner"></span> Signing in…'
        : 'Sign In';
}

/* ── clear banner when user starts typing ── */
document.getElementById('login-form').addEventListener('input', () => {
    if (statusEl.classList.contains('show')) statusEl.className = 'auth-status-msg';
}, { passive: true });

/* ── password toggle ── */
const pwInput = document.getElementById('password');
document.getElementById('pw-toggle').addEventListener('click', () => {
    const show = pwInput.type === 'password';
    pwInput.type = show ? 'text' : 'password';
    document.getElementById('eye-show').style.display = show ? 'none' : '';
    document.getElementById('eye-hide').style.display = show ? '' : 'none';
});

/* ── form submit ── */
const form = document.getElementById('login-form');
const btn = document.getElementById('login-submit');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = pwInput.value;

    if (!email) { showStatus('Please enter your email address.', true); return; }
    if (!password) { showStatus('Please enter your password.', true); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { showStatus('Please enter a valid email address.', true); return; }

    setLoading(btn, true);
    try {
        await login(email, password);
        showStatus('✓ Signed in! Redirecting…');
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
                showStatus('✓ Signed in with Google! Redirecting…');
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
    const words = ['Build.', 'Learn.', 'Grow.', 'Connect.', 'Create.'];
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
