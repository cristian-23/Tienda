import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { settingsRepository } from '@/repositories/settings.repository'
import { categoryService } from '@/services/category.service'
import { productService } from '@/services/product.service'
import type { ProductFilters, PaginationParams } from '@/types'

export const getCachedSettings = unstable_cache(
  () => settingsRepository.get(),
  ['store-settings'],
  { revalidate: 300, tags: ['settings'] }
)

export const getCachedPublicCategories = unstable_cache(
  () => categoryService.getPublicCategories(),
  ['public-categories'],
  { revalidate: 60, tags: ['categories'] }
)

export const getCachedFeaturedProducts = unstable_cache(
  (limit: number) => productService.getFeatured(limit),
  ['featured-products'],
  { revalidate: 60, tags: ['products'] }
)

export const getCachedProductBySlug = cache((slug: string) =>
  productService.getBySlug(slug)
)

export function getCachedProductsWithFilters(
  filters: ProductFilters,
  pagination: PaginationParams
) {
  const key = JSON.stringify({ filters, pagination })
  return unstable_cache(
    () => productService.getWithFilters(filters, pagination),
    ['products-filtered', key],
    { revalidate: 60, tags: ['products'] }
  )()
}
