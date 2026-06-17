'use server'

import { revalidatePath } from 'next/cache'
import { revalidatePublicContent } from '@/lib/revalidate-public'
import { auth } from '@/lib/auth'
import { imageRepository } from '@/repositories/image.repository'
import { uploadImage, deleteImage as deleteCloudinaryImage } from '@/lib/cloudinary'
import { UnauthorizedError, AppError } from '@/lib/errors'
import type { ActionResponse, ImageDTO } from '@/types'

async function checkAuth(): Promise<void> {
  const session = await auth()
  if (!session?.user) throw new UnauthorizedError()
}

function handleError<T>(error: unknown): ActionResponse<T> {
  if (error instanceof AppError) {
    return {
      success: false,
      error: { code: error.code, message: error.message },
    } as ActionResponse<T>
  }
  return {
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Error al procesar la imagen' },
  } as ActionResponse<T>
}

export async function uploadProductImage(
  productId: string,
  file: File
): Promise<ActionResponse<ImageDTO>> {
  try {
    await checkAuth()

    const url = await uploadImage(file)
    const order = await imageRepository.getNextOrder(productId)

    const image = await imageRepository.create({ productId, url, order })

    revalidatePath(`/admin/productos/${productId}`)
    revalidatePublicContent()
    return {
      success: true,
      data: { id: image.id, url: image.url, order: image.order },
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteProductImage(
  imageId: string,
  productId: string
): Promise<ActionResponse> {
  try {
    await checkAuth()

    const images = await imageRepository.findByProductId(productId)
    const image = images.find((img) => img.id === imageId)

    if (image) {
      await deleteCloudinaryImage(image.url)
    }

    await imageRepository.delete(imageId)

    revalidatePath(`/admin/productos/${productId}`)
    revalidatePublicContent()
    return { success: true }
  } catch (error) {
    return handleError(error)
  }
}

export async function reorderImages(
  productId: string,
  imageIds: string[]
): Promise<ActionResponse> {
  try {
    await checkAuth()
    await imageRepository.reorder(productId, imageIds)
    revalidatePath(`/admin/productos/${productId}`)
    revalidatePublicContent()
    return { success: true }
  } catch (error) {
    return handleError(error)
  }
}
