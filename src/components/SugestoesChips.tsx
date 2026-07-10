import type { CatalogoItem } from '@/lib/db'

interface SugestoesChipsProps {
  sugestoes: CatalogoItem[]
  onSelect: (nome: string) => void
}

export function SugestoesChips({ sugestoes, onSelect }: SugestoesChipsProps) {
  if (sugestoes.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {sugestoes.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.nome)}
          className="shrink-0 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 transition active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
        >
          {item.nome}
        </button>
      ))}
    </div>
  )
}
