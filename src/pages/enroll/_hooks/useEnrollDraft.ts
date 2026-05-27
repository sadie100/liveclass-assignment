import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { DEFAULT_VALUES, type EnrollFormValues } from '../_schema'

const STORAGE_KEY = 'enroll-draft:v1'
const DEBOUNCE_MS = 400

const stepSchema = z.union([z.literal(1), z.literal(2), z.literal(3)])
type StepIndex = z.infer<typeof stepSchema>

const storedDraftSchema = z.object({
  version: z.literal(1),
  step: stepSchema,
  values: z.record(z.string(), z.unknown()),
})

function loadDraft(): { values: EnrollFormValues; step: StepIndex } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const result = storedDraftSchema.safeParse(JSON.parse(raw))
    if (!result.success) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const { step, values } = result.data
    const merged = { ...DEFAULT_VALUES, ...values } as EnrollFormValues
    return { values: merged, step }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function clearDraftStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

type UseEnrollDraftOptions = {
  methods: UseFormReturn<EnrollFormValues>
  currentStep: StepIndex
  setCurrentStep: (step: StepIndex) => void
}

export function useEnrollDraft({ methods, currentStep, setCurrentStep }: UseEnrollDraftOptions) {
  // 지금 로컬스토리지에 저장된 draft. 사용자가 복원 여부를 결정할 때만 참조한다.
  const [initialDraft] = useState(loadDraft)
  // 로컬스토리지에 draft가 있으면 복원 여부를 묻는 다이얼로그를 연다.
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(initialDraft !== null)
  // 중복 호출 방지 플래그
  const decidedRef = useRef(false)
  // 복원/새로 시작 선택 전이나 clearDraft 이후에는 임시저장된 값을 덮어쓰지 않도록 막는다.
  const canWriteDraftRef = useRef(initialDraft === null)
  // debounce된 저장 함수가 최신 단계를 읽을 수 있도록 currentStep을 ref로 보관한다.
  const stepRef = useRef(currentStep)

  useEffect(() => {
    stepRef.current = currentStep
  }, [currentStep])

  const writeDraft = useCallback(
    (step: StepIndex = stepRef.current) => {
      if (!canWriteDraftRef.current) return
      if (!methods.formState.isDirty) return

      try {
        const payload = {
          version: 1 as const,
          step,
          values: methods.getValues(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      } catch {
        // quota or serialization issues - ignore
      }
    },
    [methods],
  )

  // 임시저장 로직(디바운스)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    const subscription = methods.watch(() => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(writeDraft, DEBOUNCE_MS)
    })

    return () => {
      subscription.unsubscribe()
      if (timer) {
        clearTimeout(timer)
        writeDraft()
      }
    }
  }, [methods, writeDraft])

  // 현재 단계가 변경될 때마다 임시저장
  useEffect(() => {
    writeDraft(currentStep)
  }, [currentStep, writeDraft])

  function clearDraft() {
    canWriteDraftRef.current = false
    clearDraftStorage()
  }

  function confirmRestore() {
    if (decidedRef.current) return
    decidedRef.current = true
    if (initialDraft) {
      methods.reset(initialDraft.values)
      setCurrentStep(initialDraft.step)
    }
    setIsDraftDialogOpen(false)
    canWriteDraftRef.current = true
  }

  function cancelRestore() {
    if (decidedRef.current) return
    decidedRef.current = true
    clearDraftStorage()
    setIsDraftDialogOpen(false)
    canWriteDraftRef.current = true
  }

  return {
    isDraftDialogOpen,
    confirmRestore,
    cancelRestore,
    clearDraft,
  }
}
