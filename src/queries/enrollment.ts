import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError, fetcher } from '@/lib/api'
import { courseKeys } from '@/queries/course'
import type {
  EnrollmentErrorResponse,
  EnrollmentRequest,
  EnrollmentResponse,
} from '@/types/enrollment'

export class EnrollmentApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: Record<string, string>

  constructor(status: number, body: EnrollmentErrorResponse) {
    super(body.message)
    this.name = 'EnrollmentApiError'
    this.status = status
    this.code = body.code
    this.details = body.details
  }
}

function toEnrollmentError(error: unknown): EnrollmentApiError {
  if (error instanceof ApiError) {
    const body = (error.body ?? {
      code: 'UNKNOWN',
      message: error.message,
    }) as EnrollmentErrorResponse
    return new EnrollmentApiError(error.status, body)
  }
  throw error
}

async function submitEnrollment(body: EnrollmentRequest): Promise<EnrollmentResponse> {
  try {
    return await fetcher<EnrollmentResponse>('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (error) {
    throw toEnrollmentError(error)
  }
}

export const enrollmentKeys = {
  all: ['enrollments'] as const,
}

export function useSubmitEnrollmentMutation() {
  const queryClient = useQueryClient()

  return useMutation<EnrollmentResponse, EnrollmentApiError, EnrollmentRequest>({
    mutationFn: submitEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all })
    },
  })
}
