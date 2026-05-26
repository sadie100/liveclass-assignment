import { Suspense, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CourseSummaryCard } from '@/pages/enroll/_components/CourseSummaryCard'
import { useCourseQuery } from '@/queries/course'
import { EnrollmentStatus } from '@/types/enrollment'

interface EnrollDoneState {
  enrollmentId: string
  status: EnrollmentStatus
  enrolledAt: string
  courseId: string
  applicantName: string
  type: 'personal' | 'group'
  organizationName?: string
  headCount?: number
}

const STATUS_LABELS: Record<EnrollmentStatus, string> = {
  [EnrollmentStatus.Confirmed]: '확정',
  [EnrollmentStatus.Pending]: '대기',
}

export default function EnrollDonePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as EnrollDoneState | null

  useEffect(() => {
    if (!state) {
      alert('완료된 요청입니다. 강의 신청 페이지로 이동합니다.')
      navigate('/enroll', { replace: true })
    }
  }, [state])

  if (!state) return null

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <header className="mb-8 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 aria-hidden className="text-primary size-12" />
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          신청이 완료되었습니다
        </h1>
    
      </header>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <SummaryRow label="신청 번호">
              <span className="font-mono tabular-nums">{state.enrollmentId}</span>
            </SummaryRow>
            <SummaryRow label="상태">{STATUS_LABELS[state.status]}</SummaryRow>
            <SummaryRow label="신청 일시">{formatDateTime(state.enrolledAt)}</SummaryRow>
            <Separator />
            <SummaryRow label="신청자">{state.applicantName}</SummaryRow>
            <SummaryRow label="신청 유형">
              {state.type === 'group' ? '단체 신청' : '개인 신청'}
            </SummaryRow>
            {state.type === 'group' && state.organizationName && (
              <SummaryRow label="단체명">{state.organizationName}</SummaryRow>
            )}
            {state.type === 'group' && state.headCount !== undefined && (
              <SummaryRow label="신청 인원">
                <span className="tabular-nums">{state.headCount}명</span>
              </SummaryRow>
            )}
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h2 className="text-foreground text-base font-semibold">강의 정보</h2>
          <ErrorBoundary
            resetKeys={[state.courseId]}
            fallbackRender={() => (
              <div className="text-muted-foreground rounded-xl border border-dashed py-8 text-center text-sm">
                강의 정보를 불러오지 못했어요.
              </div>
            )}
          >
            <Suspense
              fallback={
                <div aria-busy="true" className="bg-muted/40 h-40 animate-pulse rounded-xl border" />
              }
            >
              <CourseInfoSection courseId={state.courseId} />
            </Suspense>
          </ErrorBoundary>
        </section>

        <div className="flex justify-center pt-2">
          <Button onClick={() => navigate('/enroll')}>처음으로</Button>
        </div>
      </div>
    </main>
  )
}

function CourseInfoSection({ courseId }: { courseId: string }) {
  const { data: course } = useCourseQuery(courseId)
  if (!course) {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed py-8 text-center text-sm">
        강의 정보를 찾을 수 없어요.
      </div>
    )
  }
  return <CourseSummaryCard course={course} />
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <span className="text-foreground text-right text-sm">{children}</span>
    </div>
  )
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
