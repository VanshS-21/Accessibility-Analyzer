// PDF Report Generator for Accessibility Analysis
class PDFGenerator {
    constructor(analysisData) {
        this.data = analysisData;
        this.doc = null;
        this.pageHeight = 297; // A4 height in mm
        this.pageWidth = 210; // A4 width in mm
        this.margin = 20;
        this.currentY = this.margin;
        this.lineHeight = 7;
        
        // Test jsPDF availability on construction
        this.testJsPDF();
    }
    
    testJsPDF() {
        try {
            if (typeof window.jsPDF === 'undefined') {
                console.error('jsPDF not loaded');
                return false;
            }
            
            // Try to create a test instance
            let testDoc;
            if (window.jsPDF.jsPDF) {
                testDoc = new window.jsPDF.jsPDF();
            } else if (window.jsPDF) {
                testDoc = new window.jsPDF();
            }
            
            if (testDoc) {
                console.log('jsPDF test successful');
                return true;
            }
        } catch (error) {
            console.error('jsPDF test failed:', error);
        }
        return false;
    }
    
    // Fallback method to generate text report if PDF fails
    generateTextReport() {
        try {
            const summary = this.calculateSummary();
            const timestamp = new Date().toISOString();
            
            let report = `ACCESSIBILITY ANALYSIS REPORT\n`;
            report += `Generated: ${timestamp}\n`;
            report += `${'='.repeat(50)}\n\n`;
            
            report += `SUMMARY\n`;
            report += `Total Issues: ${summary.totalIssues}\n`;
            report += `Critical: ${summary.critical}\n`;
            report += `Serious: ${summary.serious}\n`;
            report += `Moderate: ${summary.moderate}\n`;
            report += `Minor: ${summary.minor}\n\n`;
            
            if (this.data.violations && this.data.violations.length > 0) {
                report += `DETAILED ISSUES\n`;
                report += `${'='.repeat(20)}\n\n`;
                
                this.data.violations.forEach((violation, index) => {
                    report += `${index + 1}. ${violation.description}\n`;
                    report += `   Severity: ${violation.impact || 'minor'}\n`;
                    report += `   Help: ${violation.help}\n`;
                    if (violation.helpUrl) {
                        report += `   More info: ${violation.helpUrl}\n`;
                    }
                    report += `   Affected elements: ${violation.nodes ? violation.nodes.length : 1}\n\n`;
                });
            }
            
            // Create and download text file
            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Text report generation failed:', error);
            return false;
        }
    }
    
    generateAndDownload() {
        try {
            // Wait a bit for jsPDF to load if needed
            if (typeof window.jsPDF === 'undefined') {
                // Try to load jsPDF dynamically
                return this.loadJsPDFAndGenerate();
            }
            
            // Validate data
            if (!this.data || !this.data.violations) {
                throw new Error('Invalid analysis data. Please run the analysis again.');
            }
            
            // Initialize jsPDF - try different ways to access it
            let jsPDFConstructor;
            if (window.jsPDF && typeof window.jsPDF === 'function') {
                jsPDFConstructor = window.jsPDF;
            } else if (window.jsPDF && window.jsPDF.jsPDF) {
                jsPDFConstructor = window.jsPDF.jsPDF;
            } else {
                throw new Error('jsPDF constructor not found. Available: ' + Object.keys(window.jsPDF || {}));
            }
            
            this.doc = new jsPDFConstructor();
            this.currentY = this.margin;
            
            console.log('PDF generation started...');
            
            this.addCoverPage();
            this.addNewPage();
            this.addExecutiveSummary();
            this.addDetailedIssues();
            this.addRecommendations();
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `accessibility-report-${timestamp}.pdf`;
            
            console.log('Saving PDF...');
            this.doc.save(filename);
            
            console.log('PDF generated successfully');
            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            console.error('Error stack:', error.stack);
            console.error('Data:', this.data);
            console.error('Available window objects:', Object.keys(window).filter(k => k.toLowerCase().includes('pdf')));
            alert(`Error generating PDF report: ${error.message}`);
            return false;
        }
    }
    
