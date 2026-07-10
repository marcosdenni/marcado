import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, ShoppingBasket } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { AnimatePresence, motion } from 'motion/react'
import { db, type Produto } from '@/lib/db'
import { registrarUsoCatalogo } from '@/lib/catalogo'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { NomeFormSheet } from '@/components/NomeFormSheet'
import { AdicionarProdutosSheet } from '@/components/AdicionarProdutosSheet'
import { VoiceAddOverlay } from '@/components/VoiceAddOverlay'
import { SwipeableRow } from '@/components/SwipeableRow'
import { IconButton } from '@/components/IconButton'
import { RiscarTexto } from '@/components/RiscarTexto'

const ITEM_TRANSITION = { duration: 0.18 }

export function ListaDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const listId = Number(id)
  const [createOpen, setCreateOpen] = useState(false)
  const [vozOverlayOpen, setVozOverlayOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)

  const lista = useLiveQuery(() => db.listas.get(listId), [listId])
  const produtos = useLiveQuery(
    () => db.produtos.where('listId').equals(listId).sortBy('criadoEm'),
    [listId],
  )

  const pendentes = produtos?.filter((produto) => !produto.comprado) ?? []
  const comprados = produtos?.filter((produto) => produto.comprado) ?? []

  async function adicionarProdutos(nomes: string[]) {
    const agora = new Date()
    await db.transaction('rw', db.produtos, db.catalogo, async () => {
      for (const nome of nomes) {
        await db.produtos.add({ listId, nome, comprado: false, criadoEm: agora })
        await registrarUsoCatalogo(nome)
      }
    })
  }

  async function alternarComprado(produtoId: number, comprado: boolean) {
    await db.produtos.update(produtoId, { comprado: !comprado })
    navigator.vibrate?.(10)
  }

  function abrirEdicao(produto: Produto) {
    setEditingProduto(produto)
    setEditOpen(true)
  }

  async function salvarEdicao(nome: string) {
    if (!editingProduto) return
    await db.produtos.update(editingProduto.id, { nome })
  }

  async function excluirProduto(produtoId: number) {
    await db.produtos.delete(produtoId)
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
          <IconButton aria-label="Adicionar produto" onClick={() => setCreateOpen(true)}>
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
            <AnimatePresence initial={false}>
              {pendentes.map((produto, index) => (
                <motion.li
                  key={produto.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ ...ITEM_TRANSITION, delay: index * 0.04 }}
                >
                  <SwipeableRow
                    onEdit={() => abrirEdicao(produto)}
                    onDelete={() => excluirProduto(produto.id)}
                  >
                    <Card
                      as="button"
                      type="button"
                      onClick={() => alternarComprado(produto.id, produto.comprado)}
                    >
                      {produto.nome}
                    </Card>
                  </SwipeableRow>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {comprados.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                Comprados
              </p>
              <ul className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {comprados.map((produto) => (
                    <motion.li
                      key={produto.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -80 }}
                      transition={ITEM_TRANSITION}
                    >
                      <SwipeableRow
                        onEdit={() => abrirEdicao(produto)}
                        onDelete={() => excluirProduto(produto.id)}
                      >
                        <Card
                          as="button"
                          type="button"
                          onClick={() => alternarComprado(produto.id, produto.comprado)}
                          className="text-neutral-400 dark:text-neutral-500"
                        >
                          <RiscarTexto ativo>{produto.nome}</RiscarTexto>
                        </Card>
                      </SwipeableRow>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          )}
        </div>
      )}

      <AdicionarProdutosSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={adicionarProdutos}
        onIniciarVoz={() => {
          setCreateOpen(false)
          setVozOverlayOpen(true)
        }}
      />

      {vozOverlayOpen && (
        <VoiceAddOverlay listId={listId} onClose={() => setVozOverlayOpen(false)} />
      )}

      <NomeFormSheet
        key={editingProduto?.id ?? 'edit-none'}
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Editar produto"
        label="Nome do produto"
        submitLabel="Salvar"
        initialValue={editingProduto?.nome}
        onSubmit={salvarEdicao}
      />
    </div>
  )
}
