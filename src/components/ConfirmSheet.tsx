import { BottomSheet } from '@/components/BottomSheet'

interface ConfirmSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void | Promise<void>
}

export function ConfirmSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmSheetProps) {
  async function handleConfirm() {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={title}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-app border border-neutral-200 px-4 py-3 text-center font-medium transition active:scale-[0.99] dark:border-neutral-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-app bg-danger px-4 py-3 text-center font-medium text-white transition active:scale-[0.99]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
