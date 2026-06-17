'use server'

import { revalidatePath } from 'next/cache'
import { revalidatePublicContent } from '@/lib/revalidate-public'
import { auth } from '@/lib/auth'
import { settingsService } from '@/services/settings.service'
import { updateSettingsSchema } from '@/validations/settings.schema'
import { UnauthorizedError, AppError } from '@/lib/errors'
import type { ActionResponse, StoreSettingsDTO } from '@/types'

async function checkAuth(): Promise<void> {
  const session = await auth()
  if (!session?.user) throw new UnauthorizedError()
}

function handleError<T>(error: unknown): ActionResponse<T> {
  if (error instanceof AppError) {
    return {
      success: false,
      error: { code: error.code, message: error.message, details: error.details },
    } as ActionResponse<T>
  }
  return {
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Ocurrió un error inesperado' },
  } as ActionResponse<T>
}

export async function getSettings(): Promise<ActionResponse<StoreSettingsDTO>> {
  try {
    const settings = await settingsService.get()
    if (!settings) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Configuración no encontrada' } }
    }
    return { success: true, data: settings }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateSettings(
  prevState: ActionResponse<StoreSettingsDTO> | null,
  formData: FormData
): Promise<ActionResponse<StoreSettingsDTO>> {
  try {
    await checkAuth()

    const raw = Object.fromEntries(formData) as Record<string, string>
    if (raw.addresses) {
      try { raw.addresses = JSON.parse(raw.addresses) } catch { raw.addresses = '[]' }
    }
    const parsed = updateSettingsSchema.safeParse(raw)

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

    const settings = await settingsService.update(parsed.data)
    revalidatePath('/admin/configuracion')
    revalidatePublicContent()
    return { success: true, data: settings }
  } catch (error) {
    return handleError(error)
  }
}
