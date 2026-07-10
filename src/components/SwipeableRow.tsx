import { useState, type ReactNode } from 'react'
import { motion, useMotionValue, animate, type PanInfo } from 'motion/react'
import { Pencil, Trash2 } from 'lucide-react'

const ACTIONS_WIDTH = 144
const SPRING = { type: 'spring', stiffness: 400, damping: 40 } as const

interface SwipeableRowProps {
  onEdit: () => void
  onDelete: () => void
  children: ReactNode
}

export function SwipeableRow({ onEdit, onDelete, children }: SwipeableRowProps) {
  const x = useMotionValue(0)
  const [open, setOpen] = useState(false)

  function handleDragEnd(_event: unknown, info: PanInfo) {
    const shouldOpen = info.offset.x < -ACTIONS_WIDTH / 2 || info.velocity.x < -500
    animate(x, shouldOpen ? -ACTIONS_WIDTH : 0, SPRING)
    setOpen(shouldOpen)
  }

  function runAction(action: () => void) {
    animate(x, 0, SPRING)
    setOpen(false)
    action()
  }

  return (
    <div className="relative overflow-hidden rounded-app">
      <div className="absolute inset-y-0 right-0 flex">
        <button
          type="button"
          onClick={() => runAction(onEdit)}
          aria-label="Editar"
          tabIndex={open ? 0 : -1}
          className="flex w-18 items-center justify-center bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        >
          <Pencil className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => runAction(onDelete)}
          aria-label="Excluir"
          tabIndex={open ? 0 : -1}
          className="flex w-18 items-center justify-center bg-danger text-white"
        >
          <Trash2 className="size-5" />
        </button>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -ACTIONS_WIDTH, right: 0 }}
        dragElastic={0.05}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="relative bg-white dark:bg-neutral-950"
      >
        {children}
      </motion.div>
    </div>
  )
}
