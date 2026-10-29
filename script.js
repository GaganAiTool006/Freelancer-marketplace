(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.reading-progress span');
  const toast = document.querySelector('.toast');

  if (navToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    };
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      navLinks.classList.toggle('open', open);
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Scroll progress stays smooth without doing layout work on every scroll event.
  let scrollPending = false;
  const updateScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollHeight > 0 ? Math.min(100, (window.scrollY / scrollHeight) * 100) : 0;
    if (progress) progress.style.width = percentage + '%';
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    scrollPending = false;
  };
  window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    window.requestAnimationFrame(updateScroll);
  }, { passive: true });
  updateScroll();

  // Reveal sections and cards when they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', (index % 4) * 45 + 'ms');
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }


  // Ensure scroll-reveal applies to every service/project card, even if markup is expanded later.
  const scrollCards = document.querySelectorAll('.service-card, .project-card, .skill-card, .tool-card');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -18px 0px' });
    scrollCards.forEach((card, index) => {
      card.classList.add('reveal');
      card.style.setProperty('--reveal-delay', (index % 3) * 80 + 'ms');
      cardObserver.observe(card);
    });
  } else {
    scrollCards.forEach((card) => card.classList.add('is-visible'));
  }


  // Desktop pointer magnifier inspired by the supplied Dribbble reference.
  const heroShell = document.querySelector('.hero-shell');
  const magnifier = document.querySelector('.interactive-lens');
  if (heroShell && magnifier && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let lensFrame = 0;
    heroShell.addEventListener('pointerenter', () => heroShell.classList.add('lens-active'));
    heroShell.addEventListener('pointerleave', () => heroShell.classList.remove('lens-active'));
    heroShell.addEventListener('pointermove', (event) => {
      if (lensFrame) return;
      lensFrame = window.requestAnimationFrame(() => {
        const bounds = heroShell.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        magnifier.style.transform = 'translate3d(' + (x - 107) + 'px,' + (y - 107) + 'px,0)';
        lensFrame = 0;
      });
    }, { passive: true });
  }

  // Keep footer year current.
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Button press feedback adds a quick ripple, but never blocks navigation.
  if (!reduceMotion) {
    document.querySelectorAll('.button').forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'button-ripple';
        ripple.style.left = (event.clientX - rect.left) + 'px';
        ripple.style.top = (event.clientY - rect.top) + 'px';
        button.appendChild(ripple);
        window.setTimeout(() => ripple.remove(), 700);
      });
    });
  }

  // Tiny toast helper for future front-end interactions.
  let toastTimeout;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 3000);
  };

  // Use the custom cards as intentional concept previews, not fake client case studies.
  document.querySelectorAll('.project-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', card.querySelector('.project-info h3')?.textContent + ' — UI concept');
  });

  // Prevent placeholders from being mistaken for broken links.
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  // Expose no global variables; the contact area uses real profile links for now.
  window.addEventListener('load', () => {
    document.body.classList.add('page-ready');
  }, { once: true });
})();