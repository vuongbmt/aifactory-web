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

  // Intercept btn-pricing clicks
  document.querySelectorAll('.btn-pricing[data-plan]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(btn.dataset.plan, btn.dataset.amount, btn.dataset.price);
    });
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
