import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductGallery } from '@/components/public/ProductGallery/ProductGallery'
import { WhatsAppButton } from '@/components/public/WhatsAppButton/WhatsAppButton'
import { getCachedProductBySlug, getCachedStoreSettings } from '@/lib/cached-queries'
import { formatPrice } from '@/lib/utils'
import styles from './page.module.css'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string; domain: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, domain } = await params
  const product = await getCachedProductBySlug(slug, domain)

  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: product.name,
    description: product.shortDescription ?? `${product.name} - ${formatPrice(product.price)}`,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug, domain } = await params
  const [product, settings] = await Promise.all([
    getCachedProductBySlug(slug, domain),
    getCachedStoreSettings(domain),
  ])

  if (!product) notFound()

  const whatsappNumber = settings?.whatsappNumber ?? ''

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/productos">Productos</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/categorias/${product.category.slug}`}>{product.category.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className={styles.layout}>
          <ProductGallery images={product.images} productName={product.name} />

          <div className={styles.info}>
            <Link href={`/categorias/${product.category.slug}`} className={styles.category}>
              {product.category.name}
            </Link>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>{formatPrice(product.price)}</p>

            {product.shortDescription && (
              <p className={styles.shortDesc}>{product.shortDescription}</p>
            )}

            {product.stock !== null && (
              <p className={`${styles.stock} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
                {product.stock > 0 ? `✓ ${product.stock} unidades disponibles` : 'Sin stock'}
              </p>
            )}

            {whatsappNumber && (
              <div className={styles.cta}>
                <WhatsAppButton
                  phone={whatsappNumber}
                  productName={product.name}
                  productPrice={product.price}
                />
                <p className={styles.ctaHint}>Te respondemos en minutos por WhatsApp</p>
              </div>
            )}

            {product.description && (
              <div className={styles.description}>
                <h2>Descripción</h2>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
