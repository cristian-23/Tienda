'use server'

import { revalidatePath } from 'next/cache'
import { revalidatePublicContent } from '@/lib/revalidate-public'
import { auth } from '@/lib/auth'
import { productService } from '@/services/product.service'
import { createProductSchema, updateProductSchema } from '@/validations/product.schema'
import { UnauthorizedError, AppError } from '@/lib/errors'
import { getDomainFromHeaders } from '@/lib/server-utils'
import type { ActionResponse, ProductAdminDTO, ProductListAdminDTO } from '@/types'

async function checkAuth(): Promise<void> {
  const session = await auth()
  if (!session?.user) throw new UnauthorizedError()
}

function handleError<T>(error: unknown): ActionResponse<T> {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    } as ActionResponse<T>
  }

  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocurrió un error inesperado',
    },
  } as ActionResponse<T>
}

export async function getProducts(
  page = 1,
  pageSize = 10
): Promise<ActionResponse<{ products: ProductListAdminDTO[]; totalPages: number }>> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()
    const result = await productService.getAdminList({ page, pageSize }, domain)
    return {
      success: true,
      data: {
        products: result.products,
        totalPages: result.pagination.totalPages,
      },
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getProduct(id: string): Promise<ActionResponse<ProductAdminDTO>> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()
    const product = await productService.getById(id, domain)
    return { success: true, data: product as ProductAdminDTO }
  } catch (error) {
    return handleError(error)
  }
}

export async function createProduct(
  prevState: ActionResponse<ProductAdminDTO> | null,
  formData: FormData
): Promise<ActionResponse<ProductAdminDTO>> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()

    const raw = Object.fromEntries(formData)
    
    let images = []
    try {
      images = JSON.parse(raw.images as string)
    } catch {
      images = []
    }

    const parsed = createProductSchema.safeParse({
      ...raw,
      price: Number(raw.price),
      stock: raw.stock ? Number(raw.stock) : undefined,
      featured: raw.featured === 'true',
      active: raw.active === 'true',
      images,
    })

    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos inválidos',
          details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        },
      }
    }

    const product = await productService.create(parsed.data, domain)
    revalidatePath('/admin/productos')
    revalidatePublicContent()
    return { success: true, data: product as unknown as ProductAdminDTO }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateProduct(
  id: string,
  prevState: ActionResponse<ProductAdminDTO> | null,
  formData: FormData
): Promise<ActionResponse<ProductAdminDTO>> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()

    const raw = Object.fromEntries(formData)
    
    let images = []
    try {
      if (raw.images) {
        images = JSON.parse(raw.images as string)
      }
    } catch {
      images = []
    }

    const parsed = updateProductSchema.safeParse({
      ...raw,
      ...(raw.price ? { price: Number(raw.price) } : {}),
      ...(raw.stock ? { stock: Number(raw.stock) } : {}),
      ...(raw.featured ? { featured: raw.featured === 'true' } : {}),
      ...(raw.active ? { active: raw.active === 'true' } : {}),
      ...(raw.images ? { images } : {}),
    })

    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos inválidos',
          details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        },
      }
    }

    const product = await productService.update(id, parsed.data as any, domain)
    revalidatePath('/admin/productos')
    revalidatePath(`/admin/productos/${id}`)
    revalidatePublicContent()
    return { success: true, data: product as unknown as ProductAdminDTO }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()
    await productService.delete(id, domain)
    revalidatePath('/admin/productos')
    revalidatePublicContent()
    return { success: true }
  } catch (error) {
    return handleError(error)
  }
}
