// ===== i18n =====
(function () {
  const STORAGE_KEY = 'aifactory_lang';
  const DEFAULT_LANG = 'vi';
  const cache = {};

  async function loadLang(lang) {
    if (cache[lang]) return cache[lang];
    try {
      const res = await fetch(`assets/lang/${lang}.json`, { cache: 'no-cache' });
      const data = await res.json();
      cache[lang] = data;
      return data;
    } catch (err) {
      console.error('Lang load failed:', err);
      return null;
    }
  }

  function getValue(obj, path) {
    return path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : null), obj);
  }

  async function applyLang(lang) {
    const dict = await loadLang(lang);
    if (!dict) return;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getValue(dict, key);
      if (val !== null) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const key = el.getAttribute('data-i18n-attr');
      const val = getValue(dict, key);
      if (val !== null) el.setAttribute('content', val);
    });

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  function init() {
    let saved = DEFAULT_LANG;
    try { saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; } catch (_) {}
    applyLang(saved);

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
