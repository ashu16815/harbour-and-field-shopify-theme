/**
 * Harbour & Field Liquid Glass Enhancement JavaScript
 * Adds smooth animations and interactive effects to glass elements
 */

class HFGlassEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupGlassAnimations();
    this.setupParallaxEffects();
    this.setupHoverEffects();
    this.setupScrollAnimations();
  }

  setupGlassAnimations() {
    // Add glass animation classes to elements
    const glassElements = document.querySelectorAll('.card, .button, .hf-filters__option, .hf-reviews');
    
    glassElements.forEach(element => {
      element.classList.add('glass-animated');
    });

    // Add CSS for glass animations
    const style = document.createElement('style');
    style.textContent = `
      .glass-animated {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .glass-animated:hover {
        transform: translateY(-4px) scale(1.02);
      }
      
      .glass-animated::before {
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .glass-animated:hover::before {
        opacity: 1 !important;
      }
      
      /* Glass ripple effect */
      .glass-ripple {
        position: relative;
        overflow: hidden;
      }
      
      .glass-ripple::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
        pointer-events: none;
        z-index: 3;
      }
      
      .glass-ripple:active::after {
        width: 300px;
        height: 300px;
      }
    `;
    document.head.appendChild(style);
  }

  setupParallaxEffects() {
    // Add subtle parallax to glass elements
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.glass');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  setupHoverEffects() {
    // Enhanced hover effects for glass elements
    const glassElements = document.querySelectorAll('.card, .button, .hf-filters__option');
    
    glassElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.createGlassRipple(e, element);
      });
      
      element.addEventListener('mouseleave', () => {
        this.removeGlassRipple(element);
      });
    });
  }

  createGlassRipple(event, element) {
    const ripple = document.createElement('div');
    ripple.classList.add('glass-ripple-effect');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: glassRipple 0.6s ease-out;
      pointer-events: none;
      z-index: 3;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  removeGlassRipple(element) {
    const ripples = element.querySelectorAll('.glass-ripple-effect');
    ripples.forEach(ripple => {
      ripple.style.animation = 'glassRippleOut 0.3s ease-out forwards';
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 300);
    });
  }

  setupScrollAnimations() {
    // Animate glass elements on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('glass-visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const glassElements = document.querySelectorAll('.glass, .card, .button');
    glassElements.forEach(element => {
      observer.observe(element);
    });

    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
      .glass, .card, .button {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .glass-visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      @keyframes glassRipple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
      
      @keyframes glassRippleOut {
        0% {
          transform: scale(1);
          opacity: 0.3;
        }
        100% {
          transform: scale(1.2);
          opacity: 0;
        }
      }
      
      /* Glass shimmer effect */
      .glass-shimmer {
        position: relative;
        overflow: hidden;
      }
      
      .glass-shimmer::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: glassShimmer 2s infinite;
        pointer-events: none;
        z-index: 3;
      }
      
      @keyframes glassShimmer {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Enhanced glass interactions
document.addEventListener('DOMContentLoaded', function() {
  // Add glass shimmer effect to cards on hover
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('glass-shimmer');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('glass-shimmer');
    });
  });

  // Add glass ripple effect to buttons
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('glass-ripple');
      
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: glassRipple 0.6s ease-out;
        pointer-events: none;
        z-index: 3;
      `;
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    });
  });

  // Add glass focus effects to form elements
  const formElements = document.querySelectorAll('.input, .select__select, .textarea');
  formElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.classList.add('glass-focused');
    });
    
    element.addEventListener('blur', () => {
      element.classList.remove('glass-focused');
    });
  });

  // Add CSS for focus effects
  const style = document.createElement('style');
  style.textContent = `
    .glass-focused {
      transform: scale(1.02);
      box-shadow: var(--glass-shadow-strong);
    }
    
    .glass-focused::before {
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);
});

// Initialize glass effects
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new HFGlassEffects());
} else {
  new HFGlassEffects();
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
  // Scroll-based glass effects can be added here
}, 16)); // ~60fps
