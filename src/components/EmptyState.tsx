import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <Icon className="mb-2 size-10 text-neutral-300 dark:text-neutral-700" strokeWidth={1.5} />
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
      )}
    </div>
  )
}
