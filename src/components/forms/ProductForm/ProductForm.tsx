'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button/Button'
import { Input } from '@/components/ui/Input/Input'
import { Textarea } from '@/components/ui/Textarea/Textarea'
import { Select } from '@/components/ui/Select/Select'
import { Toggle } from '@/components/ui/Toggle/Toggle'
import { showToast } from '@/lib/toast'
import { createProductSchema, type CreateProductInput } from '@/validations/product.schema'
import type { ActionResponse } from '@/types'
import styles from './ProductForm.module.css'

type CategoryOption = { id: string; name: string }

type ProductFormProps = {
  categories: CategoryOption[]
  defaultValues?: Partial<CreateProductInput>
  onSubmit: (prev: ActionResponse | null, formData: FormData) => Promise<ActionResponse>
}

export function ProductForm({ categories, defaultValues, onSubmit }: ProductFormProps) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const { control, handleSubmit, formState: { errors } } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      price: 0,
      stock: null,
      featured: false,
      active: true,
      categoryId: '',
      ...defaultValues,
    },
  })

  async function handleFormSubmit(data: CreateProductInput) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', data.name)
      formData.set('slug', data.slug)
      formData.set('shortDescription', data.shortDescription ?? '')
      formData.set('description', data.description ?? '')
      formData.set('price', String(data.price))
      formData.set('stock', data.stock != null ? String(data.stock) : '')
      formData.set('featured', String(data.featured))
      formData.set('active', String(data.active))
      formData.set('categoryId', data.categoryId)
      const result = await onSubmit(null, formData)
      if (result.success) {
        showToast('success', defaultValues ? 'Producto actualizado' : 'Producto creado')
        if (!defaultValues) {
          setTimeout(() => router.push('/admin/productos'), 1000)
        }
      } else {
        showToast('error', 'Error', result.error?.message ?? 'Error al guardar el producto')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.grid}>
        <Controller name="name" control={control} render={({ field }) => (
          <Input label="Nombre" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.name?.message} placeholder="Nombre del producto" />
        )} />
        <Controller name="slug" control={control} render={({ field }) => (
          <Input label="Slug" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.slug?.message} placeholder="nombre-del-producto" />
        )} />
      </div>
      <Controller name="shortDescription" control={control} render={({ field }) => (
        <Textarea label="Descripción corta" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} error={errors.shortDescription?.message} placeholder="Breve descripción" />
      )} />
      <Controller name="description" control={control} render={({ field }) => (
        <Textarea label="Descripción completa" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} error={errors.description?.message} placeholder="Descripción detallada" />
      )} />
      <div className={styles.grid}>
        <Controller name="price" control={control} render={({ field }) => (
          <Input label="Precio (Bs.)" type="number" step="0.01" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.price?.message} />
        )} />
        <Controller name="stock" control={control} render={({ field }) => (
          <Input label="Stock" type="number" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))} onBlur={field.onBlur} error={errors.stock?.message} placeholder="Opcional" />
        )} />
      </div>
      <Controller name="categoryId" control={control} render={({ field }) => (
        <Select label="Categoría" options={categories.map((c) => ({ value: c.id, label: c.name }))} placeholder="Seleccionar categoría" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.categoryId?.message} />
      )} />
      <div className={styles.toggles}>
        <Controller name="featured" control={control} render={({ field }) => (
          <Toggle label="Destacado" checked={field.value} onChange={field.onChange} />
        )} />
        <Controller name="active" control={control} render={({ field }) => (
          <Toggle label="Activo" checked={field.value} onChange={field.onChange} />
        )} />
      </div>
      <div className={styles.actions}>
        <Button type="submit" isLoading={pending}>
          {defaultValues ? 'Actualizar' : 'Crear'} producto
        </Button>
      </div>
    </form>
  )
}
