export const EnrollmentStatus = {
  Confirmed: 'confirmed',
  Pending: 'pending',
} as const
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus]

export const EnrollmentErrorCode = {
  CourseFull: 'COURSE_FULL',
  DuplicateEnrollment: 'DUPLICATE_ENROLLMENT',
  InvalidInput: 'INVALID_INPUT',
} as const

export type EnrollmentErrorCode =
  (typeof EnrollmentErrorCode)[keyof typeof EnrollmentErrorCode]

export interface EnrollmentApplicant {
  name: string
  email: string
  phone: string
  motivation?: string
}

export interface EnrollmentGroup {
  organizationName: string
  headCount: number
  participants: Array<{ name: string; email: string }>
  contactPerson: string
}

export interface PersonalEnrollmentRequest {
  courseId: string
  type: 'personal'
  applicant: EnrollmentApplicant
  agreedToTerms: boolean
}

export interface GroupEnrollmentRequest {
  courseId: string
  type: 'group'
  applicant: EnrollmentApplicant
  group: EnrollmentGroup
  agreedToTerms: boolean
}

export type EnrollmentRequest = PersonalEnrollmentRequest | GroupEnrollmentRequest

export interface EnrollmentResponse {
  enrollmentId: string
  status: EnrollmentStatus
  enrolledAt: string
}
