import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { EnrollmentType } from '@/types/course'
import { ConfirmPersonalSwitchAlert } from '../_components/ConfirmPersonalSwitchAlert'
import { MIN_PARTICIPANTS, type EnrollFormValues } from '../_schema'

export function useChangeEnrollType() {
  const { setValue, getValues, clearErrors } = useFormContext<EnrollFormValues>()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const applyChange = (next: EnrollmentType) => {
    const current = getValues('type')
    if (current === next) return

    if (next === 'personal') {
      setValue('type', 'personal', { shouldDirty: true })
      setValue('organizationName', '', { shouldDirty: true })
      setValue('headCount', MIN_PARTICIPANTS, { shouldDirty: true })
      setValue('contactPerson', '', { shouldDirty: true })
      setValue(
        'participants',
        Array.from({ length: MIN_PARTICIPANTS }, () => ({ name: '', email: '' })),
        { shouldDirty: true },
      )
      clearErrors(['organizationName', 'headCount', 'contactPerson', 'participants'])
    } else {
      setValue('type', 'group', { shouldDirty: true })
    }
  }

  const requestChange = (next: EnrollmentType) => {
    const current = getValues('type')
    if (current === 'group' && next === 'personal') {
      setConfirmOpen(true)
      return
    }
    applyChange(next)
  }

  const confirmSwitchDialog = (
    <ConfirmPersonalSwitchAlert
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      onConfirm={() => applyChange('personal')}
    />
  )

  return { requestChange, confirmSwitchDialog }
}
