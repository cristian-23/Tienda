'use client'

import { useRef } from 'react'
import { FileUpload } from 'primereact/fileupload'
import { showToast } from '@/lib/toast'
import type { ActionResponse, ImageDTO } from '@/types'

type ImageUploaderProps = {
  productId: string
  onUpload: (productId: string, file: File) => Promise<ActionResponse<ImageDTO>>
}

export function ImageUploader({ productId, onUpload }: ImageUploaderProps) {
  const fileUploadRef = useRef<FileUpload>(null)

  async function handleUpload(e: { files: File[] }) {
    const file = e.files[0]
    if (!file) return

    const result = await onUpload(productId, file)
    if (result.success) {
      showToast('success', 'Imagen subida correctamente')
      fileUploadRef.current?.clear()
    } else {
      showToast('error', 'Error', result.error?.message ?? 'Error al subir imagen')
    }
  }

  return (
    <FileUpload
      ref={fileUploadRef}
      mode="basic"
      name="file"
      accept="image/*"
      maxFileSize={5000000}
      auto
      customUpload
      uploadHandler={handleUpload}
      chooseLabel="Subir imagen"
      className="p-mb-3"
    />
  )
}
