/**
 * C PHANI BHUSHAN REDDY - PORTFOLIO INTERACTIVITY
 * High-performance JavaScript for Neural Canvas, Typing Effects, Modals & Filters
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initDynamicTyping();
  initNavbar();
  initStatsCounter();
  initSkillsFilter();
  initCurrentYear();
});

/* ==========================================================================
   1. NEURAL / CONSTELLATION CANVAS BACKGROUND
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + '0.7)';
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // Connect with mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ==========================================================================
   2. DYNAMIC TYPING HERO EFFECT
   ========================================================================== */
function initDynamicTyping() {
  const dynamicRoleElem = document.getElementById('dynamic-role');
  if (!dynamicRoleElem) return;

  const roles = [
    "Integrated M.Tech Student @ VIT-AP",
    "Computer Vision & AI Specialist",
    "Full-Stack Web Developer",
    "Real-Time YOLOv8 & MediaPipe Engineer",
    "Continuous Learner & Problem Solver"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 75;
  const deleteSpeed = 35;
  const holdTime = 1900;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      dynamicRoleElem.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      dynamicRoleElem.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(type, holdTime);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 350);
      return;
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  type();
}

/* ==========================================================================
   3. NAVBAR BEHAVIOR & INTERSECTION OBSERVER
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   4. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentVal = easeProgress * target;

            if (isDecimal) {
              counter.textContent = currentVal.toFixed(2);
            } else {
              counter.textContent = Math.floor(currentVal);
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = isDecimal ? target.toFixed(2) : target;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   5. SKILLS FILTERING
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECT MODALS & CASE STUDIES
   ========================================================================== */
const projectData = {
  skywrite: {
    title: "SkyWrite (Air Canvas) · Touchless Drawing & CNN Recognition",
    subtitle: "Real-time 21-point hand tracking with MediaPipe and 87% accuracy character recognition",
    tech: ["Python", "OpenCV", "MediaPipe", "TensorFlow", "CNN", "EMNIST"],
    overview: "SkyWrite transforms regular webcams into touchless digital drawing tablets. Utilizing MediaPipe's lightweight hand landmark model, the system tracks 21 specific 3D landmarks in real time with low latency. Hand gestures switch dynamically between drawing mode, erasing mode, and character classification mode.",
    features: [
      "Zero-hardware touchless interface operating smoothly on standard RGB web cameras.",
      "Custom Convolutional Neural Network trained on the EMNIST dataset, achieving an 87% character recognition accuracy for drawn digits and letters.",
      "Mathematical line smoothing and noise reduction algorithms to eliminate jitter caused by minor finger tremors.",
      "Color palette selection and stroke thickness modulation via intuitive index-to-middle finger pinch gestures."
    ],
    architecture: "Input Video Stream ➔ MediaPipe Landmark Extraction (21 3D points) ➔ Gesture State Machine ➔ Canvas Buffer Smoothing ➔ CNN Classifier (EMNIST weights) ➔ Real-time Visual Output.",
    github: "https://github.com/Phani424302/portfolio"
  },
  vehicle: {
    title: "Vehicle Detection & Counting System · Intelligent Traffic Analytics",
    subtitle: "High-performance video inference with YOLOv8n and Flask real-time web portal",
    tech: ["Python", "Flask", "YOLOv8", "OpenCV", "COCO Dataset", "Computer Vision"],
    overview: "An automated traffic surveillance and analytics pipeline designed to detect, track, and classify vehicles from uploaded traffic video streams. Built using Ultralytics YOLOv8n architecture pretrained on the 80-class COCO dataset, filtered specifically for transportation classes (cars, buses, trucks, motorcycles).",
    features: [
      "Fast inference using YOLOv8 nano model, enabling real-time frame processing even on consumer-grade hardware.",
      "Custom bounding box rendering with configurable confidence thresholds to eliminate false positives in diverse weather and lighting conditions.",
      "Automated bidirectional counting line logic to register unique vehicle passages without double-counting.",
      "Integrated Flask web dashboard that allows users to upload surveillance videos, adjust detection parameters, and monitor vehicle count statistics live."
    ],
    architecture: "Uploaded Video ➔ Flask Ingestion ➔ OpenCV Frame Generator ➔ YOLOv8n Detection Engine (COCO Weights) ➔ Intersection Line Counting Logic ➔ Web Streaming Response.",
    github: "https://github.com/Phani424302/portfolio"
  }
};

function openProjectModal(id) {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const data = projectData[id];

  if (!modal || !modalBody || !data) return;

  modalBody.innerHTML = `
    <h3 class="modal-deepdive-title">${data.title}</h3>
    <p class="modal-deepdive-sub">${data.subtitle}</p>

    <div class="modal-tech-list">
      ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
    </div>

    <h4 class="modal-section-h4"><i class="fa-solid fa-circle-info" style="color: var(--accent-cyan);"></i> Project Overview</h4>
    <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px;">${data.overview}</p>

    <h4 class="modal-section-h4"><i class="fa-solid fa-microchip" style="color: var(--accent-purple);"></i> Key Highlights & Technical Accomplishments</h4>
    <ul class="modal-bullet-list">
      ${data.features.map(f => `<li>${f}</li>`).join('')}
    </ul>

    <h4 class="modal-section-h4"><i class="fa-solid fa-network-wired" style="color: var(--accent-blue);"></i> Architecture Pipeline</h4>
    <p style="font-family: var(--font-mono); font-size: 0.85rem; background: rgba(0,0,0,0.4); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--glass-border); color: #38bdf8; margin-bottom: 24px;">
      ${data.architecture}
    </p>

    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <i class="fa-brands fa-github"></i> View Repository
      </a>
      <button class="btn btn-secondary" onclick="closeProjectModal()">
        Close
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function closeModalOnOverlay(e) {
  if (e.target.id === 'project-modal') {
    closeProjectModal();
  }
}

/* ==========================================================================
   7. RESUME MODAL
   ========================================================================== */
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

function closeResumeModalOnOverlay(e) {
  if (e.target.id === 'resume-modal') {
    closeResumeModal();
  }
}

// Global ESC key listener to close modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
    closeResumeModal();
  }
});

/* ==========================================================================
   8. COPY TO CLIPBOARD & TOAST
   ========================================================================== */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied to clipboard: ${text}`);
  }).catch(() => {
    // Fallback
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied to clipboard: ${text}`);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   9. CONTACT FORM HANDLER
   ========================================================================== */
function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  // Create mailto fallback link
  const mailtoUrl = `mailto:phani424302@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
  
  showToast(`Thank you ${name}! Opening mail client...`);
  
  setTimeout(() => {
    window.location.href = mailtoUrl;
    form.reset();
  }, 900);
}

/* ==========================================================================
   10. CURRENT YEAR IN FOOTER
   ========================================================================== */
function initCurrentYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
