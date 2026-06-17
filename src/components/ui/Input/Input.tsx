import { useId } from 'react'
import { InputText } from 'primereact/inputtext'
import styles from './Input.module.css'

type InputProps = {
  label?: string
  error?: string
  value?: string | number
  onChange?: (e: { target: { value: string } }) => void
  onBlur?: () => void
  name?: string
  placeholder?: string
  type?: string
  step?: string
  className?: string
}

export function Input({ label, error, value, onChange, onBlur, name, placeholder, type = 'text', step, className }: InputProps) {
  const id = useId()

  return (
    <div className={styles.field}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <InputText
        id={id}
        value={value as string}
        onChange={(e) => onChange?.({ target: { value: e.target.value } })}
        onBlur={onBlur}
        name={name}
        placeholder={placeholder}
        type={type}
        step={step}
        className={`${styles.input} ${error ? 'p-invalid' : ''} ${className ?? ''}`}
      />
      {error && <small className={styles.error}>{error}</small>}
    </div>
  )
}
