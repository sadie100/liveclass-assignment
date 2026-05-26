import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { CategoryFilter, Course } from '@/types/course'
import { fetcher } from '@/lib/api'
import { getCapacityStatus } from '@/lib/format'

export interface CourseListResponse {
  courses: Course[]
  categories: string[]
}

async function fetchCourses(category: CategoryFilter): Promise<CourseListResponse> {
  const url =
    category === 'all' ? '/api/courses' : `/api/courses?category=${encodeURIComponent(category)}`

  return await fetcher<CourseListResponse>(url)
}

export const courseKeys = {
  all: ['courses'] as const,
  list: (category: CategoryFilter) => [...courseKeys.all, 'list', { category }] as const,
}

export function useCoursesQuery(category: CategoryFilter) {
  return useSuspenseQuery({
    queryKey: courseKeys.list(category),
    queryFn: () => fetchCourses(category),
    staleTime: 0,
  })
}

export function useCourseQuery(courseId: string | undefined) {
  return useSuspenseQuery({
    queryKey: courseKeys.list('all'),
    queryFn: () => fetchCourses('all'),
    select: (data) => data.courses.find((c) => c.id === courseId) ?? null,
    staleTime: 0,
  })
}

export function useCourseSoldOut(courseId: string | undefined): boolean {
  const { data } = useQuery({
    queryKey: courseKeys.list('all'),
    queryFn: () => fetchCourses('all'),
    select: (data) => {
      const course = data.courses.find((c) => c.id === courseId)
      return !!course && getCapacityStatus(course.currentEnrollment, course.maxCapacity) === 'sold-out'
    },
    staleTime: 0,
  })
  return data ?? false
}
