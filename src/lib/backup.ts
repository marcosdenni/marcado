import { db, type CatalogoItem, type Lista, type Produto } from '@/lib/db'

interface BackupData {
  versao: number
  exportadoEm: string
  listas: Lista[]
  produtos: Produto[]
  catalogo: CatalogoItem[]
}

export async function exportarBackup() {
  const [listas, produtos, catalogo] = await Promise.all([
    db.listas.toArray(),
    db.produtos.toArray(),
    db.catalogo.toArray(),
  ])

  const backup: BackupData = {
    versao: 1,
    exportadoEm: new Date().toISOString(),
    listas,
    produtos,
    catalogo,
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `lista-mercado-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function validarBackup(dados: unknown): dados is BackupData {
  if (typeof dados !== 'object' || dados === null) return false
  const d = dados as Record<string, unknown>
  return Array.isArray(d.listas) && Array.isArray(d.produtos) && Array.isArray(d.catalogo)
}

function reviverData(valor: unknown): Date {
  return valor instanceof Date ? valor : new Date(valor as string)
}

export async function importarBackup(dados: BackupData) {
  await db.transaction('rw', db.listas, db.produtos, db.catalogo, async () => {
    await db.listas.clear()
    await db.produtos.clear()
    await db.catalogo.clear()

    await db.listas.bulkAdd(dados.listas.map((l) => ({ ...l, criadaEm: reviverData(l.criadaEm) })))
    await db.produtos.bulkAdd(
      dados.produtos.map((p) => ({ ...p, criadoEm: reviverData(p.criadoEm) })),
    )
    await db.catalogo.bulkAdd(
      dados.catalogo.map((c) => ({ ...c, ultimoUso: reviverData(c.ultimoUso) })),
    )
  })
}

export function contarItensBackup(dados: BackupData) {
  return { listas: dados.listas.length, produtos: dados.produtos.length }
}
