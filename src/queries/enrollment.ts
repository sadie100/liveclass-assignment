import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError, fetcher } from '@/lib/api'
import { courseKeys } from '@/queries/course'
import type { EnrollmentRequest, EnrollmentResponse } from '@/types/enrollment'

async function submitEnrollment(body: EnrollmentRequest): Promise<EnrollmentResponse> {
  return fetcher<EnrollmentResponse>('/api/enrollments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export const enrollmentKeys = {
  all: ['enrollments'] as const,
}

export function useSubmitEnrollmentMutation() {
  const queryClient = useQueryClient()

  return useMutation<EnrollmentResponse, ApiError, EnrollmentRequest>({
    mutationFn: submitEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all })
    },
  })
}
