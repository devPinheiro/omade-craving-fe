import { appSEOConfig } from './seo'

export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export function generateSitemap(urls: SitemapUrl[]): string {
  const urlElements = urls.map(url => {
    return `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `
    <priority>${url.priority}</priority>` : ''}
  </url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`
}

export function getStaticSitemapUrls(): SitemapUrl[] {
  const now = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  
  return [
    {
      loc: appSEOConfig.siteUrl,
      lastmod: now,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: `${appSEOConfig.siteUrl}/auth/login`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.3
    }
  ]
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Main sitemap
Sitemap: ${appSEOConfig.siteUrl}/sitemap.xml

# Disallow auth pages and admin areas
Disallow: /auth/
Disallow: /dashboard
Disallow: /_authenticated/
Disallow: /_unauthenticated/

# Allow specific pages
Allow: /

# Crawl delay (optional - adjust based on server capacity)
Crawl-delay: 1`
}