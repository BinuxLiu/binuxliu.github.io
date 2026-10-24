/** Bingxi Liu — independent enhancements; the content works without JavaScript. */
(() => {
  'use strict';

  function initMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      links.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    };
    setOpen(false);
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    links.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', (event) => {
      if (!links.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  function initFilters() {
    const buttons = Array.from(document.querySelectorAll('[data-filter]'));
    const publications = Array.from(document.querySelectorAll('.publication[data-status]'));
    const counter = document.getElementById('publication-count');
    const viewLabel = document.getElementById('publication-view-label');
    if (!buttons.length || !publications.length) return;
    const applyFilter = (filter) => {
      const activeButton = buttons.find((button) => button.dataset.filter === filter);
      if (!activeButton) return;
      let count = 0;
      publications.forEach((publication) => {
        const show = filter === 'all'
          || (filter === 'selected' ? publication.dataset.selected === 'true' : publication.dataset.status === filter);
        publication.hidden = !show;
        if (show) count += 1;
      });
      buttons.forEach((button) => {
        const active = button.dataset.filter === filter;
        button.setAttribute('aria-pressed', String(active));
        button.classList.toggle('is-active', active);
      });
      if (counter) {
        const template = counter.dataset.countTemplate || '{count} publications';
        counter.textContent = template.replace(/\{count\}/g, String(count));
      }
      if (viewLabel && activeButton.dataset.label) viewLabel.textContent = activeButton.dataset.label;
    };
    buttons.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
    const initialButton = buttons.find((button) => button.getAttribute('aria-pressed') === 'true') || buttons[0];
    applyFilter(initialButton.dataset.filter);
  }

  function initCopyEmail() {
    document.querySelectorAll('[data-copy-email]').forEach((button) => {
      const label = button.querySelector('[data-copy-label]') || button;
      const originalLabel = label.textContent;
      const originalAriaLabel = button.getAttribute('aria-label');
      let resetTimer;
      button.addEventListener('click', async () => {
        const email = button.dataset.copyEmail || button.dataset.email;
        let message;
        try {
          if (!email || !navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(email);
          message = button.dataset.copied || 'Email copied';
        } catch (_) {
          message = button.dataset.failed || 'Please use the email link';
        }
        window.clearTimeout(resetTimer);
        label.textContent = message;
        button.setAttribute('aria-label', message);
        resetTimer = window.setTimeout(() => {
          label.textContent = originalLabel;
          if (originalAriaLabel === null) button.removeAttribute('aria-label');
          else button.setAttribute('aria-label', originalAriaLabel);
        }, 2600);
      });
    });
  }

  function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reducedMotion) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach((item) => observer.observe(item));
  }

  function init() {
    try { localStorage.setItem('portfolio-language', document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'); } catch (_) {}
    initMenu();
    initFilters();
    initCopyEmail();
    initReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
