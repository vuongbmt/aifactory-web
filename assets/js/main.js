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
