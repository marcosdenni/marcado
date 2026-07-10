import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ListChecks, Plus } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Lista } from '@/lib/db'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { NomeFormSheet } from '@/components/NomeFormSheet'
import { ConfirmSheet } from '@/components/ConfirmSheet'
import { SwipeableRow } from '@/components/SwipeableRow'
import { IconButton } from '@/components/IconButton'

export function ListasPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingLista, setEditingLista] = useState<Lista | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingLista, setDeletingLista] = useState<Lista | null>(null)

  const listas = useLiveQuery(() => db.listas.orderBy('criadaEm').toArray(), [])

  async function criarLista(nome: string) {
    await db.listas.add({ nome, criadaEm: new Date() })
  }

  function abrirEdicao(lista: Lista) {
    setEditingLista(lista)
    setEditOpen(true)
  }

  async function salvarEdicao(nome: string) {
    if (!editingLista) return
    await db.listas.update(editingLista.id, { nome })
  }

  function abrirExclusao(lista: Lista) {
    setDeletingLista(lista)
    setDeleteOpen(true)
  }

  async function confirmarExclusao() {
    if (!deletingLista) return
    await db.transaction('rw', db.listas, db.produtos, async () => {
      await db.produtos.where('listId').equals(deletingLista.id).delete()
      await db.listas.delete(deletingLista.id)
    })
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header
        title="Minhas listas"
        action={
          <IconButton aria-label="Nova lista" onClick={() => setCreateOpen(true)}>
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
              <SwipeableRow onEdit={() => abrirEdicao(lista)} onDelete={() => abrirExclusao(lista)}>
                <Card as={Link} to={`/listas/${lista.id}`}>
                  {lista.nome}
                </Card>
              </SwipeableRow>
            </li>
          ))}
        </ul>
      )}

      <NomeFormSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Nova lista"
        label="Nome da lista"
        submitLabel="Criar lista"
        onSubmit={criarLista}
      />

      <NomeFormSheet
        key={editingLista?.id ?? 'edit-none'}
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Editar lista"
        label="Nome da lista"
        submitLabel="Salvar"
        initialValue={editingLista?.nome}
        onSubmit={salvarEdicao}
      />

      <ConfirmSheet
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir lista"
        description={`Excluir "${deletingLista?.nome}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={confirmarExclusao}
      />
    </div>
  )
}
