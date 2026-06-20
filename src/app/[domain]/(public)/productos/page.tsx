import type { Metadata } from 'next'
import { ProductGrid } from '@/components/public/ProductGrid/ProductGrid'
import { ProductFilters } from '@/components/public/ProductFilters/ProductFilters'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { SectionHeader } from '@/components/public/SectionHeader/SectionHeader'
import { getCachedPublicCategories, getCachedProductsWithFilters } from '@/lib/cached-queries'
import { PAGINATION } from '@/lib/constants'
import type { ProductSortField, SortDirection } from '@/types'
import styles from './page.module.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explora nuestro catálogo completo de productos para el descanso.',
}

type SearchParams = Promise<{
  search?: string
  category?: string
  sortBy?: ProductSortField
  sortDirection?: SortDirection
  page?: string
}>

export default async function ProductsPage({
  searchParams,
  params,
}: {
  searchParams: SearchParams
  params: Promise<{ domain: string }>
}) {
  const resolvedSearchParams = await searchParams
  const { domain } = await params
  const page = Math.max(1, Number(resolvedSearchParams.page) || 1)

  const filters = {
    search: resolvedSearchParams.search,
    categorySlug: resolvedSearchParams.category,
    sortBy: resolvedSearchParams.sortBy,
    sortDirection: resolvedSearchParams.sortDirection,
  }

  const [result, categories] = await Promise.all([
    getCachedProductsWithFilters(filters, { page, pageSize: PAGINATION.DEFAULT_PAGE_SIZE }, domain),
    getCachedPublicCategories(domain),
  ])

  const filterCategories = categories.map((c) => ({
    value: c.slug,
    label: c.name,
    count: c.productCount,
  }))

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionHeader
          title="Catálogo de productos"
          subtitle={
            resolvedSearchParams.search
              ? `Resultados para "${resolvedSearchParams.search}"`
              : 'Explora nuestra colección completa.'
          }
        />

        <div className={styles.layout}>
          <ProductFilters
            categories={filterCategories}
            selectedCategory={resolvedSearchParams.category}
            sortBy={resolvedSearchParams.sortBy}
            sortDirection={resolvedSearchParams.sortDirection}
            baseUrl="/productos"
          />

          <div className={styles.results}>
            <ProductGrid products={result.products} />

            <Pagination
              currentPage={result.pagination.page}
              totalPages={result.pagination.totalPages}
              total={result.pagination.total}
              baseUrl="/productos"
              searchParams={
                {
                  ...(resolvedSearchParams.search && { search: resolvedSearchParams.search }),
                  ...(resolvedSearchParams.category && { category: resolvedSearchParams.category }),
                  ...(resolvedSearchParams.sortBy && { sortBy: resolvedSearchParams.sortBy }),
                  ...(resolvedSearchParams.sortDirection && { sortDirection: resolvedSearchParams.sortDirection }),
                } as Record<string, string>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
