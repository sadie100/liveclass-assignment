import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FieldProps {
  id: string
  label: string
  required?: boolean
  helper?: string
  error?: string
  className?: string
  children: ReactNode
}

export function Field({ id, label, required, helper, error, className, children }: FieldProps) {
  const messageId = error ? `${id}-error` : helper ? `${id}-helper` : undefined

  const enhancedChild = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        'aria-invalid': error ? true : undefined,
        'aria-describedby': messageId,
      })
    : Children.only(children)

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
      {enhancedChild}
      {error ? (
        <p id={messageId} className="text-destructive text-xs">
          {error}
        </p>
      ) : helper ? (
        <p id={messageId} className="text-muted-foreground text-xs">
          {helper}
        </p>
      ) : null}
    </div>
  )
}
