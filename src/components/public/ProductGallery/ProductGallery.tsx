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

  // Coordenadas de arrastre para Zoom Desplazable (Drag & Pan)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <span>Sin imágenes</span>
      </div>
    )
  }

  const resetZoom = () => {
    setZoomScale(1)
    setPosition({ x: 0, y: 0 })
    setIsDragging(false)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    resetZoom()
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    resetZoom()
  }

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (zoomScale === 2) {
      resetZoom()
    } else {
      setZoomScale(2)
    }
  }

  const closeLightbox = () => {
    setIsOpen(false)
    resetZoom()
  }

  // Eventos de arrastre con Ratón (Escritorio)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale === 2) {
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomScale === 2) {
      e.stopPropagation()
      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  // Eventos de arrastre con Toque (Móvil)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale === 2 && e.touches.length === 1) {
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoomScale === 2 && e.touches.length === 1) {
      e.stopPropagation()
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
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
              onClick={() => { setSelectedIndex(index); resetZoom(); }}
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
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={closeLightbox}
            aria-label="Cerrar vista"
          >
            &times;
          </button>

          {images.length > 1 && (
            <>
              <button 
                type="button" 
                className={`${styles.navBtn} ${styles.prevBtn}`} 
                onClick={handlePrev}
                aria-label="Imagen anterior"
              >
                &#10094;
              </button>
              <button 
                type="button" 
                className={`${styles.navBtn} ${styles.nextBtn}`} 
                onClick={handleNext}
                aria-label="Siguiente imagen"
              >
                &#10095;
              </button>
            </>
          )}

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div 
              className={`${styles.imageContainer} ${zoomScale === 2 ? styles.imageContainerZoomed : ''} ${isDragging ? styles.imageContainerDragging : ''}`}
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoomScale})` }}
              onClick={toggleZoom}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              title={zoomScale === 1 ? "Haz clic para ampliar 2x" : "Arrastra para mover la imagen"}
            >
              <img
                src={images[selectedIndex].url}
                alt={`${productName} - Vista ampliada`}
                className={styles.lightboxImage}
                draggable="false"
              />
            </div>
            <div className={styles.zoomHint}>
              {zoomScale === 1 
                ? "Haz clic en la imagen para hacer zoom 2x" 
                : "Arrastra para mover. Haz clic para restaurar"}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
