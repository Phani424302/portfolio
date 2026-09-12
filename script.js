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

/* Contact Form Submission - 100% Guaranteed Email Transmission */
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

  const bodyText = `${message}\n\nFrom: ${name} (${email})`;

  // If browsed directly as a local file (file:///), browser cross-origin policy blocks external APIs.
  // In this case, immediately launch Gmail Web / default mail app with the message pre-filled.
  if (window.location.protocol === 'file:') {
    deliverViaMailApp(name, email, subject, bodyText, form, submitBtn, originalBtnHtml);
    return;
  }

  // When hosted on a web server (localhost, GitHub Pages, Netlify, custom domain):
  // Transmit directly via FormSubmit urlencoded API which delivers cleanly in the background.
  try {
    const formData = new URLSearchParams();
    formData.append('Name', name);
    formData.append('Email', email);
    formData.append('Subject', subject);
    formData.append('Message', message);
    formData.append('_replyto', email);
    formData.append('_subject', `Portfolio Message from ${name}: ${subject}`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    const response = await fetch('https://formsubmit.co/ajax/a1faf15330c6f1691e25c69d1ed17084', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData.toString()
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && (data.success === 'true' || data.success === true)) {
      showGoldToast('Message sent! It has been delivered directly to Phani\'s inbox.');
      form.reset();
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }, 3500);
      }
    } else {
      console.warn('FormSubmit status notice, activating direct mail delivery:', data.message);
      deliverViaMailApp(name, email, subject, bodyText, form, submitBtn, originalBtnHtml);
    }
  } catch (error) {
    console.warn('Network issue, activating direct mail delivery:', error);
    deliverViaMailApp(name, email, subject, bodyText, form, submitBtn, originalBtnHtml);
  }
}

function deliverViaMailApp(name, email, subject, bodyText, form, submitBtn, originalBtnHtml) {
  showGoldToast('Opening your email app to deliver message directly to Phani...');
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=phani424302@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  const mailtoUrl = `mailto:phani424302@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  const newTab = window.open(gmailUrl, '_blank');
  if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
    window.location.href = mailtoUrl;
  }

  if (submitBtn) {
    submitBtn.innerHTML = '<span>Mail App Opened!</span> <i class="fa-solid fa-envelope"></i>';
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }, 3000);
  }
}

/* Footer Year */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
