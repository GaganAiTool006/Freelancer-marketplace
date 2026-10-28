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

// =========================================================
// OrbitTime interactions: accessible motion + visual details
// =========================================================
(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const iconPaths = {
    arrowUpRight: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 14 .9 2.6L22.5 17l-2.6.9L19 20.5l-.9-2.6-2.6-.9 2.6-.4L19 14Z"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    play: '<path d="M7 4.8a1 1 0 0 1 1.5-.86l10.8 6.2a1 1 0 0 1 0 1.72l-10.8 6.2A1 1 0 0 1 7 17.2Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.2a4 4 0 0 1 0 7.6"/>',
    chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    workflow: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h2a2 2 0 0 1 2 2v3.5M17.5 14v-2a2 2 0 0 0-2-2H10"/>',
    wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M16 14h.01"/><path d="M6 5V3h12v2"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M20.2 15a8.5 8.5 0 1 0-16.4 0"/><path d="M5 19h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    zap: '<path d="m13 2-3 8h7l-6 12 1-9H5l8-11Z"/>',
    chartColumn: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6" rx=".5"/><rect x="13" y="7" width="3" height="10" rx=".5"/><rect x="19" y="4" width="2" height="13" rx=".5"/>',
    receipt: '<path d="M4 2v20l4-2 4 2 4-2 4 2V2l-4 2-4-2-4 2-4-2Z"/><path d="M8 9h8M8 13h6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-1.2 1-1.8 1.3-1.8 2.7"/><path d="M12 17h.01"/>',
    bot: '<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M9 13h.01M15 13h.01M9 17h6M2 12h2M20 12h2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12" rx="1"/><circle cx="4" cy="4" r="2"/>',
    x: '<path d="M4 4l16 16M20 4 4 20"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    youtube: '<path d="M22 12s0-4-1-5-3-1-9-1-8 0-9 1-1 5-1 5 0 4 1 5 3 1 9 1 8 0 9-1 1-5 1-5Z"/><path d="m10 9 5 3-5 3Z"/>'
  };

  const icon = (name) => {
    const shape = iconPaths[name] || iconPaths.sparkles;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ui-icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = shape;
    return svg;
  };
  const replaceIcon = (element, name) => {
    if (!element) return;
    element.replaceChildren(icon(name));
    element.classList.add('icon-replaced');
  };
  const replaceTextGlyph = (selector, glyph, name) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.textContent.trim() === glyph) replaceIcon(element, name);
    });
  };

  replaceTextGlyph('.sparkle', '✦', 'sparkles');
  replaceTextGlyph('.cta-sparkle', '✦', 'sparkles');
  replaceTextGlyph('.chevron', '⌄', 'chevronDown');
  replaceTextGlyph('.play-icon', '▶', 'play');
  replaceTextGlyph('.tiny-icon.blue', '▶', 'gauge');
  replaceTextGlyph('.tiny-icon.green', '✓', 'check');
  replaceTextGlyph('.metric-icon.teal', '◷', 'clock');
  replaceTextGlyph('.metric-icon.violet', '▤', 'chart');
  replaceTextGlyph('.metric-icon.sky', '⌁', 'check');
  replaceTextGlyph('.step-green', '◷', 'clock');
  replaceTextGlyph('.step-blue', '☷', 'check');
  replaceTextGlyph('.step-purple', '⌁', 'chartColumn');
  replaceTextGlyph('.step-dark', '▣', 'receipt');
  replaceTextGlyph('.help-icon', '?', 'help');
  replaceTextGlyph('.badge-check', '✓', 'check');
  replaceTextGlyph('.badge-trend', '↗', 'arrowUpRight');
  replaceTextGlyph('.price-icon.pale-blue', '↗', 'chart');
  replaceTextGlyph('.price-icon.pale-green', '⌁', 'zap');
  replaceTextGlyph('.price-icon.pale-slate', '◈', 'shield');
  replaceTextGlyph('.benefit-icon.turquoise', '⌁', 'clock');
  replaceTextGlyph('.benefit-icon.blue', '◈', 'chart');
  replaceTextGlyph('.benefit-icon.purple', '✧', 'sparkles');

  const featureIconNames = ['clock', 'bot', 'chart', 'workflow', 'wallet', 'shield'];
  document.querySelectorAll('.feature-card .feature-icon').forEach((element, index) => {
    replaceIcon(element, featureIconNames[index] || 'sparkles');
  });
  document.querySelectorAll('.social-links a').forEach((element) => {
    const label = (element.getAttribute('aria-label') || '').toLowerCase();
    const name = label.includes('linkedin') ? 'linkedin' : label.includes('instagram') ? 'instagram' : label.includes('youtube') ? 'youtube' : 'x';
    replaceIcon(element, name);
  });
  document.querySelectorAll('span').forEach((element) => {
    if (element.textContent.trim() === '↗' && !element.classList.contains('mini-menu')) {
      replaceIcon(element, 'arrowUpRight');
      element.classList.add('button-icon');
    }
  });
  document.querySelectorAll('.email-field button').forEach((element) => replaceIcon(element, 'arrowUpRight'));

  // Add a subtle reading indicator and a calmer sticky header.
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  const progressFill = document.createElement('span');
  progress.append(progressFill);
  document.body.prepend(progress);

  let scrollFrame = 0;
  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
    progressFill.style.width = percent + '%';
    document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 10);
    scrollFrame = 0;
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollUI);
  }, { passive: true });
  updateScrollUI();

  // Reveal cards and sections only as they approach the viewport.
  const revealTargets = document.querySelectorAll(
    '.section-heading, .stats-grid > div, .trusted, .feature-card, .impact-copy, .impact-visual, .benefit, .team-intro, .team-card, .step, .testimonial-card, .price-card, .pricing-help, .final-cta-content, .footer-about, .footer-column'
  );
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    document.documentElement.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    revealTargets.forEach((element, index) => {
      element.classList.add('reveal');
      if (element.matches('.feature-card,.team-card,.step,.testimonial-card,.price-card')) {
        element.style.setProperty('--reveal-delay', (index % 4) * 65 + 'ms');
        element.classList.add('reveal-soft');
      }
      revealObserver.observe(element);
    });
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }

  // Animate the proof-point numbers once, respecting their original labels.
  const counters = [];
  document.querySelectorAll('.stats-grid strong').forEach((element) => {
    const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (!textNode) return;
    const match = textNode.nodeValue.trim().match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) return;
    counters.push({ element, textNode, value: Number(match[1]), precision: (match[1].split('.')[1] || '').length, suffix: match[2] });
  });
  const animateCounter = (counter) => {
    if (counter.done) return;
    counter.done = true;
    if (prefersReducedMotion) return;
    const start = performance.now();
    const duration = 1050;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const number = counter.value * eased;
      counter.textNode.nodeValue = number.toFixed(counter.precision) + counter.suffix;
      if (t < 1) requestAnimationFrame(step);
      else counter.textNode.nodeValue = counter.value.toFixed(counter.precision) + counter.suffix;
    };
    requestAnimationFrame(step);
  };
  const stats = document.querySelector('.stats-grid');
  if (stats && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      counters.forEach(animateCounter);
      observer.disconnect();
    }, { threshold: 0.35 });
    counterObserver.observe(stats);
  }

  // Subtle pointer spotlight values on desktop cards.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.feature-card,.team-card,.price-card,.testimonial-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', (event.clientX - bounds.left) + 'px');
        card.style.setProperty('--pointer-y', (event.clientY - bounds.top) + 'px');
      }, { passive: true });
    });
  }

  // Small press ripple on primary actions; keeps the effect decorative.
  document.querySelectorAll('.button,.email-field button').forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
      if (prefersReducedMotion) return;
      const bounds = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'button-ripple';
      ripple.style.left = (event.clientX - bounds.left) + 'px';
      ripple.style.top = (event.clientY - bounds.top) + 'px';
      button.append(ripple);
      window.setTimeout(() => ripple.remove(), 700);
    });
  });

  // Handle image load states without hiding images if a remote source fails.
  document.querySelectorAll('img').forEach((image) => {
    const markLoaded = () => image.classList.add('image-ready');
    if (image.complete && image.naturalWidth > 0) markLoaded();
    else image.addEventListener('load', markLoaded, { once: true });
  });
})();
