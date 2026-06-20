'use client'

import { useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Toast } from 'primereact/toast'
import { Sidebar } from '@/components/layout/Sidebar/Sidebar'
import { setToastRef } from '@/lib/toast'
import styles from './layout.module.css'

type AdminLayoutShellProps = {
  children: React.ReactNode
  businessName: string
}

export function AdminLayoutShell({ children, businessName }: AdminLayoutShellProps) {
  const ref = useRef<Toast>(null)
  const pathname = usePathname()
  const isLogin = pathname === '/admin'

  useEffect(() => {
    setToastRef(ref.current)
    return () => setToastRef(null)
  }, [])

  if (isLogin) {
    return (
      <>
        <Toast ref={ref} position="top-right" />
        {children}
      </>
    )
  }

  return (
    <div className={styles.layout}>
      <Sidebar businessName={businessName} />
      <main className={styles.main}>
        <Toast ref={ref} position="top-right" />
        {children}
      </main>
    </div>
  )
}
