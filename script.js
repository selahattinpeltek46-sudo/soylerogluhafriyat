// Navbar: transparent over hero, solid after scroll
const navbar = document.getElementById('navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

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

// Hero: settle the initial slow zoom-out once loaded
const hero = document.getElementById('hero');
requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('loaded')));

// Hero parallax — very light depth on mouse move (desktop only)
const heroImg = document.querySelector('.hero-media img');
if (window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    heroImg.style.transform = `scale(1.03) translate(${x}px, ${y}px)`;
  });
  hero.addEventListener('mouseleave', () => { heroImg.style.transform = ''; });
}

// Animated stat counters
const counts = document.querySelectorAll('.stat-count');
let counted = false;
function animateStats() {
  if (counted) return;
  counted = true;
  counts.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1300;
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
const statBand = document.querySelector('.stat-band');
if (statBand) {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) animateStats(); });
  }, { threshold: 0.3 });
  statObserver.observe(statBand);
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
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// Process timeline — steps activate as they enter view
const tlSteps = document.querySelectorAll('.tl-step');
if (tlSteps.length) {
  const tlObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.5 });
  tlSteps.forEach(step => tlObserver.observe(step));
}

// Masonry lightbox
const masonry = document.getElementById('masonry');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

if (masonry) {
  const items = Array.from(masonry.querySelectorAll('.masonry-item[data-full]'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = items[currentIndex].dataset.full;
    lightboxImg.alt = items[currentIndex].querySelector('img').alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showRelative(delta) {
    currentIndex = (currentIndex + delta + items.length) % items.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = items[currentIndex].dataset.full;
      lightboxImg.alt = items[currentIndex].querySelector('img').alt;
      lightboxImg.style.opacity = '1';
    }, 120);
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showRelative(-1));
  lightboxNext.addEventListener('click', () => showRelative(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });
}

// Quote form — builds a WhatsApp message (no backend on GitHub Pages)
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(quoteForm);
    const lines = [
      'Merhaba, teklif formu üzerinden ulaşıyorum:',
      `Ad Soyad: ${data.get('adSoyad') || '-'}`,
      `Telefon: ${data.get('telefon') || '-'}`,
      `Firma Adı: ${data.get('firma') || '-'}`,
      `İş Türü: ${data.get('isTuru') || '-'}`,
      `Lokasyon: ${data.get('lokasyon') || '-'}`,
      `Tahmini İş Tarihi: ${data.get('tarih') || '-'}`,
      `Mesaj: ${data.get('mesaj') || '-'}`
    ];
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/905376157437?text=${text}`, '_blank', 'noopener');
  });
}
