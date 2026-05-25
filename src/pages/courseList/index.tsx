import { Suspense, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Stepper } from '@/components/Stepper'
import { Button } from '@/components/ui/button'
import { useCoursesQuery } from '@/queries/course'
import { CategoryTabs, type CategoryFilter } from './_components/CategoryTabs'
import { CourseCard } from './_components/CourseCard'
import { EnrollTypeBar } from './_components/EnrollTypeBar'
import { getCapacityStatus } from '@/lib/format'
import type { EnrollmentType } from '@/types/course'

const STEPS = ['강의 선택', '정보 입력', '확인 및 제출']

export default function CourseListPage() {
  const [category, setCategory] = useState<CategoryFilter>('all')

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex justify-center">
        <Stepper currentStep={1} steps={STEPS} />
      </div>

      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">수강할 강의를 선택하세요</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          관심 있는 강의를 고르고 신청 유형을 선택해 주세요.
        </p>
      </header>

      <div className="mb-6">
        <CategoryTabs value={category} onChange={setCategory} />
      </div>

      <ErrorBoundary
        resetKeys={[category]}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorState message={(error as Error).message} onRetry={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<LoadingState />}>
          <CourseSection category={category} />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}

function CourseSection({ category }: { category: CategoryFilter }) {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [type, setType] = useState<EnrollmentType>('personal')
  const { data } = useCoursesQuery(category)
  const courses = data.courses

  const firstSelectableIndex = useMemo(
    () =>
      courses.findIndex(
        (c) => getCapacityStatus(c.currentEnrollment, c.maxCapacity) !== 'sold-out',
      ),
    [courses],
  )

  const selectedCourse = courses.find((c) => c.id === selectedId) ?? null

  function handleNext() {
    if (!selectedCourse) return
    navigate(`/enroll/${selectedCourse.id}`, { state: { type } })
  }

  return (
    <main>
      {courses.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          role="radiogroup"
          aria-label="강의 목록"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
        >
          {courses.map((course, index) => {
            const isSelectable =
              getCapacityStatus(course.currentEnrollment, course.maxCapacity) !== 'sold-out'
            const isFocusTarget = selectedId
              ? course.id === selectedId
              : index === firstSelectableIndex
            return (
              <CourseCard
                key={course.id}
                course={course}
                selected={course.id === selectedId}
                tabIndex={isSelectable && isFocusTarget ? 0 : -1}
                onSelect={setSelectedId}
              />
            )
          })}
        </div>
      )}

      <EnrollTypeBar
        selectedCourse={selectedCourse}
        type={type}
        onTypeChange={setType}
        onNext={handleNext}
      />
    </main>
  )
}

function LoadingState() {
  return (
    <div
      aria-busy="true"
      aria-label="강의 목록을 불러오는 중"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-muted/40 h-48 animate-pulse rounded-xl border" />
      ))}
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center"
    >
      <p className="text-foreground text-base font-medium">강의 목록을 불러오지 못했어요</p>
      <p className="text-muted-foreground text-sm">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
      <p className="text-foreground text-base font-medium">해당 카테고리에 강의가 없어요</p>
      <p className="text-muted-foreground text-sm">다른 카테고리를 선택해 주세요.</p>
    </div>
  )
}
