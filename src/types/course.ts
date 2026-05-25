export const Category = {
  Development: 'development',
  Design: 'design',
  Marketing: 'marketing',
  Business: 'business',
} as const

export type Category = (typeof Category)[keyof typeof Category]

export const CATEGORIES: Category[] = Object.values(Category)

export const CATEGORY_LABELS = {
  [Category.Development]: '개발',
  [Category.Design]: '디자인',
  [Category.Marketing]: '마케팅',
  [Category.Business]: '비즈니스',
} as const satisfies Record<Category, string>

export interface Course {
  id: string
  title: string
  description: string
  category: Category
  price: number
  maxCapacity: number
  currentEnrollment: number
  startDate: string
  endDate: string
  instructor: string
}

export type EnrollmentType = 'personal' | 'group'