    loadJsPDFAndGenerate() {
        return new Promise((resolve) => {
            // Create script element to load jsPDF
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('jsPDF loaded dynamically');
                setTimeout(() => {
                    resolve(this.generateAndDownload());
                }, 100);
            };
            script.onerror = () => {
                console.error('Failed to load jsPDF dynamically');
                alert('Failed to load PDF library. Please check your internet connection and try again.');
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }
    
    addCoverPage() {
        // Title
        this.doc.setFontSize(24);
        this.doc.setFont(undefined, 'bold');
        this.doc.text('Accessibility Analysis Report', this.margin, 50);
        
        // Subtitle
        this.doc.setFontSize(16);
        this.doc.setFont(undefined, 'normal');
        this.doc.text('WCAG 2.1 AA Compliance Assessment', this.margin, 65);
        
        // Date
        this.doc.setFontSize(12);
        const reportDate = new Date(this.data.timestamp).toLocaleDateString();
        this.doc.text(`Generated on: ${reportDate}`, this.margin, 80);
        
        // Summary stats
        const summary = this.calculateSummary();
        this.doc.setFontSize(14);
        this.doc.setFont(undefined, 'bold');
        this.doc.text('Summary', this.margin, 100);
        
        this.doc.setFontSize(12);
        this.doc.setFont(undefined, 'normal');
        this.doc.text(`Total Issues Found: ${summary.totalIssues}`, this.margin, 115);
        this.doc.text(`Critical Issues: ${summary.critical}`, this.margin, 125);
        this.doc.text(`Serious Issues: ${summary.serious}`, this.margin, 135);
        this.doc.text(`Moderate Issues: ${summary.moderate}`, this.margin, 145);
        this.doc.text(`Minor Issues: ${summary.minor}`, this.margin, 155);
        
        // Compliance status
        const complianceStatus = summary.totalIssues === 0 ? 'COMPLIANT' : 'NON-COMPLIANT';
        const statusColor = summary.totalIssues === 0 ? [0, 128, 0] : [255, 0, 0];
        
        this.doc.setFontSize(16);
        this.doc.setFont(undefined, 'bold');
        this.doc.setTextColor(...statusColor);
        this.doc.text(`WCAG 2.1 AA Status: ${complianceStatus}`, this.margin, 175);
        
        // Reset text color
        this.doc.setTextColor(0, 0, 0);
        
        // Footer
        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'normal');
        this.doc.text('Generated by AccessScan - HTML Accessibility Scanner', this.margin, 280);
    }
    
    addNewPage() {
        this.doc.addPage();
        this.currentY = this.margin;
    }
    
    addExecutiveSummary() {
        this.addSectionHeader('Executive Summary');
        
        const summary = this.calculateSummary();
        
        if (summary.totalIssues === 0) {
            this.addParagraph('Congratulations! Your HTML code passes all WCAG 2.1 AA accessibility checks. No accessibility issues were found during the analysis.');
        } else {
            this.addParagraph(`This accessibility analysis identified ${summary.totalIssues} accessibility issues in your HTML code that need attention to achieve WCAG 2.1 AA compliance.`);
            
            this.checkPageSpace(30);
            this.addSubheader('Issue Breakdown:');
            
            if (summary.critical > 0) {
                this.addBulletPoint(`Critical Issues (${summary.critical}): These issues severely impact accessibility and must be fixed immediately.`);
            }
            if (summary.serious > 0) {
                this.addBulletPoint(`Serious Issues (${summary.serious}): These issues significantly impact accessibility and should be prioritized.`);
            }
            if (summary.moderate > 0) {
                this.addBulletPoint(`Moderate Issues (${summary.moderate}): These issues may cause accessibility barriers and should be addressed.`);
            }
            if (summary.minor > 0) {
                this.addBulletPoint(`Minor Issues (${summary.minor}): These issues have minimal impact but should be fixed for best practices.`);
            }
        }
        
        this.checkPageSpace(20);
        this.addSubheader('Recommendations:');
        
        if (summary.totalIssues === 0) {
            this.addBulletPoint('Continue following accessibility best practices in future development.');
            this.addBulletPoint('Consider regular accessibility testing as part of your development workflow.');
        } else {
            this.addBulletPoint('Address critical and serious issues first to maximize accessibility impact.');
            this.addBulletPoint('Test with assistive technologies after implementing fixes.');
            this.addBulletPoint('Consider implementing automated accessibility testing in your development process.');
        }
    }
    
    addDetailedIssues() {
        if (this.data.violations.length === 0) {
            return;
        }
        
        this.checkPageSpace(40);
        this.addSectionHeader('Detailed Issue Analysis');
        
        this.data.violations.forEach((violation, index) => {
            this.checkPageSpace(50);
            
            // Issue header
            this.doc.setFontSize(14);
            this.doc.setFont(undefined, 'bold');
            this.doc.text(`${index + 1}. ${violation.description}`, this.margin, this.currentY);
            this.currentY += this.lineHeight + 2;
            
            // Severity
            this.doc.setFontSize(10);
            this.doc.setFont(undefined, 'normal');
            const severity = violation.impact || 'minor';
            const severityColor = this.getSeverityColor(severity);
            this.doc.setTextColor(...severityColor);
            this.doc.text(`Severity: ${severity.toUpperCase()}`, this.margin, this.currentY);
            this.doc.setTextColor(0, 0, 0);
            this.currentY += this.lineHeight;
            
            // WCAG Guidelines
            const wcagTags = violation.tags.filter(tag => tag.startsWith('wcag')).join(', ');
            if (wcagTags) {
                this.doc.text(`WCAG Guidelines: ${wcagTags}`, this.margin, this.currentY);
                this.currentY += this.lineHeight;
            }
            
            // Description
            this.currentY += 3;
            this.addWrappedText(`Description: ${violation.help}`, this.margin);
            
            // Affected elements
            this.currentY += 3;
            this.doc.setFont(undefined, 'bold');
            this.doc.text(`Affected Elements (${violation.nodes.length}):`, this.margin, this.currentY);
            this.currentY += this.lineHeight;
            
            violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
                this.checkPageSpace(15);
                this.doc.setFont(undefined, 'normal');
                this.doc.setFontSize(9);
                
                // Truncate long HTML for readability
                let html = node.html;
                if (html.length > 100) {
                    html = html.substring(0, 100) + '...';
                }
                
                this.addWrappedText(`${nodeIndex + 1}. ${html}`, this.margin + 5);
                this.currentY += 2;
            });
            
            if (violation.nodes.length > 3) {
                this.doc.text(`... and ${violation.nodes.length - 3} more elements`, this.margin + 5, this.currentY);
                this.currentY += this.lineHeight;
            }
            
            // How to fix
            if (violation.helpUrl) {
                this.currentY += 3;
                this.doc.setFontSize(10);
                this.doc.setFont(undefined, 'bold');
                this.doc.text('How to Fix:', this.margin, this.currentY);
                this.currentY += this.lineHeight;
                
                this.doc.setFont(undefined, 'normal');
                this.doc.text(`For detailed fix instructions, visit: ${violation.helpUrl}`, this.margin, this.currentY);
                this.currentY += this.lineHeight;
            }
            
            this.currentY += 10; // Space between issues
        });
    }
    
    addRecommendations() {
        this.checkPageSpace(60);
        this.addSectionHeader('Recommendations & Next Steps');
        
        const summary = this.calculateSummary();
        
        if (summary.totalIssues === 0) {
            this.addSubheader('Maintenance Recommendations:');
            this.addBulletPoint('Implement automated accessibility testing in your CI/CD pipeline');
            this.addBulletPoint('Conduct regular manual testing with screen readers');
            this.addBulletPoint('Stay updated with WCAG guidelines and best practices');
            this.addBulletPoint('Consider user testing with people who have disabilities');
        } else {
            this.addSubheader('Priority Actions:');
            
            if (summary.critical > 0) {
                this.addBulletPoint('IMMEDIATE: Fix all critical accessibility issues');
            }
            if (summary.serious > 0) {
                this.addBulletPoint('HIGH PRIORITY: Address serious accessibility barriers');
            }
            if (summary.moderate > 0 || summary.minor > 0) {
                this.addBulletPoint('MEDIUM PRIORITY: Resolve remaining moderate and minor issues');
            }
            
            this.checkPageSpace(30);
            this.addSubheader('Testing Recommendations:');
            this.addBulletPoint('Test with keyboard navigation only');
            this.addBulletPoint('Verify with screen reader software (NVDA, JAWS, VoiceOver)');
            this.addBulletPoint('Check color contrast ratios');
            this.addBulletPoint('Validate with automated tools after fixes');
        }
        
        this.checkPageSpace(30);
        this.addSubheader('Resources:');
        this.addBulletPoint('WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/');
        this.addBulletPoint('WebAIM Resources: https://webaim.org/');
        this.addBulletPoint('A11y Project: https://www.a11yproject.com/');
    }
    
    addSectionHeader(title) {
        this.checkPageSpace(20);
        this.doc.setFontSize(16);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(title, this.margin, this.currentY);
        this.currentY += this.lineHeight + 5;
        
        // Add underline
        this.doc.line(this.margin, this.currentY - 2, this.pageWidth - this.margin, this.currentY - 2);
        this.currentY += 5;
    }
    
    addSubheader(title) {
        this.checkPageSpace(15);
        this.doc.setFontSize(12);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(title, this.margin, this.currentY);
        this.currentY += this.lineHeight + 3;
    }
    
    addParagraph(text) {
        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'normal');
        this.addWrappedText(text, this.margin);
        this.currentY += 5;
    }
    
    addBulletPoint(text) {
        this.checkPageSpace(10);
        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'normal');
        this.doc.text('•', this.margin, this.currentY);
        this.addWrappedText(text, this.margin + 5);
        this.currentY += 2;
    }
    
    addWrappedText(text, x) {
        const maxWidth = this.pageWidth - this.margin - x;
        const lines = this.doc.splitTextToSize(text, maxWidth);
        
        lines.forEach(line => {
            this.checkPageSpace(this.lineHeight);
            this.doc.text(line, x, this.currentY);
            this.currentY += this.lineHeight;
        });
    }
    
    checkPageSpace(requiredSpace) {
        if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
            this.addNewPage();
        }
    }
    
    calculateSummary() {
        const summary = {
            totalIssues: 0,
            critical: 0,
            serious: 0,
            moderate: 0,
            minor: 0
        };
        
        // Safety check for violations array
        if (!this.data || !Array.isArray(this.data.violations)) {
            console.warn('No violations data found for PDF generation');
            return summary;
        }
        
        this.data.violations.forEach(violation => {
            try {
                const impact = violation.impact || 'minor';
                const count = violation.nodes ? violation.nodes.length : 1;
                
                summary.totalIssues += count;
                if (summary.hasOwnProperty(impact)) {
                    summary[impact] += count;
                } else {
                    summary.minor += count; // Default to minor if unknown impact
                }
            } catch (err) {
                console.warn('Error processing violation:', violation, err);
            }
        });
        
        return summary;
    }
    
    getSeverityColor(severity) {
        switch (severity) {
            case 'critical':
                return [220, 38, 38]; // Red
            case 'serious':
                return [234, 88, 12]; // Orange
            case 'moderate':
                return [202, 138, 4]; // Yellow
            case 'minor':
                return [22, 163, 74]; // Green
            default:
                return [0, 0, 0]; // Black
        }
    }
}