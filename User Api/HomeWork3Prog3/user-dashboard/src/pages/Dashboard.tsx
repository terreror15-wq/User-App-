import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleCheck,
  CircleMinus, FolderSearch, Menu, Plus, Search, Users, X,
} from 'lucide-react'
import { errorMessage } from '../api/client'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { UserFormModal } from '../components/UserFormModal'
import { UserTable, sortColumns, type Sort, type SortKey } from '../components/UserTable'
import { useUsers } from '../hooks/useUsers'
import type { User, UserInput } from '../types/user'

const pageSize = 10
const filters = [['all', 'Todos'], ['active', 'Activos'], ['inactive', 'Inactivos']] as const
const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true })
type Filter = typeof filters[number][0]
type Dialog = { type: 'form'; user?: User } | { type: 'delete'; user: User }
type Notice = { tone: 'success' | 'error'; text: string }

function searchable(value: string) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es')
}

function cellValue(user: User, key: SortKey) {
  if (key === 'name') return `${user.name} ${user.lastName}`
  if (key === 'isActive') return user.isActive ? 'Activo' : 'Inactivo'
  return user[key]
}

export function Dashboard() {
  const { users, loading, error, reload, save, remove, setStatus } = useUsers()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>({ key: 'name', direction: 'ascending' })
  const [page, setPage] = useState(1)
  const [menu, setMenu] = useState(false)
  const [dialog, setDialog] = useState<Dialog | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [pending, setPending] = useState<ReadonlySet<number>>(new Set())
  const statusRequests = useRef(new Set<number>())

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 5000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const active = users.filter(user => user.isActive).length
  const stats = [
    { label: 'Total de usuarios', count: users.length, icon: Users, tone: 'total' },
    { label: 'Usuarios activos', count: active, icon: CircleCheck, tone: 'active' },
    { label: 'Usuarios inactivos', count: users.length - active, icon: CircleMinus, tone: 'inactive' },
  ]
  const term = searchable(query.trim())
  const matches = users.filter(user =>
    (filter === 'all' || user.isActive === (filter === 'active')) &&
    (searchable(`${user.name} ${user.lastName}`).includes(term) || searchable(user.email).includes(term)),
  ).sort((first, second) => {
    const order = collator.compare(cellValue(first, sort.key), cellValue(second, sort.key))
    return (sort.direction === 'ascending' ? order : -order) || first.id - second.id
  })
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const offset = (currentPage - 1) * pageSize
  const visibleUsers = matches.slice(offset, offset + pageSize)
  const showError = (text: string) => setNotice({ tone: 'error', text })
  const newUser = () => setDialog({ type: 'form' })

  function updateSort(key: SortKey) {
    setSort(current => ({
      key, direction: current.key === key && current.direction === 'ascending' ? 'descending' : 'ascending',
    }))
    setPage(1)
  }

  async function saveUser(data: UserInput, id?: number) {
    await save(data, id)
    setNotice({ tone: 'success', text: id === undefined ? 'Usuario creado.' : 'Cambios guardados.' })
  }

  async function deleteUser(id: number) {
    await remove(id)
    setPage(currentPage)
    setNotice({ tone: 'success', text: 'Usuario eliminado.' })
  }

  async function toggleStatus(user: User) {
    const requests = statusRequests.current
    if (requests.has(user.id)) return
    requests.add(user.id)
    setPending(new Set(requests))
    setPage(currentPage)
    try {
      await setStatus(user)
      setNotice({ tone: 'success', text: user.isActive ? 'Usuario desactivado.' : 'Usuario activado.' })
    } catch (reason) {
      showError(errorMessage(reason))
    } finally {
      requests.delete(user.id)
      setPending(new Set(requests))
    }
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main">Ir al contenido</a>
      <aside className={`sidebar ${menu ? 'is-open' : ''}`} id="sidebar">
        <a className="brand" href="#main" onClick={() => setMenu(false)}>
          <span className="brand-icon"><Users size={21} /></span>
          <span>Directorio<span className="brand-subtitle">HomeWork3Prog3</span></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#main" aria-current="page" onClick={() => setMenu(false)}><Users size={19} /> Usuarios</a>
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <button className="icon-button menu-button" aria-expanded={menu} aria-controls="sidebar"
              aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenu(!menu)}>
              {menu ? <X size={23} /> : <Menu size={23} />}
            </button>
            <span>Usuarios</span>
          </div>
          <label className="search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Buscar por nombre o correo</span>
            <input type="search" placeholder="Buscar por nombre o correo" value={query}
              onChange={event => { setQuery(event.target.value); setPage(1) }} />
          </label>
        </header>

        <main id="main" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <h1>Directorio de usuarios</h1>
              <p>Consulta y administra los usuarios y su estado.</p>
            </div>
            <button className="button primary" id="new-user" onClick={newUser} disabled={loading || !!error}>
              <Plus size={20} /> Nuevo usuario
            </button>
          </div>

          <section className="stats" aria-label="Resumen de usuarios">
            {stats.map(({ label, count, icon: Icon, tone }) => (
              <article className="stat-card" key={label}>
                <span className={`stat-icon ${tone}`} aria-hidden="true"><Icon size={22} /></span>
                <div><h2>{label}</h2><p>{loading || error ? '—' : count}</p></div>
              </article>
            ))}
          </section>

          <section className="directory" aria-labelledby="directory-title">
            <div className="directory-heading">
              <h2 id="directory-title">Usuarios</h2>
              <div className="filters" role="group" aria-label="Filtrar por estado">
                {filters.map(([value, label]) => (
                  <button key={value} aria-pressed={value === filter} onClick={() => { setFilter(value); setPage(1) }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="skeleton-list" role="status">
                <span className="sr-only">Cargando usuarios…</span>
                <div aria-hidden="true">{Array.from({ length: 5 }, (_, index) => (
                  <div className="skeleton-row" key={index}><span /><span /><span /></div>
                ))}</div>
              </div>
            ) : error ? (
              <div className="empty-state" role="alert">
                <span className="empty-icon error-icon"><AlertCircle size={25} /></span>
                <h3>No se pudieron cargar los usuarios</h3><p>{error}</p>
                <button className="button secondary" onClick={reload}>Reintentar</button>
              </div>
            ) : !matches.length ? (
              <div className="empty-state">
                <span className="empty-icon">{users.length ? <FolderSearch size={25} /> : <Users size={25} />}</span>
                <h3>{users.length ? 'No hay coincidencias' : 'Aún no hay usuarios'}</h3>
                <p>{users.length ? 'Prueba con otra búsqueda o cambia el filtro.' : 'Crea el primer usuario del directorio.'}</p>
                <button className="button primary" onClick={newUser}><Plus size={18} /> Nuevo usuario</button>
              </div>
            ) : (
              <>
                <label className="mobile-sort">Ordenar por
                  <span><select value={`${sort.key}:${sort.direction}`} onChange={event => {
                    const [key, direction] = event.target.value.split(':') as [SortKey, Sort['direction']]
                    setSort({ key, direction })
                    setPage(1)
                  }}>
                    {sortColumns.flatMap(([key, label]) => [
                      <option key={key} value={`${key}:ascending`}>{label} (A–Z)</option>,
                      <option key={`${key}-reverse`} value={`${key}:descending`}>{label} (Z–A)</option>,
                    ])}
                  </select><ChevronDown size={16} aria-hidden="true" /></span>
                </label>
                <UserTable users={visibleUsers} sort={sort} onSort={updateSort} pending={pending}
                  onEdit={user => setDialog({ type: 'form', user })} onRemove={user => setDialog({ type: 'delete', user })}
                  onStatus={user => void toggleStatus(user)} />
                <div className="pagination">
                  <p aria-live="polite">Mostrando {offset + 1}–{offset + visibleUsers.length} de {matches.length}</p>
                  <nav aria-label="Paginación">
                    <button className="icon-button" aria-label="Página anterior" disabled={currentPage === 1}
                      onClick={() => setPage(currentPage - 1)}><ChevronLeft size={18} /></button>
                    <span>Página {currentPage} de {pageCount}</span>
                    <button className="icon-button" aria-label="Página siguiente" disabled={currentPage === pageCount}
                      onClick={() => setPage(currentPage + 1)}><ChevronRight size={18} /></button>
                  </nav>
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      {dialog?.type === 'form' && <UserFormModal user={dialog.user} onSave={saveUser} onError={showError} onClose={() => setDialog(null)} />}
      {dialog?.type === 'delete' && <ConfirmDialog user={dialog.user} onDelete={deleteUser} onError={showError} onClose={() => setDialog(null)} />}
      {notice && <div className={`toast ${notice.tone}`} role={notice.tone === 'error' ? 'alert' : 'status'}>
        {notice.tone === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
        <span>{notice.text}</span>
        <button className="icon-button" aria-label="Cerrar aviso" onClick={() => setNotice(null)}><X size={17} /></button>
      </div>}
    </div>
  )
}
