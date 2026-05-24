import type { Category } from '@/types/course'

const CATEGORY_LABELS: Record<Category, string> = {
  development: '개발',
  design: '디자인',
  marketing: '마케팅',
  business: '비즈니스',
}

export function categoryLabel(category: Category): string {
  return CATEGORY_LABELS[category]
}

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
