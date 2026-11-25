import { useState, type FormEvent } from 'react'
import { LoaderCircle } from 'lucide-react'
import { ApiError, errorMessage } from '../api/client'
import type { User, UserInput } from '../types/user'
import { Modal } from './Modal'

const fields = [
  { name: 'name', label: 'Nombre', type: 'text', max: 100, autoComplete: 'given-name' },
  { name: 'lastName', label: 'Apellido', type: 'text', max: 100, autoComplete: 'family-name' },
  { name: 'email', label: 'Correo electrónico', type: 'email', max: 254, autoComplete: 'email' },
  { name: 'phoneNumber', label: 'Teléfono', type: 'tel', max: 30, autoComplete: 'tel' },
  { name: 'address', label: 'Dirección', type: 'text', max: 300, autoComplete: 'street-address' },
] as const

type Errors = Partial<Record<keyof UserInput, string>>
const empty: UserInput = { name: '', lastName: '', email: '', address: '', phoneNumber: '', isActive: true }

export function UserFormModal({ user, onClose, onSave, onError }: {
  user?: User
  onClose: () => void
  onSave: (data: UserInput, id?: number) => Promise<void>
  onError: (message: string) => void
}) {
  const [data, setData] = useState<UserInput>(() => user ? {
    name: user.name, lastName: user.lastName, email: user.email,
    address: user.address, phoneNumber: user.phoneNumber, isActive: user.isActive,
  } : empty)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const values = { ...data }
    const nextErrors: Errors = {}
    for (const field of fields) {
      values[field.name] = values[field.name].trim()
      if (!values[field.name]) nextErrors[field.name] = 'Este campo es obligatorio.'
      else if (values[field.name].length > field.max) nextErrors[field.name] = `Máximo ${field.max} caracteres.`
    }
    if (!nextErrors.email && !/^[^\s@]+@[^\s@]+$/.test(values.email)) nextErrors.email = 'Introduce un correo válido.'
    if (!nextErrors.phoneNumber && !/^[+\d().\s-]+(?:\s*(?:x|ext\.?|extension)\s*\d+)?$/i.test(values.phoneNumber)) {
      nextErrors.phoneNumber = 'Introduce un teléfono válido.'
    }
    setErrors(nextErrors)
    setFormError('')
    const first = Object.keys(nextErrors)[0]
    if (first) {
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus()
      return
    }

    setBusy(true)
    try {
      await onSave(values, user?.id)
      onClose()
    } catch (reason) {
      const fieldErrors: Errors = {}
      const general = []
      if (reason instanceof ApiError && reason.status === 400) {
        for (const [name, messages] of Object.entries(reason.problem.errors ?? {})) {
          const field = [...fields.map(item => item.name), 'isActive' as const]
            .find(item => item.toLowerCase() === name.replace(/^.*\./, '').toLowerCase())
          if (field) fieldErrors[field] = messages.join(' ')
          else general.push(...messages)
        }
      }
      setErrors(fieldErrors)
      if (general.length || !Object.keys(fieldErrors).length) setFormError(general.join(' ') || errorMessage(reason))
      onError(errorMessage(reason))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title={user ? 'Editar usuario' : 'Nuevo usuario'} busy={busy} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <fieldset disabled={busy} className="form-grid">
          {fields.map(field => (
            <div className={field.name === 'address' ? 'full-field' : ''} key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input id={field.name} name={field.name} type={field.type} autoComplete={field.autoComplete}
                maxLength={field.max} required autoFocus={field.name === 'name'} value={data[field.name]}
                aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                onChange={event => {
                  setData({ ...data, [field.name]: event.target.value })
                  setErrors({ ...errors, [field.name]: undefined })
                }} />
              {errors[field.name] && <p className="field-error" id={`${field.name}-error`}>{errors[field.name]}</p>}
            </div>
          ))}
          <div className="full-field">
            <label className="checkbox"><input type="checkbox" checked={data.isActive} aria-describedby={errors.isActive ? 'status-error' : undefined}
              onChange={event => {
                setData({ ...data, isActive: event.target.checked })
                setErrors({ ...errors, isActive: undefined })
              }} /> Usuario activo</label>
            {errors.isActive && <p id="status-error" className="field-error">{errors.isActive}</p>}
          </div>
        </fieldset>
        <div className="modal-footer">
          <button type="button" className="button secondary" onClick={onClose} disabled={busy}>Cancelar</button>
          <button className="button primary" disabled={busy}>
            {busy && <LoaderCircle className="animate-spin" size={18} />} {busy ? 'Guardando…' : 'Guardar usuario'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
