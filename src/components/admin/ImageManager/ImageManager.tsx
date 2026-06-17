'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import { Button } from 'primereact/button'
import { showToast } from '@/lib/toast'
import { ImageUploader } from '@/components/admin/ImageUploader/ImageUploader'
import type { ImageDTO, ActionResponse } from '@/types'
import styles from './ImageManager.module.css'

type ImageManagerProps = {
  productId: string
  images: ImageDTO[]
  onUpload: (productId: string, file: File) => Promise<ActionResponse<ImageDTO>>
  onDelete: (imageId: string) => Promise<ActionResponse>
  onReorder: (imageIds: string[]) => Promise<ActionResponse>
}

export function ImageManager({ productId, images, onUpload, onDelete, onReorder }: ImageManagerProps) {
  const [pending, startTransition] = useTransition()

  async function handleDelete(imageId: string) {
    startTransition(async () => {
      const result = await onDelete(imageId)
      if (result.success) {
        showToast('success', 'Imagen eliminada')
      } else {
        showToast('error', 'Error', result.error?.message ?? 'Error al eliminar imagen')
      }
    })
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return
    const newOrder = [...images]
    ;[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
    startTransition(async () => {
      const result = await onReorder(newOrder.map((img) => img.id))
      if (!result.success) {
        showToast('error', 'Error', result.error?.message ?? 'Error al reordenar')
      }
    })
  }

  async function handleMoveDown(index: number) {
    if (index === images.length - 1) return
    const newOrder = [...images]
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    startTransition(async () => {
      const result = await onReorder(newOrder.map((img) => img.id))
      if (!result.success) {
        showToast('error', 'Error', result.error?.message ?? 'Error al reordenar')
      }
    })
  }

  return (
    <div className={styles.manager}>
      <ImageUploader productId={productId} onUpload={onUpload} />
      {images.length === 0 ? (
        <p className={styles.empty}>No hay imágenes. Sube la primera imagen.</p>
      ) : (
        <div className={styles.grid}>
          {images.map((image, index) => (
            <div key={image.id} className={styles.item}>
              <div className={styles.imageWrapper}>
                <Image src={image.url} alt={`Imagen ${index + 1}`} fill sizes="150px" className={styles.image} />
              </div>
              <div className={styles.actions}>
                <Button icon="pi pi-chevron-up" size="small" text rounded severity="info"
                  onClick={() => handleMoveUp(index)} disabled={index === 0 || pending} />
                <Button icon="pi pi-chevron-down" size="small" text rounded severity="info"
                  onClick={() => handleMoveDown(index)} disabled={index === images.length - 1 || pending} />
                <Button icon="pi pi-trash" size="small" text rounded severity="danger"
                  onClick={() => handleDelete(image.id)} disabled={pending} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
