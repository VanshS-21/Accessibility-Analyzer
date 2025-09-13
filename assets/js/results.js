// Results Page Management
class ResultsManager {
    constructor() {
        this.storageManager = new StorageManager();
        this.currentReports = [];
        this.selectedReport = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadReports();
        this.updateStatistics();
        this.updateStorageInfo();
    }
    
    setupEventListeners() {
        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterReports(e.target.value);
        });
        
        // Date filter
        document.getElementById('date-filter').addEventListener('change', (e) => {
            this.filterByDate(e.target.value);
        });
        
        // Action buttons
        document.getElementById('export-all').addEventListener('click', () => {
            this.exportAllReports();
        });
        
        document.getElementById('import-reports').addEventListener('click', () => {
            this.importReports();
        });
        
        document.getElementById('clear-all').addEventListener('click', () => {
            this.confirmClearAll();
        });
        
        // Import file input
        document.getElementById('import-file-input').addEventListener('change', (e) => {
            this.handleImportFile(e.target.files[0]);
        });
        
        // Modal controls
        document.getElementById('report-modal-close').addEventListener('click', () => {
            this.closeReportModal();
        });
        
        document.getElementById('download-report-pdf').addEventListener('click', () => {
            this.downloadReportPDF();
        });
        
        document.getElementById('delete-report').addEventListener('click', () => {
            this.confirmDeleteReport();
        });
        
        // Confirmation modal
        document.getElementById('confirm-close').addEventListener('click', () => {
            this.closeConfirmModal();
        });
        
        document.getElementById('confirm-cancel').addEventListener('click', () => {
            this.closeConfirmModal();
        });
        
        document.getElementById('confirm-ok').addEventListener('click', () => {
            this.executeConfirmedAction();
        });
        
        // Close modals on backdrop click
        document.getElementById('report-modal').addEventListener('click', (e) => {
            if (e.target.id === 'report-modal') {
                this.closeReportModal();
            }
        });
        
        document.getElementById('confirm-modal').addEventListener('click', (e) => {
            if (e.target.id === 'confirm-modal') {
                this.closeConfirmModal();
            }
        });
    }
    
    loadReports() {
        this.currentReports = this.storageManager.getAllReports();
        this.displayReports(this.currentReports);
    }
    
    displayReports(reports) {
        const reportsGrid = document.getElementById('reports-grid');
        const emptyState = document.getElementById('empty-reports');
        
        if (reports.length === 0) {
            reportsGrid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        reportsGrid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        reportsGrid.innerHTML = '';
        
        reports.forEach(report => {
            const reportCard = this.createReportCard(report);
            reportsGrid.appendChild(reportCard);
        });
    }
    
    createReportCard(report) {
        const card = document.createElement('div');
        card.className = 'report-card';
        
        const date = new Date(report.timestamp).toLocaleDateString();
        const time = new Date(report.timestamp).toLocaleTimeString();
        
        // Calculate summary if available
        let summaryText = 'No issues data';
        if (report.summary) {
            const total = Object.values(report.summary).reduce((sum, count) => sum + count, 0);
            summaryText = total === 0 ? 'No issues found' : `${total} issues found`;
        }
        
        // Get HTML preview
        let htmlPreview = 'No HTML content';
        if (report.results && report.results.htmlCode) {
            htmlPreview = report.results.htmlCode.substring(0, 100);
            if (report.results.htmlCode.length > 100) {
                htmlPreview += '...';
            }
        }
        
        card.innerHTML = `
            <div class="report-header">
                <h3 class="report-title">${this.escapeHtml(report.title)}</h3>
                <div class="report-date">
                    <div>${date}</div>
                    <div class="report-time">${time}</div>
                </div>
            </div>
            
            <div class="report-summary">
                <div class="summary-text">${summaryText}</div>
                ${report.summary ? this.createSummaryBadges(report.summary) : ''}
            </div>
            
            <div class="report-preview">
                <div class="preview-label">HTML Preview:</div>
                <div class="preview-content">${this.escapeHtml(htmlPreview)}</div>
            </div>
            
            <div class="report-actions">
                <button class="btn btn-sm btn-secondary view-report" data-id="${report.id}">View Details</button>
                <button class="btn btn-sm btn-primary download-report" data-id="${report.id}">Download PDF</button>
                <button class="btn btn-sm btn-destructive delete-report" data-id="${report.id}">Delete</button>
            </div>
        `;
        
        // Add event listeners
        card.querySelector('.view-report').addEventListener('click', () => {
            this.viewReportDetails(report.id);
        });
        
        card.querySelector('.download-report').addEventListener('click', () => {
            this.downloadSingleReport(report.id);
        });
        
        card.querySelector('.delete-report').addEventListener('click', () => {
            this.confirmDeleteSingleReport(report.id);
        });
        
        return card;
    }
    
    createSummaryBadges(summary) {
        const badges = [];
        
        if (summary.critical > 0) {
            badges.push(`<span class="summary-badge critical">${summary.critical} Critical</span>`);
        }
        if (summary.serious > 0) {
            badges.push(`<span class="summary-badge serious">${summary.serious} Serious</span>`);
        }
        if (summary.moderate > 0) {
            badges.push(`<span class="summary-badge moderate">${summary.moderate} Moderate</span>`);
        }
        if (summary.minor > 0) {
            badges.push(`<span class="summary-badge minor">${summary.minor} Minor</span>`);
        }
        
        return `<div class="summary-badges">${badges.join('')}</div>`;
    }
    
    filterReports(query) {
        if (!query.trim()) {
            this.displayReports(this.currentReports);
            return;
        }
        
        const filteredReports = this.storageManager.searchReports(query);
        this.displayReports(filteredReports);
    }
    
    filterByDate(days) {
        if (days === 'all') {
            this.displayReports(this.currentReports);
            return;
        }
        
        const filteredReports = this.storageManager.filterReportsByDate(parseInt(days));
        this.displayReports(filteredReports);
    }
    
    viewReportDetails(reportId) {
        const report = this.storageManager.getReport(reportId);
        if (!report) return;
        
        this.selectedReport = report;
        this.showReportModal(report);
    }
    
    showReportModal(report) {
        const modal = document.getElementById('report-modal');
        const title = document.getElementById('report-modal-title');
        const body = document.getElementById('report-modal-body');
        
        title.textContent = report.title;
        
        const date = new Date(report.timestamp).toLocaleString();
        
        let content = `
            <div class="report-detail-section">
                <h4>Report Information</h4>
                <p><strong>Generated:</strong> ${date}</p>
                <p><strong>Report ID:</strong> ${report.id}</p>
            </div>
        `;
        
        if (report.summary) {
            const total = Object.values(report.summary).reduce((sum, count) => sum + count, 0);
            content += `
                <div class="report-detail-section">
                    <h4>Issue Summary</h4>
                    <div class="modal-summary-grid">
                        <div class="modal-summary-item critical">
                            <div class="modal-summary-number">${report.summary.critical || 0}</div>
                            <div class="modal-summary-label">Critical</div>
                        </div>
                        <div class="modal-summary-item serious">
                            <div class="modal-summary-number">${report.summary.serious || 0}</div>
                            <div class="modal-summary-label">Serious</div>
                        </div>
                        <div class="modal-summary-item moderate">
                            <div class="modal-summary-number">${report.summary.moderate || 0}</div>
                            <div class="modal-summary-label">Moderate</div>
                        </div>
                        <div class="modal-summary-item minor">
                            <div class="modal-summary-number">${report.summary.minor || 0}</div>
                            <div class="modal-summary-label">Minor</div>
                        </div>
                    </div>
                    <p><strong>Total Issues:</strong> ${total}</p>
                </div>
            `;
        }
        
        if (report.results && report.results.violations) {
            content += `
                <div class="report-detail-section">
                    <h4>Issues Found (${report.results.violations.length} types)</h4>
                    <div class="issues-summary">
            `;
            
            report.results.violations.slice(0, 5).forEach(violation => {
                const nodeCount = violation.nodes ? violation.nodes.length : 1;
                content += `
                    <div class="issue-summary-item">
                        <strong>${violation.description}</strong>
                        <span class="issue-count">${nodeCount} occurrence${nodeCount > 1 ? 's' : ''}</span>
                    </div>
                `;
            });
            
            if (report.results.violations.length > 5) {
                content += `<p><em>... and ${report.results.violations.length - 5} more issue types</em></p>`;
            }
            
            content += `</div></div>`;
        }
        
        if (report.results && report.results.htmlCode) {
            content += `
                <div class="report-detail-section">
                    <h4>HTML Code</h4>
                    <pre class="code-preview">${this.escapeHtml(report.results.htmlCode.substring(0, 500))}${report.results.htmlCode.length > 500 ? '...' : ''}</pre>
                </div>
            `;
        }
        
        body.innerHTML = content;
        modal.classList.add('active');
    }
    
    closeReportModal() {
        const modal = document.getElementById('report-modal');
        modal.classList.remove('active');
        this.selectedReport = null;
    }
    
    downloadReportPDF() {
        if (!this.selectedReport || !this.selectedReport.results) return;
        
        const pdfGenerator = new PDFGenerator(this.selectedReport.results);
        pdfGenerator.generateAndDownload();
    }
    
    downloadSingleReport(reportId) {
        const report = this.storageManager.getReport(reportId);
        if (!report || !report.results) return;
        
        const pdfGenerator = new PDFGenerator(report.results);
        pdfGenerator.generateAndDownload();
    }
    
    confirmDeleteReport() {
        if (!this.selectedReport) return;
        
        this.showConfirmModal(
            'Delete Report',
            `Are you sure you want to delete "${this.selectedReport.title}"? This action cannot be undone.`,
            () => {
                this.storageManager.deleteReport(this.selectedReport.id);
                this.closeReportModal();
                this.loadReports();
                this.updateStatistics();
                this.updateStorageInfo();
            }
        );
    }
    
    confirmDeleteSingleReport(reportId) {
        const report = this.storageManager.getReport(reportId);
        if (!report) return;
        
        this.showConfirmModal(
            'Delete Report',
            `Are you sure you want to delete "${report.title}"? This action cannot be undone.`,
            () => {
                this.storageManager.deleteReport(reportId);
                this.loadReports();
                this.updateStatistics();
                this.updateStorageInfo();
            }
        );
    }
    
    confirmClearAll() {
        this.showConfirmModal(
            'Clear All Reports',
            'Are you sure you want to delete ALL saved reports? This action cannot be undone.',
            () => {
                this.storageManager.clearAllReports();
                this.loadReports();
                this.updateStatistics();
                this.updateStorageInfo();
            }
        );
    }
    
    showConfirmModal(title, message, action) {
        const modal = document.getElementById('confirm-modal');
        const titleEl = document.getElementById('confirm-title');
        const messageEl = document.getElementById('confirm-message');
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        this.confirmAction = action;
        modal.classList.add('active');
    }
    
    closeConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        modal.classList.remove('active');
        this.confirmAction = null;
    }
    
    executeConfirmedAction() {
        if (this.confirmAction) {
            this.confirmAction();
        }
        this.closeConfirmModal();
    }
    
    exportAllReports() {
        const success = this.storageManager.exportAllReports();
        if (success) {
            this.showNotification('Reports exported successfully!', 'success');
        } else {
            this.showNotification('Failed to export reports.', 'error');
        }
    }
    
    importReports() {
        document.getElementById('import-file-input').click();
    }
    
    async handleImportFile(file) {
        if (!file) return;
        
        try {
            const result = await this.storageManager.importReports(file);
            this.showNotification(
                `Import completed! ${result.imported} reports imported, ${result.skipped} skipped.`,
                'success'
            );
            this.loadReports();
            this.updateStatistics();
            this.updateStorageInfo();
        } catch (error) {
            this.showNotification(`Import failed: ${error.message}`, 'error');
        }
    }
    
    updateStatistics() {
        const stats = this.storageManager.getStatistics();
        
        document.getElementById('total-reports').textContent = stats.totalReports;
        document.getElementById('total-issues').textContent = stats.totalIssues;
        document.getElementById('avg-issues').textContent = stats.averageIssues;
        document.getElementById('recent-activity').textContent = stats.recentActivity;
    }
    
    updateStorageInfo() {
        const usage = this.storageManager.getStorageUsage();
        
        document.getElementById('storage-used').textContent = usage.usedMB;
        document.getElementById('storage-max').textContent = usage.maxMB;
        document.getElementById('storage-fill').style.width = usage.percentage + '%';
        
        // Change color based on usage
        const fill = document.getElementById('storage-fill');
        if (usage.percentage > 80) {
            fill.style.backgroundColor = '#dc2626';
        } else if (usage.percentage > 60) {
            fill.style.backgroundColor = '#ea580c';
        } else {
            fill.style.backgroundColor = 'var(--primary)';
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize results manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResultsManager();
});