'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './ProductGallery.module.css'

type GalleryImage = {
  id: string
  url: string
  order: number
}

type ProductGalleryProps = {
  images: GalleryImage[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <span>Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Image
          src={images[selectedIndex].url}
          alt={`${productName} - Imagen ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.mainImage}
          priority
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs} role="tablist" aria-label="Miniaturas del producto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`Imagen ${index + 1}`}
              onClick={() => setSelectedIndex(index)}
              className={`${styles.thumb} ${index === selectedIndex ? styles.thumbActive : ''}`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="80px"
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
