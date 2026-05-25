import { useQuery } from '@tanstack/react-query'
import type { Course } from '@/types/course'
import type { CategoryFilter } from '@/pages/courseList/_components/CategoryTabs'

export interface CourseListResponse {
  courses: Course[]
  categories: string[]
}

async function fetchCourses(category: CategoryFilter): Promise<CourseListResponse> {
  const url =
    category === 'all' ? '/api/courses' : `/api/courses?category=${encodeURIComponent(category)}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`강의 목록을 불러오지 못했습니다 (${res.status})`)
  }
  return res.json()
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
