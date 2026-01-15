module.exports = {

  source: 'build',
  
  "include": [
    "/",
    "/aboutus",
    "/service",
    "/blogs",
    "/privacypolicy",
    "/termscondition"
  ],
  
  skipThirdPartyRequests: true,
  
  userAgent: 'Mozilla/5.0 (compatible; react-snap)',
  
  waitFor: 2500,
  
  removeScriptTags: false,
  
  removeStyleTags: false,
  
  preloadImages: true,
  
  fixWebpackChunksIssue: true,
  
  puppeteerArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
  ],
  
  cacheAjaxRequests: false,
  
  skip: [
    '/api',
    '/404.html',
    '/offline.html',
  ],
  
  minifyHtml: {
    collapseWhitespace: false,
    removeComments: false,
  },
  
  async postProcess(page) {
    await page.waitForTimeout(1500);
    
    await page.evaluate(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    });
  },
};