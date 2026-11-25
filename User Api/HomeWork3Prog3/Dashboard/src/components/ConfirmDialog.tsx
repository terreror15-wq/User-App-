import { useState } from 'react'
import { LoaderCircle, Trash2 } from 'lucide-react'
import { errorMessage } from '../api/client'
import type { User } from '../types/user'
import { Modal } from './Modal'

export function ConfirmDialog({ user, onClose, onDelete, onError }: {
  user: User
  onClose: () => void
  onDelete: (id: number) => Promise<void>
  onError: (message: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function confirm() {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await onDelete(user.id)
      onClose()
    } catch (reason) {
      const message = errorMessage(reason)
      setError(message)
      onError(message)
    } finally {
      setBusy(false)
    }
  }

  return <Modal title="Eliminar usuario" busy={busy} onClose={onClose}>
    <p className="dialog-description">Se eliminará a <strong>{user.name} {user.lastName}</strong> del directorio. Esta acción es permanente.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="modal-footer">
      <button className="button secondary" autoFocus disabled={busy} onClick={onClose}>Cancelar</button>
      <button className="button danger" disabled={busy} onClick={() => void confirm()}>
        {busy ? <LoaderCircle size={18} className="animate-spin" /> : <Trash2 size={18} />}
        {busy ? 'Eliminando…' : 'Eliminar usuario'}
      </button>
    </div>
  </Modal>
}
