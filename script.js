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
    image: 'images/4-week-challenge.png',
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
if (form && statusEl) {
  function setFieldError(name, message) {
    const input = form.querySelector(`[name="${name}"]`);
    const errorEl = form.querySelector(`[data-error="${name}"]`);

    if (!input) return;

    const field = input.closest('.field');

    if (message) {
      if (field) {
        field.classList.add('invalid');
      }

      if (errorEl) {
        errorEl.textContent = message;
      }
    } else {
      if (field) {
        field.classList.remove('invalid');
      }

      if (errorEl) {
        errorEl.textContent = '';
      }
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('Form submitted');

    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    let valid = true;

    /* Email validation */
    if (!email) {
      setFieldError(
        'email',
        'Please add your email address.'
      );

      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError(
        'email',
        "That email address doesn't look right."
      );

      valid = false;
    } else {
      setFieldError('email', '');
    }

    /* Subject validation */
    if (!subject) {
      setFieldError(
        'subject',
        'Let us know what this is regarding.'
      );

      valid = false;
    } else {
      setFieldError('subject', '');
    }

    /* Message validation */
    if (!message) {
      setFieldError(
        'message',
        'Add a few details for us to go on.'
      );

      valid = false;
    } else {
      setFieldError('message', '');
    }

    /* Stop if validation fails */
    if (!valid) {
      statusEl.textContent =
        'Please fix the highlighted fields.';

      statusEl.className =
        'form-status error';

      return;
    }

    /* Sending state */
    statusEl.textContent = 'Sending...';
    statusEl.className = 'form-status';

    const submitButton = form.querySelector(
      'button[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      console.log(
        'Formspree response:',
        response.status
      );

      if (response.ok) {
        statusEl.textContent =
          "Thanks — your enquiry has been sent. We'll be in touch within two working days.";

        statusEl.className =
          'form-status success';

        form.reset();

        /* Clear previous error styling */
        setFieldError('email', '');
        setFieldError('subject', '');
        setFieldError('message', '');

      } else {
        let errorMessage =
          'Something went wrong. Please try again.';

        try {
          const data = await response.json();

          console.error(
            'Formspree error response:',
            data
          );

          if (
            data.errors &&
            data.errors.length > 0
          ) {
            errorMessage =
              data.errors
                .map(error => error.message)
                .join(' ');
          }

        } catch (parseError) {
          console.error(
            'Could not parse Formspree response:',
            parseError
          );
        }
        statusEl.textContent = errorMessage;
        statusEl.className =
          'form-status error';
      }

    } catch (error) {
      console.error(
        'Form submission error:',
        error
      );

      statusEl.textContent =
        'Unable to send your enquiry. Please try again.';

      statusEl.className =
        'form-status error';

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

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
