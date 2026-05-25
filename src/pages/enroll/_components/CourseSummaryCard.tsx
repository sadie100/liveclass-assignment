import { Calendar, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateRange, formatPrice } from '@/lib/format'
import { CATEGORY_LABELS, type Course } from '@/types/course'

export function CourseSummaryCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary">{CATEGORY_LABELS[course.category]}</Badge>
          <span className="text-foreground text-lg font-semibold tabular-nums">
            {formatPrice(course.price)}
          </span>
        </div>

        <h2 className="text-foreground text-lg leading-snug font-semibold">{course.title}</h2>

        <div className="text-muted-foreground flex flex-col gap-1.5 text-sm">
          <div className="flex items-center gap-2">
            <User aria-hidden className="size-4" />
            <span>{course.instructor} 강사</span>
          </div>
          <div className="flex items-center gap-2 tabular-nums">
            <Calendar aria-hidden className="size-4" />
            <span>{formatDateRange(course.startDate, course.endDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
