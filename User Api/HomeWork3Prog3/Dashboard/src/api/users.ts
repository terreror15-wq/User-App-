import { request } from './client'
import type { User, UserInput } from '../types/user'

const path = '/api/User'

export const usersApi = {
  getAll: (signal?: AbortSignal) => request<User[]>(path, 'GET', undefined, signal),
  getById: (id: number) => request<User>(`${path}/${id}`),
  create: (data: UserInput) => request<User>(path, 'POST', data),
  update: (id: number, data: UserInput) => request<User>(`${path}/${id}`, 'PUT', data),
  remove: (id: number) => request<void>(`${path}/${id}`, 'DELETE'),
  setStatus: (id: number, isActive: boolean) => request<User>(`${path}/${id}/status`, 'PATCH', { isActive }),
}
