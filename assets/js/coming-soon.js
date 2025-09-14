// Coming Soon Page Functionality
class ComingSoonManager {
    constructor() {
        this.emailList = this.getStoredEmails();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.animateProgressBar();
        this.setupIntersectionObserver();
    }
    
    setupEventListeners() {
        const form = document.getElementById('notify-form');
        const emailInput = document.getElementById('notify-email');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailSignup(emailInput.value);
        });
        
        // Real-time email validation
        emailInput.addEventListener('input', (e) => {
            this.validateEmail(e.target.value);
        });
    }
    
    handleEmailSignup(email) {
        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address.');
            return;
        }
        
        if (this.emailList.includes(email.toLowerCase())) {
            this.showError('This email is already registered for notifications.');
            return;
        }
        
        // Store email
        this.emailList.push(email.toLowerCase());
        this.storeEmails();
        
        // Show success
        this.showSuccess();
        
        // Track signup (you could send to analytics here)
        this.trackSignup(email);
    }
    
    validateEmail(email) {
        const emailInput = document.getElementById('notify-email');
        
        if (email && !this.isValidEmail(email)) {
            emailInput.classList.add('invalid');
        } else {
            emailInput.classList.remove('invalid');
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showSuccess() {
        const form = document.getElementById('notify-form');
        const success = document.getElementById('signup-success');
        
        form.style.display = 'none';
        success.style.display = 'block';
        
        // Animate success message
        setTimeout(() => {
            success.classList.add('animate-in');
        }, 100);
    }
    
    showError(message) {
        // Remove existing error
        const existingError = document.querySelector('.signup-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error element
        const error = document.createElement('div');
        error.className = 'signup-error';
        error.textContent = message;
        
        // Insert after form
        const form = document.getElementById('notify-form');
        form.parentNode.insertBefore(error, form.nextSibling);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (error.parentNode) {
                error.parentNode.removeChild(error);
            }
        }, 5000);
    }
    
    animateProgressBar() {
        const progressFill = document.querySelector('.progress-bar-fill');
        const percentage = document.querySelector('.progress-percentage');
        
        // Animate from 0 to target percentage
        let currentProgress = 0;
        const targetProgress = 75;
        const duration = 2000; // 2 seconds
        const increment = targetProgress / (duration / 16); // 60fps
        
        const animate = () => {
            currentProgress += increment;
            
            if (currentProgress >= targetProgress) {
                currentProgress = targetProgress;
            }
            
            progressFill.style.width = currentProgress + '%';
            percentage.textContent = Math.round(currentProgress) + '%';
            
            if (currentProgress < targetProgress) {
                requestAnimationFrame(animate);
            }
        };
        
        // Start animation when page loads
        setTimeout(() => {
            animate();
        }, 500);
    }
    
    setupIntersectionObserver() {
        // Animate elements when they come into view
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
        
        // Observe elements
        const elementsToAnimate = document.querySelectorAll(
            '.feature-preview-item, .faq-item, .notify-signup, .current-alternative'
        );
        
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    }
    
    getStoredEmails() {
        try {
            const stored = localStorage.getItem('notify-emails');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading stored emails:', error);
            return [];
        }
    }
    
    storeEmails() {
        try {
            localStorage.setItem('notify-emails', JSON.stringify(this.emailList));
        } catch (error) {
            console.error('Error storing emails:', error);
        }
    }
    
    trackSignup(email) {
        // This is where you would send analytics data
        // For now, just log to console
        console.log('Email signup:', email);
        
        // You could send to Google Analytics, Mixpanel, etc.
        // Example:
        // gtag('event', 'signup', {
        //     event_category: 'engagement',
        //     event_label: 'url_scanner_notify'
        // });
    }
    
    // Method to export email list (for admin use)
    exportEmailList() {
        if (this.emailList.length === 0) {
            alert('No emails to export.');
            return;
        }
        
        const csvContent = 'Email,Signup Date\n' + 
            this.emailList.map(email => `${email},${new Date().toISOString()}`).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'url-scanner-signups.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    // Method to get signup statistics
    getSignupStats() {
        return {
            totalSignups: this.emailList.length,
            uniqueDomains: [...new Set(this.emailList.map(email => email.split('@')[1]))].length,
            recentSignups: this.emailList.length // In a real app, you'd track dates
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComingSoonManager();
});

// Add CSS for animations and styling
const style = document.createElement('style');
style.textContent = `
    /* Coming Soon Specific Styles */
    .coming-soon-main {
        padding: 2rem 0;
        min-height: calc(100vh - 200px);
    }
    
    .coming-soon-container {
        text-align: center;
        max-width: 1000px;
        margin: 0 auto;
    }
    
    .icon-wrapper {
        margin-bottom: 2rem;
    }
    
    .coming-soon-icon {
        width: 120px;
        height: 120px;
        margin: 0 auto;
    }
    
    .coming-soon-container h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--foreground);
    }
    
    .coming-soon-subtitle {
        font-size: 1.25rem;
        color: var(--muted-foreground);
        margin-bottom: 3rem;
    }
    
    /* Development Progress */
    .development-progress {
        background-color: var(--card);
        padding: 2rem;
        border-radius: var(--radius);
        margin-bottom: 3rem;
        box-shadow: var(--shadow);
    }
    
    .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-weight: 600;
    }
    
    .progress-percentage {
        color: var(--primary);
        font-size: 1.25rem;
    }
    
    .progress-bar-container {
        width: 100%;
        height: 12px;
        background-color: var(--muted);
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 1rem;
    }
    
    .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        border-radius: 6px;
        transition: width 0.3s ease;
        width: 0%;
    }
    
    .eta-info {
        color: var(--muted-foreground);
        font-size: 0.875rem;
    }
    
    /* Features Preview */
    .features-preview {
        margin-bottom: 4rem;
    }
    
    .features-preview h3 {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 2rem;
        color: var(--foreground);
    }
    
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .feature-preview-item {
        background-color: var(--card);
        padding: 2rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        text-align: center;
    }
    
    .feature-preview-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .feature-preview-item h4 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--foreground);
        line-height: 1.3;
        min-height: 3.25rem;
        text-align: center;
    }
    
    .feature-preview-item p {
        color: var(--muted-foreground);
        line-height: 1.6;
    }
    
    /* Notify Signup */
    .notify-signup {
        background-color: var(--card);
        padding: 3rem 2rem;
        border-radius: var(--radius);
        margin-bottom: 3rem;
        box-shadow: var(--shadow);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .notify-signup.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notify-signup h3 {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--foreground);
    }
    
    .notify-signup p {
        color: var(--muted-foreground);
        margin-bottom: 2rem;
    }
    
    .input-group {
        display: flex;
        gap: 1rem;
        max-width: 500px;
        margin: 0 auto 1rem;
    }
    
    .notify-input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        font-size: 1rem;
        background-color: var(--background);
        color: var(--foreground);
    }
    
    .notify-input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(58, 91, 160, 0.2);
    }
    
    .notify-input.invalid {
        border-color: var(--destructive);
    }
    
    .notify-btn {
        padding: 0.75rem 2rem;
        background-color: var(--primary);
        color: var(--primary-foreground);
        border: none;
        border-radius: var(--radius);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
    }
    
    .notify-btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }
    
    .signup-benefits {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
        margin-top: 1rem;
    }
    
    .benefit-item {
        color: var(--muted-foreground);
        font-size: 0.875rem;
    }
    
    .signup-success {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .signup-success.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .success-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .signup-success h4 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--foreground);
    }
    
    .signup-error {
        background-color: var(--destructive);
        color: var(--destructive-foreground);
        padding: 1rem;
        border-radius: var(--radius);
        margin-top: 1rem;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Current Alternative */
    .current-alternative {
        background-color: var(--muted);
        padding: 2rem;
        border-radius: var(--radius);
        margin-bottom: 3rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .current-alternative.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .current-alternative h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--foreground);
    }
    
    .current-alternative p {
        color: var(--muted-foreground);
        margin-bottom: 2rem;
    }
    
    .alternative-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    /* FAQ */
    .coming-soon-faq {
        text-align: left;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .coming-soon-faq h3 {
        text-align: center;
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 2rem;
        color: var(--foreground);
    }
    
    .faq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }
    
    .faq-item {
        background-color: var(--card);
        padding: 2rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .faq-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .faq-item h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--foreground);
    }
    
    .faq-item p {
        color: var(--muted-foreground);
        line-height: 1.6;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .coming-soon-container h1 {
            font-size: 2rem;
        }
        
        .input-group {
            flex-direction: column;
        }
        
        .signup-benefits {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .alternative-actions {
            flex-direction: column;
        }
        
        .faq-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(style);