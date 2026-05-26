import { useEffect, useState } from 'react'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Stepper } from '@/components/Stepper'
import type { CategoryFilter } from '@/types/course'
import { useSubmitEnrollmentMutation } from '@/queries/enrollment'
import { ENROLLMENT_ERROR_MESSAGES, type EnrollmentErrorCode } from '@/types/enrollment'
import { RestoreDraftDialog } from './_components/RestoreDraftDialog'
import { Step1Course } from './_components/Step1Course'
import { Step2Info } from './_components/Step2Info'
import { Step3Confirm } from './_components/Step3Confirm'
import {
  DEFAULT_VALUES,
  enrollSchema,
  STEP_FIELDS,
  toEnrollmentRequest,
  type EnrollFormValues,
} from './_schema'
import { useEnrollDraft } from './_hooks/useEnrollDraft'

const STEPS = ['강의 선택', '정보 입력', '확인 및 제출']

type StepIndex = 1 | 2 | 3

export default function EnrollPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<StepIndex>(1)
  const [category, setCategory] = useState<CategoryFilter>('all')

  const methods = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  })

  const { isDraftDialogOpen, confirmRestore, cancelRestore, clearDraft } = useEnrollDraft({
    methods,
    currentStep,
    setCurrentStep,
  })

  const { mutate: submitEnroll, isPending } = useSubmitEnrollmentMutation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  async function goToStep2() {
    const ok = await methods.trigger(STEP_FIELDS.step1)
    if (ok) setCurrentStep(2)
  }

  async function goToStep3() {
    const type = methods.getValues('type')
    const fields = type === 'group' ? STEP_FIELDS.step2Group : STEP_FIELDS.step2Personal
    const ok = await methods.trigger(fields)
    if (ok) setCurrentStep(3)
  }

  const onSubmit: SubmitHandler<EnrollFormValues> = (data) => {
    const enrollData = toEnrollmentRequest(data)
    submitEnroll(enrollData, {
      onSuccess: (res) => {
        clearDraft()
        navigate('/enroll/done', {
          replace: true,
          state: {
            enrollmentId: res.enrollmentId,
            status: res.status,
            enrolledAt: res.enrolledAt,
            courseId: data.courseId,
            applicantName: data.name,
            type: data.type,
            ...(data.type === 'group'
              ? {
                  organizationName: data.organizationName,
                  headCount: data.headCount,
                }
              : {}),
          },
        })
      },
      onError: (err) => {
        const code = err.code as EnrollmentErrorCode
        const message = ENROLLMENT_ERROR_MESSAGES[code] ?? err.message
        alert(message)
      },
    })
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex justify-center">
        <Stepper currentStep={currentStep} steps={STEPS} />
      </div>

      <header className="mx-auto mb-6 max-w-2xl space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {HEADINGS[currentStep].title}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {HEADINGS[currentStep].description}
        </p>
      </header>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          {currentStep === 1 && (
            <Step1Course category={category} onCategoryChange={setCategory} onNext={goToStep2} />
          )}

          {currentStep === 2 && (
            <div className="mx-auto max-w-2xl">
              <Step2Info
                onPrev={() => setCurrentStep(1)}
                onNext={goToStep3}
                onChangeCourse={() => setCurrentStep(1)}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="mx-auto max-w-2xl">
              <Step3Confirm
                onPrev={() => setCurrentStep(2)}
                onEdit={(step) => setCurrentStep(step)}
                onChangeCourse={() => setCurrentStep(1)}
                isSubmitting={isPending}
              />
            </div>
          )}
        </form>
      </FormProvider>

      <RestoreDraftDialog
        open={isDraftDialogOpen}
        onConfirm={confirmRestore}
        onCancel={cancelRestore}
      />
    </main>
  )
}

const HEADINGS: Record<StepIndex, { title: string; description: string }> = {
  1: {
    title: '수강할 강의를 선택하세요',
    description: '관심 있는 강의를 고르고 신청 유형을 선택해 주세요.',
  },
  2: {
    title: '수강생 정보를 입력해 주세요',
    description: '신청 유형과 정보를 확인한 뒤 다음 단계로 진행해 주세요.',
  },
  3: {
    title: '입력한 내용을 확인해 주세요',
    description: '제출 전 내용을 한 번 더 검토하고 약관에 동의해 주세요.',
  },
}
