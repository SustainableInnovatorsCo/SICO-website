// ============================================================
// Sustainable Innovator Co. — site.js
// ============================================================

document.getElementById('year').textContent = new Date().getFullYear();



/* ---------------- Mobile nav ---------------- */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------------- Packages data ----------------
   EDIT ME: replace title / cost / description / image
   for each of your 3 real packages.
---------------------------------------------------- */
const PACKAGES = [
  {
    title: 'Seed Starter',
    cost: '$30 per student',
    image: 'images/tim-present.jpg',
    summary: 'A 3-4 hours introductory sustainability seminar covering the core principles of environmental, social and economic sustainability featuring interactive activities that build critical thinking, collaboration and practical problem-solving skills.', 
    details: 'Kick-Start STEM One-day sustainability seminar (3-4 hrs). An introduction in the foundations of sustainability through a comprehensive seminar covering environmental, social, and economic principles. Students are encouraged to develop critical thinking skills while exploring real-world sustainability challenges. The program also includes an interactive activity designed to foster creativity, collaboration, and industry-relevant skills, empowering students to think innovatively and develop practical solutions for a sustainable future.'
  },
  {
    title: 'Innovation Challenger',
    cost: '$55 per student',
    image: 'images/innovator-challenge.jpg',
    summary: 'A two-day sustainability hackathon focused on solving real-world environmental and community challenges through design thinking, teamwork, industry mentoring, and solution pitching.',
    details: 'Two-day sustainability hackathon focused on solving real-world environmental and community challenges. Students collaborate in teams, apply design thinking methodologies, engage with industry mentors, develop innovative solutions, and pitch their ideas to an expert panel.'
  },
  {
    title: 'Urban Grower',
    cost: '$60 per student',
    image: 'images/4-week-challenge.jpg',
    summary: 'A four-week program where students explore sustainable food production through aquaponics, hydroponics, and vertical farming while designing and building their own growing system.',
    details: 'Four-week program (one session per week) where students explore sustainable food production through aquaponics, hydroponics, and vertical farming systems. Participants learn the principles of circular economy, sustainable agriculture, and resource efficiency while designing and building their own growing system. The program demonstrates how fresh produce can be grown using minimal land and water resources, providing practical solutions for future food security challenges.',
  }
];

const packageGrid = document.getElementById('packageGrid');

PACKAGES.forEach((pkg, i) => {
  const card = document.createElement('button');
  card.className = 'package-card reveal';
  card.type = 'button';
  card.setAttribute('aria-haspopup', 'dialog');
  card.innerHTML = `
    <div class="package-image"><img src="${pkg.image}" alt="" loading="lazy"></div>
    <div class="package-body">
      <p class="package-cost">${pkg.cost}</p>
      <h3 class="package-title">${pkg.title}</h3>
      <p class="package-desc">${pkg.summary}</p>
      <span class="package-more">View details</span>
    </div>
  `;
  card.addEventListener('click', () => openModal(i));
  packageGrid.appendChild(card);
});

/* ---------------- Modal ---------------- */
const overlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');
const modalCost = document.getElementById('modalCost');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalClose = document.getElementById('modalClose');

let lastFocused = null;

function openModal(index) {
  const pkg = PACKAGES[index];
  modalImage.src = pkg.image;
  modalImage.alt = pkg.title;
  modalCost.textContent = pkg.cost;
  modalTitle.textContent = pkg.title;
  modalDesc.textContent = pkg.details;

  lastFocused = document.activeElement;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
});

/* ---------------- Enquiry form ---------------- */
const form = document.getElementById('enquiryForm');
const statusEl = document.getElementById('formStatus');

function setFieldError(name, message) {
  const field = form.querySelector(`[name="${name}"]`).closest('.field');
  const errorEl = form.querySelector(`[data-error="${name}"]`);
  if (message) {
    field.classList.add('invalid');
    errorEl.textContent = message;
  } else {
    field.classList.remove('invalid');
    errorEl.textContent = '';
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  let valid = true;

  if (!email) { setFieldError('email', 'Please add your email address.'); valid = false; }
  else if (!isValidEmail(email)) { setFieldError('email', 'That email address doesn\'t look right.'); valid = false; }
  else { setFieldError('email', ''); }

  if (!subject) { setFieldError('subject', 'Let us know what this is regarding.'); valid = false; }
  else { setFieldError('subject', ''); }

  if (!message) { setFieldError('message', 'Add a few details for us to go on.'); valid = false; }
  else { setFieldError('message', ''); }

  if (!valid) {
    statusEl.textContent = 'Please fix the highlighted fields.';
    statusEl.className = 'form-status error';
    return;
  }

  // ------------------------------------------------------------
  // NOTE FOR DEVELOPER: there is no backend wired up yet.
  // To actually receive these enquiries, replace this block with
  // a fetch() call to your form endpoint / email service, e.g.:
  //
  // fetch('https://your-endpoint.example.com/enquiries', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, phone: form.phone.value, subject, message })
  // });
  // ------------------------------------------------------------

  statusEl.textContent = 'Thanks — your enquiry has been sent. We\'ll be in touch within two working days.';
  statusEl.className = 'form-status success';
  form.reset();
});

/* ---------------- Scroll reveal ---------------- */
const revealTargets = document.querySelectorAll('.vm-block, .package-card, .contact-info, .enquiry-form');
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
