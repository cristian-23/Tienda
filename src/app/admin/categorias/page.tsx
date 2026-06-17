export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { categoryService } from '@/services/category.service'
import { CategoriesTable } from './CategoriesTable'

export default async function AdminCategoriesPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin')

  const categories = await categoryService.getAdminCategories()

  return <CategoriesTable categories={categories} />
}
