export type Category = 'development' | 'design' | 'marketing' | 'business'

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
