import { Header } from '@/components/layout/Header/Header'
import { Footer } from '@/components/layout/Footer/Footer'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat/WhatsAppFloat'
import { getCachedStoreSettings } from '@/lib/cached-queries'
import styles from './layout.module.css'

export const revalidate = 300

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ domain: string }>
}) {
  const { domain } = await params
  const settings = await getCachedStoreSettings(domain)

  const businessName = settings?.businessName ?? 'Colchones & Descanso'
  const whatsappNumber = settings?.whatsappNumber ?? ''
  const addresses = settings?.addresses ?? []
  const facebookUrl = settings?.facebookUrl
  const instagramUrl = settings?.instagramUrl
  const logoUrl = settings?.logoUrl

  return (
    <div className={styles.layout}>
      <Header businessName={businessName} logoUrl={logoUrl} />
      <main className={styles.main}>{children}</main>
      <Footer
        businessName={businessName}
        addresses={addresses}
        facebookUrl={facebookUrl}
        instagramUrl={instagramUrl}
      />
      {whatsappNumber && <WhatsAppFloat phone={whatsappNumber} />}
    </div>
  )
}
