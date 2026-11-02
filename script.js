'use strict';

/* ==========================================================================
   1. HERO CAROUSEL LOGIC
   ========================================================================== */
const heroSlides = Array.from(document.querySelectorAll('.slides .slide'));
const heroDots   = Array.from(document.querySelectorAll('.dots .dot'));

let currentSlideIndex = 0; 
let autoPlayTimer = null;
const TIME_BETWEEN_SLIDES = 4500; 

function updateSlideshowClasses() {
  const totalSlides = heroSlides.length;

  let previousIndex = currentSlideIndex - 1;
  if (previousIndex < 0) previousIndex = totalSlides - 1; 

  let nextIndex = currentSlideIndex + 1;
  if (nextIndex >= totalSlides) nextIndex = 0;

  heroSlides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlideIndex); 
    slide.classList.toggle('prev', index === previousIndex);       
    slide.classList.toggle('next', index === nextIndex);           
    
    const isVisible = (index === currentSlideIndex || index === previousIndex || index === nextIndex);
    slide.classList.toggle('hidden', !isVisible);
  });

  heroDots.forEach((dot, index) => {
    const isActive = (index === currentSlideIndex);
    dot.classList.toggle('active', isActive);
  });
}

function changeSlideTo(newIndex) {
  if (heroSlides.length === 0) return; 
  
  currentSlideIndex = newIndex;
  
  if (currentSlideIndex >= heroSlides.length) currentSlideIndex = 0;
  else if (currentSlideIndex < 0) currentSlideIndex = heroSlides.length - 1;

  updateSlideshowClasses();
  startAutoPlay(); 
}

function startAutoPlay() {
  clearInterval(autoPlayTimer); 
  autoPlayTimer = setInterval(() => {
    if (document.hidden === false) changeSlideTo(currentSlideIndex + 1);
  }, TIME_BETWEEN_SLIDES);
}

heroDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const requestedIndex = Number(dot.dataset.i);
    changeSlideTo(requestedIndex);
  });
});

updateSlideshowClasses();
startAutoPlay();

/* ==========================================================================
   2. NAVIGATION BAR LOGIC
   ========================================================================== */
const navbar = document.getElementById('nav');
const menuButton = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-nav');

window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
}, { passive: true });

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isMenuOpen = mobileMenu.classList.toggle('open');
    menuButton.classList.toggle('open', isMenuOpen);
    
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  });

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuButton.classList.remove('open');
      document.body.style.overflow = ''; 
    });
  });
}

/* ScrollSpy Logic */
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('section[id]');

if (navLinks.length > 0 && pageSections.length > 0) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const matchesCurrentSection = (link.getAttribute('href') === `#${entry.target.id}`);
          link.classList.toggle('active', matchesCurrentSection);
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });

  pageSections.forEach(section => sectionObserver.observe(section));
}

/* ==========================================================================
   3. COPY EMAIL BUTTON LOGIC
   ========================================================================== */
const myEmailAddress = 'excelsior@marvel.com'; /* Updated to match new theme */
const copyButton = document.getElementById('copy-btn');
const toastNotification = document.getElementById('toast');
let toastTimer = null;

function showToastMessage(message) {
  if (!toastNotification) return;
  toastNotification.textContent = message;
  toastNotification.classList.add('show');
  
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 2400);
}

if (copyButton) {
  copyButton.addEventListener('click', () => {
    const tempInput = document.createElement('textarea');
    tempInput.value = myEmailAddress;
    document.body.appendChild(tempInput);
    
    tempInput.select();
    document.execCommand('copy');
    
    document.body.removeChild(tempInput);
    showToastMessage('Email copied ✓');
  });
}

/* ==========================================================================
   4. MERRY-GO-ROUND 3D GALLERY LOGIC
   ========================================================================== */
const galleryItems = document.querySelectorAll('.mgr-item');
const totalItems = galleryItems.length;

const degreesPerItem = 360 / totalItems;
const cylinderRadius = 550; 

galleryItems.forEach((item, index) => {
  const rotationAngle = degreesPerItem * index;
  item.style.transform = `rotateY(${rotationAngle}deg) translateZ(${cylinderRadius}px)`;
});

/* ==========================================================================
   5. FAQ ACCORDION LOGIC
   ========================================================================== */
const faqQuestions = document.querySelectorAll('.faq-header');

faqQuestions.forEach(questionButton => {
  questionButton.addEventListener('click', () => {
    const accordionItem = questionButton.parentElement;
    const isCurrentlyOpen = accordionItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    if (isCurrentlyOpen === false) {
      accordionItem.classList.add('active');
    }
  });
});