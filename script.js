const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

const billingToggle = document.getElementById('billingToggle');
if (billingToggle) {
  billingToggle.addEventListener('click', () => {
    const yearly = billingToggle.getAttribute('aria-pressed') !== 'true';
    billingToggle.setAttribute('aria-pressed', String(yearly));
    billingToggle.setAttribute('aria-label', yearly ? 'Switch to monthly billing' : 'Switch to yearly billing');
    document.querySelectorAll('.price strong[data-monthly]').forEach((price) => {
      price.textContent = yearly ? price.dataset.yearly : price.dataset.monthly;
    });
    document.querySelectorAll('.billing-word').forEach((label) => {
      label.textContent = yearly ? 'annually' : 'monthly';
    });
  });
}

const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
if (newsletterForm && newsletterMessage) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = document.getElementById('emailInput');
    if (!emailInput || !emailInput.checkValidity()) {
      emailInput?.reportValidity();
      return;
    }
    newsletterMessage.textContent = 'Thanks! Connect this form to your email service to collect subscribers.';
    newsletterForm.reset();
  });
}

const toast = document.getElementById('toast');
let toastTimeout;
document.querySelectorAll('a[href="#contact"]').forEach((link) => {
  if (link.getAttribute('href') === '#contact') return;
  link.addEventListener('click', () => {});
});

// Keep anchor navigation native; use this helper for any future non-navigation actions.
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 2800);
}