'use client'

import { ProductForm } from '@/components/forms/ProductForm/ProductForm'
import { ImageManager } from '@/components/admin/ImageManager/ImageManager'
import { updateProduct } from '@/actions/products.actions'
import { uploadProductImage, deleteProductImage, reorderImages } from '@/actions/images.actions'
import type { ImageDTO } from '@/types'
import styles from './page.module.css'

type CategoryOption = { id: string; name: string }
type ProductData = {
  name: string
  slug: string
  shortDescription: string | null
  description: string | null
  price: number
  stock: number | null
  featured: boolean
  active: boolean
  categoryId: string
  images: Array<{ id: string; url: string; order: number }>
}

type EditProductClientProps = {
  productId: string
  categories: CategoryOption[]
  product: ProductData
}

export function EditProductClient({ productId, categories, product }: EditProductClientProps) {
  const defaultValues = {
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? '',
    description: product.description ?? '',
    price: product.price,
    stock: product.stock,
    featured: product.featured,
    active: product.active,
    categoryId: product.categoryId,
  }

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.subtitle}>Información del producto</h2>
        <ProductForm
          categories={categories}
          defaultValues={defaultValues}
          onSubmit={updateProduct.bind(null, productId)}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Imágenes</h2>
        <ImageManager
          productId={productId}
          images={product.images.map((img) => ({ id: img.id, url: img.url, order: img.order })) as ImageDTO[]}
          onUpload={(pid, file) => uploadProductImage(pid, file)}
          onDelete={(imageId) => deleteProductImage(imageId, productId)}
          onReorder={(imageIds) => reorderImages(productId, imageIds)}
        />
      </section>
    </>
  )
}
