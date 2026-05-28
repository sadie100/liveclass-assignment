import { Suspense, useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import { useFormContext, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatPrice, getCapacityStatus } from '@/lib/format'
import { useCoursesQuery } from '@/queries/course'
import type { CategoryFilter, Course, EnrollmentType } from '@/types/course'
import { CategoryTabs } from './CategoryTabs'
import { CourseCard } from './CourseCard'
import type { EnrollFormValues } from '../_schema'
import { useChangeEnrollType } from '../_hooks/useChangeEnrollType'

interface Step1CourseProps {
  category: CategoryFilter
  onCategoryChange: (category: CategoryFilter) => void
  onNext: () => Promise<void> | void
}

export function Step1Course({ category, onCategoryChange, onNext }: Step1CourseProps) {
  return (
    <div className="space-y-6">
      <CategoryTabs value={category} onChange={onCategoryChange} />

      <ErrorBoundary
        resetKeys={[category]}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorState message={(error as Error).message} onRetry={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<LoadingState />}>
          <CourseSection category={category} onNext={onNext} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function CourseSection({ category, onNext }: { category: CategoryFilter; onNext: () => Promise<void> | void }) {
  const { control, setValue } = useFormContext<EnrollFormValues>()
  const selectedId = useWatch({ control, name: 'courseId' }) ?? ''
  const type = useWatch({ control, name: 'type' })
  const changeEnrollType = useChangeEnrollType()

  const { data } = useCoursesQuery(category)
  const courses = data.courses

  const firstSelectableIndex = useMemo(
    () =>
      courses.findIndex(
        (c) => getCapacityStatus(c.currentEnrollment, c.maxCapacity) !== 'sold-out',
      ),
    [courses],
  )

  const selectedCourse: Course | null = courses.find((c) => c.id === selectedId) ?? null

  return (
    <>
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
                onSelect={(id) =>
                  setValue('courseId', id, { shouldValidate: true, shouldDirty: true })
                }
              />
            )
          })}
        </div>
      )}

      <SelectionBar
        selectedCourse={selectedCourse}
        type={type}
        onTypeChange={changeEnrollType}
        onNext={onNext}
      />
    </>
  )
}

const TYPE_OPTIONS: Array<{ value: EnrollmentType; label: string; description: string }> = [
  { value: 'personal', label: '개인 신청', description: '혼자 신청합니다' },
  { value: 'group', label: '단체 신청', description: '여러 명을 함께 신청합니다' },
]

function SelectionBar({
  selectedCourse,
  type,
  onTypeChange,
  onNext,
}: {
  selectedCourse: Course | null
  type: EnrollmentType
  onTypeChange: (type: EnrollmentType) => void
  onNext: () => Promise<void> | void
}) {
  const ready = selectedCourse !== null

  return (
    <div className="bg-background/95 sticky bottom-0 z-20 -mx-4 mt-8 border-t px-4 py-4 backdrop-blur md:-mx-6 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">선택한 강의</p>
          {selectedCourse ? (
            <p className="text-foreground truncate text-sm font-medium">
              {selectedCourse.title}{' '}
              <span className="text-muted-foreground">· {formatPrice(selectedCourse.price)}</span>
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">강의를 먼저 선택해 주세요</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <fieldset disabled={!ready} className="min-w-0">
            <legend className="sr-only">신청 유형</legend>
            <RadioGroup
              value={type}
              onValueChange={(v) => onTypeChange(v as EnrollmentType)}
              className="flex gap-2"
            >
              {TYPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
                >
                  <RadioGroupItem value={opt.value} />
                  <span className="flex flex-col leading-tight">
                    <span className="text-foreground font-medium">{opt.label}</span>
                    <span className="text-muted-foreground text-xs">{opt.description}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          <Button
            type="button"
            size="lg"
            disabled={!ready}
            onClick={() => void onNext()}
            className="shrink-0"
          >
            다음
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </div>
    </div>
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
