/**
 * AccessiScan - Web Accessibility Analyzer
 * A comprehensive client-side accessibility testing tool powered by axe-core
 * 
 * Features:
 * - HTML code analysis with real-time feedback
 * - URL analysis with CORS handling
 * - WCAG 2.1 Level A/AA compliance testing
 * - Detailed reporting with actionable insights
 * - Mobile-responsive design with full keyboard support
 * 
 * @author Computer Science Student Project
 * @version 1.0
 */

class AccessiScan {
    /**
     * Initialize the AccessiScan application
     * Sets up page-specific functionality and error handling
     */
    constructor() {
        this.currentResults = null;
        this.isAnalyzing = false;
        this.errorCount = 0;
        this.maxRetries = 3;
        
        // Configuration constants
        this.WCAG_LEVELS = {
            A: 'wcag2a',
            AA: 'wcag2aa',
            BEST_PRACTICES: 'best-practice'
        };
        
        this.SEVERITY_COLORS = {
            critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
            serious: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
            moderate: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
            minor: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' }
        };
        
        // Set up global error handling
        this.setupGlobalErrorHandling();
        
        // Initialize application based on current page
        this.initializeApp();
    }

    /**
     * Initialize the application based on the current page
     * Sets up page-specific event listeners and functionality
     */
    initializeApp() {
        try {
            // Initialize based on current page
            const currentPage = this.getCurrentPage();
            console.log(`Initializing AccessiScan for page: ${currentPage}`);
            
            switch (currentPage) {
                case 'analyze-html':
                    this.initializeHTMLAnalysis();
                    break;
                case 'analyze-url':
                    this.initializeURLAnalysis();
                    break;
                case 'results':
                    this.initializeResults();
                    break;
                case 'index':
                default:
                    this.initializeHomepage();
                    break;
            }

            // Initialize common functionality
            this.initializeNavigation();
            this.setupKeyboardNavigation();
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showCriticalError('Application failed to load properly. Please refresh the page.');
        }
    }

    /**
     * Determine the current page based on URL
     * @returns {string} Current page identifier
     */
    getCurrentPage() {
        try {
            const path = window.location.pathname;
            const filename = path.split('/').pop().split('.')[0];
            return filename || 'index';
        } catch (error) {
            console.warn('Could not determine current page, defaulting to index');
            return 'index';
        }
    }

