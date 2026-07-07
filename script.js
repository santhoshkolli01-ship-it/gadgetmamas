/**
 * GadgetMamas — Coming Soon Landing Page
 * Vanilla JavaScript: countdown, scroll animations,
 * parallax, particles, newsletter, navigation
 */

(function () {
  'use strict';

  /* --- DOM References --- */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navDrawer = document.getElementById('navDrawer');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.getElementById('navLinks');
  const newsletterForm = document.getElementById('newsletterForm');
  const formMessage = document.getElementById('formMessage');
  const heroMascot = document.getElementById('heroMascot');
  const particlesContainer = document.getElementById('particles');
  const starsContainer = document.getElementById('stars');
  const celebrationOverlay = document.getElementById('celebrationOverlay');

  const BURST_EMOJIS = ['🎉', '🎊', '✨', '💥', '⭐', '🎈', '💜', '🔥', '🚀', '💫'];

  /* --- Electronics icons for background particles --- */
  const ELECTRONICS_ICONS = ['📱', '💻', '⌚', '🎧', '🔋', '📷', '🎮', '🔌', '💡', '🖥️', '📡', '🔊'];

  /* --- Initialize --- */
  function init() {
    initParticles();
    initStars();
    initHeaderScroll();
    initMobileNav();
    initScrollAnimations();
    initCountdown();
    initProgressBar();
    initParallax();
    initNewsletter();
    initSmoothNavClose();
  }

  /* --- Background Particles --- */
  function initParticles() {
    if (!particlesContainer) return;

    const count = window.innerWidth < 640 ? 12 : 20;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.textContent = ELECTRONICS_ICONS[Math.floor(Math.random() * ELECTRONICS_ICONS.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (15 + Math.random() * 20) + 's';
      particle.style.animationDelay = (Math.random() * 15) + 's';
      particle.style.fontSize = (10 + Math.random() * 10) + 'px';
      particlesContainer.appendChild(particle);
    }
  }

  /* --- Background Stars --- */
  function initStars() {
    if (!starsContainer) return;

    const count = window.innerWidth < 640 ? 30 : 50;

    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = (Math.random() * 3) + 's';
      star.style.animationDuration = (2 + Math.random() * 2) + 's';

      if (Math.random() > 0.7) {
        star.style.width = '4px';
        star.style.height = '4px';
      }

      starsContainer.appendChild(star);
    }
  }

  /* --- Header Scroll Effect --- */
  function initHeaderScroll() {
    if (!header) return;

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile Navigation --- */
  function setMenuOpen(isOpen) {
    if (navDrawer) navDrawer.classList.toggle('open', isOpen);
    if (navOverlay) navOverlay.classList.toggle('visible', isOpen);
    if (navToggle) {
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close game menu' : 'Open game menu');
    }
    if (navDrawer) navDrawer.setAttribute('aria-hidden', !isOpen);
    if (navOverlay) navOverlay.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function initMobileNav() {
    if (!navToggle || !navDrawer) return;

    navToggle.addEventListener('click', function () {
      setMenuOpen(!navDrawer.classList.contains('open'));
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', function () {
        setMenuOpen(false);
      });
    }
  }

  /* --- Close mobile nav on link click --- */
  function initSmoothNavClose() {
    if (!navLinks) return;

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });
  }

  /* --- Scroll Fade-in Animations --- */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-scroll');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Fake Countdown Timer --- */
  function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    /* Start from specified values: 45d 08h 20m 40s */
    let totalSeconds =
      45 * 86400 +
      8 * 3600 +
      20 * 60 +
      40;

    const prevValues = { days: '', hours: '', minutes: '', seconds: '' };

    function pad(num) {
      return String(num).padStart(2, '0');
    }

    function animateFlip(el, newVal, key) {
      if (prevValues[key] !== newVal) {
        el.classList.remove('flip');
        void el.offsetWidth;
        el.classList.add('flip');
        el.textContent = newVal;
        prevValues[key] = newVal;
      }
    }

    function tick() {
      if (totalSeconds <= 0) {
        totalSeconds = totalSeconds + 86400;
      }

      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      animateFlip(daysEl, String(days), 'days');
      animateFlip(hoursEl, pad(hours), 'hours');
      animateFlip(minutesEl, pad(minutes), 'minutes');
      animateFlip(secondsEl, pad(seconds), 'seconds');

      totalSeconds--;
    }

    tick();
    setInterval(tick, 1000);
  }

  /* --- Animated Progress Bar --- */
  function initProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressLabel = document.getElementById('progressLabel');

    if (!progressFill) return;

    const target = 75;
    let current = 0;

    const observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          animateProgress();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const section = document.querySelector('.coming-soon');
    if (section) observer.observe(section);

    function animateProgress() {
      const interval = setInterval(function () {
        current += 1;
        progressFill.style.width = current + '%';
        if (progressLabel) progressLabel.textContent = current + '%';

        if (current >= target) {
          clearInterval(interval);
        }
      }, 20);
    }
  }

  /* --- Mouse Parallax --- */
  function initParallax() {
    const floatingGadgets = document.querySelector('.floating-gadgets');

    if (!floatingGadgets && !heroMascot) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function animateParallax() {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      if (floatingGadgets) {
        floatingGadgets.style.transform =
          'translate(' + (currentX * 18) + 'px, ' + (currentY * 18) + 'px)';
      }

      if (heroMascot) {
        heroMascot.style.transform =
          'translate(' + (currentX * 10) + 'px, ' + (currentY * 10) + 'px)';
      }

      requestAnimationFrame(animateParallax);
    }

    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      animateParallax();
    }
  }

  /* --- Newsletter Form (Frontend Only) --- */
  function initNewsletter() {
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('email');
      const email = emailInput.value.trim();

      formMessage.className = 'form-message';

      if (!email) {
        formMessage.textContent = 'Please enter your email address.';
        formMessage.classList.add('error');
        emailInput.focus();
        return;
      }

      if (!isValidEmail(email)) {
        formMessage.textContent = 'That doesn\'t look like a valid email. Try again!';
        formMessage.classList.add('error');
        emailInput.focus();
        return;
      }

      formMessage.textContent = '🎉 You\'re on the VIP list! We\'ll ping you when GadgetMamas drops in Rajahmundry!';
      formMessage.classList.add('success');
      emailInput.value = '';

      triggerCelebration();

      const btn = newsletterForm.querySelector('.btn-notify');
      if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '✓ You\'re In! 🎊';
        btn.style.pointerEvents = 'none';

        setTimeout(function () {
          btn.innerHTML = originalHTML;
          btn.style.pointerEvents = '';
        }, 3000);
      }
    });
  }

  /* --- Celebration burst on subscribe --- */
  function triggerCelebration() {
    if (!celebrationOverlay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    celebrationOverlay.innerHTML = '';
    celebrationOverlay.classList.add('active');
    celebrationOverlay.setAttribute('aria-hidden', 'false');

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const count = window.innerWidth < 640 ? 24 : 40;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'burst-particle';
      particle.textContent = BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)];
      particle.style.left = cx + 'px';
      particle.style.top = cy + 'px';

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 120 + Math.random() * 280;
      particle.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      particle.style.setProperty('--by', Math.sin(angle) * dist + 'px');
      particle.style.animationDelay = Math.random() * 0.2 + 's';
      particle.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';

      celebrationOverlay.appendChild(particle);
    }

    setTimeout(function () {
      celebrationOverlay.classList.remove('active');
      celebrationOverlay.innerHTML = '';
      celebrationOverlay.setAttribute('aria-hidden', 'true');
    }, 1400);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* --- Boot --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
