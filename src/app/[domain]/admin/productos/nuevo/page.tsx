export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ProductForm } from '@/components/forms/ProductForm/ProductForm'
import { categoryRepository } from '@/repositories/category.repository'
import { createProduct } from '@/actions/products.actions'
import styles from './page.module.css'

type Props = { params: Promise<{ domain: string }> }

export default async function NewProductPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect('/admin')

  const { domain } = await params
  const categories = await categoryRepository.findAllActive(domain)

  return (
    <div>
      <h1 className={styles.title}>Nuevo Producto</h1>
      <div className="card">
        <ProductForm
          categories={categories}
          onSubmit={createProduct}
        />
      </div>
    </div>
  )
}
