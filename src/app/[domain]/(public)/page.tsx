import { HeroBanner } from '@/components/public/HeroBanner/HeroBanner'
import { ProductGrid } from '@/components/public/ProductGrid/ProductGrid'
import { CategoryGrid } from '@/components/public/CategoryGrid/CategoryGrid'
import { SectionHeader } from '@/components/public/SectionHeader/SectionHeader'
import { getCachedFeaturedProducts, getCachedPublicCategories, getCachedStoreSettings } from '@/lib/cached-queries'
import styles from './page.module.css'

export const revalidate = 60

export default async function HomePage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params
  
  const [featuredProducts, categories, settings] = await Promise.all([
    getCachedFeaturedProducts(8, domain),
    getCachedPublicCategories(domain),
    getCachedStoreSettings(domain),
  ])

  return (
    <>
      <HeroBanner
        title={settings?.heroTitle || settings?.businessName || "Bienvenido"}
        subtitle={settings?.heroSubtitle || "Los mejores productos para tu hogar."}
      />

      {settings?.aboutText && (
        <section className={styles.section} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div className={styles.container}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {settings.aboutText}
            </p>
          </div>
        </section>
      )}

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
