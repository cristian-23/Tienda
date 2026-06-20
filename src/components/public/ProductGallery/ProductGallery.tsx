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
  const [isOpen, setIsOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <span>Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className={styles.gallery}>
      <div 
        className={styles.main} 
        onClick={() => { setIsOpen(true); setZoomScale(1); }}
        title="Haz clic para ampliar la imagen"
      >
        <Image
          src={images[selectedIndex].url}
          alt={`${productName} - Imagen ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.mainImage}
          priority
        />
        <div className={styles.magnifyIcon}>
          <i className="pi pi-search-plus" />
        </div>
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

      {/* Lightbox Modal */}
      {isOpen && (
        <div className={styles.lightbox} onClick={() => setIsOpen(false)}>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar vista"
          >
            &times;
          </button>

          {images.length > 1 && (
            <>
              <button 
                type="button" 
                className={`${styles.navBtn} ${styles.prevBtn}`} 
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  setZoomScale(1)
                }}
                aria-label="Imagen anterior"
              >
                &#10094;
              </button>
              <button 
                type="button" 
                className={`${styles.navBtn} ${styles.nextBtn}`} 
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  setZoomScale(1)
                }}
                aria-label="Siguiente imagen"
              >
                &#10095;
              </button>
            </>
          )}

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div 
              className={styles.imageContainer}
              style={{ transform: `scale(${zoomScale})` }}
              onClick={() => setZoomScale((prev) => (prev === 1 ? 2 : 1))}
              title={zoomScale === 1 ? "Haz clic para ampliar 2x" : "Haz clic para restaurar"}
            >
              <img
                src={images[selectedIndex].url}
                alt={`${productName} - Vista ampliada`}
                className={styles.lightboxImage}
              />
            </div>
            <div className={styles.zoomHint}>
              {zoomScale === 1 ? "Haz clic en la imagen para hacer zoom 2x" : "Haz clic para restaurar tamaño"}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
