/**
 * CHENNAMAREDDYGARI PHANI BHUSHAN REDDY - PORTFOLIO INTERACTION
 * Clean, lightweight, professional JavaScript without bloat
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCurrentYear();
});

/* --- MOBILE NAVIGATION --- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* --- RESUME MODAL --- */
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

function closeModalOnOverlay(e) {
  if (e.target.id === 'resume-modal') {
    closeResumeModal();
  }
}

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeResumeModal();
  }
});

/* --- COPY EMAIL & TOAST NOTIFICATION --- */
function copyEmail(email) {
  navigator.clipboard.writeText(email).then(() => {
    showToast(`Copied email to clipboard: ${email}`);
  }).catch(() => {
    const input = document.createElement('input');
    input.value = email;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(`Copied email to clipboard: ${email}`);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

/* --- CONTACT FORM --- */
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  const mailtoUrl = `mailto:phani424302@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;

  showToast(`Opening your email client...`);
  
  setTimeout(() => {
    window.location.href = mailtoUrl;
    form.reset();
  }, 700);
}

/* --- FOOTER CURRENT YEAR --- */
function initCurrentYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
