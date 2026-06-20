export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin')

  let totalProducts = 0
  let totalCategories = 0
  let activeProducts = 0
  let featuredProducts = 0

  try {
    const [pCount, aCount, fCount, cCount] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { featured: true } }),
      prisma.category.count(),
    ])
    totalProducts = pCount
    activeProducts = aCount
    featuredProducts = fCount
    totalCategories = cCount
  } catch {
    // DB not available — show zeros
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Control</h1>
        <p className={styles.subtitle}>
          Bienvenido de vuelta. Aquí tienes un resumen general del catálogo de tu tienda.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.blue}`}>
          <div className={styles.cardInner}>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalProducts}</span>
              <span className={styles.statLabel}>Total Productos</span>
            </div>
            <div className={styles.iconWrapper}>
              <i className="pi pi-box" />
            </div>
          </div>
          <Link href="/admin/productos" className={styles.cardFooter}>
            <span>Gestionar productos</span>
            <i className="pi pi-arrow-right" />
          </Link>
        </div>

        <div className={`${styles.card} ${styles.amber}`}>
          <div className={styles.cardInner}>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalCategories}</span>
              <span className={styles.statLabel}>Categorías</span>
            </div>
            <div className={styles.iconWrapper}>
              <i className="pi pi-tags" />
            </div>
          </div>
          <Link href="/admin/categorias" className={styles.cardFooter}>
            <span>Gestionar categorías</span>
            <i className="pi pi-arrow-right" />
          </Link>
        </div>

        <div className={`${styles.card} ${styles.green}`}>
          <div className={styles.cardInner}>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{activeProducts}</span>
              <span className={styles.statLabel}>Productos Activos</span>
            </div>
            <div className={styles.iconWrapper}>
              <i className="pi pi-check-circle" />
            </div>
          </div>
          <Link href="/admin/productos" className={styles.cardFooter}>
            <span>Ver activos</span>
            <i className="pi pi-arrow-right" />
          </Link>
        </div>

        <div className={`${styles.card} ${styles.gold}`}>
          <div className={styles.cardInner}>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{featuredProducts}</span>
              <span className={styles.statLabel}>Destacados</span>
            </div>
            <div className={styles.iconWrapper}>
              <i className="pi pi-star" />
            </div>
          </div>
          <Link href="/admin/productos" className={styles.cardFooter}>
            <span>Ver destacados</span>
            <i className="pi pi-arrow-right" />
          </Link>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Accesos Rápidos</h2>
        <div className={styles.actionsGrid}>
          <Link href="/admin/productos/nuevo" className={styles.actionCard}>
            <div className={`${styles.actionIcon} ${styles.bgPrimary}`}>
              <i className="pi pi-plus-circle" />
            </div>
            <div className={styles.actionContent}>
              <span className={styles.actionName}>Nuevo Producto</span>
              <span className={styles.actionDesc}>Registra un nuevo colchón o mueble con sus detalles e imágenes</span>
            </div>
          </Link>

          <Link href="/admin/categorias/nuevo" className={styles.actionCard}>
            <div className={`${styles.actionIcon} ${styles.bgAccent}`}>
              <i className="pi pi-tag" />
            </div>
            <div className={styles.actionContent}>
              <span className={styles.actionName}>Nueva Categoría</span>
              <span className={styles.actionDesc}>Crea una nueva línea de productos para tu catálogo</span>
            </div>
          </Link>

          <Link href="/admin/configuracion" className={styles.actionCard}>
            <div className={`${styles.actionIcon} ${styles.bgDark}`}>
              <i className="pi pi-cog" />
            </div>
            <div className={styles.actionContent}>
              <span className={styles.actionName}>Configuración General</span>
              <span className={styles.actionDesc}>Edita la información de contacto, redes sociales, sucursales y logo</span>
            </div>
          </Link>

          <Link href="/" target="_blank" className={styles.actionCard}>
            <div className={`${styles.actionIcon} ${styles.bgSecondary}`}>
              <i className="pi pi-external-link" />
            </div>
            <div className={styles.actionContent}>
              <span className={styles.actionName}>Ver Sitio Público</span>
              <span className={styles.actionDesc}>Visita la tienda de cara al cliente para verificar el catálogo</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
