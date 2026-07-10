import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ListChecks, Plus } from 'lucide-react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { BottomSheet } from '@/components/BottomSheet'
import { IconButton } from '@/components/IconButton'

const listasMock = [
  { id: 1, nome: 'Mercado da semana' },
  { id: 2, nome: 'Farmácia' },
]

export function ListasPage() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="flex min-h-svh flex-col">
      <Header
        title="Minhas listas"
        action={
          <IconButton aria-label="Nova lista" onClick={() => setSheetOpen(true)}>
            <Plus className="size-5" />
          </IconButton>
        }
      />

      {listasMock.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nenhuma lista ainda"
          description="Toque em + para criar sua primeira lista."
        />
      ) : (
        <ul className="flex flex-col gap-3 p-4">
          {listasMock.map((lista) => (
            <li key={lista.id}>
              <Card as={Link} to={`/listas/${lista.id}`}>
                {lista.nome}
              </Card>
            </li>
          ))}
        </ul>
      )}

      <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen} title="Nova lista">
        <label className="sr-only" htmlFor="nome-lista">
          Nome da lista
        </label>
        <input
          id="nome-lista"
          type="text"
          placeholder="Nome da lista"
          className="w-full rounded-app border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-neutral-800 dark:bg-neutral-900"
        />
      </BottomSheet>
    </div>
  )
}
