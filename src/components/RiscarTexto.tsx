import type { ReactNode } from 'react'
import { motion } from 'motion/react'

interface RiscarTextoProps {
  ativo: boolean
  children: ReactNode
}

export function RiscarTexto({ ativo, children }: RiscarTextoProps) {
  return (
    <span className="relative inline-block">
      {children}
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-px w-full origin-left bg-current"
        initial={false}
        animate={{ scaleX: ativo ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </span>
  )
}
