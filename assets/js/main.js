/**
 * Bingxi Liu · Personal Homepage
 * Dark Cyber-Theme · Particle Canvas + Scroll Reveal
 */
(function(){
  'use strict';

  // ─── Particle System ───
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles;
  const DENSITY = 0.00006; // particles per px²
  const MAX_PARTICLES = 80;

  function resize(){
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles(){
    const count = Math.min(Math.floor(w * h * DENSITY), MAX_PARTICLES);
    particles = Array.from({length: count}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.5 + 0.1
    }));
  }

  const connections = new Map(); // sparse connection cache

  function draw(){
    ctx.clearRect(0, 0, w, h);

    // Draw and update particles
    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < 0) p.x = w;
      if(p.x > w) p.x = 0;
      if(p.y < 0) p.y = h;
      if(p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(162,155,254,${p.o})`;
      ctx.fill();
    }

    // Draw connections between nearby particles
    connections.clear();
    for(let i = 0; i < particles.length; i++){
      for(let j = i + 1; j < particles.length; j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 120){
          const alpha = (1 - dist/120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,92,231,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate(){
    draw();
    requestAnimationFrame(animate);
  }

  // ─── Scroll Reveal ───
  const observer = new IntersectionObserver((entries) => {
    for(const e of entries){
      if(e.isIntersecting){
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function initReveal(){
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ─── Mouse Glow ───
  let mx = -100, my = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const glowStyle = document.createElement('style');
  glowStyle.textContent = `
    .card:hover {
      box-shadow:
        0 0 30px rgba(108,92,231,0.08),
        0 8px 32px rgba(0,0,0,0.3);
    }
  `;
  document.head.appendChild(glowStyle);

  // ─── Boot ───
  window.addEventListener('resize', resize);
  resize();
  animate();
  // Delay reveal so initial paint is stable
  setTimeout(initReveal, 100);

})();
