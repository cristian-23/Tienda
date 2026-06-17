import type { ReactNode } from 'react'
import { Card as PrimeCard } from 'primereact/card'

type CardProps = {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function Card({ title, subtitle, children, className }: CardProps) {
  return (
    <PrimeCard title={title} subTitle={subtitle} className={className}>
      {children}
    </PrimeCard>
  )
}