    /**
     * Set up global error handling for unhandled errors
     */
    setupGlobalErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
            this.handleGlobalError(event.error);
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleGlobalError(event.reason);
            event.preventDefault(); // Prevent console error
        });
    }
    
    /**
     * Handle global application errors with user-friendly messages
     * @param {Error} error - The error that occurred
     */
    handleGlobalError(error) {
        this.errorCount++;
        
        // Don't overwhelm user with too many error messages
        if (this.errorCount > 5) {
            console.error('Too many errors, suppressing further notifications');
            return;
        }
        
        let message = 'An unexpected error occurred.';
        let recovery = 'Please try refreshing the page.';
        
        if (error.message) {
            if (error.message.includes('axe')) {
                message = 'Accessibility analysis engine failed to load.';
                recovery = 'Please check your internet connection and refresh the page.';
            } else if (error.message.includes('fetch') || error.message.includes('network')) {
                message = 'Network connection issue detected.';
                recovery = 'Please check your internet connection and try again.';
            } else if (error.message.includes('parse') || error.message.includes('syntax')) {
                message = 'Invalid HTML or data format detected.';
                recovery = 'Please check your input and try again.';
            }
        }
        
        this.showRecoverableError(message, recovery);
    }
    
    /**
     * Initialize homepage functionality
     */
    initializeHomepage() {
        try {
            // Initialize animated background
            this.initializeAnimatedBackground();
            
            // Add smooth scrolling for anchor links
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
            
            // Quick URL analysis functionality
            const quickUrlInput = document.getElementById('quick-url-input');
            if (quickUrlInput) {
                // Add URL analysis functionality
                window.quickAnalyze = () => {
                    const url = quickUrlInput.value.trim();
                    if (url) {
                        sessionStorage.setItem('quickAnalysisUrl', url);
                        window.location.href = 'analyze-url.html';
                    } else {
                        this.showNotification('Please enter a valid URL', 'error');
                    }
                };
                
                // Handle Enter key in quick input
                quickUrlInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        window.quickAnalyze();
                    }
                });
            }
            
        } catch (error) {
            console.warn('Homepage initialization had issues:', error);
        }
    }
    
    /**
     * Initialize animated background effects for Symphony design
     */
    initializeAnimatedBackground() {
        try {
            this.createDiagonalLines();
            this.createMovingLines();
            this.createIntersectionPoints();
        } catch (error) {
            console.warn('Background animation initialization had issues:', error);
        }
    }
    
    /**
     * Create animated diagonal mesh lines
     */
    createDiagonalLines() {
        const container1 = document.getElementById('diagonal-lines-1');
        const container2 = document.getElementById('diagonal-lines-2');
        
        if (!container1 || !container2) return;
        
        // Create diagonal lines with CSS-only animation
        container1.innerHTML = `
            <div style="
                position: absolute;
                width: 200%;
                height: 200%;
                top: -50%;
                left: -50%;
                background-image: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 20px,
                    rgba(147, 51, 234, 0.1) 21px,
                    rgba(147, 51, 234, 0.1) 22px,
                    transparent 23px
                );
                animation: diagonalMove 30s linear infinite;
            "></div>
        `;
        
        container2.innerHTML = `
            <div style="
                position: absolute;
                width: 200%;
                height: 200%;
                top: -50%;
                left: -50%;
                background-image: repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 15px,
                    rgba(59, 130, 246, 0.08) 16px,
                    rgba(59, 130, 246, 0.08) 17px,
                    transparent 18px
                );
                animation: diagonalMove 25s linear infinite reverse;
            "></div>
        `;
    }
    
    /**
     * Create animated horizontal and vertical lines
     */
    createMovingLines() {
        const horizontalContainer = document.getElementById('horizontal-lines');
        const verticalContainer = document.getElementById('vertical-lines');
        
        if (horizontalContainer) {
            for (let i = 0; i < 3; i++) {
                const line = document.createElement('div');
                line.style.cssText = `
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.3), transparent);
                    top: ${20 + i * 30}%;
                    animation: horizontalMove ${15 + i * 5}s linear infinite;
                `;
                horizontalContainer.appendChild(line);
            }
        }
        
        if (verticalContainer) {
            for (let i = 0; i < 3; i++) {
                const line = document.createElement('div');
                line.style.cssText = `
                    position: absolute;
                    width: 1px;
                    height: 100%;
                    background: linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.2), transparent);
                    left: ${15 + i * 25}%;
                    animation: verticalMove ${20 + i * 5}s linear infinite;
                `;
                verticalContainer.appendChild(line);
            }
        }
    }
    
    /**
     * Create animated intersection points
     */
    createIntersectionPoints() {
        const container = document.getElementById('intersection-points');
        if (!container) return;
        
        const points = [
            { x: 20, y: 30, delay: 0 },
            { x: 60, y: 20, delay: 2 },
            { x: 80, y: 70, delay: 4 },
            { x: 30, y: 80, delay: 6 },
            { x: 70, y: 50, delay: 8 }
        ];
        
        points.forEach(point => {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(147, 51, 234, 0.8);
                border-radius: 50%;
                left: ${point.x}%;
                top: ${point.y}%;
                animation: pointPulse 3s ease-in-out infinite;
                animation-delay: ${point.delay}s;
                box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
            `;
            container.appendChild(dot);
        });
    }
    
    /**
     * Initialize navigation functionality including mobile menu
     */
    initializeNavigation() {
        try {
            // Create mobile menu toggle if not exists
            this.createMobileMenuToggle();
            
            // Add active state to current page nav link
            this.updateActiveNavigation();
            
            // Handle navigation link focus states
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.addEventListener('focus', () => {
                    link.style.outline = '2px solid #6366f1';
                    link.style.outlineOffset = '2px';
                });
                link.addEventListener('blur', () => {
                    link.style.outline = '';
                    link.style.outlineOffset = '';
                });
            });
            
        } catch (error) {
            console.warn('Navigation initialization had issues:', error);
        }
    }
    
    /**
     * Set up comprehensive keyboard navigation support
     */
    setupKeyboardNavigation() {
        try {
            // Add keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Alt + H for HTML analysis
                if (e.altKey && e.key === 'h') {
                    e.preventDefault();
                    window.location.href = 'analyze-html.html';
                }
                // Alt + U for URL analysis
                if (e.altKey && e.key === 'u') {
                    e.preventDefault();
                    window.location.href = 'analyze-url.html';
                }
                // Alt + R for results (if available)
                if (e.altKey && e.key === 'r' && sessionStorage.getItem('analysisResults')) {
                    e.preventDefault();
                    window.location.href = 'results.html';
                }
                // Escape to clear modals/notifications
                if (e.key === 'Escape') {
                    this.hideAllNotifications();
                }
            });
            
            // Ensure all interactive elements are keyboard accessible
            this.enhanceKeyboardAccessibility();
            
        } catch (error) {
            console.warn('Keyboard navigation setup had issues:', error);
        }
    }

    /**
     * Create mobile menu toggle button and functionality
     */
    createMobileMenuToggle() {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        if (!header || !nav) return;
        
        // Check if mobile toggle already exists
        if (document.getElementById('mobile-menu-toggle')) return;
        
        // Create mobile menu toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.id = 'mobile-menu-toggle';
        mobileToggle.className = 'md:hidden p-2 text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500';
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileToggle.setAttribute('aria-expanded', 'false');
        
        // Hamburger icon
        mobileToggle.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        `;
        
        // Add to header
        const headerContent = header.querySelector('.flex.justify-between');
        if (headerContent) {
            headerContent.appendChild(mobileToggle);
        }
        
        // Create mobile menu
        const mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        mobileMenu.className = 'hidden md:hidden bg-white border-t border-gray-200';
        
        // Clone navigation links for mobile
        const navLinks = nav.querySelectorAll('a');
        const mobileNavHTML = Array.from(navLinks).map(link => {
            return `<a href="${link.href}" class="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">${link.textContent}</a>`;
        }).join('');
        
        mobileMenu.innerHTML = `<div class="py-2">${mobileNavHTML}</div>`;
        header.appendChild(mobileMenu);
        
        // Toggle functionality
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                mobileMenu.classList.add('hidden');
            } else {
                mobileMenu.classList.remove('hidden');
            }
        });
    }
    
    /**
     * Update active navigation state based on current page
     */
    updateActiveNavigation() {
        const currentPage = this.getCurrentPage();
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = href ? href.split('/').pop().split('.')[0] : '';
            
            if ((currentPage === 'index' && (href === 'index.html' || href === '/')) ||
                (currentPage === linkPage)) {
                link.classList.add('text-indigo-600', 'font-medium');
                link.classList.remove('text-gray-700');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('text-indigo-600', 'font-medium');
                link.classList.add('text-gray-700');
                link.removeAttribute('aria-current');
            }
        });
    }
    
    /**
     * Enhance keyboard accessibility for all interactive elements
     */
    enhanceKeyboardAccessibility() {
        // Add keyboard support for sample buttons
        const sampleButtons = document.querySelectorAll('[id*="sample"][id*="btn"]');
        sampleButtons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
        
        // Ensure all buttons have proper focus styles
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            if (!button.style.outline) {
                button.addEventListener('focus', () => {
                    button.style.outline = '2px solid #6366f1';
                    button.style.outlineOffset = '2px';
                });
                button.addEventListener('blur', () => {
                    button.style.outline = '';
                    button.style.outlineOffset = '';
                });
            }
        });
    }
    
    // ================================================================
    // HTML Analysis Page Functions
    // ================================================================
    
    /**
     * Initialize HTML analysis page functionality
     * Sets up form handlers, sample loading, and analysis controls
     */
    initializeHTMLAnalysis() {
        const form = document.getElementById('html-analysis-form');
        const analyzeBtn = document.getElementById('analyze-btn');
        const clearBtn = document.getElementById('clear-btn');
        const sampleBtn = document.getElementById('sample-btn');
        const htmlInput = document.getElementById('html-input');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.analyzeHTML();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearTextarea();
                this.hideError();
                this.hideResults();
            });
        }

        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => {
                this.loadSampleHTML();
            });
        }

        // New sample loading buttons
        const sampleProblematicBtn = document.getElementById('sample-problematic-btn');
        if (sampleProblematicBtn) {
            sampleProblematicBtn.addEventListener('click', () => {
                this.loadSampleHTML('problematic');
            });
        }

        const sampleCleanBtn = document.getElementById('sample-clean-btn');
        if (sampleCleanBtn) {
            sampleCleanBtn.addEventListener('click', () => {
                this.loadSampleHTML('clean');
            });
        }

        const sampleEducationalBtn = document.getElementById('sample-educational-btn');
        if (sampleEducationalBtn) {
            sampleEducationalBtn.addEventListener('click', () => {
                this.loadSampleHTML('educational');
            });
        }

        // Handle view results button
        const viewResultsBtn = document.getElementById('view-results-btn');
        if (viewResultsBtn) {
            viewResultsBtn.addEventListener('click', () => {
                this.navigateToResults();
            });
        }

        // Handle analyze another button
        const analyzeAnotherBtn = document.getElementById('analyze-another-btn');
        if (analyzeAnotherBtn) {
            analyzeAnotherBtn.addEventListener('click', () => {
                this.resetHTMLForm();
            });
        }
    }

    // Sample HTML data for testing and demonstration
    getSampleHTMLs() {
        return {
            problematic: `<!DOCTYPE html>
<html>
<head><title>Test Page with Issues</title></head>
<body>
    <!-- Multiple accessibility violations for demonstration -->
    <img src="test.jpg">
    <button>Click</button>
    <input type="text">
    <div style="color: #ccc; background: #ddd;">Low contrast text</div>
    <h3>Wrong heading order</h3>
    <h1>This should be h2</h1>
    <a href="#">Empty link</a>
    <table>
        <tr><td>No headers</td><td>Bad table</td></tr>
    </table>
    <form>
        <input type="password">
        <button type="submit">Submit</button>
    </form>
</body>
</html>`,
            
            clean: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessible Page Example</title>
</head>
<body>
    <header>
        <nav aria-label="Main navigation">
            <ul>
                <li><a href="#main">Skip to main content</a></li>
                <li><a href="https://example.com">Home</a></li>
                <li><a href="https://example.com/about">About</a></li>
            </ul>
        </nav>
    </header>
    
    <main id="main">
        <h1>Main Heading</h1>
        <p>This is a fully accessible page example with proper semantic structure.</p>
        
        <section aria-labelledby="content-heading">
            <h2 id="content-heading">Content Section</h2>
            <img src="test.jpg" alt="Descriptive alt text for the image">
            <button type="button">Accessible Button</button>
            
            <form>
                <label for="email">Email Address:</label>
                <input type="email" id="email" name="email" required>
                <button type="submit">Submit Form</button>
            </form>
            
            <a href="https://example.com">Visit Example Site</a>
            
            <table>
                <caption>Team Members</caption>
                <thead>
                    <tr><th>Name</th><th>Role</th></tr>
                </thead>
                <tbody>
                    <tr><td>John Doe</td><td>Developer</td></tr>
                </tbody>
            </table>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Accessible Page Example</p>
    </footer>
</body>
</html>`,

            educational: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Educational Example - Mixed Issues</title>
</head>
<body>
    <h1>Learning Web Accessibility</h1>
    <h2>Common Issues to Fix</h2>
    
    <!-- Good examples -->
    <img src="chart.png" alt="Sales increased 25% from Q1 to Q2">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username">
    
    <!-- Issues to demonstrate -->
    <img src="logo.png">
    <button>Submit</button>
    <input type="password">
    <div style="color: #aaa; background: #eee;">Poor contrast example</div>
    
    <h2>Navigation</h2>
    <a href="#">Click here</a>
    <a href="about.html">Learn more about our company</a>
</body>
</html>`
        };
    }

    /**
     * Load sample HTML with error handling and user feedback
     * @param {string} type - Type of sample to load (problematic, clean, educational)
     */
    loadSampleHTML(type = 'problematic') {
        try {
            const textarea = document.getElementById('html-input');
            if (!textarea) {
                this.showNotification('HTML input field not found.', 'error');
                return;
            }
            
            const samples = this.getSampleHTMLs();
            
            if (!samples[type]) {
                this.showNotification(`Sample type "${type}" not found.`, 'error');
                return;
            }
            
            // Clear any existing errors
            this.hideError();
            this.hideAllNotifications();
            
            // Load the sample
            textarea.value = samples[type];
            
            // Show notification about which sample was loaded
            const sampleNames = {
                problematic: 'Sample with Issues',
                clean: 'Clean Sample',
                educational: 'Educational Sample'
            };
            
            this.showNotification(`${sampleNames[type]} loaded successfully!`, 'success');
            
            // Update sample indicator
            this.updateSampleIndicator(sampleNames[type]);
            
            // Focus the textarea for immediate editing
            textarea.focus();
            
        } catch (error) {
            console.error('Error loading sample HTML:', error);
            this.showNotification('Failed to load sample HTML. Please try again.', 'error');
        }
    }

    /**
     * Clear textarea with confirmation for large content
     */
    clearTextarea() {
        try {
            const textarea = document.getElementById('html-input');
            if (!textarea) {
                this.showNotification('HTML input field not found.', 'error');
                return;
            }
            
            // Ask for confirmation if there's substantial content
            if (textarea.value.length > 100) {
                const shouldClear = confirm('Are you sure you want to clear all the HTML content?');
                if (!shouldClear) return;
            }
            
            textarea.value = '';
            this.showNotification('Content cleared successfully!', 'success');
            this.updateSampleIndicator('');
            this.hideError();
            this.hideAllNotifications();
            
            // Focus the textarea
            textarea.focus();
            
        } catch (error) {
            console.error('Error clearing textarea:', error);
            this.showNotification('Failed to clear content. Please try again.', 'error');
        }
    }
    
    /**
     * Validate HTML content for basic syntax
     * @param {string} html - HTML content to validate
     * @returns {boolean} Whether HTML appears valid
     */
    isValidHTML(html) {
        try {
            // Basic checks for HTML structure
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Check for parser errors
            const parserErrors = doc.querySelectorAll('parsererror');
            if (parserErrors.length > 0) {
                console.warn('HTML parser found errors:', parserErrors);
                return false;
            }
            
            // Check for basic HTML structure
            const hasHtml = html.toLowerCase().includes('<html') || html.toLowerCase().includes('<!doctype');
            const hasBody = html.toLowerCase().includes('<body') || html.toLowerCase().includes('<main') || html.toLowerCase().includes('<div');
            
            return hasHtml || hasBody;
        } catch (error) {
            console.warn('HTML validation error:', error);
            return true; // Assume valid if validation fails
        }
    }
    
    /**
     * Handle analysis errors with user-friendly messages and recovery options
     * @param {Error} error - The error that occurred during analysis
     */
    handleAnalysisError(error) {
        let message = 'Analysis failed unexpectedly.';
        let recovery = 'Please try again or use a different HTML sample.';
        
        if (error.message) {
            if (error.message.includes('axe')) {
                message = 'Accessibility testing engine encountered an issue.';
                recovery = 'This may be due to invalid HTML. Try using one of our sample HTMLs or check your HTML syntax.';
            } else if (error.message.includes('parse') || error.message.includes('DOM')) {
                message = 'Unable to parse the HTML content.';
                recovery = 'Please check your HTML syntax and ensure it\'s well-formed. You can try our sample HTMLs for testing.';
            } else if (error.message.includes('memory') || error.message.includes('quota')) {
                message = 'The HTML content is too complex for analysis.';
                recovery = 'Please try with smaller HTML content or remove complex elements like large embedded scripts.';
            } else if (error.message.includes('timeout')) {
                message = 'Analysis took too long to complete.';
                recovery = 'The HTML might be too large. Please try with smaller content or simpler structure.';
            }
        }
        
        this.showRecoverableError(message, recovery);
    }

    updateSampleIndicator(sampleName) {
        const indicator = document.getElementById('sample-indicator');
        if (indicator) {
            if (sampleName) {
                indicator.textContent = `Current: ${sampleName}`;
                indicator.className = 'text-sm text-blue-600 font-medium';
            } else {
                indicator.textContent = '';
                indicator.className = 'text-sm text-gray-500';
            }
        }
    }

    /**
     * Perform HTML analysis with comprehensive error handling
     * Validates input, shows loading states, and handles all error scenarios
     */
    async analyzeHTML() {
        // Prevent multiple simultaneous analyses
        if (this.isAnalyzing) {
            this.showNotification('Analysis already in progress. Please wait...', 'info');
            return;
        }
        
        const htmlInput = document.getElementById('html-input');
        if (!htmlInput) {
            this.showCriticalError('HTML input field not found. Please refresh the page.');
            return;
        }
        
        const htmlContent = htmlInput.value.trim();

        // Comprehensive input validation
        if (!htmlContent) {
            this.showNotification('Please enter some HTML code to analyze.', 'warning');
            htmlInput.focus();
            return;
        }
        
        if (htmlContent.length < 10) {
            this.showNotification('HTML content seems too short. Please enter a complete HTML document.', 'warning');
            htmlInput.focus();
            return;
        }
        
        if (htmlContent.length > 500000) { // 500KB limit
            this.showNotification('HTML content is too large. Please limit to 500KB for better performance.', 'warning');
            return;
        }
        
        // Basic HTML validation
        if (!this.isValidHTML(htmlContent)) {
            const shouldContinue = confirm('The HTML appears to have syntax issues. Continue with analysis anyway?');
            if (!shouldContinue) return;
        }

        this.isAnalyzing = true;
        this.showLoading('analyze-btn', 'analyze-btn-text', 'analyze-spinner');
        this.hideError();
        this.hideAllNotifications();

        try {
            await this.analyzeHTMLCode(htmlContent);
        } catch (error) {
            console.error('Analysis error:', error);
            this.handleAnalysisError(error);
        } finally {
            this.isAnalyzing = false;
            this.hideLoading('analyze-btn', 'analyze-btn-text', 'analyze-spinner');
        }
    }

    async analyzeHTMLCode(htmlString) {
        try {
            console.log('Starting HTML analysis...');
            
            // Show progress feedback
            setTimeout(() => {
                this.showProgressMessage('Parsing HTML structure...');
            }, 300);
            
            // Parse HTML into proper DOM structure
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            
            // Configure axe based on selected options
            const options = this.getAnalysisOptions();
            
            console.log('Running axe-core analysis with options:', options);
            
            // Update progress
            setTimeout(() => {
                this.showProgressMessage('Running accessibility tests...');
            }, 600);
            
            // Run axe-core analysis on the parsed document
            const results = await axe.run(doc, options);
            
            console.log('Analysis complete. Violations found:', results.violations.length);
            console.log('Incomplete tests:', results.incomplete.length);
            console.log('Passed tests:', results.passes.length);
            
            // Store results for display
            sessionStorage.setItem('analysisResults', JSON.stringify({
                type: 'html',
                results: results,
                analyzedContent: htmlString.substring(0, 200) + '...',
                timestamp: new Date().toISOString()
            }));
            
            // Also store in the format expected by results page
            sessionStorage.setItem('accessiscan-results', JSON.stringify({
                type: 'html',
                content: htmlString,
                results: results,
                timestamp: new Date().toISOString()
            }));
            
            console.log('Results stored, redirecting to results page...');
            
            // Show success message
            const violationsCount = results.violations.length;
            const successMsg = violationsCount === 0 
                ? 'Perfect! No accessibility issues found.' 
                : `Analysis complete! Found ${violationsCount} issue${violationsCount !== 1 ? 's' : ''} to review.`;
            
            this.showSuccessMessage(successMsg);
            
            // Redirect to results page with a slight delay
            setTimeout(() => {
                window.location.href = 'results.html';
            }, 1500);
            
        } catch (error) {
            console.error('Analysis error:', error);
            throw new Error('Analysis failed: ' + error.message);
        }
    }

    async runAxeAnalysis(htmlContent) {
        // This method is now replaced by analyzeHTMLCode using DOMParser
        // Keeping for backward compatibility if needed elsewhere
        return new Promise((resolve, reject) => {
            try {
                console.log('Running legacy iframe analysis...');
                // Create a temporary iframe to analyze the HTML
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(htmlContent);
                iframeDoc.close();

                // Configure axe based on selected options
                const options = this.getAnalysisOptions();

                // Run axe analysis
                axe.run(iframeDoc, options, (err, results) => {
                    document.body.removeChild(iframe);
                    
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    resolve(results);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    getAnalysisOptions() {
        const options = { tags: [] };
        
        // Define checkbox mappings to avoid repetition
        const checkboxMappings = [
            { id: 'check-wcag-a', tag: this.WCAG_LEVELS.A },
            { id: 'check-wcag-aa', tag: this.WCAG_LEVELS.AA },
            { id: 'check-best-practices', tag: this.WCAG_LEVELS.BEST_PRACTICES },
            { id: 'url-check-wcag-a', tag: this.WCAG_LEVELS.A },
            { id: 'url-check-wcag-aa', tag: this.WCAG_LEVELS.AA },
            { id: 'url-check-best-practices', tag: this.WCAG_LEVELS.BEST_PRACTICES }
        ];
        
        // Check all possible checkboxes
        checkboxMappings.forEach(mapping => {
            const checkbox = document.getElementById(mapping.id);
            if (checkbox?.checked && !options.tags.includes(mapping.tag)) {
                options.tags.push(mapping.tag);
            }
        });

        // Default to WCAG 2.1 AA if no tags selected
        if (options.tags.length === 0) {
            options.tags = [this.WCAG_LEVELS.AA];
        }

        return options;
    }

    /**
     * Display HTML analysis results with enhanced error handling
     * @param {Object} results - Axe analysis results
     */
    showHTMLResults(results) {
        try {
            const resultsPreview = document.getElementById('results-preview');
            const resultsSummary = document.getElementById('results-summary');

            if (!resultsPreview || !resultsSummary) {
                console.error('Results display elements not found');
                this.showNotification('Unable to display results. Please try again.', 'error');
                return;
            }
            
            if (!results) {
                this.showNotification('No analysis results available.', 'error');
                return;
            }

            // Use the refactored summary HTML generator
            resultsSummary.innerHTML = this.createResultsSummaryHTML(results);
            resultsPreview.classList.remove('hidden');
            
            // Announce results to screen readers
            const violationsCount = results.violations?.length || 0;
            const passesCount = results.passes?.length || 0;
            this.announceToScreenReader(`Analysis complete. Found ${violationsCount} violations, ${passesCount} passed tests.`);
            
        } catch (error) {
            console.error('Error displaying HTML results:', error);
            this.showNotification('Failed to display results. Please try the analysis again.', 'error');
        }
    }

    /**
     * Reset HTML form with comprehensive cleanup
     */
    resetHTMLForm() {
        try {
            const htmlInput = document.getElementById('html-input');
            const resultsPreview = document.getElementById('results-preview');
            
            if (htmlInput) {
                htmlInput.value = '';
                htmlInput.focus();
            }
            if (resultsPreview) {
                resultsPreview.classList.add('hidden');
            }
            
            this.hideError();
            this.hideAllNotifications();
            this.updateSampleIndicator('');
            
            // Reset analysis state
            this.isAnalyzing = false;
            this.currentResults = null;
            
            this.showNotification('Form reset successfully!', 'success');
            
        } catch (error) {
            console.error('Error resetting HTML form:', error);
            this.showNotification('Failed to reset form completely. Please refresh the page.', 'error');
        }
    }

    // URL Analysis Page Functions
    initializeURLAnalysis() {
        const form = document.getElementById('url-analysis-form');
        const viewResultsBtn = document.getElementById('url-view-results-btn');
        const analyzeAnotherBtn = document.getElementById('url-analyze-another-btn');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.analyzeURL();
            });
        }

        if (viewResultsBtn) {
            viewResultsBtn.addEventListener('click', () => {
                this.navigateToResults();
            });
        }

        if (analyzeAnotherBtn) {
            analyzeAnotherBtn.addEventListener('click', () => {
                this.resetURLForm();
            });
        }
    }

    async analyzeURL() {
        const urlInput = document.getElementById('url-input');
        const url = urlInput.value.trim();

        if (!url) {
            this.showNotification('Please enter a valid URL.', 'warning');
            return;
        }

        if (!this.isValidURL(url)) {
            this.showNotification('Please enter a valid URL (including http:// or https://).', 'warning');
            return;
        }

        try {
            console.log('Attempting URL analysis for:', url);
            
            // Show loading state
            this.showLoading('url-analyze-btn', 'url-analyze-btn-text', 'url-analyze-spinner');
            this.hideURLError();
            
            try {
                // Show progress feedback
                setTimeout(() => {
                    this.showProgressMessage('Connecting to website...');
                }, 300);
                
                // Attempt to fetch URL (will likely fail due to CORS)
                const response = await fetch(url, { 
                    mode: 'cors',
                    method: 'GET'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const html = await response.text();
                
                // Update progress
                this.showProgressMessage('Running accessibility tests...');
                
                // If successful, analyze the HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const results = await axe.run(doc, {
                    tags: this.getSelectedTags()
                });
                
                sessionStorage.setItem('analysisResults', JSON.stringify({
                    type: 'url',
                    url: url,
                    results: results,
                    timestamp: new Date().toISOString()
                }));
                
                // Show success message
                const violationsCount = results.violations.length;
                const successMsg = violationsCount === 0 
                    ? `Perfect! ${url} has no accessibility issues.` 
                    : `Analysis complete! Found ${violationsCount} issue${violationsCount !== 1 ? 's' : ''} on ${url}.`;
                
                this.showSuccessMessage(successMsg);
                
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 1500);
                
            } catch (fetchError) {
                // Handle CORS/fetch errors gracefully
                this.handleCORSError(url, fetchError);
            }
            
        } catch (error) {
            console.error('URL analysis error:', error);
            
            // Provide helpful error messages based on error type
            let errorMessage = 'Analysis failed: ' + error.message;
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                errorMessage = 'Cannot access this website due to security restrictions. Try analyzing your own website or use the HTML analysis instead.';
            } else if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            
            this.showNotification(errorMessage, 'error');
        } finally {
            // Reset button state
            this.hideLoading('url-analyze-btn', 'url-analyze-btn-text', 'url-analyze-spinner');
        }
    }

    handleCORSError(url, error) {
        console.log('CORS limitation encountered for:', url);
        
        // Suppress the unhandled promise rejection by properly handling the error
        Promise.resolve().catch(() => {
            // This prevents the unhandled rejection warning
        });
        
        sessionStorage.setItem('analysisResults', JSON.stringify({
            type: 'url',
            url: url,
            corsError: true,
            results: { violations: [], incomplete: [], passes: [], inapplicable: [] },
            message: 'URL analysis blocked by browser security (CORS). This is normal for external websites. Try copying the HTML source code and using "Analyze HTML Code" instead.',
            timestamp: new Date().toISOString()
        }));
        
        window.location.href = 'results.html';
    }

    getSelectedTags() {
        const options = this.getAnalysisOptions();
        return options.tags.length > 0 ? options.tags : [this.WCAG_LEVELS.A, this.WCAG_LEVELS.AA, this.WCAG_LEVELS.BEST_PRACTICES];
    }

    isValidURL(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    showURLResults(results) {
        const resultsPreview = document.getElementById('url-results-preview');
        const resultsSummary = document.getElementById('url-results-summary');

        if (resultsPreview && resultsSummary) {
            resultsSummary.innerHTML = this.createResultsSummaryHTML(results);
            resultsPreview.classList.remove('hidden');
        }
    }
    
    /**
     * Create reusable results summary HTML
     * @param {Object} results - Analysis results
     * @returns {string} HTML string for results summary
     */
    createResultsSummaryHTML(results) {
        const stats = [
            { label: 'Violations', count: results.violations?.length || 0, color: 'red' },
            { label: 'Incomplete', count: results.incomplete?.length || 0, color: 'yellow' },
            { label: 'Passes', count: results.passes?.length || 0, color: 'green' },
            { label: 'Inapplicable', count: results.inapplicable?.length || 0, color: 'blue' }
        ];
        
        return `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                ${stats.map(stat => `
                    <div class="bg-${stat.color}-50 p-3 rounded-lg border border-${stat.color}-200">
                        <div class="text-2xl font-bold text-${stat.color}-600" aria-label="${stat.count} ${stat.label.toLowerCase()}">${stat.count}</div>
                        <div class="text-sm text-${stat.color}-600">${stat.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    resetURLForm() {
        const urlInput = document.getElementById('url-input');
        const resultsPreview = document.getElementById('url-results-preview');
        
        if (urlInput) urlInput.value = '';
        if (resultsPreview) resultsPreview.classList.add('hidden');
        
        this.hideURLError();
    }

    // Results Page Functions
    initializeResults() {
        const exportBtn = document.getElementById('export-results-btn');
        const newAnalysisBtn = document.getElementById('new-analysis-btn');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportResults();
            });
        }

        if (newAnalysisBtn) {
            newAnalysisBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }

    // Navigation Functions
    navigateToResults() {
        window.location.href = 'results.html';
    }

    // ================================================================
    // Error Handling and Notification System
    // ================================================================
    
    /**
     * Show critical error that requires page refresh
     * @param {string} message - Error message to display
     */
    showCriticalError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md text-center';
        errorDiv.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div>
                    <div class="font-semibold">Critical Error</div>
                    <div class="text-sm">${message}</div>
                </div>
            </div>
            <button onclick="window.location.reload()" class="mt-3 bg-white text-red-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
                Refresh Page
            </button>
        `;
        document.body.appendChild(errorDiv);
    }
    
    /**
     * Show recoverable error with recovery suggestions
     * @param {string} message - Error message
     * @param {string} recovery - Recovery instructions
     */
    showRecoverableError(message, recovery) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-lg z-50 max-w-lg';
        errorDiv.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Error</h3>
                    <div class="mt-1 text-sm text-red-700">
                        <p>${message}</p>
                        <p class="mt-2 font-medium">How to fix: ${recovery}</p>
                    </div>
                    <div class="mt-3">
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors">
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }
    
    /**
     * Show success message with positive feedback
     * @param {string} message - Success message
     */
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }
    
    /**
     * Hide all notifications
     */
    hideAllNotifications() {
        const notifications = document.querySelectorAll('[class*="notification-"], .fixed[class*="bg-red-"], .fixed[class*="bg-green-"], .fixed[class*="bg-yellow-"], .fixed[class*="bg-blue-"]');
        notifications.forEach(notification => {
            if (notification.id !== 'progress-message') {
                notification.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        });
    }
    
    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
    
    // ================================================================
    // Utility Functions
    // ================================================================
    
    /**
     * Show loading state for buttons with spinner
     * @param {string} btnId - Button element ID
     * @param {string} textId - Text element ID
     * @param {string} spinnerId - Spinner element ID
     */
    showLoading(btnId, textId, spinnerId) {
        try {
            const btn = document.getElementById(btnId);
            const text = document.getElementById(textId);
            const spinner = document.getElementById(spinnerId);

            if (btn) {
                btn.disabled = true;
                btn.classList.add('opacity-75', 'cursor-not-allowed', 'loading-disabled');
                btn.setAttribute('aria-busy', 'true');
                btn.setAttribute('aria-describedby', 'loading-status');
                
                // Add haptic feedback on mobile devices
                if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                }
            }
            
            if (text) {
                const isUrl = btnId.includes('url');
                text.textContent = isUrl ? 'Connecting...' : 'Analyzing...';
            }
            
            if (spinner) {
                spinner.classList.remove('hidden');
                spinner.setAttribute('aria-label', 'Loading in progress');
            }
            
            // Create loading status for screen readers
            this.updateLoadingStatus('Analysis in progress, please wait...');
            
            // Enhanced progress feedback
            requestAnimationFrame(() => {
                this.showProgressMessage(btnId.includes('url') ? 'Connecting to website...' : 'Preparing analysis...');
            });
            
        } catch (error) {
            console.warn('Error setting loading state:', error);
        }
    }
    
    /**
     * Update loading status for screen readers
     * @param {string} message - Status message
     */
    updateLoadingStatus(message) {
        let statusEl = document.getElementById('loading-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'loading-status';
            statusEl.className = 'sr-only';
            statusEl.setAttribute('aria-live', 'polite');
            statusEl.setAttribute('aria-atomic', 'true');
            document.body.appendChild(statusEl);
        }
        statusEl.textContent = message;
    }

    hideLoading(btnId, textId, spinnerId) {
        try {
            const btn = document.getElementById(btnId);
            const text = document.getElementById(textId);
            const spinner = document.getElementById(spinnerId);

            if (btn) {
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'cursor-not-allowed', 'loading-disabled');
                btn.removeAttribute('aria-busy');
                btn.removeAttribute('aria-describedby');
                
                // Add completion animation
                btn.classList.add('loading-complete');
                setTimeout(() => {
                    btn.classList.remove('loading-complete');
                }, 300);
            }
            
            if (text) {
                const isUrl = btnId.includes('url');
                const originalText = isUrl ? 'Analyze Website' : 'Analyze HTML';
                
                // Smooth text transition
                text.style.opacity = '0';
                setTimeout(() => {
                    text.textContent = originalText;
                    text.style.opacity = '1';
                }, 150);
            }
            
            if (spinner) {
                spinner.classList.add('hidden');
                spinner.removeAttribute('aria-label');
            }
            
            // Clear loading status
            this.updateLoadingStatus('');
            
            // Hide progress message with delay
            setTimeout(() => {
                this.hideProgressMessage();
            }, 200);
            
        } catch (error) {
            console.warn('Error hiding loading state:', error);
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');

        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    /**
     * Hide error message elements
     */
    hideError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
        
        const urlErrorDiv = document.getElementById('url-error-message');
        if (urlErrorDiv) {
            urlErrorDiv.classList.add('hidden');
        }
    }

    showURLError(message) {
        const errorDiv = document.getElementById('url-error-message');
        const errorText = document.getElementById('url-error-text');

        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    /**
     * Hide URL-specific error messages
     */
    hideURLError() {
        this.hideError();
    }

    showProgressMessage(message) {
        // Create or update progress message element
        let progressDiv = document.getElementById('progress-message');
        if (!progressDiv) {
            progressDiv = document.createElement('div');
            progressDiv.id = 'progress-message';
            progressDiv.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:right-4 sm:left-auto sm:translate-x-0 bg-blue-600 text-white px-4 py-3 sm:px-6 rounded-lg shadow-lg flex items-center space-x-2 sm:space-x-3 transition-all duration-300 translate-y-full z-50 max-w-xs sm:max-w-sm';
            progressDiv.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span id="progress-text">${message}</span>
            `;
            document.body.appendChild(progressDiv);
            
            // Animate in
            setTimeout(() => {
                progressDiv.classList.remove('translate-y-full');
            }, 100);
        } else {
            document.getElementById('progress-text').textContent = message;
        }
    }

    hideProgressMessage() {
        const progressDiv = document.getElementById('progress-message');
        if (progressDiv) {
            progressDiv.classList.add('translate-y-full');
            setTimeout(() => {
                progressDiv.remove();
            }, 300);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 transition-all duration-300 transform translate-y-full z-50 max-w-xs sm:max-w-sm';
        
        const colors = {
            success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-400' },
            error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-400' },
            warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-400' },
            info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-400' }
        };
        
        const color = colors[type] || colors.info;
        notificationDiv.className = `fixed bottom-4 right-4 ${color.bg} ${color.border} border rounded-lg shadow-lg px-4 py-3 transition-all duration-300 transform translate-y-full z-50 max-w-xs sm:max-w-sm`;
        
        const icons = {
            success: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
            error: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
            warning: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>`,
            info: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>`
        };
        
        notificationDiv.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <svg class="h-4 w-4 ${color.icon}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        ${icons[type] || icons.info}
                    </svg>
                </div>
                <div class="ml-2 flex-1">
                    <p class="text-sm font-medium ${color.text}">${message}</p>
                </div>
                <div class="ml-2 flex-shrink-0">
                    <button class="inline-flex ${color.text} hover:${color.text.replace('700', '500')} focus:outline-none" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notificationDiv);
        
        // Animate in
        setTimeout(() => {
            notificationDiv.classList.remove('translate-y-full');
        }, 100);
        
        // Auto-hide after 5 seconds (longer on mobile for easier reading)
        const hideDelay = window.innerWidth <= 768 ? 7000 : 5000;
        setTimeout(() => {
            if (document.body.contains(notificationDiv)) {
                notificationDiv.classList.add('translate-y-full');
                setTimeout(() => {
                    if (document.body.contains(notificationDiv)) {
                        notificationDiv.remove();
                    }
                }, 300);
            }
        }, hideDelay);
    }

    showSuccessMessage(message, details) {
        this.showNotification(message, 'success');
        
        // Update progress message to show completion
        this.showProgressMessage('Analysis complete! Preparing results...');
        
        // Hide progress after a short delay
        setTimeout(() => {
            this.hideProgressMessage();
        }, 1500);
    }

    hideResults() {
        const resultsPreview = document.getElementById('results-preview');
        const urlResultsPreview = document.getElementById('url-results-preview');
        
        if (resultsPreview) resultsPreview.classList.add('hidden');
        if (urlResultsPreview) urlResultsPreview.classList.add('hidden');
    }

    exportResults() {
        if (!this.currentResults) {
            this.showNotification('No results to export. Please run an analysis first.', 'warning');
            return;
        }

        const exportData = {
            ...this.currentResults,
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `accessiscan-results-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Results page specific functions
const displayResults = () => {
    const resultsData = sessionStorage.getItem('analysisResults');
    const container = document.getElementById('resultsContainer');
    const successState = document.getElementById('success-state');
    const issuesState = document.getElementById('issues-state');
    const overallScore = document.getElementById('overall-score');
    
    if (!resultsData) {
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8 glass-card">
                    <p class="text-gray-300 mb-4">No analysis results found.</p>
                    <a href="index.html" class="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                        Go back to homepage
                    </a>
                </div>
            `;
        }
        return;
    }
    
    const data = JSON.parse(resultsData);
    console.log('Displaying results:', data);
    
    // Update timestamp
    const timestampEl = document.getElementById('analysis-timestamp');
    if (timestampEl) {
        const date = new Date(data.timestamp);
        timestampEl.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Analyzed on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}
        `;
    }
    
    // Handle CORS error case
    if (data.corsError) {
        handleCORSErrorDisplay(data, container);
        return;
    }
    
    const violations = data.results.violations || [];
    console.log('Violations found:', violations.length);
    
    // Update overall score display
    if (overallScore) {
        overallScore.textContent = violations.length;
        if (violations.length === 0) {
            overallScore.className = "text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4";
        } else {
            overallScore.className = "text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4";
        }
    }
    
    // Show appropriate state based on results
    if (violations.length === 0) {
        showSuccessState(successState, issuesState);
    } else {
        showIssuesState(violations, data, successState, issuesState);
    }
};

const handleCORSErrorDisplay = (data, container) => {
    if (container) {
        container.innerHTML = `
            <div class="glass-card bg-blue-500/10 border-blue-500/20">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-lg font-medium text-blue-300 mb-3">Understanding Web Security (CORS)</h3>
                        <div class="text-blue-200">
                            <p class="mb-3">The website <strong class="text-white">${data.url}</strong> could not be analyzed due to browser security restrictions.</p>
                            
                            <div class="bg-white/5 rounded-lg p-4 mb-4">
                                <h4 class="font-semibold text-white mb-2">💡 Why This Happens</h4>
                                <p class="text-gray-300 text-sm">Browsers prevent cross-origin requests for security. This protects users from malicious websites.</p>
                            </div>
                            
                            <div class="flex flex-col sm:flex-row gap-3">
                                <a href="analyze-html.html" class="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-center">
                                    Try HTML Analysis
                                </a>
                                <a href="analyze-url.html" class="glass-card bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-center">
                                    Try Another URL
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

