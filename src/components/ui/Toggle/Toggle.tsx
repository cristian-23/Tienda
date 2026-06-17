import { useId } from 'react'
import { InputSwitch } from 'primereact/inputswitch'
import styles from './Toggle.module.css'

type ToggleProps = {
  label: string
  checked?: boolean
  onChange?: (value: boolean) => void
  name?: string
  onBlur?: () => void
  disabled?: boolean
}

export function Toggle({ label, checked, onChange, name, onBlur, disabled }: ToggleProps) {
  const id = useId()

  function handleChange(e: { value: boolean }) {
    if (onChange) {
      onChange(e.value)
    }
  }

  return (
    <div className={styles.field}>
      <InputSwitch
        inputId={id}
        checked={checked ?? false}
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        disabled={disabled}
      />
      <label htmlFor={id} className={styles.label}>{label}</label>
    </div>
  )
}
