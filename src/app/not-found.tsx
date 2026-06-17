'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button/Button'
import styles from './not-found.module.css'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Página no encontrada</p>
      <Button onClick={() => router.push('/')}>Volver al inicio</Button>
    </div>
  )
}
