import type { Toast } from 'primereact/toast'

let toastRef: Toast | null = null

export function setToastRef(ref: Toast | null) {
  toastRef = ref
}

export function showToast(severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail?: string) {
  toastRef?.show({ severity, summary, detail, life: 4000 })
}
