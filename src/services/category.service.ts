import { categoryRepository } from '@/repositories/category.repository'
import { slugify } from '@/lib/utils'
import { NotFoundError, ConflictError } from '@/lib/errors'
import type { CreateCategoryInput, UpdateCategoryInput } from '@/validations/category.schema'
import type { CategoryAdminDTO, CategoryPublicDTO } from '@/types'

async function generateUniqueSlug(name: string, domain: string, excludeId?: string): Promise<string> {
  let slug = slugify(name)
  let counter = 1

  while (await categoryRepository.existsBySlug(slug, domain, excludeId)) {
    slug = `${slugify(name)}-${counter}`
    counter++
  }

  return slug
}

export const categoryService = {
  async getPublicCategories(domain: string): Promise<CategoryPublicDTO[]> {
    const categories = await categoryRepository.findAllWithProductCount(domain, true)
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      productCount: c._count.products,
    }))
  },

  async getAdminCategories(domain: string): Promise<CategoryAdminDTO[]> {
    const categories = await categoryRepository.findAllWithProductCount(domain, false)
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      active: c.active,
      productCount: c._count.products,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))
  },

  async getById(id: string, domain: string): Promise<CategoryAdminDTO> {
    const category = await categoryRepository.findById(id, domain)
    if (!category) throw new NotFoundError('Categoría')

    const productCount = await categoryRepository.countProducts(id, domain)
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      active: category.active,
      productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  },

  async create(input: CreateCategoryInput, domain: string) {
    const slug = input.slug || (await generateUniqueSlug(input.name, domain))
    const exists = await categoryRepository.existsBySlug(slug, domain)
    if (exists) throw new ConflictError('El slug ya está en uso')

    return categoryRepository.create({
      name: input.name,
      slug,
      description: input.description || undefined,
      active: input.active,
    }, domain)
  },

  async update(id: string, input: UpdateCategoryInput, domain: string) {
    const existing = await categoryRepository.findById(id, domain)
    if (!existing) throw new NotFoundError('Categoría')

    const slug = input.slug || (await generateUniqueSlug(input.name ?? existing.name, domain, id))
    if (slug !== existing.slug) {
      const exists = await categoryRepository.existsBySlug(slug, domain, id)
      if (exists) throw new ConflictError('El slug ya está en uso')
    }

    return categoryRepository.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      slug,
      ...(input.description !== undefined && { description: input.description }),
      ...(input.active !== undefined && { active: input.active }),
    }, domain)
  },

  async delete(id: string, domain: string): Promise<void> {
    const existing = await categoryRepository.findById(id, domain)
    if (!existing) throw new NotFoundError('Categoría')

    const productCount = await categoryRepository.countProducts(id, domain)
    if (productCount > 0) {
      throw new ConflictError('No se puede eliminar una categoría con productos asociados')
    }

    await categoryRepository.delete(id, domain)
  },
}
