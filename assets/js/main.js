// ===== Carousel arrows =====
(function () {
  function initArrows(carouselId, prevId, nextId) {
    const track = document.getElementById(carouselId);
    const prev  = document.getElementById(prevId);
    const next  = document.getElementById(nextId);
    const wrap  = track && track.closest('.carousel-wrap');
    if (!track || !prev || !next) return;

    let animId = null;

    function update() {
      const atStart   = track.scrollLeft <= 2;
      const atEnd     = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      const canScroll = track.scrollWidth > track.clientWidth + 4;

      prev.classList.toggle('hidden', atStart || !canScroll);
      next.classList.toggle('hidden', atEnd   || !canScroll);
      if (wrap) {
        wrap.classList.toggle('at-start', atStart);
        wrap.classList.toggle('at-end',   atEnd);
      }
    }

    // Custom slow smooth scroll (600ms, easeInOutCubic)
    function smoothScrollBy(distance, duration) {
      if (animId) cancelAnimationFrame(animId);
      const start    = track.scrollLeft;
      const target   = Math.max(0, Math.min(start + distance, track.scrollWidth - track.clientWidth));
      const startTime = performance.now();

      function ease(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function step(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        track.scrollLeft = start + (target - start) * ease(progress);
        update();
        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else {
          animId = null;
          update();
        }
      }
      animId = requestAnimationFrame(step);
    }

    prev.addEventListener('click', () => smoothScrollBy(-Math.round(track.clientWidth * 0.82), 600));
    next.addEventListener('click', () => smoothScrollBy( Math.round(track.clientWidth * 0.82), 600));
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('scrollend', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    // Wait for layout to settle before initial arrow state
    requestAnimationFrame(() => requestAnimationFrame(() => {
      update();
      setTimeout(update, 200);
    }));
  }

  initArrows('featCarousel', 'featPrev', 'featNext');
  initArrows('stepCarousel', 'stepPrev', 'stepNext');
  initArrows('priceCarousel', 'pricePrev', 'priceNext');
})();

// ===== Mobile menu =====
(function () {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => nav.classList.remove('open'))
  );
})();

// ===== Reveal on scroll =====
(function () {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('.card, .step, .gallery-item, .cta-box');
  els.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  els.forEach((el) => io.observe(el));
})();

// ===== Payment Modal =====
(function () {
  const BANK    = 'TCB';
  const ACCOUNT = '19038709343023';
  const OWNER   = 'HOANG NGOC QUOC';
  const ZALO    = 'https://zalo.me/g/z2cntcd5tj2uvuywul2';

  const overlay     = document.getElementById('paymentModal');
  const title       = document.getElementById('payTitle');
  const qrImg       = document.getElementById('payQR');
  const amountEl    = document.getElementById('payAmount');
  const contentEl   = document.getElementById('payContent');
  const accNumEl    = document.getElementById('payAccNum');
  const copyAcc     = document.getElementById('payCopyAcc');
  const copyContent = document.getElementById('payCopyContent');
  const closeBtn    = document.getElementById('payClose');
  const closeBtn2   = document.getElementById('payCloseBtn');

  if (!overlay) return;

  let currentContent = '';

  function openModal(plan, amount, price) {
    const note = plan + ' --- ' + OWNER.split(' ').pop();
    currentContent = note;

    title.textContent      = 'Mua gói ' + plan;
    amountEl.textContent   = price;
    contentEl.textContent  = note;
    accNumEl.textContent   = ACCOUNT;

    const qrUrl = 'https://img.vietqr.io/image/' + BANK + '-' + ACCOUNT +
      '-compact2.png?amount=' + amount +
      '&addInfo=' + encodeURIComponent(note) +
      '&accountName=' + encodeURIComponent(OWNER);
    qrImg.src = qrUrl;

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Intercept btn-pricing clicks (event delegation — robust against DOM rewrite by i18n)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-pricing[data-plan]');
    if (!btn) return;
    e.preventDefault();
    openModal(btn.dataset.plan, btn.dataset.amount, btn.dataset.price);
  });

  // Copy account number
  copyAcc.addEventListener('click', function () {
    navigator.clipboard.writeText(ACCOUNT).then(function () {
      copyAcc.textContent = '✓ Đã sao chép!';
      setTimeout(function () { copyAcc.textContent = '📋 Sao chép số TK'; }, 2000);
    });
  });

  // Copy transfer content
  copyContent.addEventListener('click', function () {
    navigator.clipboard.writeText(currentContent).then(function () {
      copyContent.textContent = '✓ Đã sao chép!';
      setTimeout(function () { copyContent.textContent = '📋 Sao chép nội dung'; }, 2000);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  closeBtn2.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
