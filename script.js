document.addEventListener('DOMContentLoaded', () => {
  initLuxurySpotlight();
  initLiquidGlassCards();
  initMobileNavigation();
  initSectionSpy();
  initCurrentYear();
});

/* Dynamic Warm Gold Cursor Spotlight */
function initLuxurySpotlight() {
  const root = document.documentElement;
  window.addEventListener('mousemove', (e) => {
    root.style.setProperty('--mouse-x', `${e.clientX}px`);
    root.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
}

/* Dynamic Liquid Glass Interactive Pointer Glint (iPhone 26 / Next-Gen VisionOS Glass) */
function initLiquidGlassCards() {
  const cards = document.querySelectorAll('.luxury-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-x', `${x}px`);
      card.style.setProperty('--card-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--card-x');
      card.style.removeProperty('--card-y');
    });
  });
}

/* Mobile Navigation Toggle */
function initMobileNavigation() {
  const toggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* Active Section Spy */
function initSectionSpy() {
  const sections = document.querySelectorAll('section[id], [id="certifications"]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
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
  });
}

/* Official Resume Modal */
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
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

/* Direct Personal Email Dispatch — Zero Middlemen, Zero Activation Emails */
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]') || document.getElementById('contact-submit-btn');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = (form.subject && form.subject.value) ? form.subject.value.trim() : 'Portfolio Inquiry';
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    showGoldToast('Please complete all fields.');
    return;
  }

  const recipient = 'phani424302@gmail.com';
  const fullSubject = `${subject} — from ${name}`;
  const fullBody = `${message}\n\n---\nSender Name: ${name}\nSender Email: ${email}`;

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;

  showGoldToast('Opening your email app to send message directly to Phani...');

  if (submitBtn) {
    submitBtn.innerHTML = '<span>Opening Mail...</span> <i class="fa-solid fa-envelope"></i>';
  }

  // Open Gmail Web compose in a new tab
  const newTab = window.open(gmailUrl, '_blank');
  if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
    // If popups are blocked or on mobile device, trigger default mail app
    window.location.href = mailtoUrl;
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.innerHTML = '<span>Message Drafted!</span> <i class="fa-solid fa-check"></i>';
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnHtml;
      }, 3500);
    }
  }, 1000);
}

/* Footer Year */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
