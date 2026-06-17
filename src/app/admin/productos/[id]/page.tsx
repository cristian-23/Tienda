export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { EditProductClient } from './EditProductClient'
import { productRepository } from '@/repositories/product.repository'
import { categoryRepository } from '@/repositories/category.repository'
import styles from './page.module.css'

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect('/admin')

  const { id } = await params

  const [product, categories] = await Promise.all([
    productRepository.findById(id),
    categoryRepository.findAllActive(),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className={styles.title}>Editar: {product.name}</h1>
      <EditProductClient
        productId={id}
        categories={categories}
        product={product}
      />
    </div>
  )
}
