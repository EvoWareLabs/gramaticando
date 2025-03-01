export interface GameSession {
  id: string
  createdAt: number
  status: "active" | "completed"
  players: { [key: string]: Player }
}

export interface Player {
  id: string
  name: string
  sessionId: string
  score: number
  selectedCard?: number
  currentQuestion: number
  answers: Answer[]
  hasSeenCardExplanation?: boolean
  helpUsed: number
}

export interface Answer {
  questionId: number
  isCorrect: boolean
  timeSpent: number
}

export interface Card {
  id: number
  questions: Question[]
}

export interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: string
  hint?: string
}

