import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { ProductFilters, PaginationParams, PaginationResult } from '@/types'

export const productRepository = {
  async findFeatured(limit = 8) {
    const products = await prisma.product.findMany({
      where: { active: true, featured: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
        _count: { select: { images: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return products.map(mapToPublicDTO)
  },

  async findWithFilters(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<{ products: ReturnType<typeof mapToPublicDTO>[]; pagination: PaginationResult }> {
    const where: Prisma.ProductWhereInput = { active: true }

    if (filters.categorySlug) {
      where.category = { slug: filters.categorySlug }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { shortDescription: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {}
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {}
    if (filters.sortBy === 'price') {
      orderBy.price = filters.sortDirection ?? 'asc'
    } else if (filters.sortBy === 'name') {
      orderBy.name = filters.sortDirection ?? 'asc'
    } else {
      orderBy.createdAt = filters.sortDirection ?? 'desc'
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
          _count: { select: { images: true } },
        },
        orderBy,
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
      }),
    ])

    return {
      products: products.map(mapToPublicDTO),
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total,
        totalPages: Math.ceil(total / pagination.pageSize),
      },
    }
  },

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug, active: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' }, select: { id: true, url: true, order: true } },
      },
    })

    if (!product) return null

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      featured: product.featured,
      category: product.category,
      images: product.images,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  },

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        images: { orderBy: { order: 'asc' }, select: { id: true, url: true, order: true } },
      },
    })

    if (!product) return null

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      featured: product.featured,
      active: product.active,
      categoryId: product.categoryId,
      category: product.category,
      images: product.images,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  },

  async findAdminList(pagination: PaginationParams) {
    const [total, products] = await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({
        include: {
          category: { select: { name: true } },
          images: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
      }),
    ])

    return {
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        featured: p.featured,
        active: p.active,
        category: p.category,
        primaryImage: p.images[0] ?? null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total,
        totalPages: Math.ceil(total / pagination.pageSize),
      },
    }
  },

  async create(data: Prisma.ProductCreateInput) {
    const product = await prisma.product.create({ data })
    return product
  },

  async update(id: string, data: Prisma.ProductUpdateInput) {
    const product = await prisma.product.update({ where: { id }, data })
    return product
  },

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } })
  },

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const where = excludeId ? { slug, NOT: { id: excludeId } } : { slug }
    const count = await prisma.product.count({ where })
    return count > 0
  },
}

function mapToPublicDTO(product: {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  price: Prisma.Decimal
  featured: boolean
  category: { id: string; name: string; slug: string }
  images: Array<{ url: string }>
  _count: { images: number }
  createdAt: Date
}) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    price: Number(product.price),
    featured: product.featured,
    category: product.category,
    primaryImage: product.images[0] ?? null,
    imagesCount: product._count.images,
    createdAt: product.createdAt,
  }
}
