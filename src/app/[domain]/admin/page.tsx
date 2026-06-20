'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button/Button'
import { Input } from '@/components/ui/Input/Input'
import { z } from 'zod'
import styles from './page.module.css'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginInput = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    setError(null)

    try {
      const result = (await Promise.race([
        signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 8000)
        ),
      ])) as Awaited<ReturnType<typeof signIn>>

      if (result?.error) {
        setError('Credenciales inválidas')
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Error de conexión. ¿Corriste el SQL en Supabase?')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoBadge}>
            <i className="pi pi-crown" />
          </div>
          <h1 className={styles.title}>Iniciar sesión</h1>
          <p className={styles.subtitle}>Panel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Controller name="email" control={control} render={({ field }) => (
            <Input label="Correo electrónico" type="email" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.email?.message} placeholder="admin@colchones.com" />
          )} />

          <Controller name="password" control={control} render={({ field }) => (
            <Input label="Contraseña" type="password" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.password?.message} placeholder="••••••••" />
          )} />

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth isLoading={loading} variant="primary">
            Ingresar al panel
          </Button>
        </form>
      </div>
    </div>
  )
}
