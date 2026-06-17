'use client'

import { useRouter } from 'next/navigation'
import styles from './ProductFilters.module.css'

type FilterOption = {
  value: string
  label: string
  count?: number
}

type ProductFiltersProps = {
  categories: FilterOption[]
  selectedCategory?: string
  sortBy?: string
  sortDirection?: string
  baseUrl: string
}

const sortOptions = [
  { label: 'Más recientes', value: '' },
  { label: 'Menor precio', value: 'price_asc' },
  { label: 'Mayor precio', value: 'price_desc' },
  { label: 'Nombre A-Z', value: 'name_asc' },
]

export function ProductFilters({
  categories,
  selectedCategory,
  sortBy,
  sortDirection,
  baseUrl,
}: ProductFiltersProps) {
  const router = useRouter()

  function navigate(params: Record<string, string | undefined>) {
    const searchParams = new URLSearchParams()
    if (params.category && params.category !== 'all') searchParams.set('category', params.category)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortDirection) searchParams.set('sortDirection', params.sortDirection)
    const qs = searchParams.toString()
    router.push(qs ? `${baseUrl}?${qs}` : baseUrl)
  }

  const currentSort = sortBy && sortDirection ? `${sortBy}_${sortDirection}` : ''

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    if (!value) {
      navigate({ category: selectedCategory, sortBy: undefined, sortDirection: undefined })
      return
    }
    const [newSortBy, newSortDirection] = value.split('_')
    navigate({ category: selectedCategory, sortBy: newSortBy, sortDirection: newSortDirection })
  }

  return (
    <aside className={styles.filters}>
      <div className={styles.section}>
        <h3 className={styles.title}>Categorías</h3>
        <ul className={styles.list}>
          <li>
            <button
              type="button"
              onClick={() => navigate({ category: undefined, sortBy, sortDirection })}
              className={`${styles.link} ${!selectedCategory ? styles.active : ''}`}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.value}>
              <button
                type="button"
                onClick={() => navigate({ category: cat.value, sortBy, sortDirection })}
                className={`${styles.link} ${selectedCategory === cat.value ? styles.active : ''}`}
              >
                {cat.label}
                {cat.count !== undefined && (
                  <span className={styles.count}>({cat.count})</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>Ordenar por</h3>
        <select
          value={currentSort}
          onChange={handleSortChange}
          className={styles.select}
          aria-label="Ordenar productos"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
}
