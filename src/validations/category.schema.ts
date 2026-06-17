import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
  active: z.boolean(),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres').optional(),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones')
    .optional(),
  description: z.string().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
  active: z.boolean().optional(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
