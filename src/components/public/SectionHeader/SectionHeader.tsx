import Link from 'next/link'
import styles from './SectionHeader.module.css'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  action?: { label: string; href: string }
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className={styles.action}>
          {action.label}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  )
}
