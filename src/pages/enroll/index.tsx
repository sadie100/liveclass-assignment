import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Stepper } from '@/components/Stepper'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { EnrollmentType } from '@/types/course'
import { CourseInfo } from './_components/CourseInfo'
import { EnrollTypeSwitch } from './_components/EnrollTypeSwitch'
import { GroupFields } from './_components/GroupFields'
import { PersonalFields } from './_components/PersonalFields'

const STEPS = ['강의 선택', '정보 입력', '확인 및 제출']

function isEnrollmentType(value: any): value is EnrollmentType {
  return value === 'personal' || value === 'group'
}

export default function EnrollPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [type, setType] = useState<EnrollmentType>(() => {
    if (!isEnrollmentType(location.state?.type)) {
      return 'personal'
    }
    return location.state.type
  })

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex justify-center">
        <Stepper currentStep={2} steps={STEPS} />
      </div>

      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          수강생 정보를 입력해 주세요
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          신청 유형과 정보를 확인한 뒤 다음 단계로 진행해 주세요.
        </p>
      </header>

      <div className="space-y-6">
        <CourseInfo courseId={courseId} />

        <Card>
          <CardContent className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-foreground text-base font-semibold">신청 유형</h3>
              <EnrollTypeSwitch value={type} onChange={setType} />
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
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft aria-hidden />
            이전
          </Button>
          <Button disabled>
            다음
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </div>
    </main>
  )
}
