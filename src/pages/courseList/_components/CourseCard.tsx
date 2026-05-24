import { Calendar, Check, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { categoryLabel, formatDateRange, formatPrice, getCapacityStatus } from '@/lib/format'
import type { Course } from '@/types/course'

interface CourseCardProps {
  course: Course
  selected: boolean
  tabIndex: number
  onSelect: (id: string) => void
}

export function CourseCard({ course, selected, tabIndex, onSelect }: CourseCardProps) {
  const status = getCapacityStatus(course.currentEnrollment, course.maxCapacity)
  const soldOut = status === 'sold-out'
  const ratio = Math.round((course.currentEnrollment / course.maxCapacity) * 100)
  const remaining = course.maxCapacity - course.currentEnrollment

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={soldOut || undefined}
      disabled={soldOut}
      tabIndex={tabIndex}
      onClick={() => !soldOut && onSelect(course.id)}
      className={cn(
        'group bg-card relative flex flex-col gap-4 rounded-xl border p-5 text-left transition-colors',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        !soldOut && 'hover:border-foreground/30 cursor-pointer hover:shadow-sm',
        selected && 'border-primary ring-primary/20 border-2 ring-2',
        !selected && !soldOut && 'border-border',
        soldOut && 'border-border cursor-not-allowed opacity-60',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary">{categoryLabel(course.category)}</Badge>
        {status === 'almost-full' && (
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
          >
            잔여 {remaining}석
          </Badge>
        )}
        {status === 'sold-out' && (
          <Badge variant="outline" className="text-muted-foreground">
            마감
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-foreground line-clamp-2 text-lg leading-snug font-semibold">
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm">{course.instructor} 강사</p>
      </div>

      <p className="text-muted-foreground line-clamp-2 text-sm">{course.description}</p>

      <div className="space-y-2 text-sm">
        <div className="text-muted-foreground flex items-center gap-2 tabular-nums">
          <Calendar aria-hidden className="size-4" />
          <span>{formatDateRange(course.startDate, course.endDate)}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2">
          <Users aria-hidden className="size-4" />
          <Progress value={ratio} className="h-1.5 flex-1" />
          <span className="tabular-nums">
            {course.currentEnrollment}/{course.maxCapacity}명
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between border-t pt-4">
        <span className="text-foreground text-lg font-semibold tabular-nums">
          {formatPrice(course.price)}
        </span>
        <span
          className={cn('text-sm font-medium', selected ? 'text-primary' : 'text-muted-foreground')}
        >
          {soldOut ? '마감된 강의' : selected ? '선택됨' : '선택하기'}
        </span>
      </div>

      {selected && (
        <span
          aria-hidden
          className="bg-primary text-primary-foreground absolute top-3 right-3 flex size-6 items-center justify-center rounded-full shadow"
        >
          <Check className="size-4" />
        </span>
      )}
    </button>
  )
}
