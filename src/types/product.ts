export type ProductPublicDTO = {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  price: number
  featured: boolean
  category: {
    id: string
    name: string
    slug: string
  }
  primaryImage: { url: string } | null
  imagesCount: number
  createdAt: Date
}

export type ProductDetailDTO = {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  description: string | null
  price: number
  stock: number | null
  featured: boolean
  category: {
    id: string
    name: string
    slug: string
  }
  images: Array<{ id: string; url: string; order: number }>
  createdAt: Date
  updatedAt: Date
}

export type ProductAdminDTO = {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  description: string | null
  price: number
  stock: number | null
  featured: boolean
  active: boolean
  categoryId: string
  category: { id: string; name: string }
  images: Array<{ id: string; url: string; order: number }>
  createdAt: Date
  updatedAt: Date
}

export type ProductFormData = {
  name: string
  slug: string
  shortDescription?: string
  description?: string
  price: number
  stock?: number | null
  featured: boolean
  active: boolean
  categoryId: string
}

export type ProductListAdminDTO = {
  id: string
  name: string
  slug: string
  price: number
  featured: boolean
  active: boolean
  category: { name: string }
  primaryImage: { url: string } | null
  createdAt: Date
  updatedAt: Date
}
