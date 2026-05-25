import { http, HttpResponse, delay, type HttpHandler } from 'msw'
import { SAMPLE_COURSES } from '@/mocks/data'
import type { Category } from '@/types/course'
import type { CourseListResponse } from '@/queries/course'

const CATEGORIES: Category[] = ['development', 'design', 'marketing', 'business']

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
]
