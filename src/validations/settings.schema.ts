import { z } from 'zod'

export const storeAddressSchema = z.object({
  label: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  address: z.string().min(1, 'La dirección es requerida').max(500, 'Máximo 500 caracteres'),
})

export const updateSettingsSchema = z.object({
  businessName: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  whatsappNumber: z
    .string()
    .min(1, 'El número es requerido')
    .regex(/^\+?\d{7,15}$/, 'Número inválido. Formato: +59170000000'),
  addresses: z.array(storeAddressSchema).min(1, 'Al menos una dirección es requerida'),
  facebookUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  instagramUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  logoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  faviconUrl: z.string().url('URL inválida').optional().or(z.literal('')),
})

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
