import { useId } from 'react'
import { InputTextarea as PrimeTextarea } from 'primereact/inputtextarea'
import styles from './Textarea.module.css'

type TextareaProps = {
  label?: string
  error?: string
  value?: string
  onChange?: (e: { target: { value: string } }) => void
  onBlur?: () => void
  name?: string
  placeholder?: string
  rows?: number
  className?: string
}

export function Textarea({ label, error, value, onChange, onBlur, name, placeholder, rows = 3, className }: TextareaProps) {
  const id = useId()

  return (
    <div className={styles.field}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <PrimeTextarea
        id={id}
        value={value}
        onChange={(e) => onChange?.({ target: { value: e.target.value } })}
        onBlur={onBlur}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`${styles.textarea} ${error ? 'p-invalid' : ''} ${className ?? ''}`}
      />
      {error && <small className={styles.error}>{error}</small>}
    </div>
  )
}
