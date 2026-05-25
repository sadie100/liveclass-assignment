import { forwardRef, useMemo, type ComponentPropsWithoutRef } from 'react'
import { Input } from '@/components/ui/input'
import { formatPhone } from '@/lib/format'

type PhoneInputProps = Omit<ComponentPropsWithoutRef<typeof Input>, 'value' | 'onChange'> & {
  value: string
  onChange: (digits: string) => void
}

const SEOUL_MAX = 10
const DEFAULT_MAX = 11

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

function getMaxDigits(digits: string) {
  return digits.startsWith('02') ? SEOUL_MAX : DEFAULT_MAX
}

