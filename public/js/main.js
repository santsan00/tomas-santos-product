/**
 * Main JavaScript
 * Portfolio Website - Tomas Santos
 */

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      
      // Animate hamburger icon
      const spans = this.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          const spans = mobileMenuBtn?.querySelectorAll('span');
          if (spans) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
          }
        }
      }
    });
  });

  // Scroll animations
  function checkScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.85) {
        element.classList.add('animated');
      }
    });
  }

  // Add animation classes to sections
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('animate-on-scroll');
  });

  // Check animations on load and scroll
  checkScrollAnimations();
  window.addEventListener('scroll', checkScrollAnimations);

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.style.padding = '12px 0';
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.padding = '24px 0';
      navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });

  // Parallax effect for hero section
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image img');

  if (hero && heroImage) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      heroImage.style.transform = `translateY(${rate}px)`;
    });
  }

  // Form submission
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.classList.add('loading');
      
      // Simulate form submission (replace with actual API call)
      setTimeout(function() {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.backgroundColor = '#10b981';
        
        // Reset form
        setTimeout(function() {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.classList.remove('loading');
        }, 2000);
      }, 1500);
    });
  }

  // Skill bars animation
  const skillBars = document.querySelectorAll('.skill-progress');
  
  function animateSkillBars() {
    skillBars.forEach(bar => {
      const width = bar.style.width;
      if (width) {
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      }
    });
  }

  // Animate skill bars when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const skillsSection = document.querySelector('.about-skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }

  // Typing animation for hero subtitle (optional)
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }

  // Project card hover effects
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Console Easter Egg
  console.log('%c🎨 Tomas Santos Portfolio', 'font-size: 24px; color: #6366f1; font-weight: bold;');
  console.log('%cWelcome to my portfolio! 👋', 'font-size: 16px; color: #64748b;');
  console.log('%cBuilt with ❤️ using Figma & Vibe Code', 'font-size: 12px; color: #94a3b8;');
});

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
