import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'
import { useCourseQuery } from '@/queries/course'
import { CourseSummaryCard } from './CourseSummaryCard'

export function CourseInfo({ courseId }: { courseId: string | undefined }) {
  return (
    <ErrorBoundary
      resetKeys={[courseId]}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <CourseErrorState message={(error as Error).message} onRetry={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<CourseLoadingState />}>
        <CourseSummarySection courseId={courseId} />
      </Suspense>
    </ErrorBoundary>
  )
}

function CourseSummarySection({ courseId }: { courseId: string | undefined }) {
  const { data: course } = useCourseQuery(courseId)

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-10 text-center">
        <p className="text-foreground text-base font-medium">강의를 찾을 수 없어요</p>
        <p className="text-muted-foreground text-sm">강의 목록으로 돌아가 다시 선택해 주세요.</p>
        <Button variant="outline" asChild>
          <Link to="/">강의 목록으로</Link>
        </Button>
      </div>
    )
  }
  return <CourseSummaryCard course={course} />
}

function CourseLoadingState() {
  return <div aria-busy="true" className="bg-muted/40 h-40 animate-pulse rounded-xl border" />
}

function CourseErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-10 text-center"
    >
      <p className="text-foreground text-base font-medium">강의 정보를 불러오지 못했어요</p>
      <p className="text-muted-foreground text-sm">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  )
}
