'use client'

import { CategoryForm } from '@/components/forms/CategoryForm/CategoryForm'
import { updateCategory } from '@/actions/categories.actions'
import type { CategoryAdminDTO } from '@/types'

type EditCategoryClientProps = {
  categoryId: string
  category: CategoryAdminDTO
}

export function EditCategoryClient({ categoryId, category }: EditCategoryClientProps) {
  return (
    <div className="card">
      <CategoryForm
        defaultValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? '',
          active: category.active,
        }}
        onSubmit={updateCategory.bind(null, categoryId)}
      />
    </div>
  )
}
