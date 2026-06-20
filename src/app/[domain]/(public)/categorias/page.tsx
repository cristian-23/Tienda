import type { Metadata } from 'next'
import { CategoryGrid } from '@/components/public/CategoryGrid/CategoryGrid'
import { SectionHeader } from '@/components/public/SectionHeader/SectionHeader'
import { getCachedPublicCategories } from '@/lib/cached-queries'
import styles from './page.module.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Explora nuestras categorías de colchones, camas y muebles para el hogar.',
}

export default async function CategoriesPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params
  const categories = await getCachedPublicCategories(domain)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionHeader
          title="Categorías"
          subtitle="Navega por nuestras categorías y encuentra el producto ideal para ti."
        />
        {categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : (
          <p className={styles.empty}>No hay categorías disponibles.</p>
        )}
      </div>
    </div>
  )
}
