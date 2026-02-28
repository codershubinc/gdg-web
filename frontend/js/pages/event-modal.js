(function () {
    var modal = document.getElementById('ev-modal');
    var cards = Array.from(document.querySelectorAll('.event-card'));
    var currentIdx = 0;

    function fillModal(card) {
        var title = card.dataset.title || '';
        var date = card.dataset.date || '';
        var loc = card.dataset.loc || '';
        var desc = card.dataset.desc || '';
        var tags = (card.dataset.tags || '').split(',').filter(Boolean);

        var ph = card.querySelector('.img-placeholder');
        document.getElementById('ev-modal-hero').style.background =
            ph ? ph.style.background : 'linear-gradient(135deg,#0d1b3e,#1a237e)';

        var badgeEl = card.querySelector('.event-type-badge');
        var bNode = document.getElementById('ev-modal-badge');
        if (badgeEl) {
            var clone = badgeEl.cloneNode(true);
            clone.style.position = 'static';
            bNode.innerHTML = '';
            bNode.appendChild(clone);
        }

        document.getElementById('ev-modal-title').textContent = title;
        document.getElementById('ev-modal-meta').innerHTML =
            '<span>📅 ' + date + '</span><span>📍 ' + loc + '</span>';
        document.getElementById('ev-modal-desc').textContent = desc;
        document.getElementById('ev-modal-tags').innerHTML =
            tags.map(function (t) { return '<span>' + t + '</span>'; }).join('');

        document.getElementById('ev-modal-prev').disabled = currentIdx === 0;
        document.getElementById('ev-modal-next').disabled = currentIdx === cards.length - 1;
    }

    function openModal(card) {
        currentIdx = cards.indexOf(card);
        fillModal(card);
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function navigate(dir) {
        var next = currentIdx + dir;
        if (next < 0 || next >= cards.length) return;
        currentIdx = next;
        fillModal(cards[currentIdx]);
    }

    document.getElementById('ev-modal-close').addEventListener('click', closeModal);
    document.getElementById('ev-modal-prev').addEventListener('click', function () { navigate(-1); });
    document.getElementById('ev-modal-next').addEventListener('click', function () { navigate(1); });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    cards.forEach(function (card) {
        card.addEventListener('click', function (e) {
            if (!e.target.closest('a')) openModal(card);
        });
    });
})();
