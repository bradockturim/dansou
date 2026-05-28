/* ================================================
   STUDIO DE DANÇA BÁRBARA BERTOLDO — DANSOU
   Scripts Principais
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Lucide Icons ──────────────────────────── */
  if (typeof lucide !== 'undefined') lucide.createIcons();

  /* ── Navbar scroll ─────────────────────────── */
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Active nav link ───────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  function updateActiveLink() {
    const currentHash = window.location.hash;
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
      const href = link.getAttribute('href');
      const [hrefPage, hrefAnchor] = href.split('#');
      const hrefHash = hrefAnchor ? '#' + hrefAnchor : '';
      const pageMatch = hrefPage === currentPage || (currentPage === '' && hrefPage === 'index.html');
      const isActive = currentHash
        ? pageMatch && hrefHash === currentHash
        : pageMatch && !hrefHash;
      link.classList.toggle('active', isActive);
    });
  }
  updateActiveLink();
  window.addEventListener('hashchange', updateActiveLink);

  /* ── Mobile menu ───────────────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-mobile a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Hero loaded (Ken Burns) ───────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  /* ── Scroll reveal ─────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ── Counter animation ─────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const update = (time) => {
          const elapsed = time - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* ── Cookie banner (LGPD + GTM Consent Mode) ── */
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieKey = 'dansou_cookies_accepted';
  window.dataLayer = window.dataLayer || [];

  if (cookieBanner && !localStorage.getItem(cookieKey)) {
    setTimeout(() => cookieBanner.classList.add('show'), 1200);
  }

  document.querySelector('.cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem(cookieKey, '1');
    cookieBanner?.classList.remove('show');
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', { 'ad_storage': 'granted', 'analytics_storage': 'granted' });
    }
    window.dataLayer.push({ 'event': 'cookie_consent_granted' });
  });

  document.querySelector('.cookie-decline')?.addEventListener('click', () => {
    cookieBanner?.classList.remove('show');
    window.dataLayer.push({ 'event': 'cookie_consent_denied' });
  });

  /* ── WhatsApp click tracking ───────────────── */
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          event_category: 'CTA',
          event_label: link.dataset.origin || 'generic',
        });
      }
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact');
      }
    });
  });

  /* ── Form submit (WhatsApp redirect) ─────── */
  const contactForm = document.querySelector('.contact-form-js');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="nome"]')?.value || '';
    const modal = contactForm.querySelector('[name="modalidade"]')?.value || '';
    const msg = encodeURIComponent(
      `Olá! Meu nome é *${name}* e tenho interesse em ${modal ? 'conhecer mais sobre *' + modal + '*' : 'agendar uma aula experimental'} no Studio Dansou. 😊`
    );
    window.open(`https://wa.me/5511948157394?text=${msg}`, '_blank');
  });

  /* ── Smooth scroll para âncoras ────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

});
