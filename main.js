/* ═══════════════════════════════════════════════════════
   main.js — Portfolio Interactivity
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialise Lucide icons
  if (window.lucide) lucide.createIcons();

  /* ───── Navbar Scroll Effect ───── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ───── Mobile Navigation ───── */
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('navOverlay');

  const toggleMobileNav = () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMobileNav);
  overlay.addEventListener('click', toggleMobileNav);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) toggleMobileNav();
    });
  });

  /* ───── Active Link Highlighting ───── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ───── Scroll Reveal (Intersection Observer) ───── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ───── Animated Counter for Stats ───── */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCount(el, 0, target, 1800);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out quad
      const ease = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(start + (end - start) * ease) + '+';
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ───── Smooth-scroll polyfill for CTA buttons ───── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ───── Parallax-style blob movement on mouse ───── */
  const blobs = document.querySelectorAll('.blob');
  let mouseX = 0, mouseY = 0, blobX = 0, blobY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
  }, { passive: true });

  function moveBlobs() {
    blobX += (mouseX - blobX) * 0.04;
    blobY += (mouseY - blobY) * 0.04;
    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 0.6;
      blob.style.transform = `translate(${blobX * factor}px, ${blobY * factor}px)`;
    });
    requestAnimationFrame(moveBlobs);
  }
  moveBlobs();

  /* ───── Typing effect for hero badge (subtle) ───── */
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(10px) scale(0.96)';
    setTimeout(() => {
      badge.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0) scale(1)';
    }, 200);
  }

  /* ───── Certificate Lightbox Modal ───── */
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.querySelector('.modal-close');

  if (modal && modalImg) {
    const openModal = (trigger) => {
      const certUrl = trigger.getAttribute('data-cert-url') || trigger.src;
      const captionText = trigger.getAttribute('data-cert-caption') || 'Credential Verification';

      modalImg.src = certUrl;
      modalCaption.textContent = captionText;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Disable scroll on background
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Re-enable scroll
    };

    document.querySelectorAll('.cert-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(trigger);
      });
      // Accessibility: allow triggering via enter key if focused
      trigger.setAttribute('tabindex', '0');
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          openModal(trigger);
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    modal.addEventListener('click', (e) => {
      // Close only if clicking the background overlay
      if (e.target === modal || e.target.classList.contains('modal-content-wrapper')) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }
});
