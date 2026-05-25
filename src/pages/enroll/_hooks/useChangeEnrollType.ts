import { useFormContext } from 'react-hook-form'
import type { EnrollmentType } from '@/types/course'
import type { EnrollFormValues } from '../_schema'

export function useChangeEnrollType() {
  const { setValue, getValues, clearErrors } = useFormContext<EnrollFormValues>()

  return (next: EnrollmentType) => {
    const current = getValues('type')
    if (current === next) return

    if (next === 'personal') {
      setValue('type', 'personal', { shouldDirty: true })
      clearErrors(['organizationName', 'headCount', 'contactPerson', 'participants'])
    } else {
      setValue('type', 'group', { shouldDirty: true })
    }
  }
}
