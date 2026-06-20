'use server'

import { revalidatePath } from 'next/cache'
import { revalidatePublicContent } from '@/lib/revalidate-public'
import { auth } from '@/lib/auth'
import { settingsRepository } from '@/repositories/settings.repository'
import { updateSettingsSchema } from '@/validations/settings.schema'
import { UnauthorizedError, AppError } from '@/lib/errors'
import { getDomainFromHeaders } from '@/lib/server-utils'
import type { ActionResponse, StoreSettingsDTO } from '@/types'

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

export async function getSettings(): Promise<ActionResponse<StoreSettingsDTO>> {
  try {
    await checkAuth()
    const domain = await getDomainFromHeaders()
    const settings = await settingsRepository.getByDomain(domain)
    
    if (!settings) {
      return {
        success: true,
        data: {
          businessName: '',
          whatsappNumber: '',
          addresses: [],
          facebookUrl: null,
          instagramUrl: null,
          logoUrl: null,
          faviconUrl: null,
          heroTitle: null,
          heroSubtitle: null,
          aboutText: null,
        },
      }
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
    const domain = await getDomainFromHeaders()

    const raw = Object.fromEntries(formData)
    
    let addresses = []
    try {
      addresses = JSON.parse(raw.addresses as string)
    } catch {
      addresses = []
    }

    const parsed = updateSettingsSchema.safeParse({
      ...raw,
      addresses,
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

    const settings = await settingsRepository.upsert(parsed.data, domain)
    revalidatePath('/admin/configuracion')
    revalidatePublicContent()
    return { success: true, data: settings }
  } catch (error) {
    return handleError(error)
  }
}
