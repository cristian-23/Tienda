import Link from 'next/link'
import styles from './Pagination.module.css'

type PaginationProps = {
  currentPage: number
  totalPages: number
  total?: number
  baseUrl: string
  searchParams?: Record<string, string>
}

function buildUrl(baseUrl: string, page: number, searchParams?: Record<string, string>) {
  const params = new URLSearchParams(searchParams ?? {})
  if (page <= 1) {
    params.delete('page')
  } else {
    params.set('page', String(page))
  }
  const qs = params.toString()
  return qs ? `${baseUrl}?${qs}` : baseUrl
}

export function Pagination({ currentPage, totalPages, total = 0, baseUrl, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className={styles.nav} aria-label="Paginación">
      {currentPage > 1 ? (
        <Link href={buildUrl(baseUrl, currentPage - 1, searchParams)} className={styles.link}>
          ← Anterior
        </Link>
      ) : (
        <span className={`${styles.link} ${styles.disabled}`}>← Anterior</span>
      )}

      <span className={styles.info}>
        Página {currentPage} de {totalPages}
        {total > 0 && <span className={styles.total}> ({total} productos)</span>}
      </span>

      {currentPage < totalPages ? (
        <Link href={buildUrl(baseUrl, currentPage + 1, searchParams)} className={styles.link}>
          Siguiente →
        </Link>
      ) : (
        <span className={`${styles.link} ${styles.disabled}`}>Siguiente →</span>
      )}
    </nav>
  )
}
