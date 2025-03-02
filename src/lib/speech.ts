// Fix explicit any and unused variables

declare global {
  interface Window {
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null
  private isListening = false

  constructor() {
    if (typeof window !== "undefined") {
      if ("webkitSpeechRecognition" in window) {
        this.recognition = new (window as unknown as { webkitSpeechRecognition: new () => SpeechRecognition }).webkitSpeechRecognition()
        this.setupRecognition()
      }
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
      let silenceTimer: NodeJS.Timeout

      this.recognition.onstart = () => {
        this.isListening = true
        hasStartedListening = true
        console.log("Started listening...")
      }

      this.recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          }
        }

        // Reset silence timer on any speech detection
        clearTimeout(silenceTimer)
        silenceTimer = setTimeout(() => {
          if (finalTranscript) {
            this.stop()
            resolve(finalTranscript)
          }
        }, 2000) // Wait 2 seconds of silence before considering speech complete
      }

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        if (event.error === "no-speech" && !hasStartedListening) {
          // If error occurs before any listening, retry
          this.recognition?.start()
          return
        }

        if (finalTranscript) {
          // If we have some transcript despite the error, use it
          resolve(finalTranscript)
        } else {
          reject(new Error(event.error))
        }
      }

      this.recognition.onend = () => {
        this.isListening = false
        if (!finalTranscript && hasStartedListening) {
          // If ended without transcript but was listening, restart
          this.recognition?.start()
          return
        }
        clearTimeout(silenceTimer)
      }

      // Start recognition
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
}

let speechService: SpeechRecognitionService

if (typeof window !== "undefined") {
  speechService = new SpeechRecognitionService()
}

export { speechService }
