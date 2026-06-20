import { productRepository } from '@/repositories/product.repository'
import { slugify } from '@/lib/utils'
import { NotFoundError, ConflictError } from '@/lib/errors'
import type { ProductFormData } from '@/types'
import type { ProductFilters, PaginationParams } from '@/types'

async function generateUniqueSlug(name: string, domain: string, excludeId?: string): Promise<string> {
  let slug = slugify(name)
  let counter = 1

  while (await productRepository.existsBySlug(slug, domain, excludeId)) {
    slug = `${slugify(name)}-${counter}`
    counter++
  }

  return slug
}

export const productService = {
  async getFeatured(limit = 8, domain: string) {
    return productRepository.findFeatured(limit, domain)
  },

  async getWithFilters(filters: ProductFilters, pagination: PaginationParams, domain: string) {
    return productRepository.findWithFilters(filters, pagination, domain)
  },

  async getBySlug(slug: string, domain: string) {
    const product = await productRepository.findBySlug(slug, domain)
    if (!product) throw new NotFoundError('Producto')
    return product
  },

  async getById(id: string, domain: string) {
    const product = await productRepository.findById(id, domain)
    if (!product) throw new NotFoundError('Producto')
    return product
  },

  async getAdminList(pagination: PaginationParams, domain: string) {
    return productRepository.findAdminList(pagination, domain)
  },

  async create(data: ProductFormData, domain: string) {
    const slug = await generateUniqueSlug(data.name, domain)

    return productRepository.create({
      name: data.name,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      stock: data.stock,
      featured: data.featured,
      active: data.active,
      categoryId: data.categoryId,
      images: {
        create: data.images?.map((img, index) => ({
          url: img.url,
          order: index,
        })) || [],
      },
    }, domain)
  },

  async update(id: string, data: ProductFormData, domain: string) {
    const existing = await productRepository.findById(id, domain)
    if (!existing) throw new NotFoundError('Producto')

    let slug = existing.slug
    if (data.name !== existing.name) {
      slug = await generateUniqueSlug(data.name, domain, id)
    }

    return productRepository.update(id, {
      name: data.name,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      stock: data.stock,
      featured: data.featured,
      active: data.active,
      categoryId: data.categoryId,
      ...(data.images && {
        images: {
          deleteMany: {},
          create: data.images.map((img, index) => ({
            url: img.url,
            order: index,
          })),
        },
      }),
    }, domain)
  },

  async delete(id: string, domain: string): Promise<void> {
    const existing = await productRepository.findById(id, domain)
    if (!existing) throw new NotFoundError('Producto')

    await productRepository.delete(id, domain)
  },
}
