import { HeroBanner } from '@/components/public/HeroBanner/HeroBanner'
import { ProductGrid } from '@/components/public/ProductGrid/ProductGrid'
import { CategoryGrid } from '@/components/public/CategoryGrid/CategoryGrid'
import { SectionHeader } from '@/components/public/SectionHeader/SectionHeader'
import { getCachedFeaturedProducts, getCachedPublicCategories } from '@/lib/cached-queries'
import styles from './page.module.css'

export const revalidate = 60

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getCachedFeaturedProducts(8),
    getCachedPublicCategories(),
  ])

  return (
    <>
      <HeroBanner
        title="Colchones & Descanso"
        subtitle="Los mejores productos para tu hogar. Calidad, confort y estilo a tu alcance."
      />

      {categories.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeader
              title="Explora por categoría"
              subtitle="Encuentra exactamente lo que necesitas para cada espacio de tu hogar."
              action={{ label: 'Ver todas', href: '/categorias' }}
            />
            <CategoryGrid categories={categories} />
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <SectionHeader
              title="Productos destacados"
              subtitle="Nuestra selección de los mejores productos para tu descanso."
              action={{ label: 'Ver catálogo', href: '/productos' }}
            />
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}
    </>
  )
}
