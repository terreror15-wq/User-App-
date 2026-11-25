import { ArrowDown, ArrowUp, ArrowUpDown, Check, LoaderCircle, Pencil, Trash2 } from 'lucide-react'
import type { User } from '../types/user'

const columns = [
  ['name', 'Usuario'], ['email', 'Correo electrónico'], ['phoneNumber', 'Teléfono'],
  ['address', 'Dirección'], ['isActive', 'Estado'],
] as const

export type SortKey = typeof columns[number][0]
export type Sort = { key: SortKey; direction: 'ascending' | 'descending' }
export const sortColumns = columns

export function UserTable({ users, sort, onSort, pending, onEdit, onRemove, onStatus }: {
  users: User[]
  sort: Sort
  onSort: (key: SortKey) => void
  pending: ReadonlySet<number>
  onEdit: (user: User) => void
  onRemove: (user: User) => void
  onStatus: (user: User) => void
}) {
  return (
    <div className="table-wrap">
      <table role="table" aria-label="Usuarios">
        <thead role="rowgroup"><tr role="row">
          {columns.map(([key, label]) => {
            const Icon = sort.key !== key ? ArrowUpDown : sort.direction === 'ascending' ? ArrowUp : ArrowDown
            return <th role="columnheader" key={key} scope="col" aria-sort={sort.key === key ? sort.direction : undefined}>
              <button className="sort-button" onClick={() => onSort(key)}>{label}<Icon size={14} aria-hidden="true" /></button>
            </th>
          })}
          <th role="columnheader" scope="col" className="actions-heading">Acciones</th>
        </tr></thead>
        <tbody role="rowgroup">{users.map(user => {
          const name = `${user.name} ${user.lastName}`
          const isPending = pending.has(user.id)
          return <tr key={user.id} role="row">
            <td role="cell" className="person-cell"><div className="person">
              <span className="avatar" aria-hidden="true">{[user.name, user.lastName].map(part => Array.from(part.trim())[0]).join('').toLocaleUpperCase()}</span>
              <span>{name}</span>
            </div></td>
            <td role="cell" data-label="Correo electrónico">{user.email}</td>
            <td role="cell" data-label="Teléfono">{user.phoneNumber}</td>
            <td role="cell" data-label="Dirección">{user.address}</td>
            <td role="cell" data-label="Estado">
              <div className="status-cell">
                <span className={`badge ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? <Check size={13} /> : <span aria-hidden="true" className="status-dot" />}
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
                <button type="button" className="switch" role="switch" aria-checked={user.isActive}
                  aria-label={`Estado activo de ${name}`} aria-busy={isPending} disabled={isPending} onClick={() => onStatus(user)}>
                  {isPending ? <LoaderCircle className="animate-spin" size={14} /> : <span className="switch-thumb" />}
                </button>
              </div>
            </td>
            <td role="cell" className="row-actions"><div>
              <button className="icon-button" disabled={isPending} aria-label={`Editar a ${name}`} onClick={() => onEdit(user)}>
                <Pencil size={17} />
              </button>
              <button className="icon-button danger-icon" disabled={isPending} aria-label={`Eliminar a ${name}`} onClick={() => onRemove(user)}>
                <Trash2 size={17} />
              </button>
            </div></td>
          </tr>
        })}</tbody>
      </table>
    </div>
  )
}
