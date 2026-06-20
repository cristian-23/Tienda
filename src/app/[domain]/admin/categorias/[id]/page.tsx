export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { EditCategoryClient } from './EditCategoryClient'
import { categoryService } from '@/services/category.service'
import styles from './page.module.css'

type Props = { params: Promise<{ id: string; domain: string }> }

export default async function EditCategoryPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect('/admin')

  const { id, domain } = await params

  let category
  try {
    category = await categoryService.getById(id, domain)
  } catch {
    notFound()
  }

  return (
    <div>
      <h1 className={styles.title}>Editar: {category.name}</h1>
      <EditCategoryClient categoryId={id} category={category} />
    </div>
  )
}
