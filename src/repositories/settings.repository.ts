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
  heroTitle: string | null
  heroSubtitle: string | null
  aboutText: string | null
  heroBgUrl: string | null
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
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    aboutText: settings.aboutText,
    heroBgUrl: settings.heroBgUrl,
  }
}

export const settingsRepository = {
  async getByDomain(domain: string): Promise<StoreSettingsDTO | null> {
    const settings = await prisma.storeSettings.findFirst({
      where: {
        tenant: {
          subdomain: domain
        }
      }
    })
    if (!settings) return null
    return mapSettings(settings)
  },

  async upsert(data: UpdateSettingsInput, domain: string): Promise<StoreSettingsDTO> {
    const tenant = await prisma.tenant.findUnique({ where: { subdomain: domain } })
    if (!tenant) throw new Error('Tenant not found')

    const settings = await prisma.storeSettings.upsert({
      where: { tenantId: tenant.id },
      update: {
        businessName: data.businessName,
        whatsappNumber: data.whatsappNumber,
        addresses: data.addresses,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        logoUrl: data.logoUrl || null,
        faviconUrl: data.faviconUrl || null,
        heroTitle: data.heroTitle || null,
        heroSubtitle: data.heroSubtitle || null,
        aboutText: data.aboutText || null,
        heroBgUrl: data.heroBgUrl || null,
      },
      create: {
        businessName: data.businessName,
        whatsappNumber: data.whatsappNumber,
        addresses: data.addresses,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        logoUrl: data.logoUrl || null,
        faviconUrl: data.faviconUrl || null,
        heroTitle: data.heroTitle || null,
        heroSubtitle: data.heroSubtitle || null,
        aboutText: data.aboutText || null,
        heroBgUrl: data.heroBgUrl || null,
        tenantId: tenant.id
      },
    })
    return mapSettings(settings)
  },
}
