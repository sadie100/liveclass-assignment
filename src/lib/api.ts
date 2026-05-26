import type { ErrorResponse } from '@/types/api'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: Record<string, string>

  constructor(status: number, body: ErrorResponse) {
    super(body.message)
    this.name = 'ApiError'
    this.status = status
    this.code = body.code
    this.details = body.details
  }
}

export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ErrorResponse | null
    throw new ApiError(
      res.status,
      body ?? { code: 'UNKNOWN', message: `API 요청 실패 (${res.status})` },
    )
  }
  return res.json() as Promise<T>
}
