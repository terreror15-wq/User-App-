import { useEffect, useState } from 'react'
import { usersApi } from '../api/users'
import { errorMessage } from '../api/client'
import type { User, UserInput } from '../types/user'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    usersApi.getAll(controller.signal).then(result => {
      if (!controller.signal.aborted) setUsers(result)
    }).catch(reason => {
      if (!controller.signal.aborted) setError(errorMessage(reason))
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [attempt])

  function reload() {
    setLoading(true)
    setError('')
    setAttempt(value => value + 1)
  }

  function replace(updated: User) {
    setUsers(current => current.map(user => user.id === updated.id ? updated : user))
  }

  async function save(data: UserInput, id?: number) {
    if (id === undefined) {
      const created = await usersApi.create(data)
      setUsers(current => [...current, created])
    } else {
      replace(await usersApi.update(id, data))
    }
  }

  async function remove(id: number) {
    await usersApi.remove(id)
    setUsers(current => current.filter(user => user.id !== id))
  }

  async function setStatus(user: User) {
    replace({ ...user, isActive: !user.isActive })
    try {
      replace(await usersApi.setStatus(user.id, !user.isActive))
    } catch (reason) {
      setUsers(current => current.map(item => item.id === user.id ? { ...item, isActive: user.isActive } : item))
      throw reason
    }
  }

  return { users, loading, error, reload, save, remove, setStatus }
}
