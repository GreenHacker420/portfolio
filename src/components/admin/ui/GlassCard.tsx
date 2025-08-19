import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function GlassCard({ className, children, title, description, actions, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card border border-border rounded-xl p-5 transition-all',
        'hover:shadow-xl hover:border-primary/40 bg-background/70 backdrop-blur',
        className,
      )}
      {...props}
    >
      {(title || description || actions) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  )}

