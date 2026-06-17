import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductGrid } from '@/components/public/ProductGrid/ProductGrid'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { getCachedProductsWithFilters } from '@/lib/cached-queries'
import { categoryRepository } from '@/repositories/category.repository'
import { PAGINATION } from '@/lib/constants'
import styles from './page.module.css'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await categoryRepository.findBySlug(slug)

  if (!category) return { title: 'Categoría no encontrada' }

  return {
    title: category.name,
    description: category.description ?? `Productos de la categoría ${category.name}`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const [category, result] = await Promise.all([
    categoryRepository.findBySlug(slug),
    getCachedProductsWithFilters(
      { categorySlug: slug },
      { page, pageSize: PAGINATION.DEFAULT_PAGE_SIZE }
    ),
  ])

  if (!category) notFound()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/categorias">Categorías</Link>
          <span aria-hidden="true">/</span>
          <span>{category.name}</span>
        </nav>

        <h1 className={styles.title}>{category.name}</h1>
        {category.description && <p className={styles.desc}>{category.description}</p>}

        <ProductGrid products={result.products} />

        <Pagination
          currentPage={result.pagination.page}
          totalPages={result.pagination.totalPages}
          total={result.pagination.total}
          baseUrl={`/categorias/${slug}`}
        />
      </div>
    </div>
  )
}
