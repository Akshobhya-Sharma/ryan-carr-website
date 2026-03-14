(function () {
  'use strict';

  // Set current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Smooth scroll for anchor links (optional)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

// Form submit toast trigger
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

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    });

    const result = await response.json();

    if (result.success) {
      showToast('Message sent! I\'ll be in touch soon.');
      form.reset();
    } else {
      showToast('Something went wrong. Please try again.', 'error');
    }
  } catch (err) {
    showToast('Something went wrong. Please try again.', 'error');
  }
});