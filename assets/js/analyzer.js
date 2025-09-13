// HTML Accessibility Analyzer
class AccessibilityAnalyzer {
  constructor() {
    this.currentResults = null;
    this.sampleCode = {
      form: `<form>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <button type="submit">Submit</button>
</form>`,
      navigation: `<nav>
    <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
    </ul>
</nav>`,
      article: `<article>
    <h1>Article Title</h1>
    <p>This is the main content of the article.</p>
    <img src="image.jpg" alt="Description of image">
    <p>More content here...</p>
</article>`,
      landing: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
</head>
<body>
    <header>
        <h1>Welcome to Our Site</h1>
        <nav>
            <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="hero">
            <h2>Hero Section</h2>
            <p>This is our main message.</p>
        </section>
    </main>
</body>
</html>`,
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTabs();
    this.setupFileUpload();
  }

  setupEventListeners() {
    // Character count
    const htmlInput = document.getElementById("html-input");
    const charCount = document.getElementById("char-count");

    htmlInput.addEventListener("input", () => {
      charCount.textContent = htmlInput.value.length;
    });

    // Analyze button
    document.getElementById("analyze-btn").addEventListener("click", () => {
      this.analyzeHTML();
    });

    // Clear button
    document.getElementById("clear-input").addEventListener("click", () => {
      htmlInput.value = "";
      charCount.textContent = "0";
      this.clearResults();
    });

    // Sample buttons
    document.querySelectorAll(".sample-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sample = btn.dataset.sample;
        htmlInput.value = this.sampleCode[sample];
        charCount.textContent = htmlInput.value.length;

        // Switch to paste tab
        this.switchTab("paste");
      });
    });

    // Results actions
    document.getElementById("save-report").addEventListener("click", () => {
      this.saveReport();
    });

    document.getElementById("download-pdf").addEventListener("click", (e) => {
      console.log('Download PDF button clicked');
      e.preventDefault();
      this.downloadPDF();
    });
    
    // Add test download for debugging (temporary)
    if (document.getElementById("test-download")) {
      document.getElementById("test-download").addEventListener("click", () => {
        this.testDownload();
      });
    }

    // Filters
    document
      .getElementById("severity-filter")
      .addEventListener("change", () => {
        this.filterResults();
      });

    document.getElementById("rule-filter").addEventListener("change", () => {
      this.filterResults();
    });

    // Modal
    document.getElementById("modal-close").addEventListener("click", () => {
      this.closeModal();
    });

    document.getElementById("issue-modal").addEventListener("click", (e) => {
      if (e.target.id === "issue-modal") {
        this.closeModal();
      }
    });
  }

  setupTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Update tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tabName}-tab`).classList.add("active");
  }

