'use client'

import { Button } from '@/components/ui/Button/Button'
import styles from './error.module.css'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>Error</h1>
      <p className={styles.message}>Ocurrió un error inesperado</p>
      <Button onClick={reset}>Intentar nuevamente</Button>
    </div>
  )
}
