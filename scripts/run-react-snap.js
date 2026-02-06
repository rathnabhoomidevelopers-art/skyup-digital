const { run } = require('react-snap');
const fs = require('fs');
const path = require('path');

// Possible Chrome/Chromium paths on Windows
const possiblePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env.CHROME_PATH,
  process.env.PUPPETEER_EXECUTABLE_PATH
].filter(Boolean);

// Find the first valid Chrome executable
let chromePath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    chromePath = p;
    break;
  }
}

if (!chromePath) {
  console.warn('⚠️  Chrome/Edge not found. Pre-rendering will be skipped.');
  console.warn('   Your site will still work, but initial page loads may be slower.');
  console.warn('   To fix this, install Chrome or set PUPPETEER_EXECUTABLE_PATH environment variable.');
  process.exit(0);
}

// Set the executable path for puppeteer-core
process.env.PUPPETEER_EXECUTABLE_PATH = chromePath;

async function runReactSnap() {
  try {
    console.log('🚀 Starting react-snap for pre-rendering...');
    console.log('📍 Using browser at:', chromePath);
    
    await run();
    
    console.log('✅ react-snap completed successfully!');
  } catch (error) {
    console.error('❌ react-snap failed:', error.message);
    console.warn('⚠️  Pre-rendering skipped. Build will continue without it.');
    console.warn('   Your site will still work, but initial page loads may be slower.');
    // Exit successfully to not break the build
    process.exit(0);
  }
}

runReactSnap();