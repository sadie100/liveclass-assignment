import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CATEGORIES, CATEGORY_LABELS, type CategoryFilter } from '@/types/course'

interface CategoryTabsProps {
  value: CategoryFilter
  onChange: (value: CategoryFilter) => void
}

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as CategoryFilter)}>
      <TabsList variant="line" aria-label="카테고리 필터">
        <TabsTrigger value="all">전체</TabsTrigger>
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat} value={cat}>
            {CATEGORY_LABELS[cat]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
