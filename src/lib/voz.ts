const STORAGE_KEY = 'lista-mercado:voz-indisponivel'

export function vozMarcadaComoIndisponivel() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function marcarVozIndisponivel() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // localStorage pode estar indisponível (modo privado); ignora
  }
}

export function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export function vozPodeFuncionar() {
  return getSpeechRecognitionCtor() !== null && !vozMarcadaComoIndisponivel()
}

export function transcricaoParaLinhas(texto: string): string[] {
  return texto
    .split(/,|\be\b/gi)
    .map((parte) => parte.trim())
    .filter(Boolean)
}
