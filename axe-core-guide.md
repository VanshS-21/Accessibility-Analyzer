# The Complete Guide to axe-core: Web Accessibility Testing Made Simple

## Table of Contents

1. [What is axe-core?](#what-is-axe-core)
2. [Why Use axe-core?](#why-use-axe-core)
3. [Understanding Web Accessibility](#understanding-web-accessibility)
4. [How axe-core Works](#how-axe-core-works)
5. [Getting Started](#getting-started)
6. [Installation Methods](#installation-methods)
7. [Basic Usage Examples](#basic-usage-examples)
8. [Advanced Configuration](#advanced-configuration)
9. [Understanding Results](#understanding-results)
10. [Integration Patterns](#integration-patterns)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)
13. [Resources and Further Learning](#resources-and-further-learning)

---

## What is axe-core?

**axe-core** is a powerful, open-source JavaScript library developed by Deque Systems that automatically tests web pages and applications for accessibility issues. Think of it as a digital accessibility inspector that can scan your website and tell you what might be difficult or impossible for people with disabilities to use.

### Key Characteristics:

- **Automated Testing**: Scans HTML, CSS, and JavaScript to find accessibility problems
- **WCAG Compliance**: Tests against Web Content Accessibility Guidelines (WCAG) 2.0, 2.1, and 2.2
- **Zero False Positives**: Designed to only report real issues, not false alarms
- **Fast and Lightweight**: Can test thousands of elements in milliseconds
- **Framework Agnostic**: Works with any web technology (React, Vue, Angular, vanilla HTML, etc.)

### What Makes axe-core Special?

Unlike other accessibility testing tools, axe-core is built by accessibility experts and is used by major companies like Microsoft, Google, and government agencies worldwide. It's the engine behind many popular accessibility testing tools.

---

## Why Use axe-core?

### 1. **Legal Compliance**

Many countries have laws requiring digital accessibility:

- **USA**: Americans with Disabilities Act (ADA), Section 508
- **Europe**: European Accessibility Act
- **Canada**: Accessibility for Ontarians with Disabilities Act (AODA)
- **Australia**: Disability Discrimination Act

### 2. **Inclusive Design**

- **1 billion people** worldwide have disabilities
- **15% of the global population** benefits from accessible design
- Accessible websites work better for everyone, not just people with disabilities

### 3. **Business Benefits**

- **Larger audience**: Reach more potential customers
- **Better SEO**: Accessible sites often rank higher in search results
- **Improved usability**: Benefits all users, especially on mobile devices
- **Risk mitigation**: Avoid costly lawsuits and redesigns

### 4. **Technical Advantages**

- **Early detection**: Find issues during development, not after launch
- **Automated testing**: Reduce manual testing time and costs
- **Consistent standards**: Ensure uniform accessibility across your site
- **Developer-friendly**: Integrates into existing workflows

---

## Understanding Web Accessibility

Before diving into axe-core, it's important to understand what web accessibility means.

### The Four Principles of Accessibility (POUR)

#### 1. **Perceivable**

Information must be presentable in ways users can perceive:

- **Images** need alternative text for screen readers
- **Videos** need captions for deaf users
- **Colors** shouldn't be the only way to convey information
- **Text** must have sufficient contrast against backgrounds

#### 2. **Operable**

Interface components must be operable:

- **Keyboard navigation** for users who can't use a mouse
- **No seizure-inducing** flashing content
- **Sufficient time** to read and use content
- **Clear navigation** and page structure

#### 3. **Understandable**

Information and UI operation must be understandable:

- **Clear language** and instructions
- **Predictable functionality** and navigation
- **Error identification** and correction assistance
- **Consistent design** patterns

#### 4. **Robust**

Content must be robust enough for various assistive technologies:

- **Valid HTML** that works with screen readers
- **Semantic markup** that conveys meaning
- **Compatible** with current and future assistive technologies

### Common Accessibility Issues axe-core Detects

1. **Missing Alt Text**: Images without descriptive alternative text
2. **Poor Color Contrast**: Text that's hard to read against its background
3. **Keyboard Traps**: Elements users can't navigate away from using keyboard
4. **Missing Form Labels**: Form inputs without proper labels
5. **Heading Structure**: Improper heading hierarchy (h1, h2, h3, etc.)
6. **Focus Management**: Elements that can't receive keyboard focus when they should
7. **ARIA Issues**: Incorrect use of ARIA attributes
8. **Link Problems**: Links without descriptive text or proper context

---

## How axe-core Works

### What Axe-Core Is Based On

**Engine**: Axe-core is built as a JavaScript-based accessibility engine. It runs directly in the browser or in Node.js environments, meaning it doesn't rely on external engines like Chromium or Selenium to function. Instead, it uses:

- **DOM inspection**: It analyzes the live DOM of a webpage
- **WCAG & ARIA rule sets**: It applies a curated set of rules based on WCAG 2.0, 2.1, and 2.2 and ARIA best practices
- **JavaScript execution context**: It runs inside the same context as your page, allowing it to inspect elements, attributes, and computed styles

### 🔍 How Axe-Core Works

Here's the flow of how axe-core performs an audit:

1. **DOM Snapshot**: It scans the current state of the DOM, including shadow DOMs and dynamically rendered content
2. **Rule Evaluation**: It applies a set of rules to detect violations like missing labels, poor color contrast, improper ARIA usage, etc.
3. **Results Categorization**:
   - ✅ **Passes**: Elements that meet accessibility standards
   - ❌ **Violations**: Confirmed accessibility issues
   - ⚠️ **Incomplete**: Cases where manual review is needed (e.g., keyboard focus behavior)
4. **Output**: It returns structured JSON with details like:
   - Affected elements
   - Rule violated
   - Suggested fixes

### Rule Categories by Severity

#### **Critical Issues**

Problems that completely block access for users with disabilities:

- Missing form labels
- Images without alt text in content
- Keyboard traps

#### **Serious Issues**

Significant barriers that make content very difficult to access:

- Poor color contrast
- Missing page titles
- Improper heading structure

#### **Moderate Issues**

Noticeable problems that impact usability:

- Missing skip links
- Redundant links
- Minor ARIA issues

#### **Minor Issues**

Small improvements that enhance accessibility:

- Missing language declarations
- Suboptimal markup patterns

### Technical Architecture

```
Web Page → axe-core Engine → Rule Evaluation → Results Processing
    ↓           ↓                ↓                ↓
  Live DOM   JavaScript      WCAG/ARIA        Structured
  Analysis   Execution       Rule Sets        JSON Output
```

---

## Getting Started

### Prerequisites

**Basic Knowledge Needed:**

- HTML fundamentals
- Basic JavaScript (for integration)
- Understanding of web development concepts

**Tools You'll Need:**

- A web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE
- Basic development environment

### Your First axe-core Test

Let's start with the simplest possible example:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First axe-core Test</title>
  </head>
  <body>
    <h1>Welcome to My Website</h1>
    <img src="logo.png" />
    <!-- This will trigger an accessibility issue -->
    <button>Click me</button>

    <!-- Include axe-core -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js"></script>
    <script>
      // Run axe-core test
      axe.run().then((results) => {
        console.log("Accessibility Results:", results);
        if (results.violations.length > 0) {
          console.log("Issues found:", results.violations);
        } else {
          console.log("No accessibility issues found!");
        }
      });
    </script>
  </body>
</html>
```

**What This Does:**

1. Loads axe-core from a CDN
2. Runs a complete accessibility scan
3. Logs results to the browser console
4. The image without alt text will be flagged as an issue

---

## Installation Methods

### 1. CDN (Easiest for Beginners)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js"></script>
```

**Pros:** Quick setup, no build process needed
**Cons:** Requires internet connection, less control over versions

### 2. NPM Installation

```bash
npm install axe-core
```

```javascript
import axe from "axe-core";

// Use axe in your application
axe.run().then((results) => {
  console.log(results);
});
```

**Pros:** Version control, offline usage, better for production
**Cons:** Requires build process and Node.js knowledge

### 3. Direct Download

Download from [GitHub releases](https://github.com/dequelabs/axe-core/releases) and include locally:

```html
<script src="./js/axe.min.js"></script>
```

**Pros:** Full control, no external dependencies
**Cons:** Manual updates required

---

## Basic Usage Examples

### Example 1: Simple Page Scan

```javascript
// Basic scan of entire page
axe
  .run()
  .then((results) => {
    console.log("Total violations:", results.violations.length);
    console.log("Total passes:", results.passes.length);

    // Log each violation
    results.violations.forEach((violation) => {
      console.log(`Issue: ${violation.id}`);
      console.log(`Description: ${violation.description}`);
      console.log(`Impact: ${violation.impact}`);
      console.log(`Help: ${violation.help}`);
    });
  })
  .catch((error) => {
    console.error("axe-core error:", error);
  });
```

### Example 2: Scan Specific Element

```javascript
// Scan only a specific section
const mainContent = document.querySelector("main");

axe.run(mainContent).then((results) => {
  console.log("Issues in main content:", results.violations);
});
```

### Example 3: Custom Configuration

```javascript
// Scan with custom rules and options
axe
  .run({
    // Include specific rules
    rules: {
      "color-contrast": { enabled: true },
      "image-alt": { enabled: true },
      label: { enabled: true },
    },
    // Set tags to test against
    tags: ["wcag2a", "wcag2aa"],
  })
  .then((results) => {
    console.log("Custom scan results:", results);
  });
```

### Example 4: Exclude Elements

```javascript
// Exclude certain elements from testing
axe
  .run({
    exclude: [
      ".advertisement", // Exclude ads
      "#third-party-widget", // Exclude external widgets
    ],
  })
  .then((results) => {
    console.log("Filtered results:", results);
  });
```

---

## Advanced Configuration

### Rule Configuration

axe-core has over 90 built-in rules. You can enable, disable, or configure them:

```javascript
axe.configure({
  rules: [
    {
      id: "color-contrast",
      enabled: true,
      options: {
        // Require AAA level contrast instead of AA
        level: "AAA",
      },
    },
    {
      id: "image-alt",
      enabled: true,
    },
    {
      // Disable a rule you don't want to test
      id: "bypass",
      enabled: false,
    },
  ],
});
```

### Tag-Based Testing

Test against specific standards:

```javascript
// Test only WCAG 2.1 AA rules
axe
  .run(document, {
    tags: ["wcag21aa"],
  })
  .then((results) => {
    console.log("WCAG 2.1 AA Results:", results);
  });

// Test against multiple standards
axe
  .run(document, {
    tags: ["wcag2a", "wcag2aa", "section508"],
  })
  .then((results) => {
    console.log("Multi-standard results:", results);
  });
```

### Available Tags:

- `wcag2a` - WCAG 2.0 Level A
- `wcag2aa` - WCAG 2.0 Level AA
- `wcag21a` - WCAG 2.1 Level A
- `wcag21aa` - WCAG 2.1 Level AA
- `wcag22aa` - WCAG 2.2 Level AA
- `section508` - Section 508 compliance
- `best-practice` - Best practices beyond WCAG

### Performance Optimization

```javascript
// For large pages, you might want to optimize performance
axe
  .run(document, {
    // Run only critical rules for faster execution
    tags: ["wcag2a"],

    // Exclude heavy rules if needed
    rules: {
      "color-contrast": { enabled: false }, // This rule can be slow on large pages
    },
  })
  .then((results) => {
    console.log("Optimized scan results:", results);
  });
```

---

## Understanding Results

### Result Structure

axe-core returns results in this format:

```javascript
{
    violations: [],    // Issues found
    passes: [],       // Tests that passed
    incomplete: [],   // Tests that need manual review
    inapplicable: [] // Tests that don't apply to this page
}
```

### Violation Object Structure

Each violation contains detailed information:

```javascript
{
    id: "image-alt",                    // Rule identifier
    impact: "critical",                 // Severity level
    tags: ["cat.text-alternatives"],    // Rule categories
    description: "Images must have alternative text",
    help: "Elements must have alternate text",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.8/image-alt",
    nodes: [                           // Affected elements
        {
            target: ["img"],           // CSS selector
            html: '<img src="logo.png">', // HTML snippet
            impact: "critical",
            any: [],                   // Checks that must pass
            all: [],                   // Checks where all must pass
            none: []                   // Checks where none should pass
        }
    ]
}
```

### Processing Results

```javascript
axe.run().then((results) => {
  // Group violations by severity
  const critical = results.violations.filter((v) => v.impact === "critical");
  const serious = results.violations.filter((v) => v.impact === "serious");
  const moderate = results.violations.filter((v) => v.impact === "moderate");
  const minor = results.violations.filter((v) => v.impact === "minor");

  console.log(`Critical issues: ${critical.length}`);
  console.log(`Serious issues: ${serious.length}`);
  console.log(`Moderate issues: ${moderate.length}`);
  console.log(`Minor issues: ${minor.length}`);

  // Create a summary report
  const summary = {
    totalIssues: results.violations.length,
    criticalIssues: critical.length,
    passedTests: results.passes.length,
    needsReview: results.incomplete.length,
  };

  console.log("Accessibility Summary:", summary);
});
```

---

## Integration Patterns

### 1. Development Workflow Integration

#### During Development

```javascript
// Add to your development environment
if (process.env.NODE_ENV === "development") {
  // Load axe-core dynamically in development
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js";
  script.onload = () => {
    axe.run().then((results) => {
      if (results.violations.length > 0) {
        console.warn("Accessibility issues detected:", results.violations);
      }
    });
  };
  document.head.appendChild(script);
}
```

#### Build Process Integration

```javascript
// For webpack-based projects
const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  plugins: [
    // Add axe-core to development builds
    isDevelopment &&
      new webpack.DefinePlugin({
        "process.env.INCLUDE_AXE": JSON.stringify("true"),
      }),
  ].filter(Boolean),
};
```

### 2. Automated Testing Integration

#### Basic HTML Testing

```javascript
// test-accessibility.js
const fs = require("fs");
const { JSDOM } = require("jsdom");
const axeCore = require("axe-core");

async function testHTMLFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const dom = new JSDOM(html);

  const results = await axeCore.run(dom.window.document);

  if (results.violations.length > 0) {
    console.error(`Accessibility violations in ${filePath}:`);
    results.violations.forEach((violation) => {
      console.error(`- ${violation.id}: ${violation.description}`);
    });
    return false;
  }

  console.log(`✅ ${filePath} passed accessibility tests`);
  return true;
}

// Test multiple files
["index.html", "about.html", "contact.html"].forEach(testHTMLFile);
```

#### CI/CD Pipeline Integration

```bash
# Add to your CI/CD pipeline (e.g., GitHub Actions)
name: Accessibility Tests
on: [push, pull_request]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install axe-core jsdom
      - name: Run accessibility tests
        run: node test-accessibility.js
```

---

## Best Practices

### 1. **When to Run Tests**

#### During Development

- Run axe-core on every page/component you build
- Include in your local development server
- Test early and often

#### Before Deployment

- Include in your CI/CD pipeline
- Run comprehensive tests on staging environments
- Block deployments with critical accessibility issues

#### After Deployment

- Monitor production sites regularly
- Set up automated accessibility monitoring
- Test after content updates

### 2. **What to Test**

#### Essential Pages

- Homepage
- Main navigation paths
- Forms and interactive elements
- Error pages
- Mobile responsive views

#### Content Types

- Text content and headings
- Images and media
- Forms and inputs
- Interactive widgets
- Dynamic content

### 3. **Handling Results**

#### Prioritization Strategy

1. **Critical Issues First**: Block user access completely
2. **Serious Issues Second**: Major barriers to access
3. **Moderate Issues Third**: Usability improvements
4. **Minor Issues Last**: Polish and best practices

#### Documentation

```javascript
// Create detailed reports
function generateAccessibilityReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    summary: {
      totalViolations: results.violations.length,
      criticalIssues: results.violations.filter((v) => v.impact === "critical")
        .length,
      passedTests: results.passes.length,
    },
    violations: results.violations.map((violation) => ({
      rule: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      elementCount: violation.nodes.length,
      elements: violation.nodes.map((node) => ({
        selector: node.target.join(" "),
        html: node.html,
      })),
    })),
  };

  return report;
}
```

### 4. **Performance Considerations**

#### Optimize for Large Pages

```javascript
// For pages with many elements
axe.run(document, {
  // Test in batches
  rules: {
    "color-contrast": {
      enabled: true,
      options: {
        // Reduce precision for better performance
        pseudoSizeThreshold: 0.25,
      },
    },
  },
});
```

#### Selective Testing

```javascript
// Test only what's changed
function testNewContent(selector) {
  const newElement = document.querySelector(selector);
  if (newElement) {
    axe.run(newElement).then((results) => {
      console.log("New content accessibility:", results);
    });
  }
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. **axe is not defined**

```javascript
// Problem: axe-core not loaded
// Solution: Ensure script is loaded before use
window.addEventListener("load", () => {
  if (typeof axe !== "undefined") {
    axe.run().then((results) => {
      console.log(results);
    });
  } else {
    console.error("axe-core not loaded");
  }
});
```

#### 2. **False Positives**

```javascript
// Problem: Rules reporting issues incorrectly
// Solution: Configure or disable problematic rules
axe.configure({
  rules: [
    {
      id: "problematic-rule",
      enabled: false, // Disable if causing false positives
    },
  ],
});
```

#### 3. **Performance Issues**

```javascript
// Problem: Tests taking too long
// Solution: Optimize rule selection and scope
axe.run(".main-content", {
  // Limit scope
  tags: ["wcag2a"], // Limit rules
  rules: {
    "color-contrast": { enabled: false }, // Disable slow rules
  },
});
```

#### 4. **Third-Party Content**

```javascript
// Problem: Issues in third-party widgets
// Solution: Exclude from testing
axe.run({
  exclude: [
    ".google-ads",
    ".social-media-widget",
    'iframe[src*="youtube.com"]',
  ],
});
```

### Debugging Tips

#### 1. **Inspect Specific Elements**

```javascript
// Test a single element
const button = document.querySelector("#my-button");
axe.run(button).then((results) => {
  console.log("Button accessibility:", results);
});
```

#### 2. **Understand Rule Context**

```javascript
// Get detailed information about a rule
axe.getRules(["color-contrast"]).then((rules) => {
  console.log("Color contrast rule details:", rules);
});
```

#### 3. **Manual Verification**

```javascript
// For incomplete results that need manual review
results.incomplete.forEach((item) => {
  console.log(`Manual review needed for: ${item.id}`);
  console.log(`Reason: ${item.description}`);
  console.log(`Elements:`, item.nodes);
});
```

---

## Resources and Further Learning

### Official Documentation

- **axe-core GitHub**: https://github.com/dequelabs/axe-core
- **API Documentation**: https://www.deque.com/axe/core-documentation/
- **Rule Descriptions**: https://dequeuniversity.com/rules/axe/

### Learning Resources

- **Deque University**: https://dequeuniversity.com/
- **Web Accessibility Initiative (WAI)**: https://www.w3.org/WAI/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **A11y Project**: https://www.a11yproject.com/

### Tools and Extensions

- **axe DevTools**: Browser extension for manual testing
- **axe-cli**: Command-line interface for axe-core
- **Lighthouse**: Google's accessibility auditing tool (uses axe-core)
- **WAVE**: Web accessibility evaluation tool

### Community and Support

- **GitHub Issues**: Report bugs and request features
- **Stack Overflow**: Tag questions with `axe-core`
- **Accessibility Slack Communities**: Join discussions with other developers
- **Conferences**: Attend accessibility-focused events and workshops

### Sample Projects

- **Basic Integration**: https://github.com/dequelabs/axe-core/tree/develop/examples
- **React Example**: https://github.com/dequelabs/react-axe
- **Testing Examples**: https://github.com/dequelabs/axe-core/tree/develop/test

---

## Real-World Examples from AccessiScan Codebase

Here are actual examples of how axe-core is implemented in the AccessiScan project:

### Example 1: Script Inclusion (analyzer.html, line 279)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js"></script>
```

**Usage**: Loading axe-core from CDN in the HTML accessibility analyzer page.

### Example 2: Performance Optimization with Preload (index.html, lines 147-150)

```html
<link
  rel="preload"
  href="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js"
  as="script"
/>
```

**Usage**: Preloading axe-core for better performance on the landing page.

### Example 3: Comprehensive Configuration (assets/js/analyzer.js, lines 246-254)

```javascript
// Configure axe-core with comprehensive rules using tags approach
const axeConfig = {
  tags: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
  // Run all available rules without specifying individual ones to avoid errors
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
  },
};
```

**Usage**: Setting up axe-core to test against multiple WCAG standards and best practices.

### Example 4: Running Analysis with Custom DOM (assets/js/analyzer.js, line 256)

```javascript
// Run axe-core analysis with enhanced configuration
const results = await axe.run(doc, axeConfig);
```

**Usage**: Running axe-core analysis on a parsed HTML document with custom configuration.

### Example 5: Combining Results with Custom Checks (assets/js/analyzer.js, lines 259-267)

```javascript
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
```

**Usage**: Extending axe-core results with custom accessibility checks for comprehensive analysis.

### Example 6: User-Facing Documentation (assets/js/analyzer.js, line 968)

```javascript
🔍 Enhanced Analysis: Showing comprehensive accessibility issues including custom checks beyond standard axe-core rules
```

**Usage**: Informing users that the analysis goes beyond standard axe-core rules.

### Example 7: Report Generation Context (assets/js/text-generator.js, lines 12-15)

```javascript
let report = `ACCESSIBILITY ANALYSIS REPORT\n`;
report += `Generated: ${timestamp}\n`;
report += `${"=".repeat(50)}\n\n`;
```

**Usage**: Creating text reports based on axe-core analysis results.

### Example 8: Technology Stack Documentation (README.md, line 32)

```markdown
- **Accessibility Engine**: axe-core
```

**Usage**: Documenting axe-core as the core accessibility testing engine in project documentation.

These examples show how axe-core is integrated throughout the AccessiScan application, from basic script inclusion to advanced configuration and result processing.

---

## Conclusion

axe-core is an essential tool for creating accessible web applications. By integrating it into your development workflow, you can:

- **Catch accessibility issues early** in the development process
- **Ensure compliance** with legal and industry standards
- **Create inclusive experiences** for all users
- **Improve overall code quality** and user experience

Remember that automated testing with axe-core is just one part of a comprehensive accessibility strategy. It should be combined with:

- Manual testing with assistive technologies
- User testing with people who have disabilities
- Regular accessibility audits and reviews
- Ongoing education and training for your team

Start small, test often, and gradually build accessibility into every aspect of your development process. Your users will thank you for creating a more inclusive web experience.

---

_This guide covers axe-core version 4.8.2. Always check the official documentation for the latest features and updates._
