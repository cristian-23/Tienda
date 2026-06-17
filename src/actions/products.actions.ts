'use server'

import { revalidatePath } from 'next/cache'
import { revalidatePublicContent } from '@/lib/revalidate-public'
import { auth } from '@/lib/auth'
import { productService } from '@/services/product.service'
import { createProductSchema, updateProductSchema } from '@/validations/product.schema'
import { UnauthorizedError, AppError } from '@/lib/errors'
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

export async function getProductsAction(
  page = 1
): Promise<ActionResponse<{ products: ProductListAdminDTO[]; total: number; totalPages: number }>> {
  try {
    await checkAuth()
    const result = await productService.getAdminList({ page, pageSize: 20 })
    return {
      success: true,
      data: {
        products: result.products as ProductListAdminDTO[],
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
    }
  } catch (error) {
    return handleError(error)
  }
}

export async function getProductAction(id: string): Promise<ActionResponse<ProductAdminDTO>> {
  try {
    await checkAuth()
    const product = await productService.getById(id)
    if (!product) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } }
    }
    return { success: true, data: product }
  } catch (error) {
    return handleError(error)
  }
}

export async function createProduct(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await checkAuth()

    const raw = Object.fromEntries(formData)
    const parsed = createProductSchema.safeParse({
      ...raw,
      price: raw.price,
      stock: raw.stock === '' || raw.stock === 'null' ? null : raw.stock,
      featured: raw.featured === 'true',
      active: raw.active === 'true',
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

    await productService.create(parsed.data)
    revalidatePath('/admin/productos')
    revalidatePublicContent()
    return { success: true }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateProduct(
  id: string,
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await checkAuth()

    const raw = Object.fromEntries(formData)
    const parsed = updateProductSchema.safeParse({
      ...raw,
      price: raw.price || undefined,
      stock: raw.stock === '' || raw.stock === 'null' ? null : raw.stock || undefined,
      featured: raw.featured === 'true' ? true : raw.featured === 'false' ? false : undefined,
      active: raw.active === 'true' ? true : raw.active === 'false' ? false : undefined,
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

    await productService.update(id, parsed.data)
    revalidatePath('/admin/productos')
    revalidatePublicContent()
    return { success: true }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    await checkAuth()
    await productService.delete(id)
    revalidatePath('/admin/productos')
    revalidatePublicContent()
    return { success: true }
  } catch (error) {
    return handleError(error)
  }
}
