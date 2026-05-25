import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import type { GroupFormValues } from '../_schema'
import { Field } from '../../../components/FormField'

export function ParticipantRow({ index }: { index: number }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<GroupFormValues>()

  const number = index + 1
  const nameId = `participant-${number}-name`
  const emailId = `participant-${number}-email`

  const rowErrors = errors.participants?.[index]

  return (
    <div className="rounded-lg border p-3">
      <p className="text-muted-foreground mb-2 text-xs font-medium">참가자 {number}</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field id={nameId} label="이름" required error={rowErrors?.name?.message}>
          <Input
            id={nameId}
            placeholder="이름"
            className="h-11"
            {...register(`participants.${index}.name`)}
          />
        </Field>
        <Field id={emailId} label="이메일" required error={rowErrors?.email?.message}>
          <Input
            id={emailId}
            type="email"
            inputMode="email"
            placeholder="example@email.com"
            className="h-11"
            {...register(`participants.${index}.email`)}
          />
        </Field>
      </div>
    </div>
  )
}
