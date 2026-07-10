import type { ComponentPropsWithoutRef, ElementType } from 'react'

type CardProps<T extends ElementType> = {
  as?: T
} & ComponentPropsWithoutRef<T>

export function Card<T extends ElementType = 'div'>({
  as,
  className = '',
  ...props
}: CardProps<T>) {
  const Component = as ?? 'div'

  return (
    <Component
      className={`block w-full rounded-app border border-neutral-200 bg-white p-4 text-left shadow-sm transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-accent/40 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
      {...props}
    />
  )
}
