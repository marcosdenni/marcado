import type { ReactNode } from 'react'
import { Drawer } from 'vaul'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}

export function BottomSheet({ open, onOpenChange, title, children }: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 flex flex-col rounded-t-app bg-white p-4 pb-8 outline-none dark:bg-neutral-900">
          <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <Drawer.Title className="mb-4 text-base font-semibold">{title}</Drawer.Title>
          <Drawer.Description className="sr-only">{title}</Drawer.Description>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
