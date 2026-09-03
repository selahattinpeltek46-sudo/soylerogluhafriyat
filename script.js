// Navbar background intensifies on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 20
    ? 'rgba(11, 13, 18, 0.95)'
    : 'rgba(11, 13, 18, 0.7)';
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Animated stat counters
const stats = document.querySelectorAll('.stat-num');
let counted = false;

function animateStats() {
  if (counted) return;
  counted = true;
  stats.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}

const statStrip = document.querySelector('.stat-strip');
if (statStrip) {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateStats();
    });
  }, { threshold: 0.3 });
  statObserver.observe(statStrip);
}

// Hero parallax — background drifts slower than scroll for depth
const heroEl = document.querySelector('.hero');
const heroBgEl = document.querySelector('.hero-bg');
if (heroEl && heroBgEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const rect = heroEl.getBoundingClientRect();
    if (rect.bottom < 0) return;
    const offset = Math.min(Math.max(window.scrollY * 0.06, 0), 40);
    heroBgEl.style.backgroundPositionY = `calc(28% + ${offset}px)`;
  }, { passive: true });
}

// Scroll-reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));
