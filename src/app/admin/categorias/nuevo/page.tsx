export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { CategoryForm } from '@/components/forms/CategoryForm/CategoryForm'
import { createCategory } from '@/actions/categories.actions'
import styles from './page.module.css'

export default async function NewCategoryPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin')

  return (
    <div>
      <h1 className={styles.title}>Nueva Categoría</h1>
      <div className="card">
        <CategoryForm onSubmit={createCategory} />
      </div>
    </div>
  )
}
