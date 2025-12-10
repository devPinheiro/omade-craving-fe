import { useEffect } from 'react'
import { updateDocumentMeta, generateSEO } from '@/lib/seo'
import type { SEOConfig } from '@/lib/seo'

interface SEOHeadProps {
  seoConfig?: Partial<SEOConfig>
}

export function SEOHead({ seoConfig = {} }: SEOHeadProps) {
  useEffect(() => {
    const seo = generateSEO(seoConfig)
    updateDocumentMeta(seo)
  }, [seoConfig])

  return null // This component doesn't render anything visible
}

export default SEOHead