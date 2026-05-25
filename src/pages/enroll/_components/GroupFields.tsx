import { Input } from '@/components/ui/input'
import { Field } from './Field'
import { ParticipantRow } from './ParticipantRow'

const PLACEHOLDER_ROWS = 2

export function GroupFields() {
  return (
    <div className="space-y-4">
      <Field id="org-name" label="단체명" required>
        <Input
          id="org-name"
          name="organizationName"
          placeholder="예) 라이브클래스"
          className="h-11"
        />
      </Field>

      <Field id="head-count" label="신청 인원수" required helper="2~10명까지 신청 가능합니다">
        <Input
          id="head-count"
          name="headCount"
          type="number"
          inputMode="numeric"
          min={2}
          max={10}
          defaultValue={PLACEHOLDER_ROWS}
          className="h-11 w-32"
        />
      </Field>

      <Field id="contact-person" label="담당자 연락처" required helper="예) 010-1234-5678">
        <Input
          id="contact-person"
          name="contactPerson"
          type="tel"
          inputMode="tel"
          placeholder="010-0000-0000"
          className="h-11"
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
          {Array.from({ length: PLACEHOLDER_ROWS }).map((_, i) => (
            <ParticipantRow key={i} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