const showSuccessState = (successState, issuesState) => {
    if (successState) {
        successState.classList.remove('hidden');
    }
    if (issuesState) {
        issuesState.classList.add('hidden');
    }
};

const showIssuesState = (violations, data, successState, issuesState) => {
    if (successState) {
        successState.classList.add('hidden');
    }
    if (issuesState) {
        issuesState.classList.remove('hidden');
    }
    
    // Update quick stats
    updateQuickStats(violations);
    
    // Display violations with improved styling
    displayViolations(violations, data);
};

const updateQuickStats = (violations) => {
    const counts = {
        critical: violations.filter(v => v.impact === 'critical').length,
        serious: violations.filter(v => v.impact === 'serious').length,
        moderate: violations.filter(v => v.impact === 'moderate').length,
        minor: violations.filter(v => v.impact === 'minor').length
    };
    
    Object.entries(counts).forEach(([severity, count]) => {
        const element = document.getElementById(`${severity}-count`);
        if (element) {
            element.textContent = count;
        }
    });
};

const displayViolations = (violations, data) => {
    const container = document.getElementById('resultsContainer');
    
    // Create summary
    const summary = createSummary(violations, data.results);
    
    // Group violations by severity
    const grouped = groupViolationsBySeverity(violations);
    
    let html = summary;
    
    // Display each severity group
    ['critical', 'serious', 'moderate', 'minor'].forEach(severity => {
        if (grouped[severity] && grouped[severity].length > 0) {
            html += createSeveritySection(severity, grouped[severity]);
        }
    });
    
    container.innerHTML = html;
};

