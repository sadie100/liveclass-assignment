import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { EnrollFormValues } from '../_schema'
import { Field } from '../../../components/FormField'
import { PhoneInput } from '../../../components/PhoneInput'

export function PersonalFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EnrollFormValues>()

  return (
    <div className="space-y-4">
      <Field id="applicant-name" label="이름" required error={errors.name?.message}>
        <Input
          id="applicant-name"
          placeholder="이름을 입력해 주세요"
          className="h-11"
          {...register('name')}
        />
      </Field>

      <Field id="applicant-email" label="이메일" required error={errors.email?.message}>
        <Input
          id="applicant-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="example@email.com"
          className="h-11"
          {...register('email')}
        />
      </Field>

      <Field id="applicant-phone" label="전화번호" required error={errors.phone?.message}>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInput
              id="applicant-phone"
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

      <Field
        id="applicant-motivation"
        label="수강 동기"
        helper="최대 300자"
        error={errors.motivation?.message}
      >
        <Textarea
          id="applicant-motivation"
          rows={4}
          maxLength={300}
          placeholder="강의를 신청하게 된 이유를 자유롭게 적어주세요."
          {...register('motivation')}
        />
      </Field>
    </div>
  )
}
