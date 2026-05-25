const priceFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
})

export function formatPrice(price: number): string {
  return priceFormatter.format(price)
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function formatDate(iso: string): string {
  return dateFormatter
    .format(new Date(iso))
    .replace(/\.\s?$/, '')
    .replace(/\.\s/g, '.')
}

export function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} - ${formatDate(end)}`
}

export type CapacityStatus = 'available' | 'almost-full' | 'sold-out'

export function getCapacityStatus(current: number, max: number): CapacityStatus {
  if (current >= max) return 'sold-out'
  if (current / max >= 0.7) return 'almost-full'
  return 'available'
}

export function formatPhone(digits: string) {
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
