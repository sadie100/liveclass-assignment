import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CourseInfo } from './CourseInfo'
import { EnrollTypeSwitch } from './EnrollTypeSwitch'
import { GroupFields } from './GroupFields'
import { PersonalFields } from './PersonalFields'
import type { EnrollFormValues } from '../_schema'
import { useChangeEnrollType } from '../_hooks/useChangeEnrollType'
import { useCourseSoldOut } from '@/queries/course'

interface Step2InfoProps {
  onPrev: () => void
  onNext: () => Promise<void> | void
  onChangeCourse: () => void
}

export function Step2Info({ onPrev, onNext, onChangeCourse }: Step2InfoProps) {
  const { control } = useFormContext<EnrollFormValues>()
  const courseId = useWatch({ control, name: 'courseId' })
  const type = useWatch({ control, name: 'type' })
  const { requestChange, confirmSwitchDialog } = useChangeEnrollType()
  const soldOut = useCourseSoldOut(courseId)

  return (
    <div className="space-y-6">
      <CourseInfo courseId={courseId} onChangeCourse={onChangeCourse} />

      <Card>
        <CardContent className="space-y-6">
          <section className="space-y-3">
            <h3 className="text-foreground text-base font-semibold">신청 유형</h3>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <EnrollTypeSwitch
                  value={field.value}
                  onChange={(next) => {
                    requestChange(next)
                    field.onBlur()
                  }}
                />
              )}
            />
          </section>

          <section className="space-y-3">
            <h3 className="text-foreground text-base font-semibold">수강생 정보</h3>
            <PersonalFields />
          </section>

          {type === 'group' && (
            <section className="space-y-3">
              <h3 className="text-foreground text-base font-semibold">단체 정보</h3>
              <GroupFields />
            </section>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft aria-hidden />
          이전
        </Button>
        <Button type="button" onClick={() => void onNext()} disabled={soldOut}>
          다음
          <ArrowRight aria-hidden />
        </Button>
      </div>

      {confirmSwitchDialog}
    </div>
  )
}
