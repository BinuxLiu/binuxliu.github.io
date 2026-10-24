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
    if (!buttons.length || !publications.length) return;
    const applyFilter = (filter) => {
      let count = 0;
      publications.forEach((publication) => {
        const show = filter === 'all' || publication.dataset.status === filter;
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
    };
    buttons.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
    applyFilter('all');
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

  function initMotion() {
    const preference = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const buttons = Array.from(document.querySelectorAll('[data-motion-toggle]'));
    const listeners = new Set();
    let manuallyPaused = false;
    const isPaused = () => manuallyPaused || Boolean(preference && preference.matches);
    const update = () => {
      const reduced = Boolean(preference && preference.matches);
      const paused = isPaused();
      document.body.classList.toggle('motion-paused', paused);
      buttons.forEach((button) => {
        const label = button.querySelector('[data-motion-label]') || button;
        const text = reduced
          ? (button.dataset.reduced || 'Reduced motion enabled')
          : paused ? (button.dataset.play || 'Play animation') : (button.dataset.pause || 'Pause animation');
        button.setAttribute('aria-pressed', String(paused));
        button.setAttribute('aria-label', text);
        button.disabled = reduced;
        label.textContent = text;
      });
      listeners.forEach((listener) => listener());
    };
    buttons.forEach((button) => button.addEventListener('click', () => {
      manuallyPaused = !manuallyPaused;
      update();
    }));
    if (preference) {
      if (preference.addEventListener) preference.addEventListener('change', update);
      else if (preference.addListener) preference.addListener(update);
    }
    update();
    return { isPaused, onChange: (listener) => listeners.add(listener) };
  }

  function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
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

  function initSpatialCanvas(motion) {
    const canvas = document.getElementById('spatial-canvas');
    if (!canvas) return;
    let context;
    try { context = canvas.getContext('2d', { alpha: true }); } catch (_) { return; }
    if (!context) return;
    canvas.setAttribute('aria-hidden', 'true');
    const container = canvas.closest('.spatial-visual') || canvas.parentElement;
    if (!container) return;
    const TAU = Math.PI * 2;
    const points = [];
    const projected = [];
    // Staggered samples describe one continuous surface, without random network edges.
    for (let ring = 0; ring < 56; ring += 1) {
      for (let sample = 0; sample < 25; sample += 1) {
        const u = ring / 56 * TAU;
        const v = (sample + (ring % 2) * 0.5) / 25 * TAU;
        const tube = 0.282 + 0.014 * Math.cos(3 * u);
        const radius = 0.665 + tube * Math.cos(v);
        points.push({
          x: radius * Math.cos(u), y: radius * Math.sin(u), z: tube * Math.sin(v),
          nx: Math.cos(v) * Math.cos(u), ny: Math.cos(v) * Math.sin(u), nz: Math.sin(v),
          blue: 0.5 + 0.5 * Math.cos(u - 0.8),
          grain: 0.5 + 0.5 * Math.sin(ring * 17.21 + sample * 7.31)
        });
        projected.push({ x: 0, y: 0, z: 0, radius: 0, alpha: 0, red: 0, green: 0, blue: 0 });
      }
    }
    let width = 0, height = 0, pixelRatio = 1;
    let frame = 0, lastTime = 0, elapsed = 0;
    let visible = false;
    let pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0;
    let pointerBounds = null;

    function draw() {
      if (!width || !height) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      const size = Math.min(width, height);
      const scale = size * 0.405;
      const centerX = width * 0.5;
      const centerY = height * 0.47;
      const pitch = 0.66 + tiltY * 0.10;
      const yaw = 0.46 + Math.sin(elapsed * 0.10) * 0.36 + tiltX * 0.14;
      const roll = -0.32 + elapsed * 0.027;
      const cx = Math.cos(pitch), sx = Math.sin(pitch);
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cz = Math.cos(roll), sz = Math.sin(roll);
      const dotScale = Math.max(0.68, size / 550);

      // Transparent ambient color and a floor shadow give the white composition depth.
      const halo = context.createRadialGradient(centerX, centerY, size * 0.09, centerX, centerY, size * 0.46);
      halo.addColorStop(0, 'rgba(51, 134, 244, 0.018)');
      halo.addColorStop(0.68, 'rgba(59, 141, 246, 0.035)');
      halo.addColorStop(1, 'rgba(59, 141, 246, 0)');
      context.fillStyle = halo;
      context.fillRect(0, 0, width, height);
      context.save();
      context.translate(centerX, centerY + size * 0.385);
      context.scale(1, 0.13);
      const shadow = context.createRadialGradient(0, 0, 0, 0, 0, size * 0.34);
      shadow.addColorStop(0, 'rgba(26, 50, 83, 0.09)');
      shadow.addColorStop(0.5, 'rgba(26, 50, 83, 0.035)');
      shadow.addColorStop(1, 'rgba(26, 50, 83, 0)');
      context.fillStyle = shadow;
      context.beginPath();
      context.arc(0, 0, size * 0.34, 0, TAU);
      context.fill();
      context.restore();

      for (let index = 0; index < points.length; index += 1) {
        const point = points[index];
        const output = projected[index];
        const ax = point.x * cy + point.z * sy;
        const az = -point.x * sy + point.z * cy;
        const ay = point.y * cx - az * sx;
        const z = point.y * sx + az * cx;
        const x = ax * cz - ay * sz;
        const y = ax * sz + ay * cz;
        const perspective = 3.8 / (3.8 - z);
        const depth = Math.min(1, Math.max(0, (z + 0.8) / 1.6));
        const normalX = point.nx * cy + point.nz * sy;
        const normalZ = -point.nx * sy + point.nz * cy;
        const normalY = point.ny * cx - normalZ * sx;
        const normalFront = point.ny * sx + normalZ * cx;
        const light = Math.max(0, -normalX * 0.35 - normalY * 0.55 + normalFront * 0.70);
        const blue = point.blue * (0.35 + 0.65 * light);
        const brightness = 20 + light * 31 + (1 - depth) * 31;
        output.x = centerX + x * scale * perspective;
        output.y = centerY + y * scale * perspective;
        output.z = z;
        output.radius = (0.68 + depth * 0.75 + point.grain * 0.21) * perspective * dotScale;
        output.alpha = Math.min(0.94, 0.19 + depth * 0.58 + light * 0.17);
        output.red = Math.round(brightness + blue * 4);
        output.green = Math.round(brightness + 12 + blue * 65);
        output.blue = Math.round(brightness + 23 + blue * 155);
      }
      projected.sort((a, b) => a.z - b.z);
      for (const point of projected) {
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, TAU);
        context.fillStyle = `rgba(${point.red},${point.green},${point.blue},${point.alpha.toFixed(3)})`;
        context.fill();
      }
    }

    const canAnimate = () => visible && !document.hidden && !motion.isPaused() && width > 0 && height > 0;
    function tick(time) {
      frame = 0;
      if (!canAnimate()) {
        lastTime = 0;
        return;
      }
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      elapsed += delta;
      const easing = 1 - Math.exp(-delta * 4);
      tiltX += (pointerX - tiltX) * easing;
      tiltY += (pointerY - tiltY) * easing;
      draw();
      frame = window.requestAnimationFrame(tick);
    }
    function syncAnimation() {
      if (canAnimate()) {
        if (!frame) frame = window.requestAnimationFrame(tick);
      } else {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        if (visible && !document.hidden) draw();
      }
    }
    function resize() {
      const bounds = container.getBoundingClientRect();
      const nextWidth = Math.max(0, bounds.width);
      const nextHeight = Math.max(0, bounds.height);
      const nextRatio = Math.min(2, window.devicePixelRatio || 1);
      pointerBounds = bounds;
      if (width !== nextWidth || height !== nextHeight || pixelRatio !== nextRatio) {
        width = nextWidth;
        height = nextHeight;
        pixelRatio = nextRatio;
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        draw();
      }
      syncAnimation();
    }

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);
    window.addEventListener('resize', resize, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        syncAnimation();
      }, { threshold: 0 }).observe(canvas);
    } else {
      const checkVisibility = () => {
        const bounds = container.getBoundingClientRect();
        visible = bounds.bottom > 0 && bounds.top < window.innerHeight && bounds.right > 0 && bounds.left < window.innerWidth;
        syncAnimation();
      };
      window.addEventListener('scroll', checkVisibility, { passive: true });
      window.addEventListener('resize', checkVisibility, { passive: true });
      checkVisibility();
    }
    container.addEventListener('pointerenter', () => { pointerBounds = container.getBoundingClientRect(); }, { passive: true });
    container.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' || motion.isPaused() || !pointerBounds || !pointerBounds.width || !pointerBounds.height) return;
      pointerX = Math.max(-1, Math.min(1, (event.clientX - pointerBounds.left) / pointerBounds.width * 2 - 1));
      pointerY = Math.max(-1, Math.min(1, (event.clientY - pointerBounds.top) / pointerBounds.height * 2 - 1));
    }, { passive: true });
    container.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; }, { passive: true });
    document.addEventListener('visibilitychange', syncAnimation);
    motion.onChange(syncAnimation);
    resize();
  }

  function init() {
    try { localStorage.setItem('portfolio-language', document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'); } catch (_) {}
    initMenu();
    initFilters();
    initCopyEmail();
    const motion = initMotion();
    initReveal();
    initSpatialCanvas(motion);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
