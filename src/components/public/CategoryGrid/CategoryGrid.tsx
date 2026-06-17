import { CategoryCard } from '@/components/public/CategoryCard/CategoryCard'
import type { CategoryPublicDTO } from '@/types'
import styles from './CategoryGrid.module.css'

type CategoryGridProps = {
  categories: CategoryPublicDTO[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className={styles.grid}>
      {categories.map((category, index) => (
        <CategoryCard key={category.id} category={category} index={index} />
      ))}
    </div>
  )
}
