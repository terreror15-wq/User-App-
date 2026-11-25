import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({ title, busy, onClose, children }: {
  title: string
  busy: boolean
  onClose: () => void
  children: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const element = dialog.current
    const previous = document.activeElement
    element?.showModal()
    return () => {
      element?.close()
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus()
      else document.getElementById('new-user')?.focus()
    }
  }, [])

  return (
    <dialog ref={dialog} aria-labelledby={titleId} onCancel={event => {
      event.preventDefault()
      if (!busy) onClose()
    }}>
      <div className="modal-heading">
        <h2 id={titleId}>{title}</h2>
        <button className="icon-button" aria-label="Cerrar" disabled={busy} onClick={onClose}><X size={20} /></button>
      </div>
      {children}
    </dialog>
  )
}
