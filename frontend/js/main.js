import './cursor/cursor.js';


/* ===== PAGE LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    if (loader) loader.classList.add('hidden');
  }, 800);
});

/* ===== PARTICLES ===== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];
  const particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.2,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(66,133,244,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
})();

/* ===== NAVBAR SCROLL ===== */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
})();

/* ===== MOBILE MENU ===== */
(function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
})();

/* ===== SCROLL REVEAL ===== */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => observer.observe(el));
})();

/* ===== COUNTER ANIMATION ===== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1800;
      const step = target / (duration / 16);
      const tick = () => {
        start = Math.min(start + step, target);
        el.textContent = Math.floor(start) + suffix;
        if (start < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

/* ===== HERO TYPEWRITER ===== */
(function initTypewriter() {
  const el = document.getElementById('hero-tw');
  if (!el) return;

  const words = ['Build', 'Learn', 'Grow', 'Create', 'Connect', 'Innovate'];
  const colors = ['#4285F4', '#EA4335', '#34A853', '#FBBC04', '#4285F4', '#EA4335'];
  let wi = 0, ci = 0, deleting = false, pauseTicks = 0;
  const PAUSE = 28; // frames to pause at full word

  function applyColor(hex) {
    el.style.backgroundImage = `linear-gradient(135deg, ${hex}, ${hex}cc)`;
  }

  function tick() {
    const word = words[wi];
    if (!deleting) {
      ci++;
      el.textContent = word.slice(0, ci);
      applyColor(colors[wi]);
      if (ci === word.length) {
        deleting = true;
        pauseTicks = PAUSE;
      }
    } else {
      if (pauseTicks > 0) { pauseTicks--; }
      else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
    }
    const delay = deleting && pauseTicks === 0 ? 55 : (ci === word.length ? 120 : 100);
    setTimeout(tick, delay);
  }

  // small start delay so page load animation settles
  setTimeout(tick, 900);
})();

/* ===== ACTIVE NAV LINK ===== */
(function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ===== FILTER BUTTONS (Events Page) ===== */
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.event-card[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if (show) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = 'auto';
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          card.style.pointerEvents = 'none';
          setTimeout(() => {
            if (btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter) {
              card.style.display = 'none';
            }
          }, 400);
        }
      });
    });
  });
})();

/* ===== PASSWORD TOGGLE ===== */
(function initPasswordToggle() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.form-input-wrap').querySelector('.form-input');
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.innerHTML = isPassword
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`;
    });
  });
})();

/* ===== FORM SUBMISSION ===== */
(function initForms() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  function showToast(icon, title, msg, isError = false) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <div class="toast-icon" style="${isError ? 'background:rgba(234,67,53,0.2);color:#EA4335' : ''}">
        ${isError ? '✕' : '✓'}
      </div>
      <div class="toast-text">
        <h4>${title}</h4>
        <p>${msg}</p>
      </div>
    `;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = loginForm.querySelector('.btn-auth');
      btn.textContent = 'Signing in...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Sign In';
        btn.disabled = false;
        showToast('✓', 'Welcome back!', 'Successfully signed in to GDG Campus CSMU');
      }, 1500);
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const pwd = signupForm.querySelector('#password');
      const cpwd = signupForm.querySelector('#confirm-password');
      if (pwd && cpwd && pwd.value !== cpwd.value) {
        showToast('✕', 'Passwords do not match', 'Please make sure both passwords are the same.', true);
        return;
      }
      const btn = signupForm.querySelector('.btn-auth');
      btn.textContent = 'Creating account...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Create Account';
        btn.disabled = false;
        showToast('✓', 'Account created!', 'Welcome to GDG Campus CSMU community!');
      }, 1800);
    });
  }
})();

