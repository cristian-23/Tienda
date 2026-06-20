export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { categoryService } from '@/services/category.service'
import { CategoriesTable } from './CategoriesTable'

export default async function AdminCategoriesPage({ params }: { params: Promise<{ domain: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/admin')

  const { domain } = await params
  const categories = await categoryService.getAdminCategories(domain)

  return <CategoriesTable categories={categories} />
}
