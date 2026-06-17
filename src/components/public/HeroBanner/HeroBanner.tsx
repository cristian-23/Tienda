import { Button } from '@/components/ui/Button/Button'
import styles from './HeroBanner.module.css'

type HeroBannerProps = {
  title: string
  subtitle?: string
}

export function HeroBanner({ title, subtitle }: HeroBannerProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.bgPattern} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.eyebrow}>Tu descanso, nuestra prioridad</span>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.actions}>
          <Button href="/productos" size="lg">
            Explorar catálogo
          </Button>
          <Button href="/categorias" variant="secondary" size="lg">
            Ver categorías
          </Button>
        </div>
        <ul className={styles.trust} aria-label="Beneficios">
          <li>
            <span className={styles.trustIcon} aria-hidden="true">✦</span>
            Calidad premium
          </li>
          <li>
            <span className={styles.trustIcon} aria-hidden="true">✦</span>
            Asesoría personalizada
          </li>
          <li>
            <span className={styles.trustIcon} aria-hidden="true">✦</span>
            Envío a domicilio
          </li>
        </ul>
      </div>
    </section>
  )
}
