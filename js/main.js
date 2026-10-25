/* ==========================================================================
   Cairn Browser Website — main.js
   Interactive behaviors, Theme switcher, Store launcher, Outrageous edition
   ========================================================================== */

(function () {
  'use strict';

  /* ── THEME SWITCHER (DARK BROWSER THEME VS LIGHT THEME) ─────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('cairn-theme');

  // Default to authentic Cairn dark-theme unless user explicitly chose light
  if (storedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('cairn-theme', 'light');
        showToast('Switched to Light Theme');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('cairn-theme', 'dark');
        showToast('Switched to Cairn Dark (Browser Theme)');
      }
    });
  }

  /* ── NAV: SCROLL SHADOW ─────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── NAV: ACTIVE LINK HIGHLIGHT ON SCROLL ───────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNavLink() {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + currentId);
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ── HAMBURGER MOBILE MENU ──────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  /* ── MICROSOFT STORE ACTION BUTTONS ─────────────────────────────────────── */
  document.querySelectorAll('[data-store-uri]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const storeUri = btn.getAttribute('data-store-uri');
      if (storeUri && navigator.userAgent.indexOf('Windows') !== -1) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = storeUri;
        document.body.appendChild(iframe);
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 2000);
      }
    });
  });

  /* ── OUTRAGEOUS EDITION BUTTONS ─────────────────────────────────────────── */
  document.querySelectorAll('[data-edition="outrageous"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href === '#outrageous-download' || href === '#downloads-outrageous') {
        e.preventDefault();
        showToast('Outrageous Edition standalone build will be published here shortly. Stay tuned!');
      }
    });
  });

  /* ── SCROLL REVEAL OBSERVER ─────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  // Immediately make deep-linked section visible if opened with a hash (e.g. #onion-guide)
  if (window.location.hash) {
    const targetSection = document.querySelector(window.location.hash);
    if (targetSection) {
      targetSection.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '60px 0px 60px 0px' });

    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 60 && rect.bottom > -60) {
        el.classList.add('visible');
      } else {
        revealObserver.observe(el);
      }
    });

    // Enable reveal transitions only for remaining off-screen elements
    requestAnimationFrame(() => {
      document.documentElement.classList.add('js-reveal');
    });
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ── FAQ ACCORDION ──────────────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ── COPY CODE SNIPPET BUTTON ───────────────────────────────────────────── */
  document.querySelectorAll('.btn-copy-code').forEach(copyBtn => {
    copyBtn.addEventListener('click', () => {
      const textToCopy = copyBtn.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          copyBtn.style.background = '#10b981';
          copyBtn.style.color = '#ffffff';
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
          }, 2000);
        }).catch(() => {
          fallbackCopyText(textToCopy, copyBtn);
        });
      } else {
        fallbackCopyText(textToCopy, copyBtn);
      }
    });
  });

  function fallbackCopyText(text, btn) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = originalText; }, 2000);
    } catch (err) {
      console.warn('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }

  /* ── SMOOTH SCROLL OFFSET FOR ANCHOR LINKS ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.startsWith('#outrageous-download')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── DYNAMIC FOOTER YEAR ────────────────────────────────────────────────── */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── TOAST NOTIFICATION UTILITY ─────────────────────────────────────────── */
  function showToast(message) {
    let toast = document.getElementById('cairn-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cairn-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3600);
  }

})();
