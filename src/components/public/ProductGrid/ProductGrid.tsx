import { ProductCard } from '@/components/public/ProductCard/ProductCard'
import type { ProductPublicDTO } from '@/types'
import styles from './ProductGrid.module.css'

type ProductGridProps = {
  products: ProductPublicDTO[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No se encontraron productos</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
