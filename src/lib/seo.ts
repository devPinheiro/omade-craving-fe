export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image'
  canonical?: string
  noIndex?: boolean
  structuredData?: object
}

export interface AppSEOConfig {
  siteName: string
  siteUrl: string
  defaultImage: string
  defaultKeywords: string[]
  twitterHandle?: string
  locale: string
  type: string
}

export const appSEOConfig: AppSEOConfig = {
  siteName: 'Omade Cravings',
  siteUrl: 'https://omadecravings.com',
  defaultImage: 'https://res.cloudinary.com/appnet/image/upload/v1765399940/loaf_tcnxv5.png',
  defaultKeywords: [
    'artisan bread',
    'fresh baked goods',
    'bakery',
    'sourdough',
    'pastries',
    'organic ingredients',
    'handcrafted bread',
    'local bakery',
    'premium baking',
    'artisanal food'
  ],
  twitterHandle: '@omadecravings',
  locale: 'en_US',
  type: 'website'
}

export const defaultSEO: SEOConfig = {
  title: 'Omade Cravings - Artisanal Breads & Fresh Baked Goods',
  description: 'Experience the finest artisanal breads and fresh baked goods at Omade Cravings. We craft premium sourdough, pastries, and specialty items using organic ingredients and traditional techniques.',
  keywords: appSEOConfig.defaultKeywords,
  ogImage: appSEOConfig.defaultImage,
  ogType: 'website',
  twitterCard: 'summary_large_image'
}

export function generateSEO(seoConfig: Partial<SEOConfig> = {}): SEOConfig {
  return {
    ...defaultSEO,
    ...seoConfig,
    keywords: seoConfig.keywords ? [...defaultSEO.keywords!, ...seoConfig.keywords] : defaultSEO.keywords
  }
}

export function updateDocumentMeta(seo: SEOConfig): void {
  // Update document title
  document.title = seo.title

  // Helper function to update or create meta tags
  const updateMeta = (name: string, content: string, property = false) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
    let meta = document.querySelector(selector) as HTMLMetaElement
    
    if (!meta) {
      meta = document.createElement('meta')
      if (property) {
        meta.setAttribute('property', name)
      } else {
        meta.setAttribute('name', name)
      }
      document.head.appendChild(meta)
    }
    
    meta.content = content
  }

  // Update basic meta tags
  updateMeta('description', seo.description)
  if (seo.keywords?.length) {
    updateMeta('keywords', seo.keywords.join(', '))
  }

  // Open Graph meta tags
  updateMeta('og:site_name', appSEOConfig.siteName, true)
  updateMeta('og:title', seo.title, true)
  updateMeta('og:description', seo.description, true)
  updateMeta('og:type', seo.ogType || 'website', true)
  updateMeta('og:locale', appSEOConfig.locale, true)
  
  if (seo.ogImage) {
    updateMeta('og:image', seo.ogImage, true)
    updateMeta('og:image:alt', `${appSEOConfig.siteName} - ${seo.title}`, true)
  }

  if (seo.canonical) {
    updateMeta('og:url', seo.canonical, true)
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = seo.canonical
  }

  // Twitter Card meta tags
  updateMeta('twitter:card', seo.twitterCard || 'summary_large_image')
  updateMeta('twitter:title', seo.title)
  updateMeta('twitter:description', seo.description)
  
  if (appSEOConfig.twitterHandle) {
    updateMeta('twitter:site', appSEOConfig.twitterHandle)
    updateMeta('twitter:creator', appSEOConfig.twitterHandle)
  }
  
  if (seo.ogImage) {
    updateMeta('twitter:image', seo.ogImage)
    updateMeta('twitter:image:alt', `${appSEOConfig.siteName} - ${seo.title}`)
  }

  // Robots meta tag
  if (seo.noIndex) {
    updateMeta('robots', 'noindex, nofollow')
  } else {
    updateMeta('robots', 'index, follow')
  }

  // Additional SEO meta tags
  updateMeta('author', appSEOConfig.siteName)
  updateMeta('viewport', 'width=device-width, initial-scale=1.0')
  updateMeta('theme-color', '#8B5CF6') // Purple theme color
  
  // Structured Data
  if (seo.structuredData) {
    updateStructuredData(seo.structuredData)
  }
}

function updateStructuredData(data: object): void {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Add new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}

export function getBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": appSEOConfig.siteName,
    "description": defaultSEO.description,
    "url": appSEOConfig.siteUrl,
    "logo": appSEOConfig.defaultImage,
    "image": appSEOConfig.defaultImage,
    "servesCuisine": "Bakery",
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card",
    "currenciesAccepted": "USD",
    "openingHours": [
      "Mo-Fr 06:00-18:00",
      "Sa-Su 07:00-17:00"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Your City",
      "addressRegion": "Your State",
      "addressCountry": "US"
    },
    "telephone": "+1-XXX-XXX-XXXX",
    "email": "hello@omadecravings.com",
    "sameAs": [
      "https://facebook.com/omadecravings",
      "https://instagram.com/omadecravings",
      "https://twitter.com/omadecravings"
    ]
  }
}

export function getWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": appSEOConfig.siteName,
    "description": defaultSEO.description,
    "url": appSEOConfig.siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${appSEOConfig.siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": appSEOConfig.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": appSEOConfig.defaultImage,
        "width": 600,
        "height": 400
      }
    }
  }
}

export function getOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": appSEOConfig.siteName,
    "url": appSEOConfig.siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": appSEOConfig.defaultImage,
      "width": 600,
      "height": 400
    },
    "description": defaultSEO.description,
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-XXX-XXX-XXXX",
      "contactType": "customer service",
      "email": "hello@omadecravings.com",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://facebook.com/omadecravings",
      "https://instagram.com/omadecravings",
      "https://twitter.com/omadecravings"
    ]
  }
}

export function getBreadcrumbStructuredData(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

export function getFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}