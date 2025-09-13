// Local Storage Management for Accessibility Reports
class StorageManager {
    constructor() {
        this.storageKey = 'accessibility-reports';
        this.maxReports = 50;
        this.maxStorageSize = 5 * 1024 * 1024; // 5MB limit
    }
    
    saveReport(reportData) {
        try {
            const reports = this.getAllReports();
            
            // Add new report with unique ID and timestamp
            const newReport = {
                id: this.generateId(),
                timestamp: new Date().toISOString(),
                ...reportData
            };
            
            reports.unshift(newReport);
            
            // Limit number of reports
            if (reports.length > this.maxReports) {
                reports.splice(this.maxReports);
            }
            
            // Check storage size and cleanup if necessary
            this.cleanupIfNeeded(reports);
            
            localStorage.setItem(this.storageKey, JSON.stringify(reports));
            
            return newReport.id;
        } catch (error) {
            console.error('Error saving report:', error);
            throw new Error('Failed to save report. Storage may be full.');
        }
    }
    
    getAllReports() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading reports:', error);
            return [];
        }
    }
    
    getReport(id) {
        const reports = this.getAllReports();
        return reports.find(report => report.id === id);
    }
    
    deleteReport(id) {
        try {
            const reports = this.getAllReports();
            const filteredReports = reports.filter(report => report.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(filteredReports));
            return true;
        } catch (error) {
            console.error('Error deleting report:', error);
            return false;
        }
    }
    
    clearAllReports() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing reports:', error);
            return false;
        }
    }
    
    searchReports(query) {
        const reports = this.getAllReports();
        const lowercaseQuery = query.toLowerCase();
        
        return reports.filter(report => 
            report.title.toLowerCase().includes(lowercaseQuery) ||
            (report.results.htmlCode && report.results.htmlCode.toLowerCase().includes(lowercaseQuery))
        );
    }
    
    filterReportsByDate(days) {
        const reports = this.getAllReports();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return reports.filter(report => 
            new Date(report.timestamp) >= cutoffDate
        );
    }
    
    getStorageUsage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            const usedBytes = stored ? new Blob([stored]).size : 0;
            const usedMB = (usedBytes / (1024 * 1024)).toFixed(2);
            const maxMB = (this.maxStorageSize / (1024 * 1024)).toFixed(2);
            
            return {
                used: usedBytes,
                usedMB: usedMB,
                max: this.maxStorageSize,
                maxMB: maxMB,
                percentage: Math.round((usedBytes / this.maxStorageSize) * 100)
            };
        } catch (error) {
            console.error('Error calculating storage usage:', error);
            return { used: 0, usedMB: '0', max: this.maxStorageSize, maxMB: '5', percentage: 0 };
        }
    }
    
    exportAllReports() {
        try {
            const reports = this.getAllReports();
            const exportData = {
                exportDate: new Date().toISOString(),
                version: '1.0',
                reports: reports
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `accessibility-reports-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Error exporting reports:', error);
            return false;
        }
    }
    
    importReports(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    if (!importData.reports || !Array.isArray(importData.reports)) {
                        throw new Error('Invalid import file format');
                    }
                    
                    const existingReports = this.getAllReports();
                    const existingIds = new Set(existingReports.map(r => r.id));
                    
                    // Filter out duplicates and add new reports
                    const newReports = importData.reports.filter(report => 
                        !existingIds.has(report.id)
                    );
                    
                    const mergedReports = [...existingReports, ...newReports];
                    
                    // Sort by timestamp (newest first)
                    mergedReports.sort((a, b) => 
                        new Date(b.timestamp) - new Date(a.timestamp)
                    );
                    
                    // Limit total reports
                    if (mergedReports.length > this.maxReports) {
                        mergedReports.splice(this.maxReports);
                    }
                    
                    localStorage.setItem(this.storageKey, JSON.stringify(mergedReports));
                    
                    resolve({
                        imported: newReports.length,
                        skipped: importData.reports.length - newReports.length,
                        total: mergedReports.length
                    });
                } catch (error) {
                    reject(new Error('Failed to import reports: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read import file'));
            };
            
            reader.readAsText(file);
        });
    }
    
    cleanupIfNeeded(reports) {
        const currentSize = new Blob([JSON.stringify(reports)]).size;
        
        if (currentSize > this.maxStorageSize) {
            // Remove oldest reports until under size limit
            while (reports.length > 0 && new Blob([JSON.stringify(reports)]).size > this.maxStorageSize) {
                reports.pop();
            }
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Utility method to format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Get reports statistics
    getStatistics() {
        const reports = this.getAllReports();
        
        if (reports.length === 0) {
            return {
                totalReports: 0,
                totalIssues: 0,
                averageIssues: 0,
                mostCommonIssues: [],
                recentActivity: []
            };
        }
        
        let totalIssues = 0;
        const issueTypes = {};
        
        reports.forEach(report => {
            if (report.results && report.results.violations) {
                report.results.violations.forEach(violation => {
                    const issueCount = violation.nodes ? violation.nodes.length : 1;
                    totalIssues += issueCount;
                    
                    if (issueTypes[violation.id]) {
                        issueTypes[violation.id] += issueCount;
                    } else {
                        issueTypes[violation.id] = issueCount;
                    }
                });
            }
        });
        
        // Sort issues by frequency
        const mostCommonIssues = Object.entries(issueTypes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([issue, count]) => ({ issue, count }));
        
        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentActivity = reports.filter(report => 
            new Date(report.timestamp) >= sevenDaysAgo
        ).length;
        
        return {
            totalReports: reports.length,
            totalIssues,
            averageIssues: Math.round(totalIssues / reports.length),
            mostCommonIssues,
            recentActivity
        };
    }
}