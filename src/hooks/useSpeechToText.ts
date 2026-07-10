import { useRef, useState } from 'react'

const STORAGE_KEY = 'lista-mercado:voz-indisponivel'
const TIMEOUT_FUNCIONAL_MS = 4000

function vozMarcadaComoIndisponivel() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function marcarVozIndisponivel() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // localStorage pode estar indisponível (modo privado); ignora
  }
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export function useSpeechToText(onResultado: (texto: string) => void) {
  const [suportado, setSuportado] = useState(
    () => getSpeechRecognitionCtor() !== null && !vozMarcadaComoIndisponivel(),
  )
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
