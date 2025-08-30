# AccessiScan: Web Accessibility Analyzer

## Overview

AccessiScan is a client-side web accessibility analyzer that helps developers identify and fix accessibility issues in HTML content and live websites. The application uses axe-core, the industry-standard accessibility testing engine, to perform WCAG 2.1 Level AA compliance checks. It provides two analysis modes: direct HTML code analysis and live website URL scanning, with detailed reporting and export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static HTML/CSS/JavaScript**: Pure client-side architecture with no backend dependencies
- **Multi-page application**: Separate HTML files for different functionality (home, HTML analysis, URL analysis, results)
- **Responsive design**: Mobile-first approach using Tailwind CSS framework
- **Component-based styling**: Modular CSS with reusable component classes

### Analysis Engine
- **axe-core integration**: Uses CDN-hosted axe-core library (v4.7.2) for accessibility testing
- **Dual analysis modes**: 
  - HTML code analysis: Direct parsing and testing of user-provided HTML
  - URL analysis: Cross-origin website scanning (limited by CORS policies)
- **Real-time processing**: Client-side analysis with immediate feedback

### User Interface Design
- **Progressive disclosure**: Step-by-step workflow from input to results
- **Visual severity indicators**: Color-coded system for issue classification (critical, serious, moderate, minor)
- **Export functionality**: Built-in results export capabilities
- **Navigation system**: Multi-page navigation with active state indicators

### Data Flow Architecture
- **Stateless operation**: No persistent data storage required
- **Session-based results**: Results stored in browser memory during analysis session
- **Export-oriented**: Focus on generating downloadable reports rather than data persistence

## External Dependencies

### Core Libraries
- **axe-core (v4.7.2)**: Primary accessibility testing engine from Deque Systems
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN for responsive styling

### Browser APIs
- **DOM Manipulation**: Native JavaScript for dynamic content generation and form handling
- **Fetch API**: For URL-based website content retrieval (subject to CORS limitations)
- **File API**: For export functionality and potential file upload features

### CDN Services
- **Tailwind CSS CDN**: For rapid prototyping and styling without build process
- **cdnjs**: For reliable axe-core library delivery

### Accessibility Standards
- **WCAG 2.1 Level AA**: Target compliance standard for all accessibility checks
- **WAI-ARIA**: Support for modern accessibility patterns and attributes