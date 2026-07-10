import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Mic, X } from 'lucide-react'
import { db, type Produto } from '@/lib/db'
import { registrarUsoCatalogo } from '@/lib/catalogo'
import { transcricaoParaLinhas } from '@/lib/voz'
import { useSpeechToText } from '@/hooks/useSpeechToText'

interface VoiceAddOverlayProps {
  onClose: () => void
  listId: number
}

export function VoiceAddOverlay({ onClose, listId }: VoiceAddOverlayProps) {
  const [itens, setItens] = useState<Produto[]>([])

  async function adicionarItem(nome: string) {
    const id = await db.produtos.add({ listId, nome, comprado: false, criadoEm: new Date() })
    await registrarUsoCatalogo(nome)
    const produto = await db.produtos.get(id)
    if (produto) setItens((atual) => [produto, ...atual])
  }

  async function processarTranscricao(texto: string) {
    for (const nome of transcricaoParaLinhas(texto)) {
      await adicionarItem(nome)
    }
  }

  async function removerItem(produtoId: number) {
    await db.produtos.delete(produtoId)
    setItens((atual) => atual.filter((item) => item.id !== produtoId))
  }

  const { suportado, ouvindo, iniciar, parar } = useSpeechToText(processarTranscricao)

  useEffect(() => {
    iniciar()
    return () => parar()
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full text-white/80"
      >
        <X className="size-6" />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        {suportado ? (
          <>
            <div className="relative flex items-center justify-center">
              {ouvindo &&
                [0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute size-32 rounded-full bg-accent/40"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              <button
                type="button"
                onClick={onClose}
                aria-label="Parar de ouvir"
                className="relative flex size-32 items-center justify-center rounded-full bg-accent text-white shadow-lg transition active:scale-95"
              >
                <Mic className="size-14" />
              </button>
            </div>
            <p className="text-center text-sm text-white/70">
              {ouvindo ? 'Pode falar os produtos, um de cada vez' : 'Preparando o microfone...'}
            </p>
          </>
        ) : (
          <>
            <p className="text-center text-base font-medium text-white">
              Reconhecimento de voz indisponível neste aparelho.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-app bg-white px-5 py-3 font-medium text-neutral-900"
            >
              Fechar
            </button>
          </>
        )}
      </div>

      {itens.length > 0 && (
        <div className="max-h-[40vh] overflow-y-auto px-4 pb-8">
          <AnimatePresence initial={false}>
            {itens.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.18 }}
                className="mb-2 flex items-center justify-between rounded-app bg-white/10 px-4 py-3"
              >
                <span className="font-medium text-white">{item.nome}</span>
                <button
                  type="button"
                  onClick={() => removerItem(item.id)}
                  aria-label={`Remover ${item.nome}`}
                  className="flex size-8 items-center justify-center rounded-full text-white/70"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
