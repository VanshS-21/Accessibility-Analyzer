// server.js

// Import necessary libraries
const express = require('express');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args)); // For fetching the web page content
// const axe = require('axe-core');   // COMMENT OUT or REMOVE this line - We will inject axe-core into JSDOM
const { JSDOM } = require('jsdom'); // For simulating the DOM
const fs = require('fs'); // Built-in Node.js module for file system operations
const path = require('path'); // Built-in Node.js module for handling file paths
const { createCanvas, Image } = require('canvas'); // For canvas support in JSDOM

// Note: You only need the 'pg' import if you are implementing the PostgreSQL database functionality (e.g., for user accounts or saving reports).
// If not using a database yet, you can comment out or remove this line for now.
// const pg = require('pg'); // For PostgreSQL database

// Create an Express application instance
const app = express();

// Define the port the server will run on
const PORT = process.env.PORT || 3000; // Use environment variable PORT or default to 3000

// Add middleware to parse JSON request bodies
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Accessibility Analyzer Backend is running!');
});

// API endpoint to analyze a URL
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body; // Get the URL from the request body

  // Basic validation - Check if the URL looks like a valid URL
  // This is a basic check, more robust validation might be needed later
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({ error: 'A valid URL is required in the request body.' });
  }

  console.log(`Received request to analyze URL: ${url}`); // Log the received URL

  let dom; // Declare dom variable outside try block

  try {
    // Fetch the HTML content of the URL
    const response = await fetch(url);

    // Check if the fetch was successful
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
      });
    }

    const html = await response.text(); // Get the HTML content as text

    // --- Use JSDOM to simulate a browser environment and inject axe-core ---

    // Step 1: Create JSDOM instance
    // runScripts: 'dangerously' allows scripts in the fetched HTML to run (needed for some axe-core checks)
    // resources: 'usable' allows JSDOM to fetch external resources like CSS (can improve accuracy)
    // url: Set the document URL for correct behavior relative to the fetched HTML
    dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: url });

    // Patch canvas support into the JSDOM window
    dom.window.HTMLCanvasElement.prototype.getContext = function() {
      return createCanvas(1, 1).getContext('2d');
    };
    dom.window.Image = Image;

    // Step 2: Inject axe-core into the JSDOM window
    // Find the path to the axe-core source file within node_modules
    // Use path.join to create platform-independent paths
    const axeCorePath = path.join(__dirname, 'node_modules', 'axe-core', 'axe.min.js');

    let axeCoreSource;
    try {
        // Read the axe-core source file
        axeCoreSource = fs.readFileSync(axeCorePath, 'utf8');
    } catch (readErr) {
        // If axe.min.js is not found, try axe.js (sometimes the name varies)
        const fallbackAxeCorePath = path.join(__dirname, 'node_modules', 'axe-core', 'axe.js');
         if (fs.existsSync(fallbackAxeCorePath)) {
             axeCoreSource = fs.readFileSync(fallbackAxeCorePath, 'utf8');
         } else {
             // Neither file found, throw a more specific error
             throw new Error('Could not find axe-core source file (axe.min.js or axe.js) in node_modules. Have you installed axe-core correctly?');
         }
    }

    // Execute the axe-core source code within the JSDOM window's global scope
    // This makes `axe` available as a global in the simulated JSDOM environment
    dom.window.eval(axeCoreSource);

    // Step 3: Run axe.run() within the JSDOM window's context
    // Use dom.window.eval to execute code within the simulated browser context
    // axe.run returns a Promise, so we need to await the result of the eval call
    // Pass an empty object or options to axe.run() if needed, here we just run with default options
    const results = await dom.window.eval('axe.run(document)');

    // Send the analysis results back to the frontend
    // The results object from axe.run() should be directly JSON serializable
    res.json(results);

  } catch (error) {
    console.error('Error during analysis:', error);
    // Include error message details in the response for easier debugging during development
    res.status(500).json({ error: 'An error occurred during the analysis.', details: error.message, stack: error.stack });
  } finally {
      // Clean up JSDOM resources if they were created
      if (dom) {
          dom.window.close();
      }
  }
});


// Start the server and listen on the defined port
// NOTE: This app.listen call should only appear ONCE in your file.
// If you have a duplicate from the initial setup code, remove the first one.
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});