import Dexie, { type EntityTable } from 'dexie'

export interface Lista {
  id: number
  nome: string
  criadaEm: Date
}

export interface Produto {
  id: number
  listId: number
  nome: string
  comprado: boolean
  criadoEm: Date
}

export const db = new Dexie('lista-mercado') as Dexie & {
  listas: EntityTable<Lista, 'id'>
  produtos: EntityTable<Produto, 'id'>
}

db.version(1).stores({
  listas: '++id, nome, criadaEm',
  produtos: '++id, listId, nome, comprado, criadoEm',
})
