export type CategoryPublicDTO = {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
}

export type CategoryAdminDTO = {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  productCount: number
  createdAt: Date
  updatedAt: Date
}

export type CategoryFormData = {
  name: string
  slug: string
  description?: string
  active: boolean
}
