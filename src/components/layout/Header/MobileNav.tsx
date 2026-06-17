'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './MobileNav.module.css'

type MobileNavProps = {
  businessName: string
}

export function MobileNav({ businessName }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span className={`${styles.bar} ${open ? styles.barOpen : ''}`} />
        <span className={`${styles.bar} ${open ? styles.barHidden : ''}`} />
        <span className={`${styles.bar} ${open ? styles.barOpen2 : ''}`} />
      </button>

      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} aria-hidden="true" />
          <nav className={styles.drawer} aria-label="Navegación móvil">
            <p className={styles.brand}>{businessName}</p>
            <Link href="/productos" className={styles.link} onClick={() => setOpen(false)}>
              Productos
            </Link>
            <Link href="/categorias" className={styles.link} onClick={() => setOpen(false)}>
              Categorías
            </Link>
          </nav>
        </>
      )}
    </>
  )
}
