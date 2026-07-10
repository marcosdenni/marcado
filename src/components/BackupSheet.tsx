import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { BottomSheet } from '@/components/BottomSheet'
import { ConfirmSheet } from '@/components/ConfirmSheet'
import { exportarBackup, importarBackup, validarBackup, contarItensBackup } from '@/lib/backup'

interface BackupSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BackupSheet({ open, onOpenChange }: BackupSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [pendente, setPendente] = useState<{
    dados: Parameters<typeof importarBackup>[0]
    resumo: { listas: number; produtos: number }
  } | null>(null)

  async function handleExportar() {
    setErro(null)
    await exportarBackup()
  }

  function handleImportarClick() {
    setErro(null)
    fileInputRef.current?.click()
  }

  async function handleArquivoSelecionado(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0]
    event.target.value = ''
    if (!arquivo) return

    try {
      const texto = await arquivo.text()
      const dados: unknown = JSON.parse(texto)

      if (!validarBackup(dados)) {
        setErro('Esse arquivo não parece ser um backup válido do Lista de Mercado.')
        return
      }

      setPendente({ dados, resumo: contarItensBackup(dados) })
      onOpenChange(false)
    } catch {
      setErro('Não foi possível ler esse arquivo. Verifique se é um JSON válido.')
    }
  }

  async function confirmarImportacao() {
    if (!pendente) return
    await importarBackup(pendente.dados)
    setPendente(null)
    onOpenChange(false)
  }

  return (
    <>
      <BottomSheet open={open} onOpenChange={onOpenChange} title="Backup">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleExportar}
            className="flex items-center gap-3 rounded-app border border-neutral-200 px-4 py-3 text-left transition active:scale-[0.99] dark:border-neutral-800"
          >
            <Download className="size-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="font-medium">Exportar backup</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Salva todas as listas num arquivo .json
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleImportarClick}
            className="flex items-center gap-3 rounded-app border border-neutral-200 px-4 py-3 text-left transition active:scale-[0.99] dark:border-neutral-800"
          >
            <Upload className="size-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="font-medium">Importar backup</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Substitui os dados atuais pelos do arquivo
              </p>
            </div>
          </button>

          {erro && <p className="text-sm text-danger">{erro}</p>}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleArquivoSelecionado}
          />
        </div>
      </BottomSheet>

      <ConfirmSheet
        open={pendente !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPendente(null)
        }}
        title="Importar backup"
        description={
          pendente
            ? `Isso vai substituir TODOS os dados atuais por ${pendente.resumo.listas} lista(s) e ${pendente.resumo.produtos} produto(s) do arquivo. Essa ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Importar e substituir"
        onConfirm={confirmarImportacao}
      />
    </>
  )
}
