'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button/Button'
import { Input } from '@/components/ui/Input/Input'
import { Textarea } from '@/components/ui/Textarea/Textarea'
import { Toggle } from '@/components/ui/Toggle/Toggle'
import { showToast } from '@/lib/toast'
import { createCategorySchema, type CreateCategoryInput } from '@/validations/category.schema'
import type { ActionResponse, CategoryAdminDTO } from '@/types'
import styles from './CategoryForm.module.css'

type CategoryFormProps = {
  defaultValues?: Partial<CreateCategoryInput> & { active?: boolean }
  onSubmit: (prev: ActionResponse<CategoryAdminDTO> | null, formData: FormData) => Promise<ActionResponse<CategoryAdminDTO>>
}

export function CategoryForm({ defaultValues, onSubmit }: CategoryFormProps) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const { control, handleSubmit, formState: { errors } } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      active: true,
      ...defaultValues,
    },
  })

  async function handleFormSubmit(data: CreateCategoryInput) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', data.name)
      formData.set('slug', data.slug)
      formData.set('description', data.description ?? '')
      formData.set('active', String(data.active))
      const result = await onSubmit(null, formData)
      if (result.success) {
        showToast('success', defaultValues ? 'Categoría actualizada' : 'Categoría creada')
        if (!defaultValues) {
          setTimeout(() => router.push('/admin/categorias'), 1000)
        }
      } else {
        showToast('error', 'Error', result.error?.message ?? 'Error al guardar la categoría')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <Controller name="name" control={control} render={({ field }) => (
        <Input label="Nombre" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.name?.message} placeholder="Nombre de la categoría" />
      )} />
      <Controller name="slug" control={control} render={({ field }) => (
        <Input label="Slug" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.slug?.message} placeholder="nombre-de-la-categoria" />
      )} />
      <Controller name="description" control={control} render={({ field }) => (
        <Textarea label="Descripción" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} error={errors.description?.message} placeholder="Descripción opcional" />
      )} />
      <Controller name="active" control={control} render={({ field }) => (
        <Toggle label="Activo" checked={field.value} onChange={field.onChange} />
      )} />
      <div className={styles.actions}>
        <Button type="submit" isLoading={pending}>
          {defaultValues ? 'Actualizar' : 'Crear'} categoría
        </Button>
      </div>
    </form>
  )
}
