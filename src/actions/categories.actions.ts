'use server'

import { revalidatePath } from 'next/cache'
import { revalidatePublicContent } from '@/lib/revalidate-public'
import { auth } from '@/lib/auth'
import { categoryService } from '@/services/category.service'
import { createCategorySchema, updateCategorySchema } from '@/validations/category.schema'
import { UnauthorizedError, AppError } from '@/lib/errors'
import { getDomainFromHeaders } from '@/lib/server-utils'
import type { ActionResponse, CategoryAdminDTO } from '@/types'

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

export async function getCategories(): Promise<ActionResponse<CategoryAdminDTO[]>> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()
    const categories = await categoryService.getAdminCategories(domain)
    return { success: true, data: categories }
  } catch (error) {
    return handleError(error)
  }
}

export async function getCategory(id: string): Promise<ActionResponse<CategoryAdminDTO>> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()
    const category = await categoryService.getById(id, domain)
    return { success: true, data: category }
  } catch (error) {
    return handleError(error)
  }
}

export async function createCategory(
  prevState: ActionResponse<CategoryAdminDTO> | null,
  formData: FormData
): Promise<ActionResponse<CategoryAdminDTO>> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()

    const raw = Object.fromEntries(formData)
    const parsed = createCategorySchema.safeParse({
      ...raw,
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

    const category = await categoryService.create(parsed.data, domain)
    revalidatePath('/admin/categorias')
    revalidatePublicContent()
    return { success: true, data: category as unknown as CategoryAdminDTO }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateCategory(
  id: string,
  prevState: ActionResponse<CategoryAdminDTO> | null,
  formData: FormData
): Promise<ActionResponse<CategoryAdminDTO>> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()

    const raw = Object.fromEntries(formData)
    const parsed = updateCategorySchema.safeParse({
      ...raw,
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

    const category = await categoryService.update(id, parsed.data, domain)
    revalidatePath('/admin/categorias')
    revalidatePublicContent()
    return { success: true, data: category as unknown as CategoryAdminDTO }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteCategory(id: string): Promise<ActionResponse> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()
    await categoryService.delete(id, domain)
    revalidatePath('/admin/categorias')
    revalidatePublicContent()
    return { success: true }
  } catch (error) {
    return handleError(error)
  }
}
