import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field } from './Field'

export function PersonalFields() {
  return (
    <div className="space-y-4">
      <Field id="applicant-name" label="이름" required>
        <Input id="applicant-name" name="name" placeholder="이름을 입력해 주세요" className="h-11" />
      </Field>

      <Field id="applicant-email" label="이메일" required>
        <Input
          id="applicant-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="example@email.com"
          className="h-11"
        />
      </Field>

      <Field id="applicant-phone" label="전화번호" required helper="예) 010-1234-5678">
        <Input
          id="applicant-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="010-0000-0000"
          className="h-11"
        />
      </Field>

      <Field id="applicant-motivation" label="수강 동기" helper="최대 300자">
        <Textarea
          id="applicant-motivation"
          name="motivation"
          rows={4}
          maxLength={300}
          placeholder="강의를 신청하게 된 이유를 자유롭게 적어주세요."
        />
      </Field>
    </div>
  )
}