const createSummary = (violations, results) => {
    const total = violations.length;
    const critical = violations.filter(v => v.impact === 'critical').length;
    const serious = violations.filter(v => v.impact === 'serious').length;
    const moderate = violations.filter(v => v.impact === 'moderate').length;
    const minor = violations.filter(v => v.impact === 'minor').length;
    
    return `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 class="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Analysis Summary
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                    <p class="text-blue-700 text-lg mb-2">
                        Found <strong class="text-blue-900">${total} accessibility issues</strong>
                        ${critical > 0 || serious > 0 ? ` requiring attention` : ''}
                    </p>
                    ${total > 0 ? `
                        <div class="text-sm text-blue-600 space-y-1">
                            ${critical > 0 ? `<div>🔴 ${critical} critical (fix immediately)</div>` : ''}
                            ${serious > 0 ? `<div>🟠 ${serious} serious (fix soon)</div>` : ''}
                            ${moderate > 0 ? `<div>🟡 ${moderate} moderate (address when possible)</div>` : ''}
                            ${minor > 0 ? `<div>🟢 ${minor} minor (enhancement)</div>` : ''}
                        </div>
                    ` : ''}
                </div>
                <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="bg-white rounded-lg p-3">
                        <div class="text-2xl font-bold text-green-600">${results.passes?.length || 0}</div>
                        <div class="text-xs text-gray-600">Passed Tests</div>
                    </div>
                    <div class="bg-white rounded-lg p-3">
                        <div class="text-2xl font-bold text-yellow-600">${results.incomplete?.length || 0}</div>
                        <div class="text-xs text-gray-600">Manual Review</div>
                    </div>
                </div>
            </div>
            ${total > 0 ? `
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <h3 class="font-bold text-blue-800 mb-3 flex items-center">
                        <span class="mr-2">📚</span>
                        Your Accessibility Learning Plan
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div class="space-y-2">
                            <h4 class="font-semibold text-blue-700">🎯 Priority Order:</h4>
                            <ul class="text-blue-600 space-y-1">
                                ${critical > 0 ? '<li>🔴 <strong>Start with Critical</strong> - These block users completely</li>' : ''}
                                ${serious > 0 ? '<li>🟠 <strong>Then Serious</strong> - These create major barriers</li>' : ''}
                                ${moderate > 0 ? '<li>🟡 <strong>Address Moderate</strong> - These cause difficulties</li>' : ''}
                                ${minor > 0 ? '<li>🟢 <strong>Finally Minor</strong> - These enhance experience</li>' : ''}
                            </ul>
                        </div>
                        <div class="space-y-2">
                            <h4 class="font-semibold text-blue-700">📖 What You'll Learn:</h4>
                            <ul class="text-blue-600 space-y-1">
                                <li>• WCAG success criteria and compliance levels</li>
                                <li>• Real-world impact on users with disabilities</li>
                                <li>• Step-by-step fixes with code examples</li>
                                <li>• Best practices for inclusive design</li>
                            </ul>
                        </div>
                    </div>
                    <div class="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-400">
                        <p class="text-blue-700 text-sm">
                            <strong>💡 Study Tip:</strong> Each issue includes WCAG success criteria badges, real-world impact examples, 
                            and links to official guidelines. Use this as a learning opportunity to build accessible coding skills!
                        </p>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
};

