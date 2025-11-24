document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------
  // 1. SONG SEARCH HIGHLIGHT & SCROLL
  // -----------------------------
  const searchInput = document.getElementById('searchInput');
  const searchForm = document.getElementById('searchForm');

  function clearHighlights() {
    const allCards = document.querySelectorAll('.song-card');
    allCards.forEach(card => card.classList.remove('highlight'));
  }

  function highlightAndScroll(query) {
    clearHighlights();
    if (!query) return;

    const allCards = document.querySelectorAll('.song-card');
    let firstMatch = null;

    allCards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      if (title.includes(query)) {
        card.classList.add('highlight');
        if (!firstMatch) firstMatch = card; // store first match
      }
    });

    // Scroll to first matching song if exists
    if (firstMatch) {
      const offsetTop = firstMatch.getBoundingClientRect().top + window.scrollY - 100; // offset for navbar
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }

  // On form submit
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.toLowerCase().trim();
    highlightAndScroll(query);
  });

  // On typing
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    highlightAndScroll(query);
  });


  // -----------------------------
  // 2. SMOOTH SCROLL & ACTIVE NAVBAR HIGHLIGHT
  // -----------------------------
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200; // offset for fixed navbar

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });


  // -----------------------------
  // 3. FADE-IN ON SCROLL EFFECT
  // -----------------------------
  const observerOptions = { threshold: 0.2 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(50px)';
    observer.observe(section);
  });


  // -----------------------------
  // 4. CAROUSEL AUTO-PLAY
  // -----------------------------
  const carouselElement = document.querySelector('#carouselExample');
  if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
      interval: 4000,
      pause: 'hover',
      ride: 'carousel'
    });
  }


  // -----------------------------
  // 5. SONG CARD HOVER EFFECT
  // -----------------------------
  const songCards = document.querySelectorAll('.song-card');
  songCards.forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('shadow-lg'));
    card.addEventListener('mouseleave', () => card.classList.remove('shadow-lg'));
  });


  // -----------------------------
  // 6. CONTACT FORM SUBMISSION (NEW ADDITION)
  // -----------------------------
  // Make sure your HTML form tag has id="contactForm"
  const contactForm = document.getElementById('contactForm') || document.querySelector('#contact form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevents the page from reloading/going to PHP

      // Get values from the inputs
      // This checks for IDs first (if you updated HTML), falls back to name attribute
      const nameInput = document.getElementById('name') || contactForm.querySelector('[name="name"]');
      const emailInput = document.getElementById('email') || contactForm.querySelector('[name="email"]');
      const numberInput = document.getElementById('number') || contactForm.querySelector('[name="number"]');

      const formData = {
        name: nameInput.value,
        email: emailInput.value,
        number: numberInput.value
      };

      try {
        // Send data to Node.js server (ensure server.js is running on port 3000)
        const response = await fetch('http://localhost:3000/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Thank you! Your message has been saved.');
          contactForm.reset(); // Clear the form inputs
        } else {
          alert('Failed to save contact. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to the server. Is Node.js running?');
      }
    });
  }

});