// Main Application JavaScript
class AccessScanApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileNavigation();
    this.setupScrollEffects();
    this.setupEnhancedHoverEffects();
    this.setupSmoothScroll();
    this.setupLoadingAnimations();
  }
  
  
  setupMobileNavigation() {
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector(".mobile-menu-toggle")) {
      this.createMobileMenuToggle();
    }

    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-open");
        mobileToggle.classList.toggle("active");
      });

      // Close mobile menu when clicking on a link
      navLinks.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("mobile-open");
          mobileToggle.classList.remove("active");
        });
      });
    }
  }

  createMobileMenuToggle() {
    const mobileToggle = document.createElement("button");
    mobileToggle.className = "mobile-menu-toggle";
    mobileToggle.setAttribute("aria-label", "Toggle mobile menu");
    mobileToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

    // Add to navbar
    const navbar = document.querySelector(".navbar .container");
    if (navbar) {
      navbar.appendChild(mobileToggle);
    }
  }

  setupScrollEffects() {
    // Add scroll-based animations and effects
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
      ".feature-card, .workflow-step, .benefit-card, .faq-item"
    );

    elementsToAnimate.forEach((el) => {
      observer.observe(el);
    });

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (navbar) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          navbar.classList.add("navbar-hidden");
        } else {
          navbar.classList.remove("navbar-hidden");
        }

        if (currentScrollY > 50) {
          navbar.classList.add("navbar-scrolled");
        } else {
          navbar.classList.remove("navbar-scrolled");
        }
      }

      lastScrollY = currentScrollY;
    });
  }

  setupEventTracking() {
    // Track button clicks
    document.addEventListener("click", (e) => {
      const target = e.target;

      // Track CTA button clicks
      if (target.classList.contains("btn-primary")) {
        this.trackEvent("cta_click", {
          button_text: target.textContent.trim(),
          page: window.location.pathname,
        });
      }

      // Track navigation clicks
      if (target.classList.contains("nav-link")) {
        this.trackEvent("navigation_click", {
          link_text: target.textContent.trim(),
          destination: target.getAttribute("href"),
        });
      }
    });

    // Track form submissions
    document.addEventListener("submit", (e) => {
      const form = e.target;

      if (form.id === "notify-form") {
        this.trackEvent("email_signup", {
          form_id: form.id,
          page: window.location.pathname,
        });
      }
    });
  }

  trackEvent(eventName, parameters = {}) {
    console.log("Event:", eventName, parameters);

    // Example for Google Analytics
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, parameters);
    }
  }

  // Utility methods
  showNotification(message, type = "info", duration = 3000) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles if not already present
    if (!document.querySelector("#notification-styles")) {
      this.addNotificationStyles();
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove notification
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  addNotificationStyles() {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--radius);
                color: white;
                font-weight: 500;
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-info {
                background-color: var(--primary);
            }
            
            .notification-success {
                background-color: #16a34a;
            }
            
            .notification-error {
                background-color: var(--destructive);
            }
            
            .notification-warning {
                background-color: #ea580c;
            }
        `;
    document.head.appendChild(style);
  }

  // Enhanced hover effects and interactions
  setupEnhancedHoverEffects() {
    // Add ripple effect to buttons
    this.addRippleEffect();
  }

  addRippleEffect() {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const ripple = document.createElement("span");
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
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;

        button.style.position = "relative";
        button.style.overflow = "hidden";
        button.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Add ripple animation CSS
    if (!document.querySelector("#ripple-styles")) {
      const style = document.createElement("style");
      style.id = "ripple-styles";
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Add smooth scroll behavior for anchor links
  setupSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Add loading state animations
  setupLoadingAnimations() {
    // Animate elements on page load
    window.addEventListener("load", () => {
      const animatedElements = document.querySelectorAll(
        ".hero-title, .hero-subtitle, .feature-card, .workflow-step"
      );

      animatedElements.forEach((element, index) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = "all 0.6s ease";

        setTimeout(() => {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }, index * 100);
      });
    });
  }
}

// Add CSS for mobile navigation and animations
const appStyles = document.createElement("style");
appStyles.textContent = `

    
    /* Mobile Menu Toggle */
    .mobile-menu-toggle {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.75rem;
        gap: 4px;
        width: 44px;
        height: 44px;
        position: relative;
    }
    
    .mobile-menu-toggle span {
        width: 22px;
        height: 2px;
        background-color: var(--foreground);
        transition: all 0.3s ease;
        display: block;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(7px, 7px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
        transform: scale(0);
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -7px);
    }
    
    /* Navbar Effects */
    .navbar {
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .navbar-hidden {
        transform: translateY(-100%);
    }
    
    .navbar-scrolled {
        background-color: rgba(227, 234, 242, 0.95);
        backdrop-filter: blur(10px);
    }
    
    /* Animation Classes */
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    

    
    /* Mobile Responsive */
    @media (max-width: 768px) {
        .mobile-menu-toggle {
            display: flex;
        }
        
        .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--card);
            border-top: 1px solid var(--border);
            flex-direction: column;
            padding: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-links.mobile-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-link {
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border);
        }
        
        .nav-link:last-child {
            border-bottom: none;
        }
    }
`;

document.head.appendChild(appStyles);

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AccessScanApp();
});
