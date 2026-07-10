import { db } from '@/lib/db'

export async function registrarUsoCatalogo(nome: string) {
  const nomeChave = nome.trim().toLowerCase()
  if (!nomeChave) return

  const existente = await db.catalogo.where('nomeChave').equals(nomeChave).first()

  if (existente) {
    await db.catalogo.update(existente.id, {
      vezesUsado: existente.vezesUsado + 1,
      ultimoUso: new Date(),
    })
  } else {
    await db.catalogo.add({ nome: nome.trim(), nomeChave, vezesUsado: 1, ultimoUso: new Date() })
  }
}

export async function buscarSugestoes(prefixo: string, limite = 5) {
  const chave = prefixo.trim().toLowerCase()

  if (!chave) {
    return db.catalogo.orderBy('vezesUsado').reverse().limit(limite).toArray()
  }

  const resultados = await db.catalogo.where('nomeChave').startsWithIgnoreCase(chave).toArray()
  return resultados.sort((a, b) => b.vezesUsado - a.vezesUsado).slice(0, limite)
}
