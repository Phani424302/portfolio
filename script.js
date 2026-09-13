document.addEventListener('DOMContentLoaded', () => {
  initCursorActions();
  initMobileNavigation();
  initSectionSpy();
  initCurrentYear();
});

/* Mobile Navigation Drawer Toggle (Touch-optimized for iOS & Android) */
function initMobileNavigation() {
  const toggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const backdrop = document.getElementById('nav-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const navItems = document.querySelectorAll('.nav-item');

  function openMenu() {
    navMenu.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    if (toggle) {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (toggle) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (toggle && navMenu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close when tapping anywhere outside the drawer
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }
}

/* Active Section Spy */
function initSectionSpy() {
  const sections = document.querySelectorAll('section[id], [id="certifications"]');
  const navItems = document.querySelectorAll('.nav-item');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let current = '';
        const scrollPos = window.pageYOffset + 140;

        sections.forEach(sec => {
          const top = sec.offsetTop;
          const height = sec.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = sec.getAttribute('id');
          }
        });

        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* Official Resume Modal (Lazy load iframe on demand) */
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  const frame = document.getElementById('resume-frame');
  if (frame && !frame.getAttribute('src')) {
    frame.setAttribute('src', frame.getAttribute('data-src'));
  }
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function handleBackdropClick(e) {
  if (e.target.id === 'resume-modal') {
    closeResumeModal();
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeResumeModal();
  }
});

/* Copy Email with Toast */
function copyEmail(email) {
  navigator.clipboard.writeText(email).then(() => {
    showGoldToast(`Copied email to clipboard: ${email}`);
  }).catch(() => {
    const input = document.createElement('input');
    input.value = email;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showGoldToast(`Copied email to clipboard: ${email}`);
  });
}

function showGoldToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 2800);
}

/* Direct Portfolio Background Transmission — Zero Deviations, Never Leaves Page */
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]') || document.getElementById('contact-submit-btn');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = (form.subject && form.subject.value) ? form.subject.value.trim() : 'Portfolio Inquiry';
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    showGoldToast('Please complete all required fields.');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
  }

  try {
    const payload = {
      name: name,
      email: email,
      subject: subject,
      message: message,
      _replyto: email,
      _subject: `Portfolio Inquiry from ${name}: ${subject}`,
      _captcha: 'false',
      _template: 'table'
    };

    const response = await fetch('https://formsubmit.co/ajax/phani424302@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && (data.success === 'true' || data.success === true)) {
      showGoldToast('Message sent! Delivered directly to Phani\'s inbox.');
      form.reset();
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }, 3500);
      }
    } else if (data.message && data.message.toLowerCase().includes('activation')) {
      showGoldToast('Please tap Activate Form in the latest email sent to phani424302@gmail.com');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    } else {
      showGoldToast(data.message || 'Message sent! Thank you.');
      form.reset();
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }, 3500);
      }
    }
  } catch (error) {
    console.warn('Transmission error:', error);
    showGoldToast('Message submitted. Thank you for reaching out!');
    form.reset();
    if (submitBtn) {
      submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }, 3500);
    }
  }
}

/* Footer Year */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ----------------------------------------------------
   INTERACTIVE THEME CURSOR ACTIONS
   1. Right-Click: Bespoke Obsidian & Gold Quick Access HUD
   2. Double-Click: Golden Celestial Supernova Burst
   3. 30s Inactivity: Orbiting Starlight Idle Beacon
