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

export default async function ProductsPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const page = Math.max(1, Number(searchParams.page) || 1)

  const filters = {
    search: searchParams.search,
    categorySlug: searchParams.category,
    sortBy: searchParams.sortBy,
    sortDirection: searchParams.sortDirection,
  }

  const [result, categories] = await Promise.all([
    getCachedProductsWithFilters(filters, { page, pageSize: PAGINATION.DEFAULT_PAGE_SIZE }),
    getCachedPublicCategories(),
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
            searchParams.search
              ? `Resultados para "${searchParams.search}"`
              : 'Explora nuestra colección completa de colchones, camas y muebles.'
          }
        />

        <div className={styles.layout}>
          <ProductFilters
            categories={filterCategories}
            selectedCategory={searchParams.category}
            sortBy={searchParams.sortBy}
            sortDirection={searchParams.sortDirection}
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
                  ...(searchParams.search && { search: searchParams.search }),
                  ...(searchParams.category && { category: searchParams.category }),
                  ...(searchParams.sortBy && { sortBy: searchParams.sortBy }),
                  ...(searchParams.sortDirection && { sortDirection: searchParams.sortDirection }),
                } as Record<string, string>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
