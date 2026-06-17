import Link from 'next/link'
import Image from 'next/image'
import { SearchBar } from '@/components/public/SearchBar/SearchBar'
import { MobileNav } from './MobileNav'
import styles from './Header.module.css'

type HeaderProps = {
  businessName: string
  logoUrl?: string | null
}

export function Header({ businessName, logoUrl }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={businessName}
              className={styles.logoImg}
              width={140}
              height={44}
              priority
            />
          ) : (
            <span className={styles.logoText}>{businessName}</span>
          )}
        </Link>

        <nav className={styles.nav} aria-label="Navegación principal">
          <Link href="/productos" className={styles.navLink}>
            Productos
          </Link>
          <Link href="/categorias" className={styles.navLink}>
            Categorías
          </Link>
        </nav>

        <div className={styles.search}>
          <SearchBar />
        </div>

        <MobileNav businessName={businessName} />
      </div>
    </header>
  )
}
