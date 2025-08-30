// AccessiScan - Web Accessibility Analyzer
// Main JavaScript application file

class AccessiScan {
    constructor() {
        this.currentResults = null;
        this.initializeApp();
    }

    initializeApp() {
        // Initialize based on current page
        const currentPage = this.getCurrentPage();
        
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
                // No specific initialization needed for homepage
                break;
        }

        // Initialize common functionality
        this.initializeNavigation();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        return filename || 'index';
    }

    initializeNavigation() {
        // Mobile navigation toggle (if implemented later)
        // For now, just ensure navigation links work properly
    }

    // HTML Analysis Page Functions
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

    loadSampleHTML(type = 'problematic') {
        const textarea = document.getElementById('html-input');
        const samples = this.getSampleHTMLs();
        
        if (textarea && samples[type]) {
            textarea.value = samples[type];
            
            // Show notification about which sample was loaded
            const sampleNames = {
                problematic: 'Sample with Issues',
                clean: 'Clean Sample',
                educational: 'Educational Sample'
            };
            
            this.showNotification(`${sampleNames[type]} loaded successfully!`, 'info');
            
            // Update sample indicator
            this.updateSampleIndicator(sampleNames[type]);
        }
    }

    clearTextarea() {
        const textarea = document.getElementById('html-input');
        if (textarea) {
            textarea.value = '';
            this.showNotification('Textarea cleared!', 'info');
            this.updateSampleIndicator('');
        }
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

    async analyzeHTML() {
        const htmlInput = document.getElementById('html-input');
        const htmlContent = htmlInput.value.trim();

        if (!htmlContent) {
            this.showNotification('Please enter some HTML code to analyze.', 'warning');
            return;
        }

        this.showLoading('analyze-btn', 'analyze-btn-text', 'analyze-spinner');
        this.hideError();

        try {
            await this.analyzeHTMLCode(htmlContent);
        } catch (error) {
            console.error('Analysis error:', error);
            this.showNotification('Analysis failed: ' + error.message, 'error');
        } finally {
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
        const options = {
            tags: []
        };

        // Check which standards to test against
        if (document.getElementById('check-wcag-a')?.checked) {
            options.tags.push('wcag2a');
        }
        if (document.getElementById('check-wcag-aa')?.checked) {
            options.tags.push('wcag2aa');
        }
        if (document.getElementById('check-best-practices')?.checked) {
            options.tags.push('best-practice');
        }

        // URL analysis has different checkbox IDs
        if (document.getElementById('url-check-wcag-a')?.checked) {
            options.tags.push('wcag2a');
        }
        if (document.getElementById('url-check-wcag-aa')?.checked) {
            options.tags.push('wcag2aa');
        }
        if (document.getElementById('url-check-best-practices')?.checked) {
            options.tags.push('best-practice');
        }

        // Default to WCAG 2.1 AA if no tags selected
        if (options.tags.length === 0) {
            options.tags = ['wcag2aa'];
        }

        return options;
    }

    showHTMLResults(results) {
        const resultsPreview = document.getElementById('results-preview');
        const resultsSummary = document.getElementById('results-summary');

        if (resultsPreview && resultsSummary) {
            const violationsCount = results.violations.length;
            const incompleteCount = results.incomplete.length;
            const passesCount = results.passes.length;

            resultsSummary.innerHTML = `
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div class="bg-red-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-red-600">${violationsCount}</div>
                        <div class="text-sm text-red-600">Violations</div>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-yellow-600">${incompleteCount}</div>
                        <div class="text-sm text-yellow-600">Incomplete</div>
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-green-600">${passesCount}</div>
                        <div class="text-sm text-green-600">Passes</div>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">${results.inapplicable.length}</div>
                        <div class="text-sm text-blue-600">Inapplicable</div>
                    </div>
                </div>
            `;

            resultsPreview.classList.remove('hidden');
        }
    }

    resetHTMLForm() {
        const htmlInput = document.getElementById('html-input');
        const resultsPreview = document.getElementById('results-preview');
        
        if (htmlInput) htmlInput.value = '';
        if (resultsPreview) resultsPreview.classList.add('hidden');
        
        this.hideError();
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
        const tags = [];
        if (document.getElementById('url-check-wcag-a')?.checked) tags.push('wcag2a');
        if (document.getElementById('url-check-wcag-aa')?.checked) tags.push('wcag2aa');
        if (document.getElementById('url-check-best-practices')?.checked) tags.push('best-practice');
        return tags.length > 0 ? tags : ['wcag2a', 'wcag2aa', 'best-practice'];
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
            const violationsCount = results.violations.length;
            const incompleteCount = results.incomplete.length;
            const passesCount = results.passes.length;

            resultsSummary.innerHTML = `
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div class="bg-red-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-red-600">${violationsCount}</div>
                        <div class="text-sm text-red-600">Violations</div>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-yellow-600">${incompleteCount}</div>
                        <div class="text-sm text-yellow-600">Incomplete</div>
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-green-600">${passesCount}</div>
                        <div class="text-sm text-green-600">Passes</div>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">${results.inapplicable.length}</div>
                        <div class="text-sm text-blue-600">Inapplicable</div>
                    </div>
                </div>
            `;

            resultsPreview.classList.remove('hidden');
        }
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

    // Utility Functions
    showLoading(btnId, textId, spinnerId) {
        const btn = document.getElementById(btnId);
        const text = document.getElementById(textId);
        const spinner = document.getElementById(spinnerId);

        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-75', 'cursor-not-allowed', 'loading-disabled');
            // Add haptic feedback on mobile devices
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }
        if (text) text.textContent = 'Analyzing...';
        if (spinner) spinner.classList.remove('hidden');
        
        // Add progress feedback
        this.showProgressMessage(btnId.includes('url') ? 'Fetching website content...' : 'Parsing HTML content...');
    }

    hideLoading(btnId, textId, spinnerId) {
        const btn = document.getElementById(btnId);
        const text = document.getElementById(textId);
        const spinner = document.getElementById(spinnerId);

        if (btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-75', 'cursor-not-allowed', 'loading-disabled');
        }
        if (text) text.textContent = btnId.includes('url') ? 'Analyze Website' : 'Analyze HTML';
        if (spinner) spinner.classList.add('hidden');
        
        // Hide progress message
        this.hideProgressMessage();
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');

        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    hideError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
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

    hideURLError() {
        const errorDiv = document.getElementById('url-error-message');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
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
    
    if (!resultsData) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-600">No analysis results found.</p>
                <a href="index.html" class="text-blue-600 hover:underline">Go back to homepage</a>
            </div>
        `;
        return;
    }
    
    const data = JSON.parse(resultsData);
    
    console.log('Displaying results:', data);
    
    // Update timestamp
    const timestampEl = document.getElementById('analysis-timestamp');
    if (timestampEl) {
        const date = new Date(data.timestamp);
        timestampEl.textContent = `Analyzed on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    }
    
    // Handle CORS error case - turn it into an educational opportunity
    if (data.corsError) {
        container.innerHTML = `
            <div class="space-y-6">
                <div class="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-lg font-medium text-blue-800">Learning Opportunity: Understanding Web Security (CORS)</h3>
                            <div class="mt-3 text-blue-700">
                                <p class="mb-3">The website <strong>${data.url}</strong> could not be analyzed due to Cross-Origin Resource Sharing (CORS) restrictions.</p>
                                
                                <h4 class="font-semibold mb-2">What is CORS?</h4>
                                <p class="mb-3">CORS is a browser security feature that prevents websites from making requests to other domains without permission. This protects users from malicious websites trying to access their data on other sites.</p>
                                
                                <h4 class="font-semibold mb-2">Why does this happen?</h4>
                                <p class="mb-3">External websites typically don't allow cross-origin requests for security reasons. This is normal and expected behavior - it means the website is properly secured!</p>
                                
                                <h4 class="font-semibold mb-2">Alternative approaches:</h4>
                                <ul class="list-disc list-inside space-y-1 mb-4">
                                    <li>Use browser developer tools to view the page source, then copy the HTML and use our "Analyze HTML Code" feature</li>
                                    <li>Use browser extensions like axe DevTools for direct website analysis</li>
                                    <li>For your own websites, configure CORS headers to allow cross-origin requests</li>
                                    <li>Use server-side analysis tools if you need automated website scanning</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 class="text-lg font-semibold text-green-800 mb-3">This isn't a failure - it's web security working as intended!</h4>
                    <p class="text-green-700 mb-4">Understanding CORS limitations is an important part of web development and security awareness.</p>
                    
                    <div class="flex space-x-4">
                        <a href="analyze-html.html" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            Try HTML Analysis Instead
                        </a>
                        <a href="analyze-url.html" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Try Another URL
                        </a>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    const violations = data.results.violations;
    console.log('Violations found:', violations.length);
    
    if (violations.length === 0) {
        container.innerHTML = `
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <h3 class="font-bold text-lg">Excellent! 🎉</h3>
                <p>No accessibility violations found in your ${data.type === 'url' ? 'website' : 'HTML code'}.</p>
            </div>
        `;
        return;
    }
    
    displayViolations(violations, data);
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
            color: 'red', 
            bgColor: 'bg-red-50', 
            borderColor: 'border-red-500', 
            textColor: 'text-red-800',
            badgeColor: 'bg-red-100 text-red-800',
            title: 'Critical Issues',
            icon: '🔴',
            description: 'These issues completely block accessibility for some users. Fix immediately.'
        },
        serious: { 
            color: 'orange', 
            bgColor: 'bg-orange-50', 
            borderColor: 'border-orange-500', 
            textColor: 'text-orange-800',
            badgeColor: 'bg-orange-100 text-orange-800',
            title: 'Serious Issues',
            icon: '🟠',
            description: 'These issues cause significant accessibility barriers. Address soon.'
        },
        moderate: { 
            color: 'yellow', 
            bgColor: 'bg-yellow-50', 
            borderColor: 'border-yellow-500', 
            textColor: 'text-yellow-800',
            badgeColor: 'bg-yellow-100 text-yellow-800',
            title: 'Moderate Issues',
            icon: '🟡',
            description: 'These issues may cause difficulties for some users.'
        },
        minor: { 
            color: 'green', 
            bgColor: 'bg-green-50', 
            borderColor: 'border-green-500', 
            textColor: 'text-green-800',
            badgeColor: 'bg-green-100 text-green-800',
            title: 'Minor Issues',
            icon: '🟢',
            description: 'These are accessibility enhancements that improve user experience.'
        }
    };
    
    const config = severityConfig[severity];
    if (!config) return '';
    
    return `
        <div class="mb-8">
            <div class="${config.bgColor} ${config.borderColor} border-l-4 rounded-r-lg p-6 mb-6">
                <h3 class="text-2xl font-bold ${config.textColor} mb-2 flex items-center">
                    <span class="mr-3">${config.icon}</span>
                    ${config.title} (${violations.length})
                </h3>
                <p class="text-sm ${config.textColor} opacity-90">${config.description}</p>
            </div>
            
            <div class="space-y-6">
                ${violations.map((violation, index) => `
                    <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div class="flex justify-between items-start mb-4">
                            <h4 class="text-lg font-semibold text-gray-900">${violation.help}</h4>
                            <div class="flex flex-col items-end space-y-2">
                                <span class="px-3 py-1 text-xs font-semibold rounded-full ${config.badgeColor}">
                                    ${violation.impact || severity}
                                </span>
                                ${getWCAGBadge(violation)}
                            </div>
                        </div>
                        
                        <p class="text-gray-700 mb-4">${violation.description}</p>
                        
                        <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 class="font-semibold text-blue-800 mb-2 flex items-center">
                                <span class="mr-2">🤔</span>
                                Why this matters for accessibility:
                            </h5>
                            <p class="text-blue-700 text-sm mb-3">${getViolationExplanation(violation)}</p>
                            <div class="text-blue-600 text-xs">
                                <strong>Real-world impact:</strong> ${getRealWorldImpact(violation)}
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <h5 class="font-semibold text-gray-800 mb-2 flex items-center">
                                <span class="mr-2">📍</span>
                                <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm mr-2">
                                    ${violation.nodes.length} element${violation.nodes.length !== 1 ? 's' : ''}
                                </span>
                                affected by this issue
                            </h5>
                            ${violation.nodes.slice(0, 2).map(node => `
                                <div class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 font-mono text-sm">
                                    <div class="text-gray-600 mb-1"><strong>Target:</strong> ${node.target.join(', ')}</div>
                                    <div class="text-gray-800"><strong>HTML:</strong></div>
                                    <code class="block mt-1 p-2 bg-white rounded text-xs overflow-x-auto">${escapeHtml(node.html.substring(0, 200))}${node.html.length > 200 ? '...' : ''}</code>
                                </div>
                            `).join('')}
                            ${violation.nodes.length > 2 ? `<p class="text-sm text-gray-500 mt-2">... and ${violation.nodes.length - 2} more elements</p>` : ''}
                        </div>
                        
                        <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h5 class="font-semibold text-green-800 mb-2 flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                How to fix this:
                            </h5>
                            <div class="text-green-700 text-sm">
                                ${getFixGuidance(violation)}
                                ${violation.helpUrl ? `
                                    <div class="mt-4 pt-3 border-t border-green-200">
                                        <a href="${violation.helpUrl}" target="_blank" class="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                            </svg>
                                            📖 Study the official WCAG guidelines
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


// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.accessiScan = new AccessiScan();
});
