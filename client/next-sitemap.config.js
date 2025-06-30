/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://pogspatna.org',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin/*',
    '/api/*',
    '/_next/*',
    '/private/*',
    '/server-sitemap-index.xml'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/private/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/private/']
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/private/']
      }
    ],
    additionalSitemaps: [
      'https://pogspatna.org/server-sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      loc: path,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }

    // Homepage
    if (path === '/') {
      return {
        ...customConfig,
        priority: 1.0,
        changefreq: 'weekly',
      }
    }

    // High priority pages
    if (path.includes('/membership') || path.includes('/events') || path.includes('/about')) {
      return {
        ...customConfig,
        priority: 0.9,
        changefreq: path.includes('/events') ? 'weekly' : 'monthly',
      }
    }

    // Member and office bearers pages
    if (path.includes('/members') || path.includes('/office-bearers')) {
      return {
        ...customConfig,
        priority: 0.8,
        changefreq: path.includes('/office-bearers') ? 'yearly' : 'monthly',
      }
    }

    // Contact page
    if (path.includes('/contact')) {
      return {
        ...customConfig,
        priority: 0.8,
        changefreq: 'monthly',
      }
    }

    // Gallery and newsletters
    if (path.includes('/gallery') || path.includes('/newsletters')) {
      return {
        ...customConfig,
        priority: path.includes('/newsletters') ? 0.7 : 0.6,
        changefreq: 'monthly',
      }
    }

    return customConfig
  },
} 