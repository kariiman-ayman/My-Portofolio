if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* ---------- Mobile navigation ---------- */

const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');

if (navbar && navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navbar.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navbar.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Theme toggle ---------- */

const themeToggle = document.querySelector('.themeToggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const lightBg = '#f5f4f2';
const darkBg = '#151312';

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', theme === 'light' ? lightBg : darkBg);
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight =
      document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

/* ---------- Hero typewriter ---------- */

const typePlain = document.querySelector('.typePlain');
const typeAccent = document.querySelector('.typeAccent');
const cursor = document.querySelector('.cursor');

if (!reduceMotion && typePlain && typeAccent && cursor) {
  const plainText = typePlain.textContent;
  const accentText = typeAccent.textContent;
  typePlain.textContent = '';
  typeAccent.textContent = '';

  let i = 0;
  function typePlainChar() {
    if (i <= plainText.length) {
      typePlain.textContent = plainText.slice(0, i);
      i += 1;
      setTimeout(typePlainChar, 90);
    } else {
      i = 0;
      setTimeout(typeAccentChar, 120);
    }
  }

  function typeAccentChar() {
    if (i <= accentText.length) {
      typeAccent.textContent = accentText.slice(0, i);
      i++;
      setTimeout(typeAccentChar, 90);
    }
  }

  setTimeout(typePlainChar, 300);
}

/* ---------- Scroll reveal ---------- */

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  document.documentElement.classList.remove('js');
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('revealed');
  });
}

/* ---------- Active nav section ---------- */

const navAnchors = document.querySelectorAll('.nav-links a');
const sectionIds = [
  '#home',
  '#about',
  '#experience',
  '#skills',
  '#projects',
  '#contact',
];
const sections = sectionIds
  .map((id) => document.querySelector(id))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => {
          a.classList.toggle(
            'active',
            a.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

/* ---------- Counters ---------- */

const countsSection = document.querySelector('[data-counts]');
const countElements = document.querySelectorAll('[data-count]');

function animateCounts() {
  countElements.forEach((el) => {
    const target = el.getAttribute('data-count') || '0';
    if (target === 'A+') {
      el.textContent = 'A+';
      return;
    }
    const isPlus = target.startsWith('+');
    const numericTarget = parseFloat(isPlus ? target.slice(1) : target);
    if (Number.isNaN(numericTarget)) {
      el.textContent = target;
      return;
    }

    if (reduceMotion) {
      el.textContent = isPlus ? `+${numericTarget}` : String(numericTarget);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (numericTarget * eased).toFixed(
        numericTarget % 1 === 0 ? 0 : 2
      );
      el.textContent = isPlus ? `+${current}` : current;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  });
}

if (countsSection && 'IntersectionObserver' in window && countElements.length > 0) {
  const countsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounts();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  countsObserver.observe(countsSection);
} else if (countElements.length > 0) {
  animateCounts();
}

/* ---------- Back to top ---------- */

const backToTop = document.querySelector('.backToTop');
const homeSection = document.getElementById('home');

if (backToTop && homeSection && 'IntersectionObserver' in window) {
  const backToTopObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        backToTop.classList.toggle('visible', !entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );
  backToTopObserver.observe(homeSection);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ---------- Footer year ---------- */

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}
