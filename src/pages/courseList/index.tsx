import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stepper } from '@/components/Stepper'
import { SAMPLE_COURSES } from '@/data/sample-courses'
import { CategoryTabs, type CategoryFilter } from './_components/CategoryTabs'
import { CourseCard } from './_components/CourseCard'
import { EnrollTypeBar } from './_components/EnrollTypeBar'
import { getCapacityStatus } from '@/lib/format'
import type { EnrollmentType } from '@/types/course'

const STEPS = ['강의 선택', '정보 입력', '확인 및 제출']

export default function CourseListPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [type, setType] = useState<EnrollmentType>('personal')

  const courses = useMemo(
    () =>
      category === 'all' ? SAMPLE_COURSES : SAMPLE_COURSES.filter((c) => c.category === category),
    [category],
  )

  const firstSelectableIndex = useMemo(
    () =>
      courses.findIndex(
        (c) => getCapacityStatus(c.currentEnrollment, c.maxCapacity) !== 'sold-out',
      ),
    [courses],
  )

  const selectedCourse = SAMPLE_COURSES.find((c) => c.id === selectedId) ?? null

  function handleNext() {
    if (!selectedCourse) return
    navigate(`/enroll/${selectedCourse.id}`, { state: { type } })
  }

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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
      <p className="text-foreground text-base font-medium">해당 카테고리에 강의가 없어요</p>
      <p className="text-muted-foreground text-sm">다른 카테고리를 선택해 주세요.</p>
    </div>
  )
}
