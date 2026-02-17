const fs = require('fs');
const path = require('path');

// ─── SERVICE SLUGS ───────────────────────────────────────────────────────────
const servicesSlugs = [
  'seo-company-in-bangalore',
  'email-marketing-company-in-bangalore',
  'creative-graphic-design',
  'branding-agency-in-bangalore',
  'ui-ux-design-company-in-bangalore',
  'social-media-marketing',
  'website-development-company-in-bangalore',
  'ai-company-in-bangalore',
  'ppc-company-in-bangalore',
];

// ─── BLOG SLUGS ──────────────────────────────────────────────────────────────
const blogSlugs = [
  'digital-marketing-vs-traditional-marketing',
  // Add new blog slugs here
];

const baseUrl = 'https://www.skyupdigitalsolutions.com';
const today = new Date().toISOString().split('T')[0];

// ─── STATIC PAGES ────────────────────────────────────────────────────────────
const staticPages = [
  { url: '',                priority: '1.0', changefreq: 'daily'   },
  { url: '/aboutus',        priority: '0.8', changefreq: 'monthly' },
  { url: '/service',        priority: '0.8', changefreq: 'weekly'  },
  { url: '/blogs',          priority: '0.7', changefreq: 'daily'   },
  { url: '/contactus',      priority: '0.9', changefreq: 'monthly' },
  { url: '/careers',        priority: '0.9', changefreq: 'monthly' },
  { url: '/privacypolicy',  priority: '0.3', changefreq: 'yearly'  },
  { url: '/termscondition', priority: '0.3', changefreq: 'yearly'  },
];

const servicePages = servicesSlugs.map(slug => ({
  url: `/services/${slug}`,
  priority: '0.8',
  changefreq: 'weekly',
}));

const blogPages = blogSlugs.map(slug => ({
  url: `/blog/${slug}`,
  priority: '0.6',
  changefreq: 'monthly',
}));

const allPages = [...staticPages, ...servicePages, ...blogPages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
console.log('✅ Sitemap generated successfully!');