/* ===== RIPPLE EFFECT on buttons ===== */
(function initRipple() {
  document.querySelectorAll('.btn, .btn-auth, .event-register-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.25);
        border-radius:50%;
        transform:scale(0);
        animation:rippleAnim 0.6s ease;
        pointer-events:none;
      `;
      if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = '@keyframes rippleAnim{to{transform:scale(2);opacity:0}}';
        document.head.appendChild(style);
      }
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();

/* ===== TILT EFFECT on cards ===== */
(function initTilt() {
  const cards = document.querySelectorAll('.event-card, .team-card, .domain-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ===== EVENT CARD HOVER POPOUT ===== */
(function initEventPopout() {
  const POP_W = 300;  // must match CSS width
  const OFFSET = 18;   // gap from cursor
  const DELAY = 120;  // ms before appearing (prevents flicker on fast pass-through)

  // ── Build single popout DOM (reused for every card) ──
  const pop = document.createElement('div');
  pop.className = 'event-popout';
  pop.setAttribute('aria-hidden', 'true');
  pop.innerHTML = `
    <div class="ep-hero" id="_ep-hero"></div>
    <div class="ep-body">
      <div class="ep-title" id="_ep-title"></div>
      <div class="ep-desc"  id="_ep-desc"></div>
      <div class="ep-meta"  id="_ep-meta"></div>
      <div class="ep-tags"  id="_ep-tags"></div>
      <div class="ep-hint">Click to register →</div>
    </div>
  `;
  document.body.appendChild(pop);

  const epHero = document.getElementById('_ep-hero');
  const epTitle = document.getElementById('_ep-title');
  const epDesc = document.getElementById('_ep-desc');
  const epMeta = document.getElementById('_ep-meta');
  const epTags = document.getElementById('_ep-tags');

  let showTimer = null;
  let activeCard = null;

  const svgCal = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`;
  const svgPin = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;
  const svgPpl = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;
  const metaIcons = [svgCal, svgPin, svgPpl];

  function position(cx, cy) {
    const popH = pop.offsetHeight || 300;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = cx + OFFSET;
    let y = cy + OFFSET;
    // flip left if overflowing right
    if (x + POP_W > vw - 10) x = cx - POP_W - OFFSET;
    // flip up if overflowing bottom
    if (y + popH > vh - 10) y = cy - popH - OFFSET;
    // clamp to viewport
    x = Math.max(8, x);
    y = Math.max(8, y);
    pop.style.left = x + 'px';
    pop.style.top = y + 'px';
  }

  function fill(data) {
    epHero.style.background = data.heroBg || 'linear-gradient(135deg,#0d1b3e,#1a237e)';
    epHero.innerHTML = `
      <span style="font-size:2.8rem;line-height:1;position:relative;z-index:2">${data.emoji}</span>
      ${data.badge ? `<span class="event-type-badge ${data.badgeCls} ep-badge">${data.badge}</span>` : ''}
    `;
    epTitle.textContent = data.title;
    epDesc.textContent = data.desc;
    epMeta.innerHTML = data.infoItems.slice(0, 2)
      .map((item, i) => `<div class="ep-meta-row">${metaIcons[i]}<span>${item}</span></div>`)
      .join('');
    epTags.innerHTML = data.tags.slice(0, 4)
      .map(t => `<span class="ep-tag">${t}</span>`)
      .join('');
  }

  function showPop(data, cx, cy) {
    fill(data);
    position(cx, cy);
    pop.classList.add('visible');
  }

  function hidePop() {
    clearTimeout(showTimer);
    pop.classList.remove('visible');
    activeCard = null;
  }

  function txt(el) { return el ? el.textContent.trim() : ''; }

  function wireCard(card, getData) {
    let pendingData = null;
    let enterX = 0, enterY = 0;

    card.addEventListener('mouseenter', e => {
      if (activeCard === card) return;
      activeCard = card;
      enterX = e.clientX;
      enterY = e.clientY;
      pendingData = getData(card);
      clearTimeout(showTimer);
      showTimer = setTimeout(() => showPop(pendingData, enterX, enterY), DELAY);
    });

    card.addEventListener('mouseleave', () => {
      if (activeCard !== card) return;
      hidePop();
    });

    // click still navigates (links inside card work natively)
  }

  // ── index.html cards ──
  document.querySelectorAll('.event-card').forEach(card => {
    wireCard(card, c => ({
      emoji: txt(c.querySelector('.img-placeholder')),
      heroBg: c.querySelector('.img-placeholder')?.style.background || '',
      badge: txt(c.querySelector('.event-type-badge')),
      badgeCls: Array.from(c.querySelector('.event-type-badge')?.classList ?? []).find(cl => cl.startsWith('badge-')) || '',
      title: txt(c.querySelector('.event-title')),
      desc: txt(c.querySelector('.event-desc')),
      infoItems: [txt(c.querySelector('.event-date-row')), txt(c.querySelector('.event-meta'))].filter(Boolean),
      tags: Array.from(c.querySelectorAll('.overlay-tag')).map(t => t.textContent.trim()),
    }));
  });

  // ── events.html big cards ──
  document.querySelectorAll('.event-card-big').forEach(card => {
    wireCard(card, c => ({
      emoji: txt(c.querySelector('.event-img-big')),
      heroBg: c.querySelector('.event-img-big')?.style.background || '',
      badge: txt(c.querySelector('.event-type-badge')),
      badgeCls: Array.from(c.querySelector('.event-type-badge')?.classList ?? []).find(cl => cl.startsWith('badge-')) || '',
      title: txt(c.querySelector('.event-title-big')),
      desc: txt(c.querySelector('.event-desc-big')),
      infoItems: Array.from(c.querySelectorAll('.event-info-item')).map(el => el.textContent.trim()),
      tags: Array.from(c.querySelectorAll('.event-tag')).map(t => t.textContent.trim()),
    }));
  });
})();
