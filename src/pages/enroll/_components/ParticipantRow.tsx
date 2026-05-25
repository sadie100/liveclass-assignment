import { Input } from '@/components/ui/input'
import { Field } from './Field'

export function ParticipantRow({ index }: { index: number }) {
  const number = index + 1
  const nameId = `participant-${number}-name`
  const emailId = `participant-${number}-email`

  return (
    <div className="rounded-lg border p-3">
      <p className="text-muted-foreground mb-2 text-xs font-medium">참가자 {number}</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field id={nameId} label="이름" required>
          <Input id={nameId} name={`participants.${index}.name`} placeholder="이름" className="h-11" />
        </Field>
        <Field id={emailId} label="이메일" required>
          <Input
            id={emailId}
            name={`participants.${index}.email`}
            type="email"
            inputMode="email"
            placeholder="example@email.com"
            className="h-11"
          />
        </Field>
      </div>
    </div>
  )
}
