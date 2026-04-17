'use strict';

function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > nav.offsetHeight);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const html   = document.documentElement;
  const STORAGE_KEY = 'fer-portfolio-theme';

  /**
   * Determine initial theme:
   * localStorage, System preference or Default (light)
   */
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);

    if (toggle) {
      const isDark = theme === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';

    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  applyTheme(getInitialTheme());

  // Listen for toggle click
  if (toggle) {
    toggle.addEventListener('click', toggleTheme);
  }

  // Sync with system preference 
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
}


function initCvModal() {
  const modal   = document.getElementById('cv-modal');
  const trigger = document.getElementById('cv-trigger');
  const close   = document.getElementById('cv-close');

  if (!modal || !trigger || !close) return;

  function openModal() {
    modal.showModal();
    close.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.close();
    document.body.style.overflow = '';
    trigger.focus();
  }

  trigger.addEventListener('click', openModal);
  close.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left  ||
      e.clientX > rect.right ||
      e.clientY < rect.top   ||
      e.clientY > rect.bottom;
    if (clickedOutside) closeModal();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();  
  initNav();
  initReveal();
  initCvModal();
});
