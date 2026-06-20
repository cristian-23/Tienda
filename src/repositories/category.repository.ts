import { prisma } from '@/lib/prisma'
import type { Category } from '@prisma/client'

export const categoryRepository = {
  async findAll(domain: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: { tenant: { subdomain: domain } },
      orderBy: { name: 'asc' },
    })
  },

  async findAllActive(domain: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: { active: true, tenant: { subdomain: domain } },
      orderBy: { name: 'asc' },
    })
  },

  async findById(id: string, domain: string): Promise<Category | null> {
    return prisma.category.findFirst({ 
      where: { id, tenant: { subdomain: domain } } 
    })
  },

  async findBySlug(slug: string, domain: string): Promise<Category | null> {
    return prisma.category.findFirst({ 
      where: { slug, tenant: { subdomain: domain } } 
    })
  },

  async create(data: { name: string; slug: string; description?: string; active?: boolean }, domain: string): Promise<Category> {
    const tenant = await prisma.tenant.findUnique({ where: { subdomain: domain } })
    if (!tenant) throw new Error('Tenant not found')
    
    return prisma.category.create({ 
      data: {
        ...data,
        tenantId: tenant.id
      }
    })
  },

  async update(id: string, data: Partial<{ name: string; slug: string; description: string; active: boolean }>, domain: string): Promise<Category> {
    // Verify it belongs to tenant
    const existing = await this.findById(id, domain)
    if (!existing) throw new Error('Category not found')

    return prisma.category.update({ where: { id }, data })
  },

  async delete(id: string, domain: string): Promise<void> {
    const existing = await this.findById(id, domain)
    if (!existing) throw new Error('Category not found')

    await prisma.category.delete({ where: { id } })
  },

  async count(domain: string): Promise<number> {
    return prisma.category.count({ where: { tenant: { subdomain: domain } } })
  },

  async existsBySlug(slug: string, domain: string, excludeId?: string): Promise<boolean> {
    const where: any = { slug, tenant: { subdomain: domain } }
    if (excludeId) {
      where.NOT = { id: excludeId }
    }
    const count = await prisma.category.count({ where })
    return count > 0
  },

  async countProducts(categoryId: string, domain: string): Promise<number> {
    return prisma.product.count({ 
      where: { categoryId, active: true, tenant: { subdomain: domain } } 
    })
  },

  async findAllWithProductCount(domain: string, onlyActive = false): Promise<
    Array<Category & { _count: { products: number } }>
  > {
    const where: any = { tenant: { subdomain: domain } }
    if (onlyActive) {
      where.active = true
    }
    return prisma.category.findMany({
      where,
      include: { _count: { select: { products: { where: { active: true } } } } },
      orderBy: { name: 'asc' },
    })
  },
}
