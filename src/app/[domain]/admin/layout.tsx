import 'primereact/resources/themes/lara-dark-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import '@/styles/prime-overrides.css'
import { settingsService } from '@/services/settings.service'
import { AdminLayoutShell } from './AdminLayoutShell'

type Props = {
  children: React.ReactNode
  params: Promise<{ domain: string }>
}

export default async function AdminLayout({
  children,
  params,
}: Props) {
  const { domain } = await params
  const settings = await settingsService.get(domain)
  const businessName = settings?.businessName ?? 'Admin Panel'

  return <AdminLayoutShell businessName={businessName}>{children}</AdminLayoutShell>
}
