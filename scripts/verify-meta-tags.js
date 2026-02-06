const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');

// Pages to check
const pages = [
  'index.html',
  'aboutus/index.html',
  'service/index.html',
  'blogs/index.html',
  'contactus/index.html'
];

console.log('🔍 Verifying meta tags in pre-rendered HTML...\n');

let allValid = true;

pages.forEach(page => {
  const filePath = path.join(buildDir, page);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${page} - File not found`);
    allValid = false;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  
  // Check for essential meta tags
  const checks = {
    'Title tag': /<title>.*<\/title>/.test(html),
    'Meta description': /<meta name="description"/.test(html),
    'Canonical URL': /<link rel="canonical"/.test(html),
    'OG Title': /<meta property="og:title"/.test(html),
    'OG Description': /<meta property="og:description"/.test(html),
    'OG Image': /<meta property="og:image"/.test(html),
  };

  console.log(`📄 ${page}`);
  
  let pageValid = true;
  Object.entries(checks).forEach(([name, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`   ${status} ${name}`);
    if (!passed) {
      pageValid = false;
      allValid = false;
    }
  });
  
  // Extract and show title
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  if (titleMatch) {
    console.log(`   📝 Title: "${titleMatch[1]}"`);
  }
  
  console.log('');
});

if (allValid) {
  console.log('✅ All pages have valid meta tags!\n');
  process.exit(0);
} else {
  console.log('❌ Some pages are missing meta tags\n');
  process.exit(1);
}