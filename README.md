# AccessScan - HTML Accessibility Scanner

A comprehensive web application for analyzing HTML code accessibility compliance with WCAG 2.1 AA guidelines.

## Features

### 🔍 HTML Accessibility Analysis
- **Instant Analysis**: Real-time accessibility scanning using axe-core
- **WCAG 2.1 AA Compliance**: Industry-standard accessibility guidelines
- **Detailed Reports**: Comprehensive issue breakdown with fix suggestions
- **Multiple Input Methods**: Paste code, upload files, or use sample templates

### 📊 Results Management
- **Local Storage**: Save and manage accessibility reports
- **PDF Export**: Generate professional accessibility reports
- **Search & Filter**: Find specific reports and issues
- **Statistics Dashboard**: Track accessibility progress over time

### 🌐 Coming Soon: URL Scanner
- Direct website URL scanning
- Multi-page accessibility audits
- Site-wide accessibility reports
- Scheduled accessibility monitoring

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Accessibility Engine**: axe-core
- **PDF Generation**: jsPDF
- **Storage**: localStorage API
- **Styling**: Custom CSS with CSS Custom Properties
- **Typography**: Libre Baskerville font

## File Structure

```
accessibility-scanner/
├── index.html              # Landing page
├── analyzer.html           # HTML analysis tool
├── results.html            # Saved reports management
├── url-analyzer.html       # Coming soon page
├── assets/
│   ├── css/
│   │   ├── styles.css      # Main styles
│   │   └── components.css  # Component-specific styles
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   ├── analyzer.js     # Analysis functionality
│   │   ├── storage.js      # Local storage management
│   │   ├── pdf-generator.js # PDF report generation
│   │   ├── results.js      # Results page management
│   │   └── coming-soon.js  # Coming soon page functionality
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine directives
└── README.md               # This file
```

## Getting Started

1. **Clone or Download**: Get the project files
2. **Open in Browser**: Open `index.html` in a web browser
3. **Start Analyzing**: Navigate to the analyzer page and paste HTML code
4. **View Results**: Check detailed accessibility reports
5. **Save Reports**: Store reports locally for future reference

## Usage

### HTML Analysis
1. Go to the Analyzer page
2. Choose input method:
   - **Paste Code**: Copy and paste HTML directly
   - **Upload File**: Upload .html or .htm files (max 1MB)
   - **Sample Code**: Use pre-built templates
3. Click "Analyze HTML"
4. Review results and fix suggestions
5. Save or download PDF reports

### Results Management
1. Go to the Results page
2. View saved accessibility reports
3. Search and filter reports
4. Download PDF reports
5. Export/import report data

## Accessibility Features

This application follows WCAG 2.1 AA guidelines:
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Color contrast compliance
- ✅ Focus management
- ✅ Alternative text for images
- ✅ Form labels and descriptions

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: Minimal dependencies for fast loading
- **Offline Support**: Works without internet after initial load

## SEO Optimization

- Semantic HTML structure
- Meta tags and Open Graph
- Structured data (Schema.org)
- Sitemap and robots.txt
- Performance optimization
- Mobile-responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test accessibility compliance
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions, issues, or feature requests:
- Create an issue on GitHub
- Contact: support@accessscan.com
- Documentation: [Project Wiki](wiki)

## Roadmap

### Phase 1 (Current)
- ✅ HTML code analysis
- ✅ Local report storage
- ✅ PDF export
- ✅ Responsive design

### Phase 2 (Q1 2025)
- 🔄 URL scanning capability
- 🔄 Multi-page analysis
- 🔄 Scheduled monitoring
- 🔄 API integration

### Phase 3 (Future)
- 📋 Team collaboration features
- 📋 Advanced reporting
- 📋 Integration plugins
- 📋 Mobile app

## Acknowledgments

- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing engine
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
- [WebAIM](https://webaim.org/) - Accessibility resources

---

**Making the web accessible for everyone** 🌐♿