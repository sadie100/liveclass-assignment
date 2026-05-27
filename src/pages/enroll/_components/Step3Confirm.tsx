import { useEffect, useRef } from 'react'
import { AlertCircle, ArrowLeft, Mail, Pencil, Phone, User, Users } from 'lucide-react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { CourseInfo } from './CourseInfo'
import type { EnrollFormValues } from '../_schema'
import { formatPhone } from '@/lib/format'
import { useCourseSoldOut } from '@/queries/course'
import { ENROLLMENT_ERROR_MESSAGES, type EnrollmentErrorCode } from '@/types/enrollment'

type SubmitErrorReason = EnrollmentErrorCode | 'SOLD_OUT' | 'UNKNOWN'

interface Step3ConfirmProps {
  onPrev: () => void
  onEdit: (step: 1 | 2) => void
  onChangeCourse: () => void
  isSubmitting: boolean
  submitError: EnrollmentErrorCode | 'UNKNOWN' | null
}

export function Step3Confirm({
  onPrev,
  onEdit,
  onChangeCourse,
  isSubmitting,
  submitError,
}: Step3ConfirmProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<EnrollFormValues>()
  const values = useWatch({ control })
  const soldOut = useCourseSoldOut(values.courseId)

  if (!values.type) return null

  return (
    <div className="space-y-6">
      <SectionHeader title="강의 정보" onEdit={() => onEdit(1)} editLabel="강의 변경" />
      <CourseInfo courseId={values.courseId} onChangeCourse={onChangeCourse} />

      <SectionHeader title="수강생 정보" onEdit={() => onEdit(2)} editLabel="정보 수정" />
      <Card>
        <CardContent className="space-y-4">
          <SummaryRow icon={<User aria-hidden className="size-4" />} label="이름">
            {values.name}
          </SummaryRow>
          <SummaryRow icon={<Mail aria-hidden className="size-4" />} label="이메일">
            {values.email}
          </SummaryRow>
          <SummaryRow icon={<Phone aria-hidden className="size-4" />} label="전화번호">
            {formatPhone(values.phone ?? '')}
          </SummaryRow>
          {values.motivation && (
            <>
              <Separator />
              <div className="space-y-1.5">
                <p className="text-muted-foreground text-xs font-medium">수강 동기</p>
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                  {values.motivation}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {values.type === 'group' && (
        <>
          <SectionHeader title="단체 정보" onEdit={() => onEdit(2)} editLabel="정보 수정" />
          <Card>
            <CardContent className="space-y-4">
              <SummaryRow icon={<Users aria-hidden className="size-4" />} label="단체명">
                {values.organizationName}
              </SummaryRow>
              <SummaryRow icon={<User aria-hidden className="size-4" />} label="신청 인원">
                <span className="tabular-nums">{values.headCount}명</span>
              </SummaryRow>
              <SummaryRow icon={<Phone aria-hidden className="size-4" />} label="담당자 연락처">
                {formatPhone(values.contactPerson ?? '')}
              </SummaryRow>

              <Separator />

              <div className="space-y-3">
                <p className="text-muted-foreground text-xs font-medium">참가자 명단</p>
                <ol className="divide-border divide-y rounded-lg border">
                  {(values.participants ?? []).map((p, i) => (
                    <li
                      key={`${p?.email ?? ''}-${i}`}
                      className="flex items-center justify-between gap-3 px-3 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-muted-foreground w-5 text-xs tabular-nums">
                          {i + 1}
                        </span>
                        <span className="text-foreground truncate text-sm font-medium">
                          {p?.name}
                        </span>
                      </div>
                      <span className="text-muted-foreground truncate text-sm">{p?.email}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardContent>
          <Controller
            control={control}
            name="agreedToTerms"
            render={({ field }) => (
              <label className="flex cursor-pointer items-start gap-3">
                <Checkbox
                  checked={field.value === true}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  className="mt-0.5"
                  aria-describedby="terms-desc"
                  aria-invalid={errors.agreedToTerms ? true : undefined}
                />
                <span className="space-y-1">
                  <span className="text-foreground block text-sm font-medium">
                    이용약관 및 개인정보 처리방침에 동의합니다{' '}
                    <span className="text-destructive">*</span>
                  </span>
                  <span
                    id="terms-desc"
                    className="text-muted-foreground block text-xs leading-relaxed"
                  >
                    수강 신청을 위한 필수 정보 수집 및 이용에 동의해 주세요.
                  </span>
                  {errors.agreedToTerms?.message && (
                    <span className="text-destructive block text-xs">
                      {errors.agreedToTerms.message}
                    </span>
                  )}
                </span>
              </label>
            )}
          />
        </CardContent>
      </Card>

      <SubmitErrorBanner
        reason={submitError ?? (soldOut ? 'SOLD_OUT' : null)}
        onChangeCourse={onChangeCourse}
        onEdit={onEdit}
      />

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isSubmitting}>
          <ArrowLeft aria-hidden />
          이전
        </Button>
        <Button type="submit" disabled={isSubmitting || soldOut}>
          {isSubmitting ? '제출 중...' : '신청 제출'}
        </Button>
      </div>
    </div>
  )
}

const SUBMIT_ERROR_CONTENT: Record<
  SubmitErrorReason,
  { title: string; description: string }
> = {
  COURSE_FULL: {
    title: ENROLLMENT_ERROR_MESSAGES.COURSE_FULL,
    description: '다른 강의를 선택해 다시 신청해 주세요.',
  },
  DUPLICATE_ENROLLMENT: {
    title: ENROLLMENT_ERROR_MESSAGES.DUPLICATE_ENROLLMENT,
    description: '한 강의는 한 번만 신청할 수 있어요. 다른 강의를 둘러보세요.',
  },
  INVALID_INPUT: {
    title: ENROLLMENT_ERROR_MESSAGES.INVALID_INPUT,
    description: '입력 정보로 돌아가 값을 확인한 뒤 다시 제출해 주세요.',
  },
  SOLD_OUT: {
    title: '선택한 강의가 마감되었습니다.',
    description: '신청을 진행할 수 없어요. 다른 강의를 선택해 주세요.',
  },
  UNKNOWN: {
    title: '신청 처리 중 문제가 발생했습니다.',
    description: '잠시 후 다시 시도해 주세요. 문제가 계속되면 고객센터로 문의해 주세요.',
  },
}

function SubmitErrorBanner({
  reason,
  onChangeCourse,
  onEdit,
}: {
  reason: SubmitErrorReason | null
  onChangeCourse: () => void
  onEdit: (step: 1 | 2) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reason) {
      ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [reason])

  if (!reason) return null

  const { title, description } = SUBMIT_ERROR_CONTENT[reason]

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      className="border-destructive/40 bg-destructive/5 flex items-start gap-3 rounded-lg border p-4"
    >
      <AlertCircle aria-hidden className="text-destructive mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-destructive text-sm font-semibold">{title}</p>
        <p className="text-foreground/80 text-xs leading-relaxed">{description}</p>
        <div className="pt-2">
          {reason === 'INVALID_INPUT' ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onEdit(2)}
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              정보 다시 확인
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onChangeCourse}
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              다른 강의 선택
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  title,
  onEdit,
  editLabel,
}: {
  title: string
  onEdit: () => void
  editLabel: string
}) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-foreground text-base font-semibold">{title}</h2>
      <Button type="button" variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2 text-xs">
        <Pencil aria-hidden className="size-3.5" />
        {editLabel}
      </Button>
    </div>
  )
}

function SummaryRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-foreground text-right text-sm">{children}</div>
    </div>
  )
}
