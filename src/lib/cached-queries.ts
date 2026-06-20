import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { settingsRepository } from '@/repositories/settings.repository'
import { categoryService } from '@/services/category.service'
import { productService } from '@/services/product.service'
import type { ProductFilters, PaginationParams } from '@/types'

export function getCachedStoreSettings(domain: string) {
  return unstable_cache(
    () => settingsRepository.getByDomain(domain),
    [`store-settings-${domain}`],
    { revalidate: 300, tags: ['settings', domain] }
  )()
}

export function getCachedPublicCategories(domain: string) {
  return unstable_cache(
    () => categoryService.getPublicCategories(domain),
    [`public-categories-${domain}`],
    { revalidate: 60, tags: ['categories', domain] }
  )()
}

export function getCachedFeaturedProducts(limit: number, domain: string) {
  return unstable_cache(
    () => productService.getFeatured(limit, domain),
    [`featured-products-${domain}`, limit.toString()],
    { revalidate: 60, tags: ['products', domain] }
  )()
}

export const getCachedProductBySlug = cache((slug: string, domain: string) =>
  productService.getBySlug(slug, domain)
)

export function getCachedProductsWithFilters(
  filters: ProductFilters,
  pagination: PaginationParams,
  domain: string
) {
  const key = JSON.stringify({ filters, pagination, domain })
  return unstable_cache(
    () => productService.getWithFilters(filters, pagination, domain),
    ['products-filtered', key],
    { revalidate: 60, tags: ['products', domain] }
  )()
}
