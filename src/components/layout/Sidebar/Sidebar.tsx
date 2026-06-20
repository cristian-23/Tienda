'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import styles from './Sidebar.module.css'

const navItems = [
  { label: 'Dashboard', icon: 'pi pi-home', url: '/admin/dashboard' },
  { label: 'Productos', icon: 'pi pi-box', url: '/admin/productos' },
  { label: 'Categorías', icon: 'pi pi-tags', url: '/admin/categorias' },
  { label: 'Configuración', icon: 'pi pi-cog', url: '/admin/configuracion' },
]

type SidebarProps = {
  businessName: string
}

export function Sidebar({ businessName }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Header Bar */}
      <header className={styles.mobileHeader}>
        <Link href="/admin/dashboard" className={styles.logo} onClick={closeSidebar}>
          <i className="pi pi-crown" style={{ color: 'var(--color-accent)', fontSize: '1.25rem' }} />
          <span>Admin</span>
        </Link>
        <button
          onClick={toggleSidebar}
          className={styles.hamburger}
          aria-label="Abrir menú"
        >
          <i className={isOpen ? 'pi pi-times' : 'pi pi-bars'} />
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {isOpen && <div className={styles.backdrop} onClick={closeSidebar} />}

      {/* Sidebar Drawer */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.header}>
          <Link href="/admin/dashboard" className={styles.logo} onClick={closeSidebar}>
            <i className="pi pi-crown" style={{ color: 'var(--color-accent)', fontSize: '1.5rem' }} />
            <span className={styles.logoText}>Admin Panel</span>
          </Link>
          <button onClick={closeSidebar} className={styles.closeBtn} aria-label="Cerrar menú">
            <i className="pi pi-times" />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <span className={styles.groupLabel}>Catálogo y Gestión</span>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.url)
              return (
                <Link
                  key={item.label}
                  href={item.url}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  onClick={closeSidebar}
                >
                  <i className={`${item.icon} ${styles.navIcon}`} />
                  <span className={styles.linkLabel}>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className={styles.separator} />

          <div className={styles.navGroup}>
            <span className={styles.groupLabel}>Sistema</span>
            <Link href="/" className={styles.navLink} target="_blank" rel="noopener noreferrer">
              <i className="pi pi-external-link styles.navIcon" />
              <span className={styles.linkLabel}>Ver tienda pública</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin' })}
              className={`${styles.navLink} ${styles.logoutBtn}`}
            >
              <i className="pi pi-sign-out styles.navIcon" />
              <span className={styles.linkLabel}>Cerrar sesión</span>
            </button>
          </div>
        </nav>

        <div className={styles.footer}>
          <span className={styles.footerText}>{businessName}</span>
          <span className={styles.footerSub}>v1.0.0</span>
        </div>
      </aside>
    </>
  )
}