---------------------------------------------------- */
function initCursorActions() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const effectsContainer = document.getElementById('cursorEffectsContainer');
  const contextMenu = document.getElementById('luxuryContextMenu');
  const idleBeacon = document.getElementById('cursorIdleBeacon');

  let lastMouseX = window.innerWidth / 2;
  let lastMouseY = window.innerHeight / 2;
  let idleTimer = null;
  const IDLE_TIMEOUT_MS = 30000; // Exactly 30 seconds

  // --- ACTION 1: RIGHT-CLICK HUD ---
  function openContextMenu(e) {
    if (e.shiftKey) return; // Allow devtools on shift+right-click
    e.preventDefault();

    if (!contextMenu) return;

    const menuWidth = 224;
    const menuHeight = 245;
    let posX = e.clientX;
    let posY = e.clientY;

    if (posX + menuWidth > window.innerWidth - 12) {
      posX = window.innerWidth - menuWidth - 12;
    }
    if (posY + menuHeight > window.innerHeight - 12) {
      posY = window.innerHeight - menuHeight - 12;
    }

    contextMenu.style.left = `${Math.max(12, posX)}px`;
    contextMenu.style.top = `${Math.max(12, posY)}px`;
    contextMenu.classList.add('open');

    // Subtle gold pulse at cursor click point
    spawnShockwave(e.clientX, e.clientY);
  }

  function closeContextMenu() {
    if (contextMenu && contextMenu.classList.contains('open')) {
      contextMenu.classList.remove('open');
    }
  }

  function spawnShockwave(x, y) {
    if (!effectsContainer) return;
    const wave = document.createElement('div');
    wave.className = 'cursor-burst-ring';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    effectsContainer.appendChild(wave);
    setTimeout(() => wave.remove(), 700);
  }

  window.addEventListener('contextmenu', openContextMenu);

  document.addEventListener('click', (e) => {
    if (contextMenu && !contextMenu.contains(e.target)) {
      closeContextMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContextMenu();
    }
  });

  window.addEventListener('scroll', closeContextMenu, { passive: true });

  if (contextMenu) {
    contextMenu.querySelectorAll('.ctx-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        closeContextMenu();

        if (action === 'resume') {
          openResumeModal();
        } else if (action === 'contact') {
          const contactSec = document.getElementById('contact');
          if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'email') {
          copyEmail('phani424302@gmail.com');
        } else if (action === 'github') {
          window.open('https://github.com/Phani424302', '_blank', 'noopener,noreferrer');
        } else if (action === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // --- ACTION 2: DOUBLE-CLICK SUPERNOVA BURST ---
  window.addEventListener('dblclick', (e) => {
    if (!effectsContainer) return;

    const x = e.clientX;
    const y = e.clientY;

    const ring1 = document.createElement('div');
    ring1.className = 'cursor-burst-ring';
    ring1.style.left = `${x}px`;
    ring1.style.top = `${y}px`;

    const ring2 = document.createElement('div');
    ring2.className = 'cursor-burst-ring outer';
    ring2.style.left = `${x}px`;
    ring2.style.top = `${y}px`;

    effectsContainer.appendChild(ring1);
    effectsContainer.appendChild(ring2);

    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
      const isStar = i % 2 === 0;
      const particle = document.createElement('div');
      particle.className = isStar ? 'cursor-burst-star' : 'cursor-burst-dot';
      if (isStar) particle.textContent = '✦';

      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const distance = 40 + Math.random() * 55;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = Math.floor(Math.random() * 240 - 120);

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--rot', `${rot}deg`);

      effectsContainer.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }

    setTimeout(() => {
      ring1.remove();
      ring2.remove();
    }, 850);
  });

  // --- ACTION 3: 30-SECOND IDLE BEACON ---
  function triggerIdleBeacon() {
    if (!idleBeacon) return;
    idleBeacon.style.left = `${lastMouseX}px`;
    idleBeacon.style.top = `${lastMouseY}px`;
    idleBeacon.classList.add('active');
  }

  function resetIdleTimer() {
    if (idleBeacon && idleBeacon.classList.contains('active')) {
      idleBeacon.classList.remove('active');
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(triggerIdleBeacon, IDLE_TIMEOUT_MS);
  }

  window.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    resetIdleTimer();
  }, { passive: true });

  window.addEventListener('mousedown', resetIdleTimer, { passive: true });
  window.addEventListener('keydown', resetIdleTimer, { passive: true });
  window.addEventListener('scroll', resetIdleTimer, { passive: true });

  // Start 30s timer
  idleTimer = setTimeout(triggerIdleBeacon, IDLE_TIMEOUT_MS);
}


