/* ============================================
   CropNet AI - Main JavaScript
============================================ */

'use strict';

// ── Navbar ──────────────────────────────────
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }

  // Scroll-to-top button
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
});

hamburger?.addEventListener('click', () => {
  mobileNav?.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = mobileNav?.classList.contains('open');
  if (spans.length === 3) {
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }
});

// Close mobile nav on link click
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav?.classList.remove('open');
  });
});

// Active nav link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
setActiveNavLink();

// ── Scroll Reveal ──────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
  revealObserver.observe(el);
});

// ── Animated Counters ──────────────────────
function animateCounter(el, target, duration = 2000, suffix = '') {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start).toLocaleString() + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, 2000, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ── Scroll to Top ──────────────────────────
const scrollTopBtn = document.querySelector('.scroll-top');
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Smooth anchor scrolling ────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Tab System ────────────────────────────
function initTabs() {
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const buttons = group.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        const tabGroup = btn.closest('[data-tab-group]')?.dataset.tabGroup;
        document.querySelectorAll(`[data-tab-content="${tabGroup}"]`).forEach(content => {
          content.style.display = content.dataset.tabId === tabId ? 'block' : 'none';
        });
      });
    });
  });
}
initTabs();

// ── Particles ─────────────────────────────
function createParticles() {
  const container = document.querySelector('.particle-field');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.setProperty('--duration', (4 + Math.random() * 6) + 's');
    particle.style.setProperty('--delay', (-Math.random() * 6) + 's');
    particle.style.setProperty('--drift', ((Math.random() - 0.5) * 80) + 'px');
    container.appendChild(particle);
  }
}
createParticles();

// ── Tooltip ───────────────────────────────
document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.addEventListener('mouseenter', (e) => {
    const tip = document.createElement('div');
    tip.className = 'tooltip-popup';
    tip.textContent = e.target.dataset.tooltip;
    tip.style.cssText = `
      position: fixed;
      background: rgba(10,31,14,0.95);
      border: 1px solid rgba(39,174,96,0.3);
      color: #e8f5ea;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.78rem;
      z-index: 9999;
      pointer-events: none;
      white-space: nowrap;
    `;
    document.body.appendChild(tip);

    const rect = e.target.getBoundingClientRect();
    tip.style.top = (rect.top - tip.offsetHeight - 8) + 'px';
    tip.style.left = (rect.left + rect.width / 2 - tip.offsetWidth / 2) + 'px';

    el._tooltip = tip;
  });

  el.addEventListener('mouseleave', () => {
    el._tooltip?.remove();
  });
});

// ── Feature Card Tags ─────────────────────
function initFeatureInputOutput() {
  document.querySelectorAll('.feature-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.feature-card');
      const details = card.querySelector('.feature-details');
      if (details) {
        const isOpen = details.style.maxHeight;
        details.style.maxHeight = isOpen ? '' : details.scrollHeight + 'px';
        btn.textContent = isOpen ? 'Learn More →' : 'Close ↑';
      }
    });
  });
}
initFeatureInputOutput();

// ── Form Handler ──────────────────────────
const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  }, 1500);
});

// ── Bar chart animate ─────────────────────
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.chart-bar').forEach((bar, i) => {
        bar.style.transitionDelay = (i * 0.08) + 's';
        bar.style.animation = `grow-bar 0.8s ${i * 0.08}s ease both`;
      });
      chartObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.chart-bars, .bar-chart').forEach(el => {
  chartObserver.observe(el);
});

// ── Progress bars animate ─────────────────
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-fill').forEach(fill => {
        const width = fill.dataset.width || fill.style.width;
        fill.style.width = '0';
        requestAnimationFrame(() => {
          fill.style.width = width;
        });
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.progress-bar').forEach(el => {
  progressObserver.observe(el.closest('.progress-item') || el);
});

// ── Hero mockup mini animation ────────────
function animateMockup() {
  const bars = document.querySelectorAll('.chart-bar');
  if (!bars.length) return;

  setInterval(() => {
    bars.forEach(bar => {
      const h = 20 + Math.random() * 80;
      bar.style.height = h + '%';
    });
  }, 2500);
}
animateMockup();

console.log('%c🌿 CropNet AI', 'color: #2ecc71; font-size: 20px; font-weight: bold;');
console.log('%cPowering Agriculture with AI Intelligence', 'color: #9dc8a7; font-size: 12px;');
