export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { StoreSettingsForm } from '@/components/forms/StoreSettingsForm/StoreSettingsForm'
import { settingsService } from '@/services/settings.service'
import { updateSettings } from '@/actions/settings.actions'
import styles from './page.module.css'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin')

  const settings = await settingsService.get()

  return (
    <div>
      <h1 className={styles.title}>Configuración</h1>
      <div className="card">
        <StoreSettingsForm
          defaultValues={settings ?? undefined}
          onSubmit={updateSettings}
        />
      </div>
    </div>
  )
}
