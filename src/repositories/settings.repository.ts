import { prisma } from '@/lib/prisma'
import type { UpdateSettingsInput } from '@/validations/settings.schema'
import type { StoreSettingsDTO } from '@/types'

function mapSettings(settings: {
  businessName: string
  whatsappNumber: string
  addresses: unknown
  facebookUrl: string | null
  instagramUrl: string | null
  logoUrl: string | null
  faviconUrl: string | null
}): StoreSettingsDTO {
  const addresses = Array.isArray(settings.addresses)
    ? (settings.addresses as { label: string; address: string }[])
    : []
  return {
    businessName: settings.businessName,
    whatsappNumber: settings.whatsappNumber,
    addresses,
    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
  }
}

export const settingsRepository = {
  async get(): Promise<StoreSettingsDTO | null> {
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } })
    if (!settings) return null
    return mapSettings(settings)
  },

  async upsert(data: UpdateSettingsInput): Promise<StoreSettingsDTO> {
    const settings = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {
        businessName: data.businessName,
        whatsappNumber: data.whatsappNumber,
        addresses: data.addresses,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        logoUrl: data.logoUrl || null,
        faviconUrl: data.faviconUrl || null,
      },
      create: {
        id: 'default',
        businessName: data.businessName,
        whatsappNumber: data.whatsappNumber,
        addresses: data.addresses,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        logoUrl: data.logoUrl || null,
        faviconUrl: data.faviconUrl || null,
      },
    })
    return mapSettings(settings)
  },
}
