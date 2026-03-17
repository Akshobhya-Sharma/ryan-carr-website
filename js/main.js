(function () {
  'use strict';

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile nav drawer
  const hamburger = document.getElementById('hamburger');
  const navDrawer = document.getElementById('nav-drawer');
  const navOverlay = document.getElementById('nav-overlay');

  if (hamburger && navDrawer && navOverlay) {
    const focusableSelectors = 'a[href], button:not([disabled])';

    function openDrawer() {
      navDrawer.setAttribute('aria-hidden', 'false');
      navOverlay.classList.add('nav-overlay--visible');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close navigation');
      document.body.style.overflow = 'hidden';
      // Move focus into drawer
      const firstFocusable = navDrawer.querySelector(focusableSelectors);
      if (firstFocusable) firstFocusable.focus();
    }

    function closeDrawer() {
      navDrawer.setAttribute('aria-hidden', 'true');
      navOverlay.classList.remove('nav-overlay--visible');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open navigation');
      document.body.style.overflow = '';
      hamburger.focus();
    }

    hamburger.addEventListener('click', () => {
      navDrawer.getAttribute('aria-hidden') === 'true' ? openDrawer() : closeDrawer();
    });

    navOverlay.addEventListener('click', closeDrawer);

    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Focus trap
    navDrawer.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = [...navDrawer.querySelectorAll(focusableSelectors)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Contact form — null-guarded
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');
  let toastTimer;

  function showToast(message, type = 'success') {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast toast--${type} toast--visible`;
    toastTimer = setTimeout(() => {
      toast.className = 'toast';
    }, 4000);
  }

  if (form && toast) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(data))
        });
        const result = await response.json();
        if (result.success) {
          showToast("Message sent! I'll be in touch soon.");
          form.reset();
        } else {
          showToast('Something went wrong. Please try again.', 'error');
        }
      } catch {
        showToast('Something went wrong. Please try again.', 'error');
      }
    });
  }

})();