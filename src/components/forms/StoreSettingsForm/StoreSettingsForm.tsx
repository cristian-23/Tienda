'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button/Button'
import { Input } from '@/components/ui/Input/Input'
import { Textarea } from '@/components/ui/Textarea/Textarea'
import { showToast } from '@/lib/toast'
import { updateSettingsSchema, type UpdateSettingsInput } from '@/validations/settings.schema'
import type { ActionResponse, StoreSettingsDTO } from '@/types'
import styles from './StoreSettingsForm.module.css'

type StoreSettingsFormProps = {
  defaultValues?: StoreSettingsDTO
  onSubmit: (prev: ActionResponse<StoreSettingsDTO> | null, formData: FormData) => Promise<ActionResponse<StoreSettingsDTO>>
}

export function StoreSettingsForm({ defaultValues, onSubmit }: StoreSettingsFormProps) {
  const [pending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(defaultValues?.logoUrl ?? null)

  const [faviconUploading, setFaviconUploading] = useState(false)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(defaultValues?.faviconUrl ?? null)

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      facebookUrl: defaultValues.facebookUrl ?? '',
      instagramUrl: defaultValues.instagramUrl ?? '',
      logoUrl: defaultValues.logoUrl ?? '',
      faviconUrl: defaultValues.faviconUrl ?? '',
    } : {
      businessName: '',
      whatsappNumber: '',
      addresses: [{ label: '', address: '' }],
      facebookUrl: '',
      instagramUrl: '',
      logoUrl: '',
      faviconUrl: '',
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'addresses' })

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const body = new FormData()
      body.set('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body })
      if (!res.ok) throw new Error('Error al subir la imagen')
      const data = await res.json()
      setValue('logoUrl', data.url)
      setLogoPreview(data.url)
      showToast('success', 'Logo subido correctamente')
    } catch {
      showToast('error', 'Error', 'Error al subir el logo')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleFaviconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFaviconUploading(true)
    try {
      const body = new FormData()
      body.set('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body })
      if (!res.ok) throw new Error('Error al subir la imagen')
      const data = await res.json()
      setValue('faviconUrl', data.url)
      setFaviconPreview(data.url)
      showToast('success', 'Favicon subido correctamente')
    } catch {
      showToast('error', 'Error', 'Error al subir el favicon')
    } finally {
      setFaviconUploading(false)
      if (faviconInputRef.current) faviconInputRef.current.value = ''
    }
  }

  async function handleFormSubmit(data: UpdateSettingsInput) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('businessName', data.businessName)
      formData.set('whatsappNumber', data.whatsappNumber)
      formData.set('addresses', JSON.stringify(data.addresses))
      formData.set('facebookUrl', data.facebookUrl ?? '')
      formData.set('instagramUrl', data.instagramUrl ?? '')
      formData.set('logoUrl', data.logoUrl ?? '')
      formData.set('faviconUrl', data.faviconUrl ?? '')
      const result = await onSubmit(null, formData)
      if (result.success) {
        showToast('success', 'Configuración guardada')
      } else {
        showToast('error', 'Error', result.error?.message ?? 'Error al guardar la configuración')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <Controller name="businessName" control={control} render={({ field }) => (
        <Input label="Nombre del negocio" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.businessName?.message} />
      )} />
      <Controller name="whatsappNumber" control={control} render={({ field }) => (
        <Input label="Número de WhatsApp" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.whatsappNumber?.message} placeholder="+59170000000" />
      )} />

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Direcciones / Sucursales</span>
          <Button type="button" variant="secondary" size="sm" onClick={() => append({ label: '', address: '' })}>
            Agregar sucursal
          </Button>
        </div>
        {errors.addresses?.root && <small className={styles.error}>{errors.addresses.root.message}</small>}
        {fields.map((field, index) => (
          <div key={field.id} className={styles.addressCard}>
            <div className={styles.addressHeader}>
              <span className={styles.addressIndex}>Sucursal #{index + 1}</span>
              {fields.length > 1 && (
                <Button type="button" variant="danger" size="sm" onClick={() => remove(index)}>Quitar</Button>
              )}
            </div>
            <Controller name={`addresses.${index}.label`} control={control} render={({ field }) => (
              <Input label="Nombre" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.addresses?.[index]?.label?.message} placeholder="Ej: Sucursal Centro" />
            )} />
            <Controller name={`addresses.${index}.address`} control={control} render={({ field }) => (
              <Textarea label="Dirección" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.addresses?.[index]?.address?.message} placeholder="Ej: Calle 123 #456, Zona Central" />
            )} />
          </div>
        ))}
      </div>

      <Controller name="facebookUrl" control={control} render={({ field }) => (
        <Input label="URL de Facebook" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.facebookUrl?.message} placeholder="https://facebook.com/tutienda" />
      )} />
      <Controller name="instagramUrl" control={control} render={({ field }) => (
        <Input label="URL de Instagram" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.instagramUrl?.message} placeholder="https://instagram.com/tutienda" />
      )} />

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Marca y Landing Page</span>
        </div>

        <div className={styles.logoSection}>
          <span className={styles.logoLabel}>Favicon de la Landing Page</span>
          {faviconPreview && (
            <div className={styles.logoPreview}>
              <Image src={faviconPreview} alt="Favicon" width={32} height={32} style={{ objectFit: 'contain' }} />
            </div>
          )}
          <div className={styles.logoActions}>
            <input ref={faviconInputRef} type="file" accept="image/x-icon,image/png,image/svg+xml" onChange={handleFaviconUpload} className={styles.fileInput} id="favicon-upload" />
            <Button type="button" variant="secondary" isLoading={faviconUploading} onClick={() => faviconInputRef.current?.click()}>
              {faviconUploading ? 'Subiendo...' : faviconPreview ? 'Cambiar favicon' : 'Subir favicon'}
            </Button>
            {faviconPreview && (
              <Button type="button" variant="ghost" onClick={() => { setValue('faviconUrl', ''); setFaviconPreview(null) }}>
                Quitar favicon
              </Button>
            )}
          </div>
          <input type="hidden" {...{ name: 'faviconUrl' }} value={faviconPreview ?? ''} />
        </div>
      </div>

      <div className={styles.logoSection}>
        <span className={styles.logoLabel}>Logo del negocio</span>
        {logoPreview && (
          <div className={styles.logoPreview}>
            <Image src={logoPreview} alt="Logo" width={120} height={60} style={{ objectFit: 'contain' }} />
          </div>
        )}
        <div className={styles.logoActions}>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className={styles.fileInput} id="logo-upload" />
          <Button type="button" variant="secondary" isLoading={uploading} onClick={() => fileInputRef.current?.click()}>
            {uploading ? 'Subiendo...' : logoPreview ? 'Cambiar logo' : 'Subir logo'}
          </Button>
          {logoPreview && (
            <Button type="button" variant="ghost" onClick={() => { setValue('logoUrl', ''); setLogoPreview(null) }}>
              Quitar logo
            </Button>
          )}
        </div>
        <input type="hidden" {...{ name: 'logoUrl' }} value={logoPreview ?? ''} />
      </div>

      <div className={styles.actions}>
        <Button type="submit" isLoading={pending}>Guardar configuración</Button>
      </div>
    </form>
  )
}
