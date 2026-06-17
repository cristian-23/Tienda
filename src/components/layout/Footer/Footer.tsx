import Link from 'next/link'
import type { StoreAddress } from '@/types'
import styles from './Footer.module.css'

type FooterProps = {
  businessName: string
  addresses?: StoreAddress[]
  facebookUrl?: string | null
  instagramUrl?: string | null
}

export function Footer({ businessName, addresses, facebookUrl, instagramUrl }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <h3 className={styles.name}>{businessName}</h3>
          <p className={styles.tagline}>
            Muebles y descanso de calidad para transformar tu hogar.
          </p>
          {addresses && addresses.length > 0 && (
            <div className={styles.addresses}>
              {addresses.map((addr, i) => (
                <p key={i} className={styles.address}>
                  {addr.label && <strong>{addr.label}: </strong>}
                  {addr.address}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Navegación</h4>
          <nav className={styles.links}>
            <Link href="/productos" className={styles.link}>Productos</Link>
            <Link href="/categorias" className={styles.link}>Categorías</Link>
          </nav>
        </div>

        {(facebookUrl || instagramUrl) && (
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Síguenos</h4>
            <div className={styles.social}>
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  Facebook
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} {businessName}. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
