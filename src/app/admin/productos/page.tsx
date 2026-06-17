export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { productRepository } from '@/repositories/product.repository'
import { ProductsTable } from './ProductsTable'

export default async function AdminProductsPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin')

  const { products } = await productRepository.findAdminList({ page: 1, pageSize: 100 })

  return <ProductsTable products={products} />
}
