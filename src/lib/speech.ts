declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognitionError {
  error: string
  message?: string
}

class SpeechRecognitionService {
  private recognition: any = null
  private isListening = false
  private retryCount = 0
  private maxRetries = 3
  private readonly TIMEOUT_DURATION = 10000 // 10 segundos

  constructor() {
    if (typeof window !== "undefined") {
      if ("webkitSpeechRecognition" in window) {
        this.initializeRecognition()
      }
    }
  }

  private initializeRecognition() {
    try {
      this.recognition = new window.webkitSpeechRecognition()
      this.setupRecognition()
    } catch (error) {
      console.error("Error initializing speech recognition:", error)
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = "pt-BR"
    this.recognition.maxAlternatives = 1
  }

  listen(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error("Speech recognition not supported"))
        return
      }

      if (this.isListening) {
        this.stop()
      }

      let finalTranscript = ""
      let hasStartedListening = false
      let timeoutId: NodeJS.Timeout
      this.retryCount = 0

      const setupTimeout = () => {
        return setTimeout(() => {
          if (!finalTranscript) {
            this.stop()
            if (this.retryCount < this.maxRetries) {
              this.retryCount++
              console.log(`Retrying... Attempt ${this.retryCount}`)
              this.recognition.start()
            } else {
              reject(new Error("Recognition timeout"))
            }
          }
        }, this.TIMEOUT_DURATION)
      }

      this.recognition.onstart = () => {
        this.isListening = true
        hasStartedListening = true
        console.log("Started listening...")
        timeoutId = setupTimeout()
      }

      this.recognition.onresult = (event: any) => {
        clearTimeout(timeoutId)
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript = transcript
            this.stop()
            resolve(finalTranscript)
            return
          }
        }

        timeoutId = setupTimeout()
      }

      this.recognition.onerror = (event: SpeechRecognitionError) => {
        clearTimeout(timeoutId)
        console.error("Speech recognition error:", event)

        if (event.error === "no-speech" && !hasStartedListening) {
          if (this.retryCount < this.maxRetries) {
            this.retryCount++
            console.log(`Retrying... Attempt ${this.retryCount}`)
            this.recognition.start()
            return
          }
        }

        if (finalTranscript) {
          resolve(finalTranscript)
        } else {
          reject(new Error(event.error))
        }
      }

      this.recognition.onend = () => {
        clearTimeout(timeoutId)
        this.isListening = false
        
        if (!finalTranscript && hasStartedListening && this.retryCount < this.maxRetries) {
          this.retryCount++
          console.log(`Retrying... Attempt ${this.retryCount}`)
          this.recognition.start()
          return
        }

        if (!finalTranscript) {
          reject(new Error("No speech detected"))
        }
      }

      try {
        this.recognition.start()
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unknown error'))
      }
    })
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  isRecognitionSupported(): boolean {
    return typeof window !== "undefined" && "webkitSpeechRecognition" in window
  }

  // Método para reiniciar o serviço se necessário
  restart() {
    this.stop()
    this.initializeRecognition()
  }
}

let speechService: SpeechRecognitionService

if (typeof window !== "undefined") {
  speechService = new SpeechRecognitionService()
}

export { speechService }
