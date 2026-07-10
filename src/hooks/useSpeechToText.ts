import { useRef, useState } from 'react'
import { getSpeechRecognitionCtor, marcarVozIndisponivel, vozPodeFuncionar } from '@/lib/voz'

const TIMEOUT_FUNCIONAL_MS = 4000
const RESTART_DELAY_MS = 300

const ERROS_QUE_NAO_RETOMAM = new Set(['not-allowed', 'audio-capture', 'service-not-allowed'])

export function useSpeechToText(onResultado: (texto: string) => void) {
  const [suportado, setSuportado] = useState(vozPodeFuncionar)
  const [ouvindo, setOuvindo] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const pararSolicitadoRef = useRef(false)

  function criarEIniciar(primeiraVez: boolean) {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setSuportado(false)
      return
    }

    const recognition = new Ctor()
    recognitionRef.current = recognition
    recognition.lang = 'pt-BR'
    recognition.continuous = true
    recognition.interimResults = false

    let funcionou = !primeiraVez
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (primeiraVez) {
      timeoutId = setTimeout(() => {
        if (!funcionou) {
          marcarVozIndisponivel()
          setSuportado(false)
          setOuvindo(false)
          try {
            recognition.abort()
          } catch {
            // ignora
          }
        }
      }, TIMEOUT_FUNCIONAL_MS)
    }

    recognition.onstart = () => {
      funcionou = true
      clearTimeout(timeoutId)
      setOuvindo(true)
    }

    recognition.onresult = (event) => {
      let textoNovo = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const resultado = event.results[i]
        if (resultado.isFinal) {
          textoNovo += `${resultado[0].transcript} `
        }
      }
      if (textoNovo.trim()) {
        onResultado(textoNovo.trim())
      }
    }

    recognition.onerror = (event) => {
      if (ERROS_QUE_NAO_RETOMAM.has(event.error)) {
        pararSolicitadoRef.current = true
      }
    }

    recognition.onend = () => {
      setOuvindo(false)

      // Android (e alguns outros) encerram a sessão sozinhos entre falas mesmo
      // com continuous=true. Se o usuário não pediu pra parar, retoma sozinho.
      if (!pararSolicitadoRef.current) {
        setTimeout(() => criarEIniciar(false), RESTART_DELAY_MS)
      }
    }

    try {
      recognition.start()
    } catch {
      clearTimeout(timeoutId)
      if (primeiraVez) {
        marcarVozIndisponivel()
        setSuportado(false)
      }
    }
  }

  function iniciar() {
    pararSolicitadoRef.current = false
    criarEIniciar(true)
  }

  function parar() {
    pararSolicitadoRef.current = true
    recognitionRef.current?.stop()
  }

  return { suportado, ouvindo, iniciar, parar }
}
