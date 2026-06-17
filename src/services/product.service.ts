import { productRepository } from '@/repositories/product.repository'
import { slugify } from '@/lib/utils'
import { NotFoundError, ConflictError } from '@/lib/errors'
import type { CreateProductInput, UpdateProductInput } from '@/validations/product.schema'
import type { ProductFilters, PaginationParams, ProductPublicDTO, ProductDetailDTO, ProductAdminDTO } from '@/types'

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  let slug = slugify(name)
  let counter = 1

  while (await productRepository.existsBySlug(slug, excludeId)) {
    slug = `${slugify(name)}-${counter}`
    counter++
  }

  return slug
}

export const productService = {
  async getFeatured(limit = 8): Promise<ProductPublicDTO[]> {
    return productRepository.findFeatured(limit)
  },

  async getWithFilters(
    filters: ProductFilters,
    pagination: PaginationParams
  ) {
    return productRepository.findWithFilters(filters, pagination)
  },

  async getBySlug(slug: string): Promise<ProductDetailDTO | null> {
    return productRepository.findBySlug(slug)
  },

  async getById(id: string): Promise<ProductAdminDTO | null> {
    return productRepository.findById(id)
  },

  async getAdminList(pagination: PaginationParams) {
    return productRepository.findAdminList(pagination)
  },

  async create(input: CreateProductInput) {
    const slug = input.slug || (await generateUniqueSlug(input.name))
    const exists = await productRepository.existsBySlug(slug)
    if (exists) throw new ConflictError('El slug ya está en uso')

    const product = await productRepository.create({
      name: input.name,
      slug,
      shortDescription: input.shortDescription || undefined,
      description: input.description || undefined,
      price: input.price,
      stock: input.stock ?? undefined,
      featured: input.featured,
      active: input.active,
      category: { connect: { id: input.categoryId } },
    })

    return product
  },

  async update(id: string, input: UpdateProductInput) {
    const existing = await productRepository.findById(id)
    if (!existing) throw new NotFoundError('Producto')

    const slug = input.slug || (await generateUniqueSlug(input.name ?? existing.name, id))
    if (slug !== existing.slug) {
      const exists = await productRepository.existsBySlug(slug, id)
      if (exists) throw new ConflictError('El slug ya está en uso')
    }

    const updateData: Record<string, unknown> = {}
    if (input.name !== undefined) updateData.name = input.name
    updateData.slug = slug
    if (input.shortDescription !== undefined) updateData.shortDescription = input.shortDescription
    if (input.description !== undefined) updateData.description = input.description
    if (input.price !== undefined) updateData.price = input.price
    if (input.stock !== undefined) updateData.stock = input.stock
    if (input.featured !== undefined) updateData.featured = input.featured
    if (input.active !== undefined) updateData.active = input.active
    if (input.categoryId !== undefined) {
      updateData.category = { connect: { id: input.categoryId } }
    }

    return productRepository.update(id, updateData)
  },

  async delete(id: string): Promise<void> {
    const existing = await productRepository.findById(id)
    if (!existing) throw new NotFoundError('Producto')

    await productRepository.delete(id)
  },
}
