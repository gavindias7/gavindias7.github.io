/* ═══════════════════════════════════════════════════════════
   GAVIN DIAS — Portfolio Interactions v2.0
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── THEME TOGGLE ──────────────────────────────────────────
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  const moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function getPreferredTheme() {
    const stored = localStorage.getItem('gd-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('gd-theme', theme);
    themeBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    // Update neural canvas on theme change
    if (window._neuralCanvas) window._neuralCanvas.updateTheme(theme);
  }

  applyTheme(getPreferredTheme());
  themeBtn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ─── NEURAL NETWORK CANVAS ─────────────────────────────────
  let animPaused = false;
  (function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, nodes, mouse = { x: -9999, y: -9999 };
    const NODE_COUNT = 55;
    const MAX_DIST = 180;
    const NODE_RADIUS = 1.5;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: NODE_RADIUS + Math.random() * 1.5,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function getColors() {
      const isDark = root.getAttribute('data-theme') !== 'light';
      return {
        node: isDark ? 'rgba(99,102,241,' : 'rgba(79,70,229,',
        line: isDark ? 'rgba(99,102,241,' : 'rgba(79,70,229,',
        mouse: isDark ? 'rgba(139,92,246,' : 'rgba(124,58,237,',
      };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const colors = getColors();

      nodes.forEach(n => {
        // Move
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;

        // Mouse attraction (subtle)
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          n.vx += dx * 0.00008;
          n.vy += dy * 0.00008;
        }

        // Clamp speed
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 1.2) { n.vx /= speed; n.vy /= speed; }

        // Bounce
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.x = Math.max(0, Math.min(W, n.x));
        n.y = Math.max(0, Math.min(H, n.y));

        // Draw node
        const pulse = 0.6 + 0.4 * Math.sin(n.pulse);
        const alpha = 0.4 * pulse;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = colors.node + alpha + ')';
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = colors.line + alpha + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Mouse node connections
        const dx = nodes[i].x - mouse.x;
        const dy = nodes[i].y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST * 1.3) {
          const alpha = (1 - d / (MAX_DIST * 1.3)) * 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = colors.mouse + alpha + ')';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      if (!animPaused) requestAnimationFrame(draw);
    }

    window._neuralCanvas = { updateTheme: () => {}, resumeDraw: () => { if (!animPaused) draw(); } };

    resize();
    createNodes();
    draw();

    window.addEventListener('resize', () => { resize(); });
    document.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      mouse.x = -9999; mouse.y = -9999;
    });
  })();

  // ─── CUSTOM CURSOR ─────────────────────────────────────────
  (function initCursor() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let visible = false;

    document.addEventListener('mousemove', e => {
      dotX = e.clientX;
      dotY = e.clientY;
      if (!visible) {
        dot.style.opacity = '1';
        ring.style.opacity = '0.5';
        visible = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      visible = false;
    });

    // Hover state
    const hoverTargets = 'a, button, [role="button"], .skill-tag, .project-card, .timeline-card, .contact-link, .contact-cta-btn, .btn';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverTargets)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    // Click state
    document.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-clicked');
    });
    document.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-clicked');
    });

    // Animate ring without lag
    function animateRing() {
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';
      ring.style.left = dotX + 'px';
      ring.style.top = dotY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
  })();

  // ─── READING PROGRESS BAR ──────────────────────────────────
  (function initProgress() {
    const bar = document.getElementById('reading-progress');
    const backToTop = document.getElementById('back-to-top');
    if (!bar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';

      // Back to top
      if (backToTop) {
        backToTop.classList.toggle('visible', scrollTop > 400);
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  })();

  // ─── NAV SCROLL EFFECT ─────────────────────────────────────
  const nav = document.querySelector('.nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  function updateNav() {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 50);

    // Active section highlighting
    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) currentSection = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ─── MOBILE MENU ───────────────────────────────────────────
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-links');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ─── SMOOTH SCROLL ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── SCROLL REVEAL (IntersectionObserver) ──────────────────
  const revealElements = document.querySelectorAll('.reveal, .timeline-item, .skill-card, .project-card, .info-card');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── ANIMATED COUNTERS ─────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => counterObserver.observe(c));

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count, 10);
      const suffix = counter.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        counter.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  // ─── TYPING EFFECT (Hero subtitle) ────────────────────────
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = [
      'AI Agent Engineer',
      'Lead Software Architect',
      'GenAI Systems Builder',
      'LLM Orchestration Expert',
      'Full-Stack Innovator',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 35;
      } else {
        typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    setTimeout(typeLoop, 1200);
  }

  // ─── STAGGERED SKILL TAGS ANIMATION ────────────────────────
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    const tags = card.querySelectorAll('.skill-tag');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tags.forEach((tag, i) => {
              tag.style.opacity = '0';
              tag.style.transform = 'translateY(10px) scale(0.95)';
              setTimeout(() => {
                tag.style.transition = `all 0.4s cubic-bezier(0.4,0,0.2,1) ${i * 0.04}s`;
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0) scale(1)';
              }, 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(card);
  });

  // ─── 3D CARD TILT ──────────────────────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    const shimmer = card.querySelector('.card-shimmer');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.boxShadow = `0 20px 60px rgba(99,102,241,0.25), 0 ${rotateX * -1}px ${Math.abs(rotateX) + 8}px rgba(0,0,0,0.2)`;

      if (shimmer) {
        const shimmerX = (x / rect.width) * 100;
        const shimmerY = (y / rect.height) * 100;
        shimmer.style.setProperty('--shimmer-x', shimmerX + '%');
        shimmer.style.setProperty('--shimmer-y', shimmerY + '%');
        shimmer.querySelector(':after') // trigger repaint
      }
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.1s, border-color 0.3s';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
  });

  // ─── PARALLAX GLOW FOLLOW ──────────────────────────────────
  const glows = document.querySelectorAll('.bg-glow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
  });

  function updateGlows() {
    glowX += (mouseX - glowX) * 0.05;
    glowY += (mouseY - glowY) * 0.05;
    glows.forEach((glow, i) => {
      const factor = (i + 1) * 0.5;
      glow.style.transform = `translate(${glowX * factor}px, ${glowY * factor}px)`;
    });
    if (!animPaused) requestAnimationFrame(updateGlows);
  }
  updateGlows();

  document.addEventListener('visibilitychange', () => {
    animPaused = document.hidden;
    if (!animPaused) {
      window._neuralCanvas.resumeDraw();
      updateGlows();
    }
  });

  // ─── MAGNETIC BUTTON EFFECT ────────────────────────────────
  document.querySelectorAll('.btn-primary, .contact-cta-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-2px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ─── NAV LOGO DATA ATTR (for glitch CSS) ──────────────────
  const navLogo = document.getElementById('nav-logo');
  if (navLogo) {
    navLogo.setAttribute('data-text', navLogo.textContent);
  }

})();
