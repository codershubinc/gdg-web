import { handleGoogleCredential, getGoogleClientId, getCurrentUser } from '../services/auth.js';

(async () => {
    // Only show to logged-out users, once per session
    if (sessionStorage.getItem('gsi-popup-dismissed')) return;
    const user = await getCurrentUser();
    if (user) {
        // Logged in: show dashboard btn, hide join/google, hide nav google
        document.getElementById('hero-dashboard-btn').style.display = 'inline-flex';
        const ngb = document.getElementById('nav-google-btn');
        if (ngb) ngb.style.display = 'none';
        return;
    }

    // Logged out: show join + google buttons
    document.getElementById('hero-join-btn').style.display = 'inline-flex';
    document.getElementById('hero-google-btn').style.display = 'inline-flex';

    const popup = document.getElementById('gsi-popup');
    const btn = document.getElementById('gsi-popup-btn');
    const btnHTML = btn.innerHTML;
    const closeBtn = document.getElementById('gsi-popup-close');

    function dismiss() {
        popup.classList.remove('gsi-popup--show');
        sessionStorage.setItem('gsi-popup-dismissed', '1');
    }
    closeBtn.addEventListener('click', dismiss);

    async function initGSI() {
        if (typeof google === 'undefined' || !google?.accounts?.id) return;
        const clientId = await getGoogleClientId();
        if (!clientId) return;
        google.accounts.id.initialize({
            client_id: clientId,
            callback: async ({ credential }) => {
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner" style="width:14px;height:14px;border-width:2px"></span> Signing in…';
                try {
                    await handleGoogleCredential(credential);
                    sessionStorage.setItem('gsi-popup-dismissed', '1');
                    window.location.href = 'dashboard.html';
                } catch {
                    btn.disabled = false;
                    btn.innerHTML = btnHTML;
                }
            },
        });
        // Show popup after 4 seconds
        setTimeout(() => {
            popup.setAttribute('aria-hidden', 'false');
            popup.classList.add('gsi-popup--show');
        }, 4000);
    }

    btn.addEventListener('click', () => {
        if (typeof google !== 'undefined' && google?.accounts?.id) {
            google.accounts.id.prompt();
        } else {
            window.location.href = 'login.html';
        }
    });

    // Hero Google button — same flow
    const heroGoogleBtn = document.getElementById('hero-google-btn');
    if (heroGoogleBtn) {
        heroGoogleBtn.addEventListener('click', () => {
            if (typeof google !== 'undefined' && google?.accounts?.id) {
                google.accounts.id.prompt();
            } else {
                window.location.href = 'signup.html';
            }
        });
    }

    // Nav Google button — same flow
    const navGoogleBtn = document.getElementById('nav-google-btn');
    if (navGoogleBtn) {
        navGoogleBtn.addEventListener('click', () => {
            if (typeof google !== 'undefined' && google?.accounts?.id) {
                google.accounts.id.prompt();
            } else {
                window.location.href = 'signup.html';
            }
        });
    }

    if (document.readyState === 'complete') { initGSI(); }
    else { window.addEventListener('load', initGSI); }
})();
