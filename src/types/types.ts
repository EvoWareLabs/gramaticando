export interface GameSession {
  id: string
  createdAt: number
  status: "active" | "completed"
  players: { [key: string]: Player }
<<<<<<< HEAD
  completedCards: { [key: string]: boolean }
=======
>>>>>>> 4608d31 (456789)
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
<<<<<<< HEAD
  completedCards: number[]
  rank?: number
  isGameCompleted?: boolean
=======
>>>>>>> 4608d31 (456789)
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

<<<<<<< HEAD
export interface RankingPlayer extends Player {
  position: number
  medal?: "gold" | "silver" | "bronze"
}

=======
>>>>>>> 4608d31 (456789)
