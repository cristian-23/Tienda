import { prisma } from '@/lib/prisma'
import type { ProductImage } from '@prisma/client'

export const imageRepository = {
  async findByProductId(productId: string): Promise<ProductImage[]> {
    return prisma.productImage.findMany({
      where: { productId },
      orderBy: { order: 'asc' },
    })
  },

  async create(data: { productId: string; url: string; order: number }): Promise<ProductImage> {
    return prisma.productImage.create({ data })
  },

  async delete(id: string): Promise<void> {
    await prisma.productImage.delete({ where: { id } })
  },

  async getNextOrder(productId: string): Promise<number> {
    const lastImage = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { order: 'desc' },
    })
    return (lastImage?.order ?? -1) + 1
  },

  async reorder(productId: string, imageIds: string[]): Promise<void> {
    const updates = imageIds.map((id, index) =>
      prisma.productImage.update({
        where: { id },
        data: { order: index },
      })
    )
    await prisma.$transaction(updates)
  },

  async countByProduct(productId: string): Promise<number> {
    return prisma.productImage.count({ where: { productId } })
  },
}
