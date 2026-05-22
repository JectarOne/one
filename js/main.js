/* ════════════════════════════════════════════════
   JECTAR ONE — main.js
   GSAP animations, scroll, menu, form
════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── LOADER ──────────────────────────────────────
   Hide loader after minimum display time, then
   kick off the hero entrance animation.
───────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    gsap.to('#loader', {
      opacity: 0,
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete() {
        document.getElementById('loader').style.display = 'none';
        heroEntrance();
        initScrollAnimations();
      },
    });
  }, 2000);
});

/* ── NAVBAR SCROLL STATE ─────────────────────────
   Add .scrolled class once user scrolls past 50px.
───────────────────────────────────────────────── */
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── MOBILE MENU ─────────────────────────────────
   Toggle the fullscreen overlay menu + animate
   hamburger lines into an X.
───────────────────────────────────────────────── */
const mobileMenu = document.getElementById('mobile-menu');
const hamBtn     = document.querySelector('.nav__ham');

window.toggleMenu = function () {
  const isOpen = mobileMenu.classList.toggle('open');
  hamBtn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
};

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    toggleMenu();
  }
});

/* ── SMOOTH SCROLL ───────────────────────────────
   Intercept anchor clicks and use GSAP ScrollTo
   for a cinematic glide effect.
───────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (mobileMenu.classList.contains('open')) toggleMenu();
    gsap.to(window, {
      duration: 1.15,
      scrollTo: { y: target, offsetY: 68 },
      ease: 'power3.inOut',
    });
  });
});

/* ── HERO ENTRANCE ───────────────────────────────
   Staggered reveal of each hero element after
   the loader exits.
───────────────────────────────────────────────── */
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero__badge',  { opacity: 0, y: 22, duration: 0.6 })
    .from('.hero__title',  { opacity: 0, y: 44, duration: 0.85 }, '-=0.35')
    .from('.hero__sub',    { opacity: 0, y: 30, duration: 0.7  }, '-=0.55')
    .from('.hero__ctas',   { opacity: 0, y: 22, duration: 0.6  }, '-=0.45')
    .from('.hero__stats',  { opacity: 0, y: 18, duration: 0.55 }, '-=0.4')
    .from('.hero__poster', { opacity: 0, x: 50, duration: 0.95 }, '-=0.8');
}

/* ── SCROLL REVEAL ───────────────────────────────
   Observe all elements with .reveal / .reveal-left
   / .reveal-right — add .on when they enter the
   viewport. Runs once per element.
───────────────────────────────────────────────── */
function initScrollAnimations() {
  // Generic intersection-based reveals
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));

  // ── Service cards stagger ──
  gsap.utils.toArray('.svc-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 0.55,
          delay: (i % 4) * 0.08,
          ease: 'power3.out',
        }),
    });
  });

  // ── Portfolio cards stagger ──
  gsap.utils.toArray('.port-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.from(card, {
          opacity: 0,
          scale: 0.96,
          duration: 0.65,
          delay: i * 0.07,
          ease: 'power3.out',
        }),
    });
  });

  // ── Process steps stagger ──
  gsap.utils.toArray('.step-card').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.from(el, {
          opacity: 0,
          x: -20,
          duration: 0.5,
          delay: i * 0.08,
          ease: 'power3.out',
        }),
    });
  });

  // ── Testimonial cards stagger ──
  gsap.utils.toArray('.testi-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.from(card, {
          opacity: 0,
          y: 26,
          duration: 0.6,
          delay: i * 0.13,
          ease: 'power3.out',
        }),
    });
  });

  // ── Tech badges stagger ──
  gsap.utils.toArray('.tech-badge').forEach((badge, i) => {
    ScrollTrigger.create({
      trigger: badge,
      start: 'top 96%',
      once: true,
      onEnter: () =>
        gsap.from(badge, {
          opacity: 0,
          scale: 0.7,
          duration: 0.4,
          delay: i * 0.04,
          ease: 'back.out(1.7)',
        }),
    });
  });
}

/* ── CONTACT FORM ────────────────────────────────
   Simulates sending — swap button state, reset
   after 3s. Replace with real backend as needed.
───────────────────────────────────────────────── */
window.handleSubmit = function (e) {
  e.preventDefault();
  const btn  = e.target.querySelector('button[type="submit"]');
  const text = btn.querySelector('.btn-text');

  btn.disabled = true;
  text.textContent = 'Sending…';

  setTimeout(() => {
    text.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
      text.textContent = 'Send Message →';
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 3200);
  }, 1700);
};

/* ── FAQ ACCORDION ───────────────────────────────
   Toggles the .open class on accordion items.
   Calculates max-height dynamically for smooth transitions.
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;
    
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });
      
      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = null;
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
});
