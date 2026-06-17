import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge/Badge'
import { formatPrice } from '@/lib/utils'
import type { ProductPublicDTO } from '@/types'
import styles from './ProductCard.module.css'

type ProductCardProps = {
  product: ProductPublicDTO
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/productos/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {product.primaryImage ? (
          <Image
            src={product.primaryImage.url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <span>Sin imagen</span>
          </div>
        )}
        {product.featured && (
          <Badge variant="accent" className={styles.badge}>
            Destacado
          </Badge>
        )}
        <div className={styles.overlay}>
          <span className={styles.viewDetail}>Ver detalle</span>
        </div>
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{product.category.name}</span>
        <h3 className={styles.name}>{product.name}</h3>
        {product.shortDescription && (
          <p className={styles.desc}>{product.shortDescription}</p>
        )}
        <p className={styles.price}>{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
