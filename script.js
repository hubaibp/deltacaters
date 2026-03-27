// =============================================
// DELTA EVENTS — MAIN SCRIPT
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  setTimeout(() => { preloader.classList.add('done'); }, 2400);

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('show');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('show');
    });
  });

  // ===== HERO SLIDESHOW =====
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  let slideInterval = setInterval(nextSlide, 5500);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(i);
      slideInterval = setInterval(nextSlide, 5500);
    });
  });

  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  // ===== ANIMATED COUNTERS =====
  const statNums = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const statsSection = document.getElementById('achievements');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      countersStarted = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target);
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 2000;
        const start = Date.now();

        function update() {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = isDecimal ? (current / 10).toFixed(1) : current;
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = isDecimal ? (target / 10).toFixed(1) : target;
        }
        requestAnimationFrame(update);
      });
    }
  }
  window.addEventListener('scroll', startCounters);
  startCounters();

  // ===== GALLERY FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          item.offsetHeight;
          item.style.animation = '';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ===== TESTIMONIAL CAROUSEL (grid-based, responsive) =====
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('carouselDots');
  let tIndex = 0;

  function getPerView() {
    if (window.innerWidth > 900) return 3;
    if (window.innerWidth > 600) return 2;
    return 1;
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const total = Math.ceil(cards.length / getPerView());
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showTestimonials(i));
      dotsContainer.appendChild(dot);
    }
  }

  function showTestimonials(index) {
    const pv = getPerView();
    const maxIndex = Math.ceil(cards.length / pv) - 1;
    tIndex = Math.max(0, Math.min(index, maxIndex));
    const start = tIndex * pv;
    cards.forEach((c, i) => {
      c.classList.toggle('visible', i >= start && i < start + pv);
    });
    dotsContainer.querySelectorAll('span').forEach((d, i) => {
      d.classList.toggle('active', i === tIndex);
    });
  }

  buildDots();
  showTestimonials(0);

  document.getElementById('prevBtn').addEventListener('click', () => showTestimonials(tIndex - 1));
  document.getElementById('nextBtn').addEventListener('click', () => showTestimonials(tIndex + 1));

  let tInterval = setInterval(() => {
    const max = Math.ceil(cards.length / getPerView()) - 1;
    showTestimonials(tIndex >= max ? 0 : tIndex + 1);
  }, 4500);

  document.getElementById('testimonialCarousel').addEventListener('mouseenter', () => clearInterval(tInterval));
  document.getElementById('testimonialCarousel').addEventListener('mouseleave', () => {
    tInterval = setInterval(() => {
      const max = Math.ceil(cards.length / getPerView()) - 1;
      showTestimonials(tIndex >= max ? 0 : tIndex + 1);
    }, 4500);
  });

  window.addEventListener('resize', () => {
    buildDots();
    showTestimonials(0);
  });

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ===== CONTACT FORM → WHATSAPP =====
  window.sendEnquiry = function(e) {
    e.preventDefault();
    const name = document.getElementById('fname').value;
    const phone = document.getElementById('fphone').value;
    const service = document.getElementById('fservice').value;
    const date = document.getElementById('fdate').value;
    const guests = document.getElementById('fguests').value;
    const message = document.getElementById('fmessage').value;

    const text = `Hello Delta Events! 🎉\n\nName: ${name}\nPhone: ${phone}\nService: ${service || 'Not specified'}\nEvent Date: ${date || 'Not specified'}\nGuests: ${guests || 'Not specified'}\nMessage: ${message || 'No message'}\n\nPlease get back to me. Thank you!`;
    window.open(`https://wa.me/919633775535?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ===== NEWSLETTER =====
  window.subscribeNewsletter = function() {
    const email = document.getElementById('newsletterEmail').value;
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    const text = `Newsletter Subscription Request\nEmail: ${email}`;
    window.open(`https://wa.me/919633775535?text=${encodeURIComponent(text)}`, '_blank');
    document.getElementById('newsletterEmail').value = '';
  };

  // ===== ACTIVE NAV ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const offset = section.offsetTop - 100;
      if (window.scrollY >= offset) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
  });

});