import { generateSEO, updateDocumentMeta } from '@/lib/seo'
import type { SEOConfig } from '@/lib/seo'
import { useEffect } from 'react'

export function useSEO(seoConfig: Partial<SEOConfig> = {}) {
  useEffect(() => {
    const seo = generateSEO(seoConfig)
    updateDocumentMeta(seo)
  }, [seoConfig])
}
