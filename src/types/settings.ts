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
}
