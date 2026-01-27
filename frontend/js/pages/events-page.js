/**
 * events-page.js — Renders data-driven sections on events.html.
 * Must be loaded BEFORE main.js.
 */
import { EVENTS, PAST_EVENTS, EVENTS_STATS, EVENTS_FILTERS } from '../data/site-data.js';
import { renderFooter } from '../components/footer.js';

/* ── helpers ──────────────────────────────────────────────────────────────── */
const h = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const ICONS = {
    cal: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
    pin: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>`,
    people: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    laptop: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
};

/* ── stats bar ────────────────────────────────────────────────────────────── */
function renderStatsBar() {
    const el = document.querySelector('.events-stats-bar');
    if (!el) return;
    el.innerHTML = EVENTS_STATS.map(s => `
    <div class="event-stat-item">
      <span class="event-stat-num"
        style="background:${s.gradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${h(s.value)}</span>
      <span class="event-stat-label">${h(s.label)}</span>
    </div>`).join('');
}

/* ── filter buttons ───────────────────────────────────────────────────────── */
function renderFilters() {
    const el = document.querySelector('.filter-bar');
    if (!el) return;
    el.innerHTML = EVENTS_FILTERS.map(f => `
    <button class="filter-btn${f.active ? ' active' : ''}" data-filter="${f.value}">${h(f.label)}</button>`
    ).join('');
}

/* ── icon-wrap fragment shared by both card types ─────────────────────────── */
const iconWrap = (svg, glowStyle = '') =>
    `<div class="ec-icon-wrap">
    <div class="ec-ring"></div>
    <div class="ec-ring ec-ring-2"></div>
    <div class="ec-glow"${glowStyle}></div>
    <svg class="ec-svg" viewBox="0 0 64 64" fill="none">${svg}</svg>
  </div>`;

/* ── upcoming event card ──────────────────────────────────────────────────── */
function upcomingCard(e, delay) {
    const infoHtml = e.info.map(row =>
        `<div class="event-info-item">${ICONS[row.icon]}${h(row.text)}</div>`
    ).join('');

    const avatarsHtml = e.avatars.map(a =>
        `<div class="attendee-avatar" style="background:${a.color}">${a.l}</div>`
    ).join('');

    return `
  <div class="event-card-big reveal delay-${delay}" data-category="${e.category}">
    <div class="event-img-big" style="background:${e.gradient}">
      ${iconWrap(e.svg)}
    </div>
    <span class="event-type-badge badge-${e.category}" style="position:absolute;top:14px;left:14px;">${h(e.badgeLabel)}</span>
    <div class="event-body-big">
      <h3 class="event-title-big">${h(e.title)}</h3>
      <p class="event-desc-big">${h(e.desc)}</p>
      <div class="event-info-row">${infoHtml}</div>
      <div class="event-tags">${e.tags.map(t => `<span class="event-tag">${h(t)}</span>`).join('')}</div>
      <div class="event-footer-big">
        <div class="attendees-pill">
          <div class="attendee-avatars">${avatarsHtml}</div>
          ${h(e.count)}
        </div>
      </div>
    </div>
  </div>`;
}

/* ── past event card ──────────────────────────────────────────────────────── */
function pastCard(e, delay) {
    return `
  <div class="event-card-big past-card reveal delay-${delay}" data-category="${e.category}">
    <div class="event-img-big" style="background:${e.gradient}">
      ${iconWrap(e.svg, ` style="background:${e.glowColor}"`)}
    </div>
    <span class="event-type-badge badge-${e.category}" style="position:absolute;top:14px;left:14px;">${h(e.badgeLabel)}</span>
    <span class="past-badge">Completed</span>
    <div class="event-body-big">
      <h3 class="event-title-big">${h(e.title)}</h3>
      <p class="event-desc-big">${h(e.desc)}</p>
      <div class="event-info-row">
        <div class="event-info-item">${ICONS.cal}${h(e.date)}</div>
      </div>
      <div class="event-tags">${e.tags.map(t => `<span class="event-tag">${h(t)}</span>`).join('')}</div>
      <div class="event-footer-big">
        <span style="font-size:0.78rem;color:rgba(255,255,255,0.35)">${h(e.footerText)}</span>
      </div>
    </div>
  </div>`;
}

/* ── render grids ─────────────────────────────────────────────────────────── */
function renderUpcoming() {
    const el = document.getElementById('upcoming-events-grid');
    if (!el) return;
    // Delays cycle 1-3 to match original HTML pattern
    const delays = [1, 2, 3, 1, 2, 3];
    el.innerHTML = EVENTS.map((e, i) => upcomingCard(e, delays[i])).join('');
}

function renderPast() {
    const el = document.getElementById('past-events-grid');
    if (!el) return;
    el.innerHTML = PAST_EVENTS.map((e, i) => pastCard(e, i + 1)).join('');
}

/* ── boot ─────────────────────────────────────────────────────────────────── */
renderStatsBar();
renderFilters();
renderUpcoming();
renderPast();
renderFooter({ eventsPage: true });
