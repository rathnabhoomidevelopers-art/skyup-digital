// scripts/puppeteer-exec-path.js
const chromium = require("@sparticuz/chromium");

(async () => {
  const execPath = await chromium.executablePath();

  if (!execPath) {
    console.error("Chromium executablePath not found");
    process.exit(1);
  }

  process.stdout.write(execPath);
})();
