(function () {
  const backdrop = document.getElementById('event-modal');
  var currentCardIndex = -1;
  var visibleCards = [];

  function getVisibleCards() {
    return Array.from(document.querySelectorAll('.event-card-big')).filter(function (card) {
      return getComputedStyle(card).display !== 'none';
    });
  }

  /* ── Tap/click anywhere on a card to open modal ── */
  document.querySelectorAll('.event-card-big').forEach(function (card) {
    card.addEventListener('click', function (e) {
      /* don't intercept real button/link clicks */
      if (e.target.closest('a, button')) return;
      visibleCards = getVisibleCards();
      currentCardIndex = visibleCards.indexOf(card);
      openModal(card);
    });
  });

  function updateNavState() {
    var prevBtn = document.getElementById('modal-prev');
    var nextBtn = document.getElementById('modal-next');
    prevBtn.classList.toggle('nav-disabled', currentCardIndex <= 0);
    nextBtn.classList.toggle('nav-disabled', currentCardIndex >= visibleCards.length - 1);
  }

  function goToCard(index) {
    if (index < 0 || index >= visibleCards.length) return;
    var direction = index > currentCardIndex ? 1 : -1;
    var modalEl = document.querySelector('.event-modal');

    /* clear any leftover anim classes */
    modalEl.classList.remove('anim-in-right', 'anim-in-left', 'anim-out-left', 'anim-out-right');

    /* slide out in the travel direction */
    var outClass = direction > 0 ? 'anim-out-left' : 'anim-out-right';
    modalEl.classList.add(outClass);

    setTimeout(function () {
      modalEl.classList.remove(outClass);
      currentCardIndex = index;
      openModal(visibleCards[currentCardIndex]);
      modalEl.scrollTop = 0;

      /* slide in from the opposite direction */
      var inClass = direction > 0 ? 'anim-in-right' : 'anim-in-left';
      modalEl.classList.add(inClass);
      modalEl.addEventListener('animationend', function cleanup() {
        modalEl.classList.remove(inClass);
        modalEl.removeEventListener('animationend', cleanup);
      });
    }, 180);
  }

  function openModal(card) {
    var heroEl = card.querySelector('.event-img-big');
    var badgeEl = card.querySelector('.event-type-badge');
    var titleEl = card.querySelector('.event-title-big');
    var descEl = card.querySelector('.event-desc-big');
    var infoEls = card.querySelectorAll('.event-info-item');
    var tagEls = card.querySelectorAll('.event-tag');
    var footerEl = card.querySelector('.event-footer-big');

    /* hero */
    var mHero = document.getElementById('modal-hero');
    mHero.style.background = heroEl ? heroEl.style.background : '';
    var mEmoji = document.getElementById('modal-emoji');
    mEmoji.innerHTML = '';
    if (heroEl) {
      var iconWrap = heroEl.querySelector('.ec-icon-wrap');
      if (iconWrap) {
        mEmoji.appendChild(iconWrap.cloneNode(true));
      } else {
        mEmoji.textContent = heroEl.textContent.trim();
      }
    }

    /* badge */
    var mBadgeRow = document.getElementById('modal-badge-row');
    mBadgeRow.innerHTML = '';
    if (badgeEl) {
      var b = badgeEl.cloneNode(true);
      b.style.position = 'static';
      mBadgeRow.appendChild(b);
    }

    /* title & desc */
    document.getElementById('modal-title').textContent = titleEl ? titleEl.textContent.trim() : '';
    document.getElementById('modal-desc').textContent = descEl ? descEl.textContent.trim() : '';

    /* info rows */
    var mInfos = document.getElementById('modal-infos');
    mInfos.innerHTML = '';
    if (infoEls.length === 0) {
      mInfos.style.display = 'none';
    } else {
      mInfos.style.display = '';
      infoEls.forEach(function (item) {
        var d = document.createElement('div');
        d.className = 'event-modal-info';
        d.innerHTML = item.innerHTML;
        mInfos.appendChild(d);
      });
    }

    /* tags */
    var mTags = document.getElementById('modal-tags');
    mTags.innerHTML = '';
    tagEls.forEach(function (t) { mTags.appendChild(t.cloneNode(true)); });

    /* footer: attendees pill + generated CTA */
    var mFooter = document.getElementById('modal-footer');
    mFooter.innerHTML = '';
    var isPast = card.classList.contains('past-card');
    if (footerEl) {
      var pill = footerEl.querySelector('.attendees-pill');
      if (pill) {
        mFooter.appendChild(pill.cloneNode(true));
      } else {
        var statusSpan = footerEl.querySelector('span');
        if (statusSpan) mFooter.appendChild(statusSpan.cloneNode(true));
      }
    }
    /* inject action button */
    var cta = document.createElement('a');
    if (isPast) {
      cta.textContent = 'View Details';
      cta.href = '#';
      cta.className = 'btn btn-ghost';
    } else {
      cta.textContent = 'Register Now';
      cta.href = 'signup.html';
      cta.className = 'btn btn-primary';
    }
    mFooter.appendChild(cta);

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateNavState();
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('modal-prev').addEventListener('click', function () {
    goToCard(currentCardIndex - 1);
  });
  document.getElementById('modal-next').addEventListener('click', function () {
    goToCard(currentCardIndex + 1);
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (!backdrop.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToCard(currentCardIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goToCard(currentCardIndex + 1); }
  });
})();
