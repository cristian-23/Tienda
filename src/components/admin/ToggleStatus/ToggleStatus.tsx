'use client'

import { useTransition } from 'react'
import { Toggle } from '@/components/ui/Toggle/Toggle'

type ToggleStatusProps = {
  id: string
  active: boolean
  onToggle: (id: string, active: boolean) => Promise<void>
}

export function ToggleStatus({ id, active, onToggle }: ToggleStatusProps) {
  const [pending, startTransition] = useTransition()

  function handleChange() {
    startTransition(async () => {
      await onToggle(id, !active)
    })
  }

  return (
    <Toggle
      label={active ? 'Activo' : 'Inactivo'}
      checked={active}
      onChange={handleChange}
      disabled={pending}
    />
  )
}
