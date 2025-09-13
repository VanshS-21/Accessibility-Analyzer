// Main Application JavaScript
class AccessScanApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupThemeToggle();
        this.setupMobileNavigation();
        this.setupScrollEffects();
        this.setupAnalytics();
    }
    
    setupThemeToggle() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Create theme toggle button if it doesn't exist
        if (!document.querySelector('.theme-toggle')) {
            this.createThemeToggle();
        }
        
        // Add event listener for theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.innerHTML = '🌙';
        
        // Add to navigation
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.appendChild(themeToggle);
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    setupMobileNavigation() {
        // Create mobile menu button if it doesn't exist
        if (!document.querySelector('.mobile-menu-toggle')) {
            this.createMobileMenuToggle();
        }
        
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-open');
                mobileToggle.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on a link
            navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('mobile-open');
                    mobileToggle.classList.remove('active');
                });
            });
        }
    }
    
    createMobileMenuToggle() {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Add to navbar
        const navbar = document.querySelector('.navbar .container');
        if (navbar) {
            navbar.appendChild(mobileToggle);
        }
    }
    
    setupScrollEffects() {
        // Add scroll-based animations and effects
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll(
            '.feature-card, .workflow-step, .benefit-card, .faq-item'
        );
        
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
        
        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (navbar) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.classList.add('navbar-hidden');
                } else {
                    navbar.classList.remove('navbar-hidden');
                }
                
                if (currentScrollY > 50) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    setupAnalytics() {
        // Track page views and user interactions
        this.trackPageView();
        this.setupEventTracking();
    }
    
    trackPageView() {
        // Track page view (replace with your analytics service)
        const page = window.location.pathname;
        console.log('Page view:', page);
        
        // Example for Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: page
            });
        }
    }
    
    setupEventTracking() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Track CTA button clicks
            if (target.classList.contains('btn-primary')) {
                this.trackEvent('cta_click', {
                    button_text: target.textContent.trim(),
                    page: window.location.pathname
                });
            }
            
            // Track navigation clicks
            if (target.classList.contains('nav-link')) {
                this.trackEvent('navigation_click', {
                    link_text: target.textContent.trim(),
                    destination: target.getAttribute('href')
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            
            if (form.id === 'notify-form') {
                this.trackEvent('email_signup', {
                    form_id: form.id,
                    page: window.location.pathname
                });
            }
        });
    }
    
    trackEvent(eventName, parameters = {}) {
        console.log('Event:', eventName, parameters);
        
        // Example for Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
    }
    
    // Utility methods
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            this.addNotificationStyles();
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    addNotificationStyles() {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
    
    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    
                    console.log('Page load time:', loadTime + 'ms');
                    
                    // Track performance metrics
                    this.trackEvent('performance', {
                        load_time: Math.round(loadTime),
                        page: window.location.pathname
                    });
                }, 0);
            });
        }
    }
}

// Add CSS for mobile navigation and animations
const appStyles = document.createElement('style');
appStyles.textContent = `
    /* Theme Toggle */
    .theme-toggle {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: var(--radius);
        transition: background-color 0.2s;
    }
    
    .theme-toggle:hover {
        background-color: var(--muted);
    }
    
    /* Mobile Menu Toggle */
    .mobile-menu-toggle {
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        gap: 3px;
    }
    
    .mobile-menu-toggle span {
        width: 20px;
        height: 2px;
        background-color: var(--foreground);
        transition: all 0.3s ease;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
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
    
    /* Dark Theme */
    [data-theme="dark"] {
        --background: rgb(24, 26, 36);
        --foreground: rgb(230, 234, 243);
        --card: rgb(35, 36, 58);
        --card-foreground: rgb(230, 234, 243);
        --primary: rgb(58, 91, 160);
        --primary-foreground: rgb(255, 224, 102);
        --secondary: rgb(255, 224, 102);
        --secondary-foreground: rgb(35, 36, 58);
        --muted: rgb(35, 36, 58);
        --muted-foreground: rgb(122, 136, 161);
        --accent: rgb(188, 205, 240);
        --accent-foreground: rgb(24, 26, 36);
        --border: rgb(45, 46, 62);
    }
    
    [data-theme="dark"] .navbar-scrolled {
        background-color: rgba(35, 36, 58, 0.95);
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
document.addEventListener('DOMContentLoaded', () => {
    new AccessScanApp();
});