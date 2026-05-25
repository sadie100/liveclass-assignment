import { forwardRef, useMemo, type ComponentPropsWithoutRef } from 'react'
import { Input } from '@/components/ui/input'

type PhoneInputProps = Omit<ComponentPropsWithoutRef<typeof Input>, 'value' | 'onChange'> & {
  value: string
  onChange: (digits: string) => void
}

const SEOUL_MAX = 10
const DEFAULT_MAX = 11

function getMaxDigits(digits: string) {
  return digits.startsWith('02') ? SEOUL_MAX : DEFAULT_MAX
}

function formatPhone(digits: string) {
  const isSeoul = digits.startsWith('02')
  const firstLen = isSeoul ? 2 : 3

  // 완성 길이에 해당하면 사용자가 지정한 분절 규칙으로 표기
  if (isSeoul && digits.length === 9) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
  }
  if (isSeoul && digits.length === 10) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (!isSeoul && digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  // 입력 중간 상태: 마지막 4자리를 우선 분리해 점진적으로 노출
  const first = digits.slice(0, firstLen)
  const middle = digits.slice(firstLen, firstLen + 4)
  const last = digits.slice(firstLen + 4)

  if (!middle) return first
  if (!last) return `${first}-${middle}`
  return `${first}-${middle}-${last}`
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  { value, onChange, ...rest },
  ref,
) {
  const display = useMemo(() => formatPhone(value), [value])

  return (
    <Input
      ref={ref}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      value={display}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, '')
        const digits = raw.slice(0, getMaxDigits(raw))
        onChange(digits)
      }}
      {...rest}
    />
  )
})
