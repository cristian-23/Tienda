import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(200, 'Máximo 200 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  shortDescription: z.string().max(300, 'Máximo 300 caracteres').optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  stock: z.coerce.number().int().positive().optional().nullable(),
  featured: z.boolean(),
  active: z.boolean(),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  images: z.array(z.object({ url: z.string() })).optional(),
})

export const updateProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres').optional(),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(200, 'Máximo 200 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones')
    .optional(),
  shortDescription: z.string().max(300, 'Máximo 300 caracteres').optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  price: z.coerce.number().positive('El precio debe ser mayor a 0').optional(),
  stock: z.coerce.number().int().positive().optional().nullable(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  categoryId: z.string().min(1, 'La categoría es requerida').optional(),
  images: z.array(z.object({ url: z.string() })).optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
