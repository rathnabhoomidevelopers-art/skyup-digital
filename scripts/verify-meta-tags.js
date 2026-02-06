const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying meta tags in build/index.html...\n');

const indexPath = path.join(__dirname, '../build/index.html');

if (!fs.existsSync(indexPath)) {
  console.log('❌ build/index.html not found');
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf-8');

const checks = {
  'Title tag': /<title>.*?<\/title>/,
  'Meta description': /<meta\s+name="description"/,
  'Canonical URL': /<link\s+rel="canonical"/,
  'OG Title': /<meta\s+property="og:title"/,
  'OG Description': /<meta\s+property="og:description"/,
  'OG Image': /<meta\s+property="og:image"/
};

let allPassed = true;

console.log('📄 index.html');
Object.entries(checks).forEach(([name, regex]) => {
  if (regex.test(html)) {
    console.log(`   ✅ ${name}`);
  } else {
    console.log(`   ❌ ${name}`);
    allPassed = false;
  }
});

// Extract and display title
const titleMatch = html.match(/<title>(.*?)<\/title>/);
if (titleMatch) {
  console.log(`   📝 Title: "${titleMatch[1]}"`);
}

console.log('');

if (allPassed) {
  console.log('✅ All meta tags verified successfully!');
  process.exit(0);
} else {
  console.log('❌ Some meta tags are missing');
  process.exit(1);
}