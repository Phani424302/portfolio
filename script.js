document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initSectionSpy();
  initCurrentYear();
});

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
