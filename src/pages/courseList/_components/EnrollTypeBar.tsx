import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatPrice } from '@/lib/format'
import type { Course, EnrollmentType } from '@/types/course'

interface EnrollTypeBarProps {
  selectedCourse: Course | null
  type: EnrollmentType
  onTypeChange: (type: EnrollmentType) => void
  onNext: () => void
}

const OPTIONS: Array<{
  value: EnrollmentType
  label: string
  description: string
}> = [
  { value: 'personal', label: '개인 신청', description: '혼자 신청합니다' },
  {
    value: 'group',
    label: '단체 신청',
    description: '2~10명을 함께 신청합니다',
  },
]

export function EnrollTypeBar({ selectedCourse, type, onTypeChange, onNext }: EnrollTypeBarProps) {
  const ready = selectedCourse !== null

  return (
    <div className="bg-background/95 sticky bottom-0 z-20 -mx-4 mt-8 border-t px-4 py-4 backdrop-blur md:-mx-6 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">선택한 강의</p>
          {selectedCourse ? (
            <p className="text-foreground truncate text-sm font-medium">
              {selectedCourse.title}{' '}
              <span className="text-muted-foreground">· {formatPrice(selectedCourse.price)}</span>
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">강의를 먼저 선택해 주세요</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <fieldset disabled={!ready} className="min-w-0">
            <legend className="sr-only">신청 유형</legend>
            <RadioGroup
              value={type}
              onValueChange={(v) => onTypeChange(v as EnrollmentType)}
              className="flex gap-2"
            >
              {OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
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

          <Button size="lg" disabled={!ready} onClick={onNext} className="shrink-0">
            신청하기
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  )
}