const groupViolationsBySeverity = (violations) => {
    return {
        critical: violations.filter(v => v.impact === 'critical'),
        serious: violations.filter(v => v.impact === 'serious'),
        moderate: violations.filter(v => v.impact === 'moderate'),
        minor: violations.filter(v => v.impact === 'minor'),
        unknown: violations.filter(v => !v.impact || !['critical', 'serious', 'moderate', 'minor'].includes(v.impact))
    };
};

const createSeveritySection = (severity, violations) => {
    const severityConfig = {
        critical: {
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30',
            textColor: 'text-red-300',
            badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30',
            title: 'Critical Issues',
            icon: '🔴',
            description: 'These issues completely block accessibility for some users. Fix immediately.'
        },
        serious: {
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/30',
            textColor: 'text-orange-300',
            badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
            title: 'Serious Issues',
            icon: '🟠',
            description: 'These issues cause significant accessibility barriers. Address soon.'
        },
        moderate: {
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
            textColor: 'text-yellow-300',
            badgeColor: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
            title: 'Moderate Issues',
            icon: '🟡',
            description: 'These issues may cause difficulties for some users.'
        },
        minor: {
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
            textColor: 'text-blue-300',
            badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
            title: 'Minor Issues',
            icon: '🟢',
            description: 'These are accessibility enhancements that improve user experience.'
        }
    };
    
    const config = severityConfig[severity];
    if (!config) return '';
    
    return `
        <div class="mb-8">
            <div class="glass-card ${config.bgColor} ${config.borderColor} border-l-4 mb-6">
                <h3 class="text-2xl font-bold ${config.textColor} mb-2 flex items-center">
                    <span class="mr-3">${config.icon}</span>
                    ${config.title} (${violations.length})
                </h3>
                <p class="text-sm text-gray-300">${config.description}</p>
            </div>
            
            <div class="space-y-6">
                ${violations.map((violation, index) => `
                    <div class="glass-card">
                        <div class="flex justify-between items-start mb-4">
                            <h4 class="text-lg font-semibold text-white">${violation.help}</h4>
                            <div class="flex flex-col items-end space-y-2">
                                <span class="px-3 py-1 text-xs font-semibold rounded-full ${config.badgeColor}">
                                    ${violation.impact || severity}
                                </span>
                                ${getWCAGBadge(violation)}
                            </div>
                        </div>
                        
                        <p class="text-gray-300 mb-4">${violation.description}</p>
                        
                        <div class="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <h5 class="font-semibold text-blue-300 mb-2 flex items-center">
                                <span class="mr-2">🤔</span>
                                Why this matters for accessibility:
                            </h5>
                            <p class="text-blue-200 text-sm mb-3">${getViolationExplanation(violation)}</p>
                            <div class="text-blue-100 text-xs">
                                <strong>Real-world impact:</strong> ${getRealWorldImpact(violation)}
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <h5 class="font-semibold text-white mb-2 flex items-center">
                                <span class="mr-2">📍</span>
                                <span class="bg-white/10 text-white px-2 py-1 rounded-full text-sm mr-2">
                                    ${violation.nodes.length} element${violation.nodes.length !== 1 ? 's' : ''}
                                </span>
                                affected by this issue
                            </h5>
                            ${violation.nodes.slice(0, 2).map(node => `
                                <div class="bg-black/20 border border-white/10 rounded p-3 mb-2 font-mono text-sm">
                                    <div class="text-gray-300 mb-1"><strong>Target:</strong> ${node.target.join(', ')}</div>
                                    <div class="text-white"><strong>HTML:</strong></div>
                                    <code class="block mt-1 p-2 bg-black/30 rounded text-xs overflow-x-auto text-gray-200">${escapeHtml(node.html.substring(0, 200))}${node.html.length > 200 ? '...' : ''}</code>
                                </div>
                            `).join('')}
                            ${violation.nodes.length > 2 ? `<p class="text-sm text-gray-400 mt-2">... and ${violation.nodes.length - 2} more elements</p>` : ''}
                        </div>
                        
                        <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <h5 class="font-semibold text-green-300 mb-2 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                How to fix this:
                            </h5>
                            <div class="text-green-200 text-sm">
                                ${getFixGuidance(violation)}
                                ${violation.helpUrl ? `
                                    <div class="mt-4 pt-3 border-t border-green-500/20">
                                        <a href="${violation.helpUrl}" target="_blank" class="inline-flex items-center bg-violet-500/20 text-violet-300 px-3 py-2 rounded-lg hover:bg-violet-500/30 transition-colors text-sm font-medium border border-violet-500/30">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                            </svg>
                                            📖 WCAG Guidelines
                                        </a>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

const getWCAGBadge = (violation) => {
    // Map common violation IDs to WCAG success criteria
    const wcagMap = {
        'image-alt': { criteria: '1.1.1', level: 'A', name: 'Non-text Content' },
        'button-name': { criteria: '4.1.2', level: 'A', name: 'Name, Role, Value' },
        'color-contrast': { criteria: '1.4.3', level: 'AA', name: 'Contrast (Minimum)' },
        'heading-order': { criteria: '1.3.1', level: 'A', name: 'Info and Relationships' },
        'link-name': { criteria: '2.4.4', level: 'A', name: 'Link Purpose (In Context)' },
        'label': { criteria: '1.3.1', level: 'A', name: 'Info and Relationships' },
        'form-field-multiple-labels': { criteria: '3.3.2', level: 'A', name: 'Labels or Instructions' },
        'region': { criteria: '1.3.1', level: 'A', name: 'Info and Relationships' },
        'landmark-one-main': { criteria: '2.4.1', level: 'A', name: 'Bypass Blocks' },
        'page-has-heading-one': { criteria: '2.4.6', level: 'AA', name: 'Headings and Labels' },
        'bypass': { criteria: '2.4.1', level: 'A', name: 'Bypass Blocks' },
        'duplicate-id': { criteria: '4.1.1', level: 'A', name: 'Parsing' },
        'meta-viewport': { criteria: '1.4.4', level: 'AA', name: 'Resize text' }
    };

    // Try to find matching WCAG criteria
    for (const [key, wcag] of Object.entries(wcagMap)) {
        if (violation.id.includes(key)) {
            const levelColor = wcag.level === 'A' ? 'bg-green-100 text-green-700' : 
                              wcag.level === 'AA' ? 'bg-blue-100 text-blue-700' : 
                              'bg-purple-100 text-purple-700';
            return `
                <span class="px-2 py-1 text-xs font-medium rounded ${levelColor}">
                    WCAG ${wcag.criteria} (Level ${wcag.level})
                </span>
            `;
        }
    }
    
    return '<span class="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">WCAG Guideline</span>';
};

const getRealWorldImpact = (violation) => {
    const impacts = {
        'image-alt': 'A blind student using a screen reader will hear "image" instead of understanding what the image shows.',
        'button-name': 'Users with motor disabilities using voice control cannot activate buttons without proper names.',
        'color-contrast': 'Students with dyslexia or low vision may struggle to read low-contrast text, especially in bright environments.',
        'heading-order': 'Screen reader users rely on proper heading structure to quickly navigate and understand page content.',
        'link-name': 'Students using screen readers often navigate by links, so "click here" provides no context about the destination.',
        'label': 'Users with cognitive disabilities need clear labels to understand what information to provide in forms.',
        'form-field-multiple-labels': 'Multiple labels can confuse assistive technology and users about which label applies to which field.',
        'region': 'Screen reader users rely on landmarks to quickly navigate to different sections of a page.',
        'duplicate-id': 'Assistive technologies may behave unpredictably when encountering duplicate IDs, breaking functionality.',
        'meta-viewport': 'Users with low vision who need to zoom content may find text becomes unusable without proper viewport settings.'
    };

    for (const [key, impact] of Object.entries(impacts)) {
        if (violation.id.includes(key)) {
            return impact;
        }
    }
    
    return 'This creates barriers for users with disabilities who rely on assistive technologies.';
};

const getViolationExplanation = (violation) => {
    const explanations = {
        'image-alt': 'Images without alternative text cannot be understood by screen readers or when images fail to load.',
        'button-name': 'Buttons without accessible names cannot be understood by assistive technologies.',
        'form-field-multiple-labels': 'Form fields need proper labels so users know what information to enter.',
        'color-contrast': 'Text with insufficient contrast is difficult to read, especially for users with visual impairments.',
        'heading-order': 'Proper heading hierarchy helps users navigate and understand page structure.',
        'link-name': 'Links without descriptive text cannot be understood when taken out of context.',
        'label': 'Form inputs need associated labels for accessibility.'
    };
    
    // Try to find a match in common violation IDs
    for (const [key, explanation] of Object.entries(explanations)) {
        if (violation.id.includes(key) || violation.help.toLowerCase().includes(key.replace('-', ' '))) {
            return explanation;
        }
    }
    
    return 'This accessibility issue prevents some users from properly accessing or understanding this content.';
};

const getFixGuidance = (violation) => {
    const fixes = {
        'image-alt': 'Add descriptive alt text: <code>&lt;img src="photo.jpg" alt="Students working on laptops in library"&gt;</code>',
        'button-name': 'Add descriptive text inside the button or use aria-label: <code>&lt;button aria-label="Close dialog"&gt;×&lt;/button&gt;</code>',
        'form-field-multiple-labels': 'Associate labels with inputs using the "for" attribute: <code>&lt;label for="email"&gt;Email&lt;/label&gt;&lt;input id="email"&gt;</code>',
        'color-contrast': 'Use darker text or lighter backgrounds. Test contrast ratios using browser developer tools.',
        'heading-order': 'Use headings in logical order: H1 → H2 → H3. Don\'t skip levels for styling purposes.',
        'link-name': 'Make link text descriptive: <code>&lt;a href="report.pdf"&gt;Download annual report (PDF, 2MB)&lt;/a&gt;</code>',
        'label': 'Add a proper label element: <code>&lt;label for="username"&gt;Username&lt;/label&gt;&lt;input id="username"&gt;</code>',
        'input-button-name': 'Add a value or aria-label attribute: <code>&lt;input type="submit" value="Search"&gt;</code>',
        'region': 'Add landmark roles or use semantic HTML5 elements like &lt;main&gt;, &lt;nav&gt;, &lt;aside&gt;',
        'landmark-one-main': 'Use only one &lt;main&gt; element per page to identify the primary content area.',
        'page-has-heading-one': 'Add a single H1 heading that describes the main content of the page.',
        'bypass': 'Add a "skip to main content" link at the beginning of the page for keyboard users.',
        'focus-order-semantics': 'Ensure interactive elements can be reached and used with keyboard navigation.',
        'duplicate-id': 'Make sure each ID attribute is unique on the page: check for duplicate id values.',
        'meta-viewport': 'Add a proper viewport meta tag: <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>'
    };
    
    // Try to find a specific fix for this violation
    for (const [key, fix] of Object.entries(fixes)) {
        if (violation.id.includes(key) || violation.help.toLowerCase().includes(key.replace('-', ' '))) {
            return fix;
        }
    }
    
    // Default guidance based on violation type
    if (violation.help.toLowerCase().includes('alt')) {
        return 'Add descriptive alternative text that conveys the meaning and purpose of the image.';
    } else if (violation.help.toLowerCase().includes('label')) {
        return 'Ensure all form controls have associated labels that clearly describe their purpose.';
    } else if (violation.help.toLowerCase().includes('contrast')) {
        return 'Increase color contrast between text and background. Aim for a contrast ratio of at least 4.5:1 for normal text.';
    } else if (violation.help.toLowerCase().includes('heading')) {
        return 'Use headings in proper hierarchical order (H1, H2, H3, etc.) and don\'t skip levels.';
    } else if (violation.help.toLowerCase().includes('link')) {
        return 'Make link text descriptive and meaningful when read out of context.';
    }
    
    return 'Review the WCAG guidelines for specific implementation guidance on fixing this accessibility issue.';
};

const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Export functionality for results
const exportResults = () => {
    const resultsData = sessionStorage.getItem('analysisResults');
    if (!resultsData) {
        alert('No analysis results found to export.');
        return;
    }
    
    const data = JSON.parse(resultsData);
    const violations = data.results.violations || [];
    
    let exportText = `AccessiScan Analysis Report\n`;
    exportText += `Generated: ${new Date().toLocaleString()}\n`;
    exportText += `Analysis Type: ${data.type}\n`;
    exportText += `Total Issues: ${violations.length}\n\n`;
    
    if (data.type === 'url') {
        exportText += `URL Analyzed: ${data.url}\n\n`;
    }
    
    if (violations.length === 0) {
        exportText += `🎉 Congratulations! No accessibility violations were found.\n`;
        exportText += `This indicates excellent accessibility compliance.\n\n`;
    } else {
        exportText += `ACCESSIBILITY VIOLATIONS:\n`;
        exportText += `${'='.repeat(50)}\n\n`;
        
        violations.forEach((violation, index) => {
            exportText += `${index + 1}. ${violation.id}\n`;
            exportText += `   Rule: ${violation.help}\n`;
            exportText += `   Severity: ${violation.impact}\n`;
            exportText += `   Description: ${violation.description}\n`;
            exportText += `   Elements affected: ${violation.nodes.length}\n`;
            
            // Add WCAG information
            const wcagInfo = getWCAGInfo(violation);
            if (wcagInfo) {
                exportText += `   WCAG Guideline: ${wcagInfo.criteria} (Level ${wcagInfo.level}) - ${wcagInfo.name}\n`;
            }
            
            // Add fix guidance
            const guidance = getFixGuidance(violation);
            exportText += `   How to Fix: ${guidance.replace(/<[^>]*>/g, '')}\n`;
            
            // Add affected elements
            if (violation.nodes.length > 0) {
                exportText += `   Affected Elements:\n`;
                violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
                    exportText += `     ${nodeIndex + 1}. ${node.target.join(', ')}\n`;
                });
                if (violation.nodes.length > 3) {
                    exportText += `     ... and ${violation.nodes.length - 3} more\n`;
                }
            }
            
            exportText += `\n`;
        });
    }
    
    // Add summary statistics
    exportText += `\nSUMMARY STATISTICS:\n`;
    exportText += `${'='.repeat(30)}\n`;
    exportText += `Total Issues: ${violations.length}\n`;
    exportText += `Critical: ${violations.filter(v => v.impact === 'critical').length}\n`;
    exportText += `Serious: ${violations.filter(v => v.impact === 'serious').length}\n`;
    exportText += `Moderate: ${violations.filter(v => v.impact === 'moderate').length}\n`;
    exportText += `Minor: ${violations.filter(v => v.impact === 'minor').length}\n`;
    exportText += `\nPassed Tests: ${data.results.passes?.length || 0}\n`;
    exportText += `Manual Review Required: ${data.results.incomplete?.length || 0}\n\n`;
    
    exportText += `Report generated by AccessiScan - Web Accessibility Analyzer\n`;
    exportText += `For more information about web accessibility, visit https://www.w3.org/WAI/\n`;
    
    // Create and download text file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.download = `accessibility-report-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success notification
    if (window.app && window.app.showNotification) {
        window.app.showNotification('Report exported successfully!', 'success');
    }
};

// Helper function to get WCAG information for export
const getWCAGInfo = (violation) => {
    const wcagMap = {
        'image-alt': { criteria: '1.1.1', level: 'A', name: 'Non-text Content' },
        'button-name': { criteria: '4.1.2', level: 'A', name: 'Name, Role, Value' },
        'color-contrast': { criteria: '1.4.3', level: 'AA', name: 'Contrast (Minimum)' },
        'heading-order': { criteria: '1.3.1', level: 'A', name: 'Info and Relationships' },
        'link-name': { criteria: '2.4.4', level: 'A', name: 'Link Purpose (In Context)' },
        'label': { criteria: '1.3.1', level: 'A', name: 'Info and Relationships' },
        'form-field-multiple-labels': { criteria: '3.3.2', level: 'A', name: 'Labels or Instructions' },
        'region': { criteria: '1.3.1', level: 'A', name: 'Info and Relationships' },
        'landmark-one-main': { criteria: '2.4.1', level: 'A', name: 'Bypass Blocks' },
        'page-has-heading-one': { criteria: '2.4.6', level: 'AA', name: 'Headings and Labels' },
        'bypass': { criteria: '2.4.1', level: 'A', name: 'Bypass Blocks' },
        'duplicate-id': { criteria: '4.1.1', level: 'A', name: 'Parsing' },
        'meta-viewport': { criteria: '1.4.4', level: 'AA', name: 'Resize text' }
    };

    for (const [key, wcag] of Object.entries(wcagMap)) {
        if (violation.id.includes(key)) {
            return wcag;
        }
    }
    return null;
};

function loadResults() {
    // Legacy function for backward compatibility
    const resultsData = sessionStorage.getItem('accessiscan-results');
    const noResultsDiv = document.getElementById('no-results');
    const resultsContentDiv = document.getElementById('results-content');

    if (!resultsData) {
        if (noResultsDiv) noResultsDiv.classList.remove('hidden');
        if (resultsContentDiv) resultsContentDiv.classList.add('hidden');
        return;
    }

    try {
        const data = JSON.parse(resultsData);
        displayDetailedResults(data);
        
        if (noResultsDiv) noResultsDiv.classList.add('hidden');
        if (resultsContentDiv) resultsContentDiv.classList.remove('hidden');

        // Update timestamp
        const timestampEl = document.getElementById('analysis-timestamp');
        if (timestampEl) {
            const date = new Date(data.timestamp);
            timestampEl.textContent = `Analyzed on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
        }

    } catch (error) {
        console.error('Error loading results:', error);
        if (noResultsDiv) noResultsDiv.classList.remove('hidden');
        if (resultsContentDiv) resultsContentDiv.classList.add('hidden');
    }
}

function displayDetailedResults(data) {
    const results = data.results;

    // Update summary counts
    updateSummaryCounts(results);

    // Display violations
    displayViolations(results.violations);

    // Display incomplete items
    displayIncompleteItems(results.incomplete);

    // Display passes
    displayPasses(results.passes);
}

function updateSummaryCounts(results) {
    const violationsCount = document.getElementById('violations-count');
    const incompleteCount = document.getElementById('incomplete-count');
    const passesCount = document.getElementById('passes-count');
    const inapplicableCount = document.getElementById('inapplicable-count');

    if (violationsCount) violationsCount.textContent = results.violations.length;
    if (incompleteCount) incompleteCount.textContent = results.incomplete.length;
    if (passesCount) passesCount.textContent = results.passes.length;
    if (inapplicableCount) inapplicableCount.textContent = results.inapplicable.length;
}


function displayIncompleteItems(incomplete) {
    const incompleteList = document.getElementById('incomplete-list');
    const incompleteSection = document.getElementById('incomplete-section');

    if (!incompleteList || !incompleteSection) return;

    if (incomplete.length === 0) {
        incompleteSection.innerHTML = `
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span class="w-3 h-3 bg-gray-400 rounded-full mr-3"></span>
                No Manual Review Required
            </h3>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p class="text-gray-600">All testable accessibility rules passed automatic verification.</p>
            </div>
        `;
        return;
    }

    incompleteList.innerHTML = incomplete.map(item => `
        <div class="result-card">
            <h4 class="text-lg font-semibold text-gray-900 mb-2">${item.help}</h4>
            <p class="text-gray-600 mb-3">${item.description}</p>
            
            <div class="mb-3">
                <strong class="text-sm text-gray-700">Elements requiring review: ${item.nodes.length}</strong>
            </div>
            
            ${item.nodes.slice(0, 2).map(node => `
                <div class="target-element mb-2">
                    <strong>Target:</strong> ${node.target.join(', ')}<br>
                    <strong>HTML:</strong> ${escapeHtml(node.html.substring(0, 100))}${node.html.length > 100 ? '...' : ''}
                </div>
            `).join('')}
            
            <div class="help-text">
                <strong>Manual check required:</strong> Please verify this element manually for accessibility compliance.
                ${item.helpUrl ? `<br><a href="${item.helpUrl}" target="_blank" class="text-indigo-600 hover:text-indigo-800">Learn more</a>` : ''}
            </div>
        </div>
    `).join('');
}

function displayPasses(passes) {
    const passesList = document.getElementById('passes-list');

    if (!passesList) return;

    if (passes.length === 0) {
        passesList.innerHTML = `
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p class="text-gray-600">No accessibility rules passed automatic verification.</p>
            </div>
        `;
        return;
    }

    passesList.innerHTML = `
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p class="text-green-800 mb-2">✅ Great job! ${passes.length} accessibility rules passed successfully.</p>
            <details class="mt-2">
                <summary class="cursor-pointer text-green-700 hover:text-green-900">View passed rules</summary>
                <div class="mt-3 space-y-2">
                    ${passes.map(pass => `
                        <div class="bg-white p-3 rounded border">
                            <h5 class="font-medium text-gray-900">${pass.help}</h5>
                            <p class="text-sm text-gray-600">${pass.description}</p>
                        </div>
                    `).join('')}
                </div>
            </details>
        </div>
    `;
}

function getSeverityClasses(impact) {
    switch (impact) {
        case 'critical':
            return 'bg-red-100 text-red-800';
        case 'serious':
            return 'bg-orange-100 text-orange-800';
        case 'moderate':
            return 'bg-yellow-100 text-yellow-800';
        case 'minor':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}


// Mobile menu toggle function
function toggleMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    
    if (mobileMenu && menuIcon) {
        const isOpen = mobileMenu.classList.contains('open');
        
        if (isOpen) {
            mobileMenu.classList.remove('open');
            mobileMenu.style.maxHeight = '0';
            mobileMenu.style.opacity = '0';
            menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
        } else {
            mobileMenu.classList.add('open');
            mobileMenu.style.maxHeight = '500px';
            mobileMenu.style.opacity = '1';
            menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
        }
    }
}

// Smooth scroll function for navigation
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.accessiScan = new AccessiScan();
    
    // Initialize mobile menu functionality
    initializeMobileMenu();
});

/**
 * Initialize mobile menu toggle functionality
 */
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            if (isExpanded) {
                mobileMenu.classList.add('hidden');
                this.setAttribute('aria-expanded', 'false');
                
                // Change icon back to hamburger
                this.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                `;
            } else {
                mobileMenu.classList.remove('hidden');
                this.setAttribute('aria-expanded', 'true');
                
                // Change icon to X
                this.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                `;
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                
                // Reset icon
                mobileMenuBtn.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                `;
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    
                    // Reset icon
                    mobileMenuBtn.innerHTML = `
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    `;
                }
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.focus();
                
                // Reset icon
                mobileMenuBtn.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                `;
            }
        });
    }
    
    // Handle mobile share and export buttons
    const shareBtnMobile = document.getElementById('share-btn-mobile');
    const exportBtnMobile = document.getElementById('export-pdf-btn-mobile');
    
    if (shareBtnMobile) {
        shareBtnMobile.addEventListener('click', function() {
            // Same functionality as desktop share button
            const shareBtn = document.getElementById('share-btn');
            if (shareBtn) {
                shareBtn.click();
            }
        });
    }
    
    if (exportBtnMobile) {
        exportBtnMobile.addEventListener('click', function() {
            // Same functionality as desktop export button
            const exportBtn = document.getElementById('export-pdf-btn');
            if (exportBtn) {
                exportBtn.click();
            }
        });
    }
}