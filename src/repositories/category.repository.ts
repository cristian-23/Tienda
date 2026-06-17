import { prisma } from '@/lib/prisma'
import type { Category } from '@prisma/client'

export const categoryRepository = {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
  },

  async findAllActive(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    })
  },

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } })
  },

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { slug } })
  },

  async create(data: { name: string; slug: string; description?: string; active?: boolean }): Promise<Category> {
    return prisma.category.create({ data })
  },

  async update(id: string, data: Partial<{ name: string; slug: string; description: string; active: boolean }>): Promise<Category> {
    return prisma.category.update({ where: { id }, data })
  },

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } })
  },

  async count(): Promise<number> {
    return prisma.category.count()
  },

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const where = excludeId ? { slug, NOT: { id: excludeId } } : { slug }
    const count = await prisma.category.count({ where })
    return count > 0
  },

  async countProducts(categoryId: string): Promise<number> {
    return prisma.product.count({ where: { categoryId, active: true } })
  },

  async findAllWithProductCount(onlyActive = false): Promise<
    Array<Category & { _count: { products: number } }>
  > {
    const where = onlyActive ? { active: true } : {}
    return prisma.category.findMany({
      where,
      include: { _count: { select: { products: { where: { active: true } } } } },
      orderBy: { name: 'asc' },
    })
  },
}
