import { useEffect } from 'react'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import type { GroupFormValues } from '../_schema'
import { Field } from '../../../components/FormField'
import { ParticipantRow } from './ParticipantRow'
import { PhoneInput } from '../../../components/PhoneInput'

const MIN_PARTICIPANTS = 2
const MAX_PARTICIPANTS = 10

export function GroupFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<GroupFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants',
  })

  const headCount = useWatch({ control, name: 'headCount' })

  useEffect(() => {
    if (typeof headCount !== 'number' || !Number.isInteger(headCount)) return
    if (headCount < MIN_PARTICIPANTS || headCount > MAX_PARTICIPANTS) return
    if (fields.length === headCount) return

    if (fields.length < headCount) {
      for (let i = fields.length; i < headCount; i++) {
        append({ name: '', email: '' }, { shouldFocus: false })
      }
    } else {
      for (let i = fields.length - 1; i >= headCount; i--) {
        remove(i)
      }
    }
  }, [headCount, fields.length, append, remove])

  return (
    <div className="space-y-4">
      <Field id="org-name" label="단체명" required error={errors.organizationName?.message}>
        <Input
          id="org-name"
          placeholder="예) 라이브클래스"
          className="h-11"
          {...register('organizationName')}
        />
      </Field>

      <Field
        id="head-count"
        label="신청 인원수"
        required
        helper="2~10명까지 신청 가능합니다"
        error={errors.headCount?.message}
      >
        <Input
          id="head-count"
          type="number"
          inputMode="numeric"
          min={MIN_PARTICIPANTS}
          max={MAX_PARTICIPANTS}
          className="h-11 w-32"
          {...register('headCount', { valueAsNumber: true })}
        />
      </Field>

      <Field
        id="contact-person"
        label="담당자 연락처"
        required
        error={errors.contactPerson?.message}
      >
        <Controller
          control={control}
          name="contactPerson"
          render={({ field }) => (
            <PhoneInput
              id="contact-person"
              placeholder="전화번호를 입력해 주세요. (숫자만 입력)"
              className="h-11"
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
      </Field>

      <div className="space-y-2">
        <div>
          <p className="text-foreground text-sm font-medium">
            참가자 명단
            <span aria-hidden className="text-destructive">
              *
            </span>
            <span className="sr-only">(필수)</span>
          </p>
          <p className="text-muted-foreground text-xs">
            참가자 전원의 이름과 이메일을 입력해 주세요.
          </p>
        </div>
        <div className="space-y-2">
          {fields.map((field, i) => (
            <ParticipantRow key={field.id} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
