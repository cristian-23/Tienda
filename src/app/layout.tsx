import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { settingsService } from '@/services/settings.service'
import { getDomainFromHeaders } from '@/lib/server-utils'
import '@/styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getDomainFromHeaders()
  const settings = await settingsService.get(domain)
  return {
    title: {
      template: '%s | ' + (settings?.businessName || 'Colchones & Descanso'),
      default: (settings?.businessName || 'Colchones & Descanso') + ' - Tienda de Muebles',
    },
    description: 'Los mejores colchones, camas, roperos y muebles para tu hogar.',
    icons: settings?.faviconUrl ? {
      icon: settings.faviconUrl,
    } : {
      icon: '/default-favicon.ico',
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${poppins.className}`}>
      <body cz-shortcut-listen="true">{children}</body>
    </html>
  )
}
