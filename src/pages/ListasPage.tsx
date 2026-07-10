import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ListChecks, Plus } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { BottomSheet } from '@/components/BottomSheet'
import { IconButton } from '@/components/IconButton'

export function ListasPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [nome, setNome] = useState('')

  const listas = useLiveQuery(() => db.listas.orderBy('criadaEm').toArray(), [])

  function fecharSheet(open: boolean) {
    setSheetOpen(open)
    if (!open) setNome('')
  }

  async function criarLista(event: FormEvent) {
    event.preventDefault()
    const nomeLimpo = nome.trim()
    if (!nomeLimpo) return

    await db.listas.add({ nome: nomeLimpo, criadaEm: new Date() })
    fecharSheet(false)
  }

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

      {listas?.length === 0 && (
        <EmptyState
          icon={ListChecks}
          title="Nenhuma lista ainda"
          description="Toque em + para criar sua primeira lista."
        />
      )}

      {listas && listas.length > 0 && (
        <ul className="flex flex-col gap-3 p-4">
          {listas.map((lista) => (
            <li key={lista.id}>
              <Card as={Link} to={`/listas/${lista.id}`}>
                {lista.nome}
              </Card>
            </li>
          ))}
        </ul>
      )}

      <BottomSheet open={sheetOpen} onOpenChange={fecharSheet} title="Nova lista">
        <form className="flex flex-col gap-4" onSubmit={criarLista}>
          <label className="sr-only" htmlFor="nome-lista">
            Nome da lista
          </label>
          <input
            id="nome-lista"
            type="text"
            autoFocus
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Nome da lista"
            className="w-full rounded-app border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-neutral-800 dark:bg-neutral-900"
          />
          <button
            type="submit"
            className="rounded-app bg-accent px-4 py-3 text-center font-medium text-accent-foreground transition active:scale-[0.99]"
          >
            Criar lista
          </button>
        </form>
      </BottomSheet>
    </div>
  )
}
