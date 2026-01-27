/**
 * index-page.js — Renders all data-driven sections on index.html.
 * Must be loaded BEFORE main.js so IntersectionObserver picks up rendered elements.
 */
import {
    HERO_STATS, ORBIT_PILLS, ABOUT_CARDS, ABOUT_STATS,
    DOMAINS, TEAM, EVENTS,
} from '../data/site-data.js';
import { renderFooter } from '../components/footer.js';

/* ── tiny helpers ─────────────────────────────────────────────────────────── */
const h = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const iconSvg = {
    linkedin: `<svg width="16" height="16" aria-hidden="true"><use href="#icon-linkedin"/></svg>`,
    github: `<svg width="16" height="16" aria-hidden="true"><use href="#icon-github"/></svg>`,
    email: `<svg width="16" height="16" aria-hidden="true"><use href="#icon-email"/></svg>`,
};

/* ── hero stats ───────────────────────────────────────────────────────────── */
function renderHeroStats() {
    const el = document.getElementById('hero-stats');
    if (!el) return;
    el.innerHTML = HERO_STATS.flatMap((s, i) => {
        const divider = i < HERO_STATS.length - 1 ? '<div class="stat-divider"></div>' : '';
        return [`<div class="stat-item">
  <span class="stat-number" data-target="${s.target}" data-suffix="${s.suffix}">${s.target}${s.suffix || 0}</span>
  <span class="stat-label">${h(s.label)}</span>
</div>`, divider];
    }).join('');
}

/* ── orbit pills ──────────────────────────────────────────────────────────── */
function renderOrbitPills() {
    const visual = document.querySelector('.hero-visual');
    if (!visual) return;
    ORBIT_PILLS.forEach(p => {
        const div = document.createElement('div');
        div.className = `orbit-pill ${p.cls}`;
        div.innerHTML = `${p.label}<span class="pill-detail">${h(p.detail)}</span>`;
        visual.appendChild(div);
    });
}

/* ── about icon cards ─────────────────────────────────────────────────────── */
function renderAboutCards() {
    const el = document.getElementById('about-icon-grid');
    if (!el) return;
    el.innerHTML = ABOUT_CARDS.map(c => `
    <div class="about-icon-card ${c.cls}">
      <span class="icon">${c.icon}</span>
      <h4>${h(c.title)}</h4>
      <p>${h(c.desc)}</p>
    </div>`).join('');
}

/* ── about stats ──────────────────────────────────────────────────────────── */
function renderAboutStats() {
    const el = document.getElementById('about-stats');
    if (!el) return;
    el.innerHTML = ABOUT_STATS.map(s => `
    <div class="about-stat-card reveal delay-${s.delay}">
      <span class="about-stat-num" style="background:${s.gradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${h(s.value)}</span>
      <span class="about-stat-label">${h(s.label)}</span>
    </div>`).join('');
}

/* ── home event cards ─────────────────────────────────────────────────────── */
function renderHomeEvents() {
    const el = document.getElementById('events-grid');
    if (!el) return;
    el.innerHTML = EVENTS.map((e, i) => `
    <div class="event-card reveal delay-${i + 1}" data-category="${e.category}"
         data-title="${h(e.title)}"
         data-date="${e.homeDate}"
         data-loc="${h(e.homeLoc)}"
         data-desc="${h(e.homeDesc)}"
         data-tags="${e.homeTags.join(',')}">
      <div class="event-card-image">
        <div class="img-placeholder" style="background:${e.gradient}">
          <div class="ec-icon-wrap">
            <div class="ec-ring"></div>
            <div class="ec-ring ec-ring-2"></div>
            <div class="ec-glow"></div>
            <svg class="ec-svg" viewBox="0 0 64 64" fill="none">${e.svg}</svg>
          </div>
        </div>
        <span class="event-type-badge badge-${e.category}">${h(e.badgeLabel)}</span>
      </div>
      <div class="event-card-body">
        <div class="event-date-row">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          ${e.homeDate}
        </div>
        <h3 class="event-title">${h(e.title)}</h3>
      </div>
      <div class="event-hover-panel">
        <p class="ehp-desc">${h(e.homeDesc)}</p>
        <div class="ehp-tags">${e.homeTags.map(t => `<span>${h(t)}</span>`).join('')}</div>
        <div class="ehp-footer">
          <span class="ehp-loc">${h(e.homeLoc)}</span>
          <a href="events.html" class="ehp-btn">${h(e.homeCta)}</a>
        </div>
      </div>
    </div>`).join('');
}

/* ── domain cards ─────────────────────────────────────────────────────────── */
function renderDomains() {
    const el = document.getElementById('domains-grid');
    if (!el) return;
    el.innerHTML = DOMAINS.map(d => `
    <div class="domain-card reveal delay-${d.delay}">
      <span class="domain-icon">${d.icon}</span>
      <div class="domain-name">${h(d.name)}</div>
      <div class="domain-desc">${h(d.desc)}</div>
    </div>`).join('');
}

/* ── team cards ───────────────────────────────────────────────────────────── */
function renderTeam() {
    const el = document.getElementById('team-grid');
    if (!el) return;
    el.innerHTML = TEAM.map(m => `
    <div class="team-card reveal delay-${m.delay}">
      <div class="team-card-top" style="background:${m.topGradient}"></div>
      <div class="team-avatar" style="background:${m.avatarGradient}">
        <img src="${m.img}" alt="${h(m.name)}"
             onerror="this.style.display='none';this.parentElement.style.fontSize='1.8rem';this.parentElement.innerHTML='${m.initials}'">
      </div>
      <div class="team-card-body">
        <div class="team-name">${h(m.name)}</div>
        <div class="team-role" style="color:${m.roleColor}">${h(m.role)}</div>
        <div class="team-socials">
          ${m.socials.map(s => `
            <a href="${h(s.href)}" ${s.type !== 'email' ? 'target="_blank" rel="noopener"' : ''}
               class="team-social-btn" aria-label="${s.type}">${iconSvg[s.type]}</a>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

/* ── boot ─────────────────────────────────────────────────────────────────── */
renderHeroStats();
renderOrbitPills();
renderAboutCards();
renderAboutStats();
renderHomeEvents();
renderDomains();
renderTeam();
renderFooter();
