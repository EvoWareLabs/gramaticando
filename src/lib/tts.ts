class TextToSpeechService {
  private synth: SpeechSynthesis | null = null
  private voice: SpeechSynthesisVoice | null = null
  private isInitialized = false
  private initializationAttempts = 0
  private readonly MAX_ATTEMPTS = 5
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private isInterrupted = false

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis
      this.initialize()
    }
  }

  private async initialize() {
    if (!this.synth || this.initializationAttempts >= this.MAX_ATTEMPTS) return

    try {
      this.initializationAttempts++
      console.log(`Initializing TTS (attempt ${this.initializationAttempts})...`)

      await new Promise<void>((resolve) => {
        const checkVoices = () => {
          const voices = this.synth!.getVoices()
          if (voices.length > 0) {
            // Tenta encontrar uma voz em português do Brasil
            this.voice = voices.find(
              (v) => 
                v.lang === "pt-BR" || 
                v.lang === "pt_BR" || 
                v.name.toLowerCase().includes("brasil") ||
                v.name.toLowerCase().includes("portuguese")
            ) || voices[0]
            
            this.isInitialized = true
            console.log("TTS initialized with voice:", this.voice.name)
            resolve()
          } else if (this.initializationAttempts < this.MAX_ATTEMPTS) {
            setTimeout(checkVoices, 100)
          } else {
            console.warn("Failed to load voices after multiple attempts")
            resolve()
          }
        }

        if (this.synth!.onvoiceschanged !== undefined) {
          this.synth!.onvoiceschanged = checkVoices
        }
        checkVoices()
      })
    } catch (error) {
      console.error("TTS initialization error:", error)
      if (this.initializationAttempts < this.MAX_ATTEMPTS) {
        setTimeout(() => this.initialize(), 1000)
      }
    }
  }

  async speak(text: string): Promise<void> {
    if (!this.synth || !this.isInitialized) {
      await this.initialize()
    }

    return new Promise<void>((resolve) => {
      if (!this.synth || !this.voice) {
        console.warn("Speech synthesis not available")
        resolve()
        return
      }

      try {
        // Cancela qualquer fala anterior
        this.stop()

        // Reseta o flag de interrupção
        this.isInterrupted = false

        const utterance = new SpeechSynthesisUtterance(text)
        this.currentUtterance = utterance
        
        utterance.voice = this.voice
        utterance.lang = "pt-BR"
        utterance.rate = 1
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onend = () => {
          if (!this.isInterrupted) {
            console.log("Speech ended successfully")
          }
          this.currentUtterance = null
          resolve()
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          if (event.error === "interrupted") {
            this.isInterrupted = true
          }
          console.error("Error name:", event.error)
          this.currentUtterance = null
          resolve() // Resolve mesmo com erro para não travar o fluxo
        }

        // Adiciona um pequeno delay antes de iniciar a fala
        setTimeout(() => {
          if (this.synth && !this.isInterrupted) {
            this.synth.speak(utterance)
          }
        }, 100)

      } catch (error) {
        console.error("Speech error:", error)
        this.currentUtterance = null
        resolve()
      }
    })
  }

  stop() {
    if (this.synth) {
      this.isInterrupted = true
      this.synth.cancel()
      if (this.currentUtterance) {
        this.currentUtterance = null
      }
    }
  }

  isReady(): boolean {
    return this.isInitialized && !!this.voice
  }

  // Método para reconectar o serviço se necessário
  async reconnect(): Promise<void> {
    this.isInitialized = false
    this.initializationAttempts = 0
    await this.initialize()
  }
}

let ttsService: TextToSpeechService

if (typeof window !== "undefined") {
  ttsService = new TextToSpeechService()
}

export { ttsService }
