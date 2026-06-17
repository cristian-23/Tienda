'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Button } from '@/components/ui/Button/Button'
import { formatDate } from '@/lib/utils'
import { deleteCategory } from '@/actions/categories.actions'
import { showToast } from '@/lib/toast'
import styles from './page.module.css'

type CategoryRow = {
  id: string
  name: string
  slug: string
  productCount: number
  active: boolean
  createdAt: Date
}

type Props = { categories: CategoryRow[] }

export function CategoriesTable({ categories }: Props) {
  const [pending, startTransition] = useTransition()

  const handleDelete = (id: string, productCount: number) => {
    if (productCount > 0) {
      showToast('error', 'No se puede eliminar', 'La categoría tiene productos asociados')
      return
    }
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return
    
    startTransition(async () => {
      const res = await deleteCategory(id)
      if (res.success) {
        showToast('success', 'Categoría eliminada')
      } else {
        showToast('error', 'Error', res.error?.message ?? 'No se pudo eliminar')
      }
    })
  }
  const statusBodyTemplate = (row: CategoryRow) => (
    row.active ? <Tag value="Activo" severity="success" /> : <Tag value="Inactivo" severity="danger" />
  )

  const dateBodyTemplate = (row: CategoryRow) => formatDate(row.createdAt)

  const actionBodyTemplate = (row: CategoryRow) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Link href={`/admin/categorias/${row.id}`} className={styles.actionBtn} title="Editar categoría">
        <i className="pi pi-pencil" />
      </Link>
      <button 
        type="button" 
        className={styles.actionBtn} 
        style={{ color: 'var(--color-error)' }}
        title="Eliminar categoría"
        onClick={() => handleDelete(row.id, row.productCount)}
        disabled={pending}
      >
        <i className="pi pi-trash" />
      </button>
    </div>
  )

  const header = (
    <div className={styles.tableHeader}>
      <h1 className={styles.tableTitle}>Categorías</h1>
      <Button href="/admin/categorias/nuevo" size="sm" icon={<i className="pi pi-plus" />}>
        Nueva categoría
      </Button>
    </div>
  )

  return (
    <div className="card">
      <DataTable value={categories} header={header} emptyMessage="No hay categorías creadas" stripedRows size="small" rows={20} rowsPerPageOptions={[10, 20, 50]} paginator className="p-datatable-sm">
        <Column field="name" header="Nombre" sortable style={{ minWidth: '200px' }} />
        <Column field="slug" header="Slug" style={{ minWidth: '180px' }} />
        <Column field="productCount" header="Productos" style={{ width: '110px' }} />
        <Column field="active" header="Estado" body={statusBodyTemplate} style={{ width: '110px' }} />
        <Column field="createdAt" header="Creado" body={dateBodyTemplate} sortable style={{ width: '160px' }} />
        <Column header="" body={actionBodyTemplate} style={{ width: '90px' }} />
      </DataTable>
    </div>
  )
}
