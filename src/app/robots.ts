import type { MetadataRoute } from 'next'
import { getConfig } from '@/lib/services/ConfigService'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getConfig('FRONTEND_URL', 'https://chouhanrugs.com')
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
