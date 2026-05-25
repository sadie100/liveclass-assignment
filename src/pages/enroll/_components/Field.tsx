import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FieldProps {
  id: string
  label: string
  required?: boolean
  helper?: string
  className?: string
  children: ReactNode
}

export function Field({ id, label, required, helper, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <>
            <span aria-hidden className="text-destructive">
              *
            </span>
            <span className="sr-only">(필수)</span>
          </>
        )}
      </Label>
      {children}
      {helper && <p className="text-muted-foreground text-xs">{helper}</p>}
    </div>
  )
}
