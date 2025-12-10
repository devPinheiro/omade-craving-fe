# SEO Implementation Guide

This document outlines the SEO implementation for Omade Cravings, including setup, usage, and best practices.

## Overview

The SEO implementation includes:
- Dynamic meta tag management
- Open Graph and Twitter Card support
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt configuration

## File Structure

```
src/
├── lib/
│   ├── seo.ts          # Core SEO utilities and configuration
│   └── sitemap.ts      # Sitemap generation utilities
├── hooks/
│   └── useSEO.ts       # React hook for SEO management
└── components/
    └── ui/
        └── SEOHead.tsx # Reusable SEO component
```

## Configuration

### App-wide SEO Config (`src/lib/seo.ts`)

```typescript
export const appSEOConfig: AppSEOConfig = {
  siteName: 'Omade Cravings',
  siteUrl: 'https://omadecravings.com', // Update with your domain
  defaultImage: 'https://res.cloudinary.com/appnet/image/upload/v1765399940/loaf_tcnxv5.png',
  defaultKeywords: [...], // Bakery-specific keywords
  twitterHandle: '@omadecravings', // Update with real handle
  locale: 'en_US',
  type: 'website'
}
```

### Default SEO Settings

```typescript
export const defaultSEO: SEOConfig = {
  title: 'Omade Cravings - Artisanal Breads & Fresh Baked Goods',
  description: 'Experience the finest artisanal breads and fresh baked goods...',
  keywords: appSEOConfig.defaultKeywords,
  ogImage: appSEOConfig.defaultImage,
  ogType: 'website',
  twitterCard: 'summary_large_image'
}
```

## Usage

### Using the useSEO Hook

The simplest way to add SEO to a component:

```tsx
import { useSEO } from '@/hooks/useSEO'

function MyComponent() {
  useSEO({
    title: 'Page Title - Omade Cravings',
    description: 'Page description...',
    keywords: ['additional', 'page-specific', 'keywords'],
    structuredData: getBusinessStructuredData()
  })

  return <div>Your content</div>
}
```

### Using the SEOHead Component

For more explicit control:

```tsx
import SEOHead from '@/components/ui/SEOHead'

function MyComponent() {
  return (
    <>
      <SEOHead seoConfig={{
        title: 'Page Title - Omade Cravings',
        description: 'Page description...'
      }} />
      <div>Your content</div>
    </>
  )
}
```

### Manual Meta Management

For advanced use cases:

```tsx
import { generateSEO, updateDocumentMeta } from '@/lib/seo'

// Generate SEO config
const seo = generateSEO({
  title: 'Custom Title',
  description: 'Custom description'
})

// Update document
updateDocumentMeta(seo)
```

## Structured Data

### Available Schema Types

1. **Business/Bakery Schema** (`getBusinessStructuredData()`)
   - Best for: Homepage, about page
   - Includes: Business info, hours, contact details

2. **Website Schema** (`getWebsiteStructuredData()`)
   - Best for: Homepage
   - Includes: Site search capability

3. **Organization Schema** (`getOrganizationStructuredData()`)
   - Best for: About page, contact page
   - Includes: Company information

4. **Breadcrumb Schema** (`getBreadcrumbStructuredData()`)
   - Best for: Navigation-heavy pages
   - Usage: `getBreadcrumbStructuredData([{name: 'Home', url: '/'}, {name: 'Products', url: '/products'}])`

5. **FAQ Schema** (`getFAQStructuredData()`)
   - Best for: FAQ pages, help sections
   - Usage: `getFAQStructuredData([{question: 'Q?', answer: 'A.'}])`

## SEO Best Practices

### Title Tags
- Keep under 60 characters
- Include brand name
- Use descriptive, keyword-rich titles
- Format: `Page Title - Omade Cravings`

### Meta Descriptions
- Keep between 150-160 characters
- Include primary keywords naturally
- Make them compelling and actionable
- Avoid duplicates across pages

### Keywords
- Focus on bakery-related terms
- Include location-based keywords
- Use long-tail keywords
- Don't keyword stuff

### Images
- Use descriptive alt text
- Optimize file sizes
- Use appropriate image dimensions for OG images (1200x630px)

### URLs
- Use clean, descriptive URLs
- Include relevant keywords
- Avoid special characters
- Keep URLs short and readable

## Page-Specific SEO

### Homepage
```tsx
useSEO({
  title: 'Omade Cravings - Artisanal Breads & Fresh Baked Goods',
  description: 'Main site description...',
  structuredData: getBusinessStructuredData()
})
```

### Product Pages
```tsx
useSEO({
  title: `${productName} - Premium Artisanal Bread | Omade Cravings`,
  description: `Fresh ${productName} made with organic ingredients...`,
  keywords: [productName, 'artisan bread', 'fresh baked'],
  ogImage: productImage
})
```

### Private Pages (Login, Dashboard)
```tsx
useSEO({
  title: 'Dashboard - Omade Cravings',
  description: 'Private dashboard...',
  noIndex: true // Don't index private pages
})
```

## Technical Implementation

### Meta Tag Updates
The `updateDocumentMeta()` function dynamically updates:
- Document title
- Meta descriptions
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Robots directives
- Structured data

### Performance
- Meta tags are updated on component mount/update
- Structured data is injected as JSON-LD scripts
- Previous structured data is cleaned up automatically

## Sitemap & Robots

### Robots.txt
Located at `public/robots.txt`:
- Allows all crawlers
- Disallows private pages (/auth/, /dashboard)
- References sitemap location

### Sitemap Generation
Use `src/lib/sitemap.ts` to generate XML sitemaps:

```typescript
const urls = getStaticSitemapUrls()
const sitemap = generateSitemap(urls)
```

## Monitoring & Testing

### Tools for Testing
1. **Google Search Console** - Monitor search performance
2. **Facebook Sharing Debugger** - Test OG tags
3. **Twitter Card Validator** - Test Twitter cards
4. **Schema.org Validator** - Test structured data
5. **Google Rich Results Test** - Test rich snippets

### Regular Checks
- Monitor Core Web Vitals
- Check for crawl errors
- Validate structured data
- Test social media previews
- Review search rankings

## Future Improvements

1. **Dynamic Sitemap Generation** - Generate sitemaps from routes
2. **Image SEO** - Add image optimization and alt text management
3. **Local SEO** - Add location-based optimization
4. **Multilingual SEO** - Add support for multiple languages
5. **Rich Snippets** - Add more schema types (products, reviews, etc.)

## Troubleshooting

### Common Issues

1. **Meta tags not updating**
   - Check if useSEO hook is called
   - Verify seoConfig is not undefined
   - Check for JavaScript errors

2. **Structured data not appearing**
   - Validate JSON-LD syntax
   - Check if script tag is being created
   - Use browser dev tools to inspect

3. **OG images not showing**
   - Verify image URLs are accessible
   - Check image dimensions (recommended: 1200x630)
   - Clear social media cache

4. **Search console errors**
   - Check robots.txt syntax
   - Verify sitemap XML format
   - Ensure canonical URLs are correct