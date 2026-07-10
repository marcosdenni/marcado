import { useState, type FormEvent } from 'react'
import { BottomSheet } from '@/components/BottomSheet'

interface NomeFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  label: string
  submitLabel: string
  initialValue?: string
  onSubmit: (nome: string) => void | Promise<void>
}

export function NomeFormSheet({
  open,
  onOpenChange,
  title,
  label,
  submitLabel,
  initialValue = '',
  onSubmit,
}: NomeFormSheetProps) {
  const [nome, setNome] = useState(initialValue)

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) setNome(initialValue)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nomeLimpo = nome.trim()
    if (!nomeLimpo) return

    await onSubmit(nomeLimpo)
    handleOpenChange(false)
  }

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange} title={title}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="nome-form-sheet">
          {label}
        </label>
        <input
          id="nome-form-sheet"
          type="text"
          autoFocus
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          placeholder={label}
          className="w-full rounded-app border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-neutral-800 dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="rounded-app bg-accent px-4 py-3 text-center font-medium text-accent-foreground transition active:scale-[0.99]"
        >
          {submitLabel}
        </button>
      </form>
    </BottomSheet>
  )
}
