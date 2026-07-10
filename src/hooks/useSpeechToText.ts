import { useRef, useState } from 'react'
import { getSpeechRecognitionCtor, marcarVozIndisponivel, vozPodeFuncionar } from '@/lib/voz'

const TIMEOUT_FUNCIONAL_MS = 4000

export function useSpeechToText(onResultado: (texto: string) => void) {
  const [suportado, setSuportado] = useState(vozPodeFuncionar)
  const [ouvindo, setOuvindo] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  function iniciar() {
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

    let funcionou = false

    const timeoutId = setTimeout(() => {
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

    recognition.onerror = () => {
      setOuvindo(false)
    }

    recognition.onend = () => {
      setOuvindo(false)
    }

    try {
      recognition.start()
    } catch {
      clearTimeout(timeoutId)
      marcarVozIndisponivel()
      setSuportado(false)
    }
  }

  function parar() {
    recognitionRef.current?.stop()
  }

  return { suportado, ouvindo, iniciar, parar }
}
