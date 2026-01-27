/**
 * footer.js — Renders the shared site footer.
 * Call renderFooter({ eventsPage: true }) on events.html to adjust anchor links.
 */
export function renderFooter({ eventsPage = false } = {}) {
    const el = document.querySelector('footer');
    if (!el) return;

    const base = eventsPage ? 'index.html' : '';

    const dots = '<div class="logo-dot"></div>'.repeat(4);

    el.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-logo" style="margin-bottom:0">
          <div class="logo-dots">${dots}</div>
          <span class="logo-text">GDG <span>Campus</span> CSMU</span>
        </a>
        <p>A community of passionate developers at Chandigarh State Medical University, powered by Google Developer Groups.</p>
        <div class="footer-social">
          <a href="https://www.linkedin.com/company/google-developer-group-on-campus-csmu/" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
          <a href="https://www.instagram.com/gdgoncampus.csmu" target="_blank" rel="noopener" aria-label="Instagram">📸</a>
          <a href="https://developers.google.com/community/gdg" target="_blank" rel="noopener" aria-label="GDG">G</a>
          <a href="mailto:gdgoc.csmu@gmail.com" aria-label="Email">✉</a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Navigate</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="${base}#about">About</a></li>
          <li><a href="events.html">Events</a></li>
          <li><a href="${base}#team">Team</a></li>
          <li><a href="${base}#domains">Domains</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Community</h4>
        <ul>
          <li><a href="signup.html">Join GDG</a></li>
          <li><a href="#">Become a Speaker</a></li>
          <li><a href="#">Sponsor Us</a></li>
          <li><a href="#">Volunteer</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Resources</h4>
        <ul>
          <li><a href="#">Google for Developers</a></li>
          <li><a href="#">Google Codelabs</a></li>
          <li><a href="#">Study Jams</a></li>
          <li><a href="#">Code of Conduct</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 GDG Campus CSMU. Made with ❤️ by the community.</p>
      <div class="gdg-colors-bar">
        <span style="background:var(--google-blue)"></span>
        <span style="background:var(--google-red)"></span>
        <span style="background:var(--google-yellow)"></span>
        <span style="background:var(--google-green)"></span>
      </div>
    </div>`;
}
