const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5152').replace(/\/+$/, '')

interface ProblemDetails {
  title?: string
  detail?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly status: number
  readonly problem: ProblemDetails

  constructor(status: number, problem: ProblemDetails = {}) {
    super(problem.detail || problem.title || `La solicitud falló (HTTP ${status}).`)
    this.status = status
    this.problem = problem
  }
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

export async function request<T>(path: string, method = 'GET', body?: object, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(baseUrl + path, {
      method, signal,
      headers: { Accept: 'application/json, application/problem+json', ...(body && { 'Content-Type': 'application/json' }) },
      body: body && JSON.stringify(body),
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error('No se pudo conectar con la API.')
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => undefined)
    throw new ApiError(response.status, problem ?? undefined)
  }
  return response.status === 204 ? undefined as T : response.json()
}
