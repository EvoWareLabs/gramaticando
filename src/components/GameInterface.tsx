"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: string
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Qual é o sujeito da frase: 'O gato dormiu na almofada'?",
    options: ["O gato", "A almofada", "Dormiu", "Na almofada"],
    correctAnswer: "O gato",
  },
  // Adicione mais perguntas aqui
]

export default function GameInterface({ playerName }: { playerName: string }) {
  const [currentCard, setCurrentCard] = useState<number | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutos em segundos
  const [gameOver, setGameOver] = useState(false)
  const [helpUsed, setHelpUsed] = useState(0)

  useEffect(() => {
    if (currentCard !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      setGameOver(true)
    }
  }, [currentCard, timeLeft])

  const selectCard = (cardNumber: number) => {
    setCurrentCard(cardNumber)
    // Aqui você carregaria as perguntas específicas para o cartão selecionado
  }

  const answerQuestion = (selectedAnswer: string) => {
    const currentQuestion = mockQuestions[currentQuestionIndex]
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 100)
    }
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setGameOver(true)
    }
  }

  const useHelp = () => {
    if (helpUsed < 3) {
      setHelpUsed((prev) => prev + 1)
      // Lógica para fornecer uma dica
      alert("Aqui está uma dica para a pergunta atual!")
    }
  }

  const renderCardSelection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-center gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
        <Button key={number} onClick={() => selectCard(number)} className="w-20 h-20 text-2xl">
          {number}
        </Button>
      ))}
    </motion.div>
  )

  const renderQuestion = () => {
    const question = mockQuestions[currentQuestionIndex]
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-2xl font-bold">{question.text}</h2>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <Button key={index} onClick={() => answerQuestion(option)} className="w-full text-left">
              {option}
            </Button>
          ))}
        </div>
        <Button onClick={useHelp} disabled={helpUsed >= 3}>
          Pedir Ajuda ({3 - helpUsed} restantes)
        </Button>
      </motion.div>
    )
  }

  const renderGameOver = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-4"
    >
      <h2 className="text-3xl font-bold">Fim de Jogo!</h2>
      <p className="text-xl">Pontuação final: {score}</p>
      <Button onClick={() => window.location.reload()}>Jogar Novamente</Button>
    </motion.div>
  )

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white p-8">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center">Olá, {playerName}!</h1>
        {currentCard === null && renderCardSelection()}
        {currentCard !== null && !gameOver && (
          <>
            <div className="text-xl text-center">
              Tempo restante: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            {renderQuestion()}
          </>
        )}
        {gameOver && renderGameOver()}
      </div>
    </div>
  )
}

