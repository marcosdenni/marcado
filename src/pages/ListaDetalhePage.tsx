import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, ShoppingBasket } from 'lucide-react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { BottomSheet } from '@/components/BottomSheet'
import { IconButton } from '@/components/IconButton'

const produtosMock = [
  { id: 1, nome: 'Leite', comprado: false },
  { id: 2, nome: 'Pão', comprado: false },
  { id: 3, nome: 'Café', comprado: true },
]

export function ListaDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const [sheetOpen, setSheetOpen] = useState(false)

  const pendentes = produtosMock.filter((produto) => !produto.comprado)
  const comprados = produtosMock.filter((produto) => produto.comprado)

  return (
    <div className="flex min-h-svh flex-col">
      <Header
        title={`Lista #${id}`}
        leading={
          <Link
            to="/"
            aria-label="Voltar"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-600 dark:text-neutral-300"
          >
            <ArrowLeft className="size-5" />
          </Link>
        }
        action={
          <IconButton aria-label="Adicionar produto" onClick={() => setSheetOpen(true)}>
            <Plus className="size-5" />
          </IconButton>
        }
      />

      {produtosMock.length === 0 ? (
        <EmptyState
          icon={ShoppingBasket}
          title="Nenhum produto ainda"
          description="Toque em + para adicionar o primeiro item."
        />
      ) : (
        <div className="flex flex-col gap-6 p-4">
          <ul className="flex flex-col gap-3">
            {pendentes.map((produto) => (
              <li key={produto.id}>
                <Card>{produto.nome}</Card>
              </li>
            ))}
          </ul>

          {comprados.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                Comprados
              </p>
              <ul className="flex flex-col gap-3">
                {comprados.map((produto) => (
                  <li key={produto.id}>
                    <Card className="text-neutral-400 line-through dark:text-neutral-500">
                      {produto.nome}
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen} title="Adicionar produto">
        <label className="sr-only" htmlFor="nome-produto">
          Nome do produto
        </label>
        <input
          id="nome-produto"
          type="text"
          placeholder="Nome do produto"
          className="w-full rounded-app border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-neutral-800 dark:bg-neutral-900"
        />
      </BottomSheet>
    </div>
  )
}
