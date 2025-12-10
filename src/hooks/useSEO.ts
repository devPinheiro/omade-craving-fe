import { useEffect } from 'react'
import { updateDocumentMeta, generateSEO } from '@/lib/seo'
import type { SEOConfig } from '@/lib/seo'

export function useSEO(seoConfig: Partial<SEOConfig> = {}) {
  useEffect(() => {
    const seo = generateSEO(seoConfig)
    updateDocumentMeta(seo)
  }, [seoConfig])
}