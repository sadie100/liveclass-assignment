import { useQuery } from '@tanstack/react-query'
import type { Course } from '@/types/course'
import type { CategoryFilter } from '@/pages/courseList/_components/CategoryTabs'
import { fetcher } from '@/lib/api'

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
  return useQuery({
    queryKey: courseKeys.list(category),
    queryFn: () => fetchCourses(category),
  })
}
