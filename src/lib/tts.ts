class TextToSpeechService {
  private synth: SpeechSynthesis | null = null
  private voice: SpeechSynthesisVoice | null = null
  private isInitialized = false
  private initializationAttempts = 0
  private readonly MAX_ATTEMPTS = 5

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
            this.voice = voices.find((v) => v.lang === "pt-BR") || voices[0]
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
        resolve() // Resolve without speaking to allow the game to continue
        return
      }

      try {
        this.stop()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.voice = this.voice
        utterance.lang = "pt-BR"
        utterance.rate = 1
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onend = () => {
          console.log("Speech ended successfully")
          resolve()
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          console.error("Error name:", event.error)
          // Still resolve to allow the game to continue
          resolve()
        }

        this.synth.speak(utterance)
      } catch (error) {
        console.error("Speech error:", error)
        resolve() // Resolve despite error to allow the game to continue
      }
    })
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
    }
  }

  isReady(): boolean {
    return this.isInitialized && !!this.voice
  }
}

let ttsService: TextToSpeechService

if (typeof window !== "undefined") {
  ttsService = new TextToSpeechService()
}

export { ttsService }

