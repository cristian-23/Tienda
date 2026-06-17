import { imageRepository } from '@/repositories/image.repository'

export const imageService = {
  async upload(productId: string, file: File): Promise<{ url: string; imageId: string }> {
    const { uploadImage } = await import('@/lib/cloudinary')
    const url = await uploadImage(file)
    const order = await imageRepository.getNextOrder(productId)

    const image = await imageRepository.create({
      productId,
      url,
      order,
    })

    return { url: image.url, imageId: image.id }
  },

  async reorder(productId: string, imageIds: string[]): Promise<void> {
    await imageRepository.reorder(productId, imageIds)
  },

  async getByProductId(productId: string) {
    return imageRepository.findByProductId(productId)
  },
}
