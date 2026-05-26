import { useEffect, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { DEFAULT_VALUES, type EnrollFormValues } from '../_schema'

const STORAGE_KEY = 'enroll-draft:v1'
const DEBOUNCE_MS = 400

type StepIndex = 1 | 2 | 3

type StoredDraft = {
  version: 1
  step: StepIndex
  values: EnrollFormValues
}

function loadDraft(): { values: EnrollFormValues; step: StepIndex } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || (parsed as StoredDraft).version !== 1) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const { step, values } = parsed as StoredDraft
    if (step !== 1 && step !== 2 && step !== 3) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    if (!values || typeof values !== 'object') {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const merged = { ...DEFAULT_VALUES, ...(values as object) } as EnrollFormValues
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
  const [initialDraft] = useState(loadDraft)
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(initialDraft !== null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(initialDraft === null)
  const decidedRef = useRef(false)

  const stepRef = useRef(currentStep)
  useEffect(() => {
    stepRef.current = currentStep
  }, [currentStep])

  useEffect(() => {
    if (!autoSaveEnabled) return

    let timer: ReturnType<typeof setTimeout> | null = null

    const writeDraft = () => {
      try {
        const payload: StoredDraft = {
          version: 1,
          step: stepRef.current,
          values: methods.getValues(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      } catch {
        // quota or serialization issues — ignore
      }
    }

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
  }, [autoSaveEnabled, methods])

  useEffect(() => {
    if (!autoSaveEnabled) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as StoredDraft
      const payload: StoredDraft = {
        version: 1,
        step: currentStep,
        values: parsed.values,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore
    }
  }, [currentStep, autoSaveEnabled])

  function confirmRestore() {
    if (decidedRef.current) return
    decidedRef.current = true
    if (initialDraft) {
      methods.reset(initialDraft.values)
      setCurrentStep(initialDraft.step)
    }
    setIsDraftDialogOpen(false)
    setAutoSaveEnabled(true)
  }

  function cancelRestore() {
    if (decidedRef.current) return
    decidedRef.current = true
    clearDraftStorage()
    setIsDraftDialogOpen(false)
    setAutoSaveEnabled(true)
  }

  return {
    isDraftDialogOpen,
    confirmRestore,
    cancelRestore,
    clearDraft: clearDraftStorage,
  }
}
