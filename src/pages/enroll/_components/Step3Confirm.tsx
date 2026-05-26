import { ArrowLeft, Mail, Pencil, Phone, User, Users } from 'lucide-react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { CourseInfo } from './CourseInfo'
import type { EnrollFormValues } from '../_schema'
import { formatPhone } from '@/lib/format'
import { useCourseSoldOut } from '@/queries/course'

interface Step3ConfirmProps {
  onPrev: () => void
  onEdit: (step: 1 | 2) => void
  onChangeCourse: () => void
  isSubmitting: boolean
}

export function Step3Confirm({ onPrev, onEdit, onChangeCourse, isSubmitting }: Step3ConfirmProps) {
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
