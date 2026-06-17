import type { ReactNode } from 'react'
import { Dialog } from 'primereact/dialog'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <Dialog
      header={title}
      visible={open}
      onHide={onClose}
      modal
      draggable={false}
      style={{ minWidth: '320px' }}
    >
      {children}
    </Dialog>
  )
}
