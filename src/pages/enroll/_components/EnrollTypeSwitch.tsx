import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { EnrollmentType } from '@/types/course'

const OPTIONS: Array<{ value: EnrollmentType; label: string; description: string }> = [
  { value: 'personal', label: '개인 신청', description: '혼자 신청합니다' },
  { value: 'group', label: '단체 신청', description: '2~10명을 함께 신청합니다' },
]

interface EnrollTypeSwitchProps {
  value: EnrollmentType
  onChange: (value: EnrollmentType) => void
}

export function EnrollTypeSwitch({ value, onChange }: EnrollTypeSwitchProps) {
  return (
    <fieldset>
      <legend className="sr-only">신청 유형</legend>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as EnrollmentType)}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors"
          >
            <RadioGroupItem value={opt.value} />
            <span className="flex flex-col leading-tight">
              <span className="text-foreground font-medium">{opt.label}</span>
              <span className="text-muted-foreground text-xs">{opt.description}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  )
}
