import type { MetadataRoute } from 'next'
import { settingsService } from '@/services/settings.service'
import { getDomainFromHeaders } from '@/lib/server-utils'

export const dynamic = 'force-dynamic'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let businessName = 'Colchones & Descanso'
  let faviconUrl = '/default-favicon.ico'

  try {
    const domain = await getDomainFromHeaders()
    const settings = await settingsService.get(domain)
    if (settings) {
      if (settings.businessName) {
        businessName = settings.businessName
      }
      if (settings.faviconUrl) {
        faviconUrl = settings.faviconUrl
      }
    }
  } catch (error) {
    console.error('Error generating dynamic manifest, falling back to default:', error)
  }

  return {
    name: businessName,
    short_name: businessName,
    description: `Catálogo de productos y ofertas de ${businessName}. Muebles, colchones y descanso.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#c4a265',
    icons: [
      {
        src: faviconUrl,
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: faviconUrl,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: faviconUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
