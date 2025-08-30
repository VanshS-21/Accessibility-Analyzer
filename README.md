# AccessiScan - Web Accessibility Analyzer

A professional client-side web accessibility analyzer that helps developers identify and fix accessibility issues in HTML content and live websites. Built with industry-standard axe-core library for WCAG 2.1 Level AA compliance checking.

## Features

- **Dual Analysis Modes**: Analyze HTML code directly or scan live websites
- **WCAG 2.1 Compliance**: Comprehensive accessibility testing with axe-core
- **Professional UI**: Clean, responsive design with dark/light theme support
- **Real-time Results**: Instant feedback with detailed violation reports
- **Export Functionality**: Download detailed accessibility reports
- **Mobile Responsive**: Optimized for all device sizes
- **Screen Reader Friendly**: Built with accessibility best practices

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Styling**: Tailwind CSS for responsive design
- **Testing Engine**: axe-core v4.7.2 for accessibility analysis
- **Architecture**: Client-side only, no backend required

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Choose your analysis method:
   - **HTML Analysis**: Paste HTML code for direct testing
   - **URL Analysis**: Enter a website URL to scan (CORS limitations apply)

## Usage

### HTML Code Analysis
1. Navigate to the HTML Analysis page
2. Paste your HTML code in the textarea
3. Click "Analyze HTML" to run accessibility tests
4. Review detailed results with violation descriptions and fix suggestions

### Website URL Analysis
1. Navigate to the URL Analysis page
2. Enter the website URL you want to test
3. Click "Analyze Website" to scan the live site
4. View comprehensive accessibility report

## Project Structure

```
AccessiScan/
├── index.html          # Home page
├── analyze-html.html   # HTML code analysis page
├── analyze-url.html    # Website URL analysis page
├── results.html        # Results display page
├── css/
│   └── styles.css      # Custom styles and animations
├── js/
│   └── app.js          # Main application logic
└── README.md           # Project documentation
```

## Accessibility Features

- Semantic HTML structure with proper heading hierarchy
- ARIA labels and live regions for screen readers
- High contrast mode support
- Keyboard navigation with focus indicators
- Skip links for efficient navigation
- Error handling with user-friendly messages

## Browser Compatibility

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Limitations

- URL analysis is subject to CORS (Cross-Origin Resource Sharing) policies
- Some websites may block cross-origin requests
- Local file analysis works best for HTML code testing

## Contributing

This project is designed as a professional demonstration of web accessibility tools. Feel free to fork and enhance the functionality.

## License

Open source - feel free to use and modify for your projects.

## Acknowledgments

- Built with [axe-core](https://github.com/dequelabs/axe-core) by Deque Systems
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Follows [WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/) accessibility guidelines