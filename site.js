// Shared script for subpages (service/landing/blog pages)

const navbar = document.getElementById('navbar');
if (navbar) {
  function updateNavbar() { navbar.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
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
}

const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
}

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

// Sahadan lightbox (self-contained, for pages that include #sahadanGrid + #lightbox)
const sahadanGrid = document.getElementById('sahadanGrid');
const lightbox = document.getElementById('lightbox');
if (sahadanGrid && lightbox) {
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const items = Array.from(sahadanGrid.querySelectorAll('.sahadan-photo[data-full]'));
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

// Sahadan videos — click-to-load (no MP4 request until the user actually plays it)
document.querySelectorAll('.sahadan-video[data-video-src]').forEach(tile => {
  tile.addEventListener('click', () => {
    const src = tile.dataset.videoSrc;
    if (!src) return;
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.src = src;
    tile.innerHTML = '';
    tile.appendChild(video);
    video.play();
  }, { once: true });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    item.classList.toggle('open', !isOpen);
    a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
  });
});
