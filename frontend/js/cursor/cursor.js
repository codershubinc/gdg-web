/**
 * cursor.js — orchestrates the robo-skeleton cursor system
 *
 * Responsibilities:
 *   • Creates and manages the CSS cursor dot & ring (hover/click states)
 *   • Creates the off-screen canvas for skeleton + laser rendering
 *   • Owns the single rAF loop
 *   • Delegates physics + drawing to RoboSkeleton and LaserTail
 *
 * Imported by main.js as a side-effect module.
 */

import { RoboSkeleton } from './skeleton.js';
import { LaserTail } from './laser.js';

(function () {
  // Skip on touch / stylus-only devices
  if (window.matchMedia('(pointer: coarse)').matches) return;


  // ── Full-viewport canvas for canvas-drawn effects ─────────────────
  const cv = document.createElement('canvas');
  cv.style.cssText = [
    'position:fixed', 'inset:0', 'width:100%', 'height:100%',
    'pointer-events:none', 'z-index:99997',
  ].join(';');
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');

  window.addEventListener('resize', () => {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
  });

  // ── Domain objects ────────────────────────────────────────────────
  const skeleton = new RoboSkeleton();
  const laser = new LaserTail();

  // ── State ─────────────────────────────────────────────────────────
  let mx = -500, my = -500;   // raw mouse position
  let visible = true;

  // ── Mouse / keyboard events ───────────────────────────────────────
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  });

  document.addEventListener('mouseleave', () => { visible = false; });
  document.addEventListener('mouseenter', () => { visible = true; });

  // Interactive element selectors
  const HOVER_SEL = [
    'a', 'button', '[role="button"]', '.btn', '.btn-auth',
    '.filter-btn', '.hamburger', '.event-card-big', '.team-card',
    '.domain-card', 'input', 'textarea', 'select', 'label',
  ].join(',');

  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVER_SEL)) return;
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVER_SEL)) return;
  });

  document.addEventListener('mousedown', () => { });
  document.addEventListener('mouseup', () => { });

  // ── Animation loop ────────────────────────────────────────────────
  function loop() {
    // Update physics
    skeleton.update(mx, my);
    const tail = skeleton.spine[skeleton.spine.length - 1];
    laser.update(tail.x, tail.y);

    // Render
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (visible) {
      laser.draw(ctx);    // laser behind the skeleton
      skeleton.draw(ctx); // skeleton on top
    }

    requestAnimationFrame(loop);
  }

  loop();
})();
