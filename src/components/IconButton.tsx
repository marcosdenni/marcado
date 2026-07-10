import type { ButtonHTMLAttributes } from 'react'

export function IconButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition active:scale-95 ${className}`}
      {...props}
    />
  )
}
