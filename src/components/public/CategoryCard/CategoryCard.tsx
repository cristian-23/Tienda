import Link from 'next/link'
import type { CategoryPublicDTO } from '@/types'
import styles from './CategoryCard.module.css'

type CategoryCardProps = {
  category: CategoryPublicDTO
  index?: number
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const initial = category.name.charAt(0).toUpperCase()

  return (
    <Link
      href={`/categorias/${category.slug}`}
      className={styles.card}
      data-index={index % 6}
    >
      <span className={styles.initial} aria-hidden="true">{initial}</span>
      <h3 className={styles.name}>{category.name}</h3>
      {category.productCount > 0 && (
        <span className={styles.count}>
          {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}
        </span>
      )}
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>
  )
}
