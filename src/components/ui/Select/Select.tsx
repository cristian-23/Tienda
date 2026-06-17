import { useId } from 'react'
import { Dropdown } from 'primereact/dropdown'
import styles from './Select.module.css'

type SelectOption = { value: string; label: string }

type SelectProps = {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
  value?: string
  onChange?: (e: { target: { value: string } } | string) => void
  onBlur?: () => void
  name?: string
}

export function Select({ label, error, options, placeholder, value, onChange, onBlur, name }: SelectProps) {
  const id = useId()

  function handleChange(e: { value: string }) {
    if (onChange) {
      onChange({ target: { value: e.value } })
    }
  }

  return (
    <div className={styles.field}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <Dropdown
        inputId={id}
        value={value}
        options={options}
        optionLabel="label"
        optionValue="value"
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        name={name}
        className={`${styles.select} ${error ? 'p-invalid' : ''}`}
        checkmark
        highlightOnSelect
      />
      {error && <small className={styles.error}>{error}</small>}
    </div>
  )
}
