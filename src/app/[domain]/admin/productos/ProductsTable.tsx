'use client'

import { useTransition, useState } from 'react'
import Link from 'next/link'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Button } from '@/components/ui/Button/Button'
import { formatPrice, formatDate } from '@/lib/utils'
import { deleteProduct } from '@/actions/products.actions'
import { showToast } from '@/lib/toast'
import styles from './page.module.css'

type ProductRow = {
  id: string
  name: string
  price: number
  featured: boolean
  active: boolean
  category: { name: string }
  createdAt: Date
}

type Props = { products: ProductRow[] }

export function ProductsTable({ products }: Props) {
  const [pending, startTransition] = useTransition()
  const [visibleCount, setVisibleCount] = useState(10)

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    startTransition(async () => {
      const res = await deleteProduct(id)
      if (res.success) {
        showToast('success', 'Producto eliminado')
      } else {
        showToast('error', 'Error', res.error?.message ?? 'No se pudo eliminar')
      }
    })
  }

  const statusBodyTemplate = (row: ProductRow) => (
    row.active ? <Tag value="Activo" severity="success" /> : <Tag value="Inactivo" severity="danger" />
  )

  const featuredBodyTemplate = (row: ProductRow) => (
    row.featured ? <Tag value="Sí" severity="success" /> : <Tag value="No" severity="info" />
  )

  const priceBodyTemplate = (row: ProductRow) => formatPrice(row.price)
  const dateBodyTemplate = (row: ProductRow) => formatDate(row.createdAt)
  const categoryBodyTemplate = (row: ProductRow) => row.category.name

  const actionBodyTemplate = (row: ProductRow) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Link href={`/admin/productos/${row.id}`} className={styles.actionBtn} title="Editar producto">
        <i className="pi pi-pencil" />
      </Link>
      <button 
        type="button" 
        className={styles.actionBtn} 
        style={{ color: 'var(--color-error)' }}
        title="Eliminar producto"
        onClick={() => handleDelete(row.id)}
        disabled={pending}
      >
        <i className="pi pi-trash" />
      </button>
    </div>
  )

  const header = (
    <div className={styles.tableHeader}>
      <h1 className={styles.tableTitle}>Productos</h1>
      <Button href="/admin/productos/nuevo" size="sm" icon={<i className="pi pi-plus" />}>
        Nuevo producto
      </Button>
    </div>
  )

  const mobileVisibleProducts = products.slice(0, visibleCount)

  return (
    <div className="card">
      {/* Vista de Escritorio: DataTable */}
      <DataTable value={products} header={header} emptyMessage="No hay productos creados" stripedRows size="small" sortField="createdAt" sortOrder={-1} rows={20} rowsPerPageOptions={[10, 20, 50]} paginator className="p-datatable-sm">
        <Column field="name" header="Nombre" sortable style={{ minWidth: '200px' }} />
        <Column field="category" header="Categoría" body={categoryBodyTemplate} sortable style={{ minWidth: '140px' }} />
        <Column field="price" header="Precio" body={priceBodyTemplate} sortable style={{ width: '120px' }} />
        <Column field="featured" header="Destacado" body={featuredBodyTemplate} style={{ width: '110px' }} />
        <Column field="active" header="Estado" body={statusBodyTemplate} style={{ width: '110px' }} />
        <Column field="createdAt" header="Creado" body={dateBodyTemplate} sortable style={{ width: '160px' }} />
        <Column header="" body={actionBodyTemplate} style={{ width: '90px' }} />
      </DataTable>

      {/* Vista de Móvil: Cards */}
      {products.length === 0 ? (
        <div className={styles.mobileCards} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No hay productos creados
        </div>
      ) : (
        <div className={styles.mobileCards}>
          {mobileVisibleProducts.map((row) => (
            <div key={row.id} className={styles.cardItem}>
              <div className={styles.cardRow}>
                <h3 className={styles.cardName}>{row.name}</h3>
                <div className={styles.cardTags}>
                  {row.featured && <Tag value="Destacado" severity="warning" style={{ fontSize: '0.7rem' }} />}
                  {row.active ? (
                    <Tag value="Activo" severity="success" style={{ fontSize: '0.7rem' }} />
                  ) : (
                    <Tag value="Inactivo" severity="danger" style={{ fontSize: '0.7rem' }} />
                  )}
                </div>
              </div>
              
              <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Categoría:</span>
                  <span className={styles.detailValue}>{row.category.name}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Precio:</span>
                  <span className={styles.detailValue} style={{ color: 'var(--color-primary)' }}>{formatPrice(row.price)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Creado:</span>
                  <span className={styles.detailValue}>{formatDate(row.createdAt)}</span>
                </div>
              </div>
              
              <div className={styles.cardActions}>
                <Link href={`/admin/productos/${row.id}`} className={styles.actionBtn} title="Editar producto">
                  <i className="pi pi-pencil" />
                </Link>
                <button 
                  type="button" 
                  className={styles.actionBtn} 
                  style={{ color: 'var(--color-error)' }}
                  title="Eliminar producto"
                  onClick={() => handleDelete(row.id)}
                  disabled={pending}
                >
                  <i className="pi pi-trash" />
                </button>
              </div>
            </div>
          ))}
          
          {visibleCount < products.length && (
            <div className={styles.loadMoreWrapper}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setVisibleCount((prev) => prev + 10)}
              >
                Cargar más ({products.length - visibleCount} restantes)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
