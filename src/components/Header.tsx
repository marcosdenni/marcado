import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  leading?: ReactNode
  action?: ReactNode
}

export function Header({ title, leading, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      {leading}
      <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>
      {action}
    </header>
  )
}
