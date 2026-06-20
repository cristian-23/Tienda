export type StoreAddress = {
  label: string
  address: string
}

export type StoreSettingsDTO = {
  businessName: string
  whatsappNumber: string
  addresses: StoreAddress[]
  facebookUrl: string | null
  instagramUrl: string | null
  logoUrl: string | null
  faviconUrl: string | null
  heroTitle: string | null
  heroSubtitle: string | null
  aboutText: string | null
  heroBgUrl: string | null
}
