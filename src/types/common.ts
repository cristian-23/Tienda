export type PaginationParams = {
  page: number
  pageSize: number
}

export type PaginationResult = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type SortDirection = 'asc' | 'desc'

export type ProductSortField = 'name' | 'price' | 'createdAt'

export type ProductFilters = {
  categorySlug?: string
  search?: string
  sortBy?: ProductSortField
  sortDirection?: SortDirection
  featured?: boolean
  active?: boolean
  minPrice?: number
  maxPrice?: number
}

export type ActionResponse<T = void> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}