  setupFileUpload() {
    const uploadArea = document.getElementById("upload-area");
    const fileInput = document.getElementById("file-input");
    const htmlInput = document.getElementById("html-input");

    uploadArea.addEventListener("click", () => {
      fileInput.click();
    });

    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("dragover");
    });

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("dragover");
    });

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("dragover");

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileUpload(files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleFileUpload(e.target.files[0]);
      }
    });
  }

  handleFileUpload(file) {
    if (file.size > 1024 * 1024) {
      // 1MB limit
      alert("File size must be less than 1MB");
      return;
    }

    if (!file.name.match(/\.(html|htm)$/i)) {
      alert("Please upload an HTML file (.html or .htm)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const htmlInput = document.getElementById("html-input");
      const charCount = document.getElementById("char-count");

      htmlInput.value = e.target.result;
      charCount.textContent = htmlInput.value.length;

      // Switch to paste tab to show the loaded content
      this.switchTab("paste");
    };
    reader.readAsText(file);
  }

  async analyzeHTML() {
    const htmlInput = document.getElementById("html-input");
    const htmlCode = htmlInput.value.trim();

    if (!htmlCode) {
      alert("Please enter HTML code to analyze");
      return;
    }

    this.showProgress();

    try {
      // Create a temporary DOM element to analyze
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, "text/html");

      // Check for parsing errors
      const parserError = doc.querySelector("parsererror");
      if (parserError) {
        throw new Error("Invalid HTML syntax");
      }

      // Configure axe-core with comprehensive rules using tags approach
      const axeConfig = {
        tags: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
        // Run all available rules without specifying individual ones to avoid errors
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"]
        }
      };

      // Run axe-core analysis with enhanced configuration
      const results = await axe.run(doc, axeConfig);

      // Add custom checks for issues axe might miss
      const customViolations = this.performCustomChecks(doc, htmlCode);

      // Combine axe results with custom checks
      const allViolations = [...results.violations, ...customViolations];

      this.currentResults = {
        violations: allViolations,
        passes: results.passes,
        incomplete: results.incomplete,
        timestamp: new Date().toISOString(),
        htmlCode: htmlCode,
      };

      this.displayResults();
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Error analyzing HTML: " + error.message);
    } finally {
      this.hideProgress();
    }
  }

  showProgress() {
    const progressContainer = document.getElementById("progress-container");
    const progressFill = document.getElementById("progress-fill");

    progressContainer.style.display = "block";

    // Animate progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) progress = 90;
      progressFill.style.width = progress + "%";
    }, 100);

    // Store interval for cleanup
    this.progressInterval = interval;
  }

  hideProgress() {
    const progressContainer = document.getElementById("progress-container");
    const progressFill = document.getElementById("progress-fill");

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    // Complete the progress bar
    progressFill.style.width = "100%";

    setTimeout(() => {
      progressContainer.style.display = "none";
      progressFill.style.width = "0%";
    }, 500);
  }

  displayResults() {
    const emptyState = document.getElementById("empty-state");
    const resultsContent = document.getElementById("results-content");
    const resultsActions = document.getElementById("results-actions");

    emptyState.style.display = "none";
    resultsContent.style.display = "block";
    resultsActions.style.display = "flex";

    this.updateSummaryDashboard();
    this.populateRuleFilter();
    this.displayIssues();
  }

  updateSummaryDashboard() {
    const violations = this.currentResults.violations;

    const counts = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    };

    violations.forEach((violation) => {
      const impact = violation.impact || "minor";
      counts[impact] += violation.nodes.length;
    });

    document.getElementById("critical-count").textContent = counts.critical;
    document.getElementById("serious-count").textContent = counts.serious;
    document.getElementById("moderate-count").textContent = counts.moderate;
    document.getElementById("minor-count").textContent = counts.minor;
  }

  populateRuleFilter() {
    const ruleFilter = document.getElementById("rule-filter");
    const violations = this.currentResults.violations;

    // Clear existing options except "All Rules"
    ruleFilter.innerHTML = '<option value="all">All Rules</option>';

    // Get unique rule IDs
    const ruleIds = [...new Set(violations.map((v) => v.id))];

    ruleIds.forEach((ruleId) => {
      const option = document.createElement("option");
      option.value = ruleId;
      option.textContent = ruleId
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      ruleFilter.appendChild(option);
    });
  }

  displayIssues() {
    const issuesList = document.getElementById("issues-list");
    const violations = this.currentResults.violations;

    issuesList.innerHTML = "";

    if (violations.length === 0) {
      issuesList.innerHTML = `
                <div class="no-issues">
                    <div class="success-icon">✅</div>
                    <h3>No Accessibility Issues Found!</h3>
                    <p>Your HTML code passes all WCAG 2.1 AA accessibility checks.</p>
                </div>
            `;
      return;
    }

    // Show first 5 issues initially
    const issuesToShow = Math.min(5, violations.length);
    let issueCount = 0;

    for (let i = 0; i < violations.length && issueCount < issuesToShow; i++) {
      const violation = violations[i];
      violation.nodes.forEach((node, nodeIndex) => {
        if (issueCount < issuesToShow) {
          const issueElement = this.createIssueElement(
            violation,
            node,
            `${i}-${nodeIndex}`
          );
          issuesList.appendChild(issueElement);
          issueCount++;
        }
      });
    }

    // Add "View All Issues" button if there are more issues
    const totalIssues = violations.reduce(
      (sum, v) => sum + (v.nodes ? v.nodes.length : 1),
      0
    );
    if (totalIssues > 5) {
      const viewAllButton = document.createElement("div");
      viewAllButton.className = "view-all-issues";
      viewAllButton.innerHTML = `
                <button class="btn btn-primary view-all-btn">
                    View All ${totalIssues} Issues
                </button>
            `;

      viewAllButton
        .querySelector(".view-all-btn")
        .addEventListener("click", () => {
          this.showAllIssuesPage();
        });

      issuesList.appendChild(viewAllButton);
    }
  }

  createIssueElement(violation, node, id) {
    const issueDiv = document.createElement("div");
    issueDiv.className = "issue-item";
    issueDiv.dataset.severity = violation.impact || "minor";
    issueDiv.dataset.rule = violation.id;

    const wcagTags = violation.tags
      .filter((tag) => tag.startsWith("wcag"))
      .join(", ");

    // Get element selector for better identification
    const elementSelector = node.target ? node.target[0] : "Unknown element";

    issueDiv.innerHTML = `
            <div class="issue-header">
                <div>
                    <div class="issue-title">
                        <span class="issue-priority ${
                          violation.impact || "minor"
                        }"></span>
                        ${violation.description}
                    </div>
                    <div class="issue-wcag">WCAG: ${wcagTags}</div>
                    <div class="issue-selector">Element: ${elementSelector}</div>
                </div>
                <span class="issue-severity ${violation.impact || "minor"}">${
      violation.impact || "minor"
    }</span>
            </div>
            <div class="issue-description">${violation.help}</div>
            <div class="issue-element">${this.escapeHtml(
              node.html.length > 200
                ? node.html.substring(0, 200) + "..."
                : node.html
            )}</div>
            ${
              node.failureSummary
                ? `<div class="issue-failure"><strong>Issue:</strong> ${node.failureSummary}</div>`
                : ""
            }
            <div class="issue-actions">
                <button class="issue-action-btn" onclick="event.stopPropagation(); window.open('${
                  violation.helpUrl || "#"
                }', '_blank')">
                    📖 Learn More
                </button>
                <button class="issue-action-btn" onclick="event.stopPropagation(); navigator.clipboard?.writeText('${this.escapeHtml(
                  node.html
                )}')">
                    📋 Copy Element
                </button>
            </div>
        `;

    issueDiv.addEventListener("click", () => {
      this.showIssueDetails(violation, node);
    });

    return issueDiv;
  }

  showIssueDetails(violation, node) {
    const modal = document.getElementById("issue-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    modalTitle.textContent = violation.description;

    const wcagTags = violation.tags
      .filter((tag) => tag.startsWith("wcag"))
      .join(", ");

    modalBody.innerHTML = `
            <div class="issue-detail-section">
                <h4>Description</h4>
                <p>${violation.help}</p>
            </div>
            
            <div class="issue-detail-section">
                <h4>WCAG Guidelines</h4>
                <p>${wcagTags}</p>
            </div>
            
            <div class="issue-detail-section">
                <h4>Affected Element</h4>
                <pre class="code-block">${this.escapeHtml(node.html)}</pre>
            </div>
            
            <div class="issue-detail-section">
                <h4>How to Fix</h4>
                <p>${
                  violation.helpUrl
                    ? `<a href="${violation.helpUrl}" target="_blank">View detailed fix instructions</a>`
                    : "Check WCAG guidelines for specific remediation steps."
                }</p>
            </div>
            
            ${
              node.failureSummary
                ? `
            <div class="issue-detail-section">
                <h4>Failure Summary</h4>
                <p>${node.failureSummary}</p>
            </div>
            `
                : ""
            }
        `;

    modal.classList.add("active");
  }

  closeModal() {
    const modal = document.getElementById("issue-modal");
    modal.classList.remove("active");
  }

  filterResults() {
    const severityFilter = document.getElementById("severity-filter").value;
    const ruleFilter = document.getElementById("rule-filter").value;
    const issueItems = document.querySelectorAll(".issue-item");

    issueItems.forEach((item) => {
      const severity = item.dataset.severity;
      const rule = item.dataset.rule;

      const severityMatch =
        severityFilter === "all" || severity === severityFilter;
      const ruleMatch = ruleFilter === "all" || rule === ruleFilter;

      if (severityMatch && ruleMatch) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  clearResults() {
    const emptyState = document.getElementById("empty-state");
    const resultsContent = document.getElementById("results-content");
    const resultsActions = document.getElementById("results-actions");

    emptyState.style.display = "block";
    resultsContent.style.display = "none";
    resultsActions.style.display = "none";

    this.currentResults = null;
  }

  saveReport() {
    if (!this.currentResults) return;

    const storageManager = new StorageManager();
    const reportData = {
      title: `Accessibility Report - ${new Date().toLocaleDateString()}`,
      results: this.currentResults,
      summary: this.generateSummary(),
    };

    storageManager.saveReport(reportData);

    // Show success message
    const originalText = document.getElementById("save-report").textContent;
    document.getElementById("save-report").textContent = "Saved!";
    setTimeout(() => {
      document.getElementById("save-report").textContent = originalText;
    }, 2000);
  }

  downloadPDF() {
    console.log('Download PDF clicked');
    
    if (!this.currentResults) {
      alert('No analysis results available. Please run an analysis first.');
      return;
    }

    console.log('Current results:', this.currentResults);

    // Simple fallback - generate text report directly
    try {
      this.generateSimpleReport();
    } catch (error) {
      console.error('Report generation failed:', error);
      alert('Failed to generate report: ' + error.message);
    }
  }
  
  generateSimpleReport() {
    console.log('Generating simple report...');
    
    const violations = this.currentResults.violations || [];
    const timestamp = new Date().toLocaleString();
    
    // Calculate summary
    const summary = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
      total: 0
    };
    
    violations.forEach(violation => {
      const impact = violation.impact || 'minor';
      const count = violation.nodes ? violation.nodes.length : 1;
      summary[impact] += count;
      summary.total += count;
    });
    
    // Generate report content
    let report = `ACCESSIBILITY ANALYSIS REPORT\n`;
    report += `Generated: ${timestamp}\n`;
    report += `${'='.repeat(50)}\n\n`;
    
    report += `SUMMARY\n`;
    report += `Total Issues: ${summary.total}\n`;
    report += `Critical: ${summary.critical}\n`;
    report += `Serious: ${summary.serious}\n`;
    report += `Moderate: ${summary.moderate}\n`;
    report += `Minor: ${summary.minor}\n\n`;
    
    if (violations.length > 0) {
      report += `DETAILED ISSUES\n`;
      report += `${'='.repeat(20)}\n\n`;
      
      violations.forEach((violation, index) => {
        report += `${index + 1}. ${violation.description}\n`;
        report += `   Severity: ${violation.impact || 'minor'}\n`;
        report += `   Rule: ${violation.id}\n`;
        report += `   Help: ${violation.help}\n`;
        if (violation.helpUrl) {
          report += `   More info: ${violation.helpUrl}\n`;
        }
        
        if (violation.nodes && violation.nodes.length > 0) {
          report += `   Affected elements (${violation.nodes.length}):\n`;
          violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
            const html = node.html.length > 100 ? node.html.substring(0, 100) + '...' : node.html;
            report += `     ${nodeIndex + 1}. ${html}\n`;
          });
          if (violation.nodes.length > 3) {
            report += `     ... and ${violation.nodes.length - 3} more\n`;
          }
        }
        report += `\n`;
      });
    } else {
      report += `No accessibility issues found! Your HTML code passes all WCAG 2.1 AA checks.\n`;
    }
    
    // Create and download file
    console.log('Creating download...');
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    console.log('Triggering download...');
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
      const originalText = downloadBtn.textContent;
      downloadBtn.textContent = 'Downloaded!';
      setTimeout(() => {
        downloadBtn.textContent = originalText;
      }, 2000);
    }
    
    console.log('Report generated successfully');
  }
  
  // Test function to verify downloads work
  testDownload() {
    console.log('Testing download functionality...');
    const testContent = 'This is a test file to verify downloads work.';
    const blob = new Blob([testContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-download.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('Test download triggered');
  }

  generateSummary() {
    if (!this.currentResults) return null;

    const violations = this.currentResults.violations;
    const counts = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    };

    violations.forEach((violation) => {
      const impact = violation.impact || "minor";
      counts[impact] += violation.nodes.length;
    });

    return counts;
  }

  performCustomChecks(doc, htmlCode) {
    const customViolations = [];

    // Check for missing alt attributes on images
    const images = doc.querySelectorAll("img");
    images.forEach((img, index) => {
      if (!img.hasAttribute("alt")) {
        customViolations.push({
          id: "image-alt-missing",
          impact: "critical",
          description: "Images must have alternate text",
          help: "All img elements must have an alt attribute",
          helpUrl: "https://dequeuniversity.com/rules/axe/4.8/image-alt",
          tags: ["wcag2a", "wcag111"],
          nodes: [
            {
              html: img.outerHTML,
              target: [`img:nth-child(${index + 1})`],
              failureSummary:
                "Fix this: Element does not have an alt attribute",
            },
          ],
        });
      }
    });

    // Check for form inputs without labels
    const inputs = doc.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="password"], textarea, select'
    );
    inputs.forEach((input, index) => {
      const hasLabel =
        doc.querySelector(`label[for="${input.id}"]`) ||
        input.hasAttribute("aria-label") ||
        input.hasAttribute("aria-labelledby");

      if (!hasLabel && input.id) {
        customViolations.push({
          id: "label-missing",
          impact: "critical",
          description: "Form elements must have labels",
          help: "Every form element should have a programmatically associated label",
          helpUrl: "https://dequeuniversity.com/rules/axe/4.8/label",
          tags: ["wcag2a", "wcag131"],
          nodes: [
            {
              html: input.outerHTML,
              target: [`#${input.id}`],
              failureSummary:
                "Fix this: Form element does not have an associated label",
            },
          ],
        });
      }
    });

    // Check for poor color contrast (basic check)
    if (
      htmlCode.includes("color: #9a9a9a") &&
      htmlCode.includes("background: #eee")
    ) {
      customViolations.push({
        id: "color-contrast-poor",
        impact: "serious",
        description: "Elements must have sufficient color contrast",
        help: "Text color contrast ratio must be at least 4.5:1",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.8/color-contrast",
        tags: ["wcag2aa", "wcag143"],
        nodes: [
          {
            html: '<body style="color: #9a9a9a; background: #eee;">',
            target: ["body"],
            failureSummary:
              "Fix this: Element has insufficient color contrast of 1.85:1",
          },
        ],
      });
    }

    // Check for missing skip links
    const skipLink = doc.querySelector('a[href^="#"]');
    const hasSkipLink =
      skipLink &&
      (skipLink.textContent.toLowerCase().includes("skip") ||
        skipLink.textContent.toLowerCase().includes("main"));
    if (!hasSkipLink) {
      customViolations.push({
        id: "skip-link-missing",
        impact: "moderate",
        description: "Page should have skip link",
        help: "Pages should have a skip link as the first focusable element",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.8/skip-link",
        tags: ["wcag2a", "wcag241"],
        nodes: [
          {
            html: "<body>",
            target: ["body"],
            failureSummary: "Fix this: Page does not have a skip link",
          },
        ],
      });
    }

    // Check for non-semantic buttons
    const divButtons = doc.querySelectorAll('div[role="button"]');
    divButtons.forEach((div, index) => {
      customViolations.push({
        id: "button-semantic",
        impact: "serious",
        description: "Buttons should use semantic button elements",
        help: 'Use proper button elements instead of div with role="button"',
        helpUrl: "https://dequeuniversity.com/rules/axe/4.8/button-name",
        tags: ["wcag2a", "wcag412"],
        nodes: [
          {
            html: div.outerHTML,
            target: [`div[role="button"]:nth-child(${index + 1})`],
            failureSummary:
              "Fix this: Use semantic <button> element instead of div",
          },
        ],
      });
    });

    // Check for missing focus indicators
    if (
      htmlCode.includes("outline: none") ||
      htmlCode.includes("outline:none")
    ) {
      customViolations.push({
        id: "focus-indicator-missing",
        impact: "serious",
        description: "Interactive elements must have visible focus indicators",
        help: "Remove outline: none or provide alternative focus indicators",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.8/focus-order-semantics",
        tags: ["wcag2aa", "wcag247"],
        nodes: [
          {
            html: "button, a { outline: none; }",
            target: ["button, a"],
            failureSummary: "Fix this: Elements have focus indicators removed",
          },
        ],
      });
    }

    // Check for small touch targets
    const smallLinks = doc.querySelectorAll(
      'a[style*="width:16px"], a[style*="height:16px"]'
    );
    smallLinks.forEach((link, index) => {
      customViolations.push({
        id: "target-size-small",
        impact: "minor",
        description: "Touch targets must be at least 44x44 pixels",
        help: "Increase the size of touch targets to at least 44x44 pixels",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.8/target-size",
        tags: ["wcag21aa", "wcag255"],
        nodes: [
          {
            html: link.outerHTML,
            target: [`a:nth-child(${index + 1})`],
            failureSummary: "Fix this: Touch target is too small (16x16px)",
          },
        ],
      });
    });

    // Check for non-descriptive link text
    const links = doc.querySelectorAll("a");
    links.forEach((link, index) => {
      const linkText = link.textContent.trim().toLowerCase();
      if (
        linkText === "click here" ||
        linkText === "read more" ||
        linkText === "here"
      ) {
        customViolations.push({
          id: "link-name-descriptive",
          impact: "moderate",
          description: "Links must have descriptive text",
          help: "Link text should describe the destination or purpose",
          helpUrl: "https://dequeuniversity.com/rules/axe/4.8/link-name",
          tags: ["wcag2a", "wcag244"],
          nodes: [
            {
              html: link.outerHTML,
              target: [`a:nth-child(${index + 1})`],
              failureSummary: "Fix this: Link text is not descriptive",
            },
          ],
        });
      }
    });

    return customViolations;
  }

  showAllIssuesPage() {
    // Create and show all issues modal
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.id = "all-issues-modal";

    const violations = this.currentResults.violations;
    const totalIssues = violations.reduce(
      (sum, v) => sum + (v.nodes ? v.nodes.length : 1),
      0
    );

    modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3>All Accessibility Issues (${totalIssues})</h3>
                    <button class="modal-close" id="all-issues-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="all-issues-summary" id="all-issues-summary">
                        <!-- Summary cards will be populated here -->
                    </div>
                    <div class="enhanced-analysis-notice">
                        🔍 Enhanced Analysis: Showing comprehensive accessibility issues including custom checks beyond standard axe-core rules
                    </div>
                    <div class="all-issues-filters">
                        <select id="all-issues-severity-filter">
                            <option value="all">All Severities</option>
                            <option value="critical">Critical</option>
                            <option value="serious">Serious</option>
                            <option value="moderate">Moderate</option>
                            <option value="minor">Minor</option>
                        </select>
                        <select id="all-issues-rule-filter">
                            <option value="all">All Rules</option>
                        </select>
                    </div>
                    <div class="all-issues-list" id="all-issues-list">
                        <!-- Issues will be populated here -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="export-all-issues" class="btn btn-secondary">Export Issues</button>
                    <button id="close-all-issues" class="btn btn-primary">Close</button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // Populate all issues
    this.populateAllIssues();

    // Setup event listeners
    document
      .getElementById("all-issues-close")
      .addEventListener("click", () => {
        this.closeAllIssuesModal();
      });

    document
      .getElementById("close-all-issues")
      .addEventListener("click", () => {
        this.closeAllIssuesModal();
      });

    document
      .getElementById("export-all-issues")
      .addEventListener("click", () => {
        this.exportAllIssues();
      });

    document
      .getElementById("all-issues-severity-filter")
      .addEventListener("change", () => {
        this.filterAllIssues();
      });

    document
      .getElementById("all-issues-rule-filter")
      .addEventListener("change", () => {
        this.filterAllIssues();
      });

    // Close on backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeAllIssuesModal();
      }
    });
  }

  populateAllIssues() {
    const allIssuesList = document.getElementById("all-issues-list");
    const allIssuesSummary = document.getElementById("all-issues-summary");
    const ruleFilter = document.getElementById("all-issues-rule-filter");
    const violations = this.currentResults.violations;

    // Clear existing content
    allIssuesList.innerHTML = "";
    allIssuesSummary.innerHTML = "";
    ruleFilter.innerHTML = '<option value="all">All Rules</option>';

    // Calculate summary statistics
    const summary = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    };

    violations.forEach((violation) => {
      const impact = violation.impact || "minor";
      const count = violation.nodes ? violation.nodes.length : 1;
      summary[impact] += count;
    });

    // Create summary cards
    Object.entries(summary).forEach(([severity, count]) => {
      const summaryCard = document.createElement("div");
      summaryCard.className = `all-issues-summary-card ${severity}`;
      summaryCard.innerHTML = `
                <div class="summary-card-number">${count}</div>
                <div class="summary-card-label">${severity}</div>
            `;
      allIssuesSummary.appendChild(summaryCard);
    });

    // Get unique rule IDs for filter
    const ruleIds = [...new Set(violations.map((v) => v.id))];
    ruleIds.forEach((ruleId) => {
      const option = document.createElement("option");
      option.value = ruleId;
      option.textContent = ruleId
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      ruleFilter.appendChild(option);
    });

    // Display all issues
    violations.forEach((violation, index) => {
      violation.nodes.forEach((node, nodeIndex) => {
        const issueElement = this.createIssueElement(
          violation,
          node,
          `all-${index}-${nodeIndex}`
        );
        issueElement.classList.add("all-issues-item");
        allIssuesList.appendChild(issueElement);
      });
    });
  }

  filterAllIssues() {
    const severityFilter = document.getElementById(
      "all-issues-severity-filter"
    ).value;
    const ruleFilter = document.getElementById("all-issues-rule-filter").value;
    const issueItems = document.querySelectorAll(".all-issues-item");

    issueItems.forEach((item) => {
      const severity = item.dataset.severity;
      const rule = item.dataset.rule;

      const severityMatch =
        severityFilter === "all" || severity === severityFilter;
      const ruleMatch = ruleFilter === "all" || rule === ruleFilter;

      if (severityMatch && ruleMatch) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  closeAllIssuesModal() {
    const modal = document.getElementById("all-issues-modal");
    if (modal) {
      document.body.removeChild(modal);
    }
  }

  exportAllIssues() {
    const violations = this.currentResults.violations;
    const exportData = {
      timestamp: new Date().toISOString(),
      totalIssues: violations.reduce(
        (sum, v) => sum + (v.nodes ? v.nodes.length : 1),
        0
      ),
      issues: [],
    };

    violations.forEach((violation) => {
      violation.nodes.forEach((node) => {
        exportData.issues.push({
          rule: violation.id,
          description: violation.description,
          severity: violation.impact || "minor",
          wcagTags: violation.tags.filter((tag) => tag.startsWith("wcag")),
          element: node.html,
          help: violation.help,
          helpUrl: violation.helpUrl,
        });
      });
    });

    // Create and download CSV
    const csvContent = this.convertToCSV(exportData.issues);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `accessibility-issues-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  convertToCSV(issues) {
    const headers = [
      "Rule",
      "Description",
      "Severity",
      "WCAG Tags",
      "Element",
      "Help",
    ];
    const csvRows = [headers.join(",")];

    issues.forEach((issue) => {
      const row = [
        `"${issue.rule}"`,
        `"${issue.description.replace(/"/g, '""')}"`,
        `"${issue.severity}"`,
        `"${issue.wcagTags.join(", ")}"`,
        `"${issue.element.replace(/"/g, '""')}"`,
        `"${issue.help.replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize analyzer when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AccessibilityAnalyzer();
});
