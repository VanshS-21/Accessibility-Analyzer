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
                htmlInput.value = '';
                this.hideError();
                this.hideResults();
            });
        }

        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => {
                this.loadSampleHTML();
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

    loadSampleHTML() {
        const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Sample Page with Accessibility Issues</title>
</head>
<body>
    <img src="test.jpg">
    <button>Click</button>
    <input type="text">
    <div style="color: #ccc; background: #ddd;">Poor contrast text</div>
    <h3>Wrong heading order</h3>
    <h1>This should be h2</h1>
    <a href="#">Empty link text</a>
</body>
</html>`;
        
        document.getElementById('html-input').value = sampleHTML;
    }

    async analyzeHTML() {
        const htmlInput = document.getElementById('html-input');
        const htmlContent = htmlInput.value.trim();

        if (!htmlContent) {
            this.showError('Please enter some HTML code to analyze.');
            return;
        }

        this.showLoading('analyze-btn', 'analyze-btn-text', 'analyze-spinner');
        this.hideError();

        try {
            const results = await this.runAxeAnalysis(htmlContent);
            this.currentResults = {
                type: 'html',
                content: htmlContent,
                results: results,
                timestamp: new Date().toISOString()
            };

            // Store results in sessionStorage for results page
            sessionStorage.setItem('accessiscan-results', JSON.stringify(this.currentResults));
            
            this.showHTMLResults(results);
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('An error occurred during analysis. Please check your HTML and try again.');
        } finally {
            this.hideLoading('analyze-btn', 'analyze-btn-text', 'analyze-spinner');
        }
    }

    async runAxeAnalysis(htmlContent) {
        return new Promise((resolve, reject) => {
            try {
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
            this.showURLError('Please enter a valid URL.');
            return;
        }

        if (!this.isValidURL(url)) {
            this.showURLError('Please enter a valid URL (including http:// or https://).');
            return;
        }

        this.showLoading('url-analyze-btn', 'url-analyze-btn-text', 'url-analyze-spinner');
        this.hideURLError();

        try {
            // Note: Due to CORS restrictions, we'll try to fetch the URL
            // This will likely fail for most websites, but we'll provide feedback
            const response = await fetch(url, { 
                mode: 'cors',
                method: 'GET'
            });
            
            const htmlContent = await response.text();
            const results = await this.runAxeAnalysis(htmlContent);
            
            this.currentResults = {
                type: 'url',
                url: url,
                results: results,
                timestamp: new Date().toISOString()
            };

            // Store results in sessionStorage for results page
            sessionStorage.setItem('accessiscan-results', JSON.stringify(this.currentResults));
            
            this.showURLResults(results);

        } catch (error) {
            console.error('URL analysis error:', error);
            let errorMessage = 'Unable to analyze the URL due to cross-origin restrictions. ';
            
            if (error.name === 'TypeError' && error.message.includes('CORS')) {
                errorMessage += 'This website blocks cross-origin requests. Please try the manual analysis method described below.';
            } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                errorMessage += 'The website cannot be accessed. Please check the URL and try again, or use the manual analysis method.';
            } else {
                errorMessage += 'Please try using the HTML analysis feature instead.';
            }
            
            this.showURLError(errorMessage);
        } finally {
            this.hideLoading('url-analyze-btn', 'url-analyze-btn-text', 'url-analyze-spinner');
        }
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

        if (btn) btn.disabled = true;
        if (text) text.textContent = 'Analyzing...';
        if (spinner) spinner.classList.remove('hidden');
    }

    hideLoading(btnId, textId, spinnerId) {
        const btn = document.getElementById(btnId);
        const text = document.getElementById(textId);
        const spinner = document.getElementById(spinnerId);

        if (btn) btn.disabled = false;
        if (text) text.textContent = btnId.includes('url') ? 'Analyze Website' : 'Analyze HTML';
        if (spinner) spinner.classList.add('hidden');
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

    hideResults() {
        const resultsPreview = document.getElementById('results-preview');
        const urlResultsPreview = document.getElementById('url-results-preview');
        
        if (resultsPreview) resultsPreview.classList.add('hidden');
        if (urlResultsPreview) urlResultsPreview.classList.add('hidden');
    }

    exportResults() {
        if (!this.currentResults) {
            alert('No results to export. Please run an analysis first.');
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
function loadResults() {
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

function displayViolations(violations) {
    const violationsList = document.getElementById('violations-list');
    const violationsSection = document.getElementById('violations-section');

    if (!violationsList || !violationsSection) return;

    if (violations.length === 0) {
        violationsSection.innerHTML = `
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span class="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                No Violations Found!
            </h3>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="text-green-800">Congratulations! No accessibility violations were detected in your content.</p>
            </div>
        `;
        return;
    }

    violationsList.innerHTML = violations.map(violation => `
        <div class="result-card severity-${violation.impact || 'moderate'}">
            <div class="flex justify-between items-start mb-3">
                <h4 class="text-lg font-semibold text-gray-900">${violation.help}</h4>
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${getSeverityClasses(violation.impact)}">
                    ${violation.impact || 'moderate'}
                </span>
            </div>
            
            <p class="text-gray-600 mb-3">${violation.description}</p>
            
            <div class="mb-3">
                <strong class="text-sm text-gray-700">Affected Elements: ${violation.nodes.length}</strong>
            </div>
            
            ${violation.nodes.slice(0, 3).map(node => `
                <div class="target-element mb-2">
                    <strong>Target:</strong> ${node.target.join(', ')}<br>
                    <strong>HTML:</strong> ${escapeHtml(node.html.substring(0, 100))}${node.html.length > 100 ? '...' : ''}
                </div>
            `).join('')}
            
            ${violation.nodes.length > 3 ? `<p class="text-sm text-gray-500">... and ${violation.nodes.length - 3} more elements</p>` : ''}
            
            <div class="help-text">
                <strong>How to fix:</strong> ${violation.helpUrl ? 
                    `<a href="${violation.helpUrl}" target="_blank" class="text-indigo-600 hover:text-indigo-800">View detailed guidance</a>` :
                    'Check WCAG guidelines for specific requirements'
                }
            </div>
        </div>
    `).join('');
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.accessiScan = new AccessiScan();
});
