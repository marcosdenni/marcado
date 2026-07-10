import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, ShoppingBasket } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { BottomSheet } from '@/components/BottomSheet'
import { IconButton } from '@/components/IconButton'

export function ListaDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const listId = Number(id)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [nome, setNome] = useState('')

  const lista = useLiveQuery(() => db.listas.get(listId), [listId])
  const produtos = useLiveQuery(
    () => db.produtos.where('listId').equals(listId).sortBy('criadoEm'),
    [listId],
  )

  const pendentes = produtos?.filter((produto) => !produto.comprado) ?? []
  const comprados = produtos?.filter((produto) => produto.comprado) ?? []

  function fecharSheet(open: boolean) {
    setSheetOpen(open)
    if (!open) setNome('')
  }

  async function adicionarProduto(event: FormEvent) {
    event.preventDefault()
    const nomeLimpo = nome.trim()
    if (!nomeLimpo) return

    await db.produtos.add({ listId, nome: nomeLimpo, comprado: false, criadoEm: new Date() })
    fecharSheet(false)
  }

  async function alternarComprado(produtoId: number, comprado: boolean) {
    await db.produtos.update(produtoId, { comprado: !comprado })
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header
        title={lista?.nome ?? 'Lista'}
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

      {produtos?.length === 0 && (
        <EmptyState
          icon={ShoppingBasket}
          title="Nenhum produto ainda"
          description="Toque em + para adicionar o primeiro item."
        />
      )}

      {produtos && produtos.length > 0 && (
        <div className="flex flex-col gap-6 p-4">
          <ul className="flex flex-col gap-3">
            {pendentes.map((produto) => (
              <li key={produto.id}>
                <Card
                  as="button"
                  type="button"
                  onClick={() => alternarComprado(produto.id, produto.comprado)}
                >
                  {produto.nome}
                </Card>
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
                    <Card
                      as="button"
                      type="button"
                      onClick={() => alternarComprado(produto.id, produto.comprado)}
                      className="text-neutral-400 line-through dark:text-neutral-500"
                    >
                      {produto.nome}
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <BottomSheet open={sheetOpen} onOpenChange={fecharSheet} title="Adicionar produto">
        <form className="flex flex-col gap-4" onSubmit={adicionarProduto}>
          <label className="sr-only" htmlFor="nome-produto">
            Nome do produto
          </label>
          <input
            id="nome-produto"
            type="text"
            autoFocus
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Nome do produto"
            className="w-full rounded-app border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-neutral-800 dark:bg-neutral-900"
          />
          <button
            type="submit"
            className="rounded-app bg-accent px-4 py-3 text-center font-medium text-accent-foreground transition active:scale-[0.99]"
          >
            Adicionar produto
          </button>
        </form>
      </BottomSheet>
    </div>
  )
}
