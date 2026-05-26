import { http, HttpResponse, delay, type HttpHandler } from 'msw'
import { SAMPLE_COURSES } from '@/mocks/data'
import { CATEGORIES, type Category } from '@/types/course'
import type { CourseListResponse } from '@/queries/course'
import {
  EnrollmentErrorCode,
  ENROLLMENT_ERROR_MESSAGES,
  EnrollmentStatus,
  type EnrollmentErrorResponse,
  type EnrollmentRequest,
  type EnrollmentResponse,
} from '@/types/enrollment'

const enrolledSet = new Set<string>()

function errorResponse(
  status: number,
  code: EnrollmentErrorCode,
  details?: Record<string, string>,
) {
  const body: EnrollmentErrorResponse = {
    code,
    message: ENROLLMENT_ERROR_MESSAGES[code],
    ...(details ? { details } : {}),
  }
  return HttpResponse.json(body, { status })
}

export const handlers: HttpHandler[] = [
  http.get('/api/courses', async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const category = url.searchParams.get('category')

    const courses =
      category && CATEGORIES.includes(category as Category)
        ? SAMPLE_COURSES.filter((c) => c.category === category)
        : SAMPLE_COURSES

    return HttpResponse.json<CourseListResponse>({
      courses,
      categories: CATEGORIES,
    })
  }),

  http.post('/api/enrollments', async ({ request }) => {
    await delay(500)

    const body = (await request.json()) as EnrollmentRequest

    const course = SAMPLE_COURSES.find((c) => c.id === body.courseId)
    if (!course) {
      return errorResponse(400, EnrollmentErrorCode.InvalidInput, {
        courseId: '존재하지 않는 강의입니다.',
      })
    }

    const seats = body.type === 'group' ? body.group.headCount : 1

    if (course.currentEnrollment + seats > course.maxCapacity) {
      return errorResponse(409, EnrollmentErrorCode.CourseFull)
    }

    if (body.type === 'group') {
      if (body.group.headCount !== body.group.participants.length) {
        return errorResponse(422, EnrollmentErrorCode.InvalidInput, {
          'group.participants': '참가자 수가 headCount와 일치하지 않습니다.',
        })
      }

      const emails = body.group.participants.map((p) => p.email.toLowerCase())
      const unique = new Set(emails)
      if (unique.size !== emails.length) {
        return errorResponse(422, EnrollmentErrorCode.InvalidInput, {
          'group.participants': '참가자 이메일이 중복됩니다.',
        })
      }
    }

    const dedupeKey = `${body.courseId}:${body.applicant.email.toLowerCase()}`
    if (enrolledSet.has(dedupeKey)) {
      return errorResponse(409, EnrollmentErrorCode.DuplicateEnrollment)
    }
    enrolledSet.add(dedupeKey)

    course.currentEnrollment += seats

    return HttpResponse.json<EnrollmentResponse>({
      enrollmentId:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `enr_${Date.now()}`,
      status: EnrollmentStatus.Confirmed,
      enrolledAt: new Date().toISOString(),
    })
  }),
]
