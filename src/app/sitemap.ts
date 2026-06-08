import type { MetadataRoute } from 'next'

import { SITE_URL, LANGUAGES } from '@data/contract'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/agents', '/languages', '/build'].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  const languageRoutes = LANGUAGES.map((l) => ({
    url: `${SITE_URL}/languages/${l.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...languageRoutes]
}
