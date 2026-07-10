import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Mic } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { BottomSheet } from '@/components/BottomSheet'
import { SugestoesChips } from '@/components/SugestoesChips'
import { buscarSugestoes } from '@/lib/catalogo'
import { vozPodeFuncionar } from '@/lib/voz'

interface AdicionarProdutosSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (nomes: string[]) => void | Promise<void>
  onIniciarVoz: () => void
}

export function AdicionarProdutosSheet({
  open,
  onOpenChange,
  onSubmit,
  onIniciarVoz,
}: AdicionarProdutosSheetProps) {
  const [texto, setTexto] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const linhaAtual = texto.slice(texto.lastIndexOf('\n') + 1)
  const sugestoes = useLiveQuery(() => buscarSugestoes(linhaAtual), [linhaAtual]) ?? []

  const itens = texto
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean)

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
  }, [texto])

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) setTexto('')
  }

  function selecionarSugestao(nomeEscolhido: string) {
    const antesDaLinha = texto.slice(0, texto.lastIndexOf('\n') + 1)
    const novoTexto = `${antesDaLinha}${nomeEscolhido}\n`
    setTexto(novoTexto)

    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (el) {
        el.focus()
        el.setSelectionRange(novoTexto.length, novoTexto.length)
      }
    })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (itens.length === 0) return

    await onSubmit(itens)
    handleOpenChange(false)
  }

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange} title="Adicionar produtos">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <SugestoesChips sugestoes={sugestoes} onSelect={selecionarSugestao} />

        <div className="flex items-start gap-2">
          <label className="sr-only" htmlFor="produtos-texto">
            Um produto por linha
          </label>
          <textarea
            id="produtos-texto"
            ref={textareaRef}
            autoFocus
            rows={1}
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            placeholder={'Leite\nPão\nOvos...'}
            className="max-h-60 w-full flex-1 resize-none overflow-y-auto rounded-app border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-neutral-800 dark:bg-neutral-900"
          />

          {vozPodeFuncionar() && (
            <button
              type="button"
              onClick={onIniciarVoz}
              aria-label="Adicionar por voz"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 transition active:scale-95 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <Mic className="size-5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={itens.length === 0}
          className="rounded-app bg-accent px-4 py-3 text-center font-medium text-accent-foreground transition active:scale-[0.99] disabled:opacity-40"
        >
          {itens.length === 0
            ? 'Adicionar'
            : `Adicionar ${itens.length} ${itens.length === 1 ? 'item' : 'itens'}`}
        </button>
      </form>
    </BottomSheet>
  )
}
