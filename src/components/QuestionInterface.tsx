"use client"

import { useState, useEffect, useCallback, useRef } from "react"
<<<<<<< HEAD
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HelpCircle, Users, SkipForward, Mic } from "lucide-react"
=======
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HelpCircle, Users, SkipForward, Mic } from 'lucide-react'
>>>>>>> 4608d31 (456789)
import Character from "@/components/Character"
import { ttsService } from "@/lib/tts"
import { speechService } from "@/lib/speech"
import { useGame } from "@/providers/GameContext"
import type { Player } from "@/types/types"
import Particles from "./Particles"
import BackgroundMusic from "./BackgroundMusic"
import { allQuestions } from "@/lib/questions"
<<<<<<< HEAD
import { gameStore } from "@/lib/store"
=======
>>>>>>> 4608d31 (456789)

interface QuestionInterfaceProps {
  player: Player
  sessionId: string
}

export default function QuestionInterface({ player, sessionId }: QuestionInterfaceProps) {
  const router = useRouter()
  const { updatePlayer } = useGame()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [helpUsed, setHelpUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showAudienceHelp, setShowAudienceHelp] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [invalidAnswer, setInvalidAnswer] = useState(false)
  const [characterExpression, setCharacterExpression] = useState<"neutral" | "happy" | "thinking">("neutral")
  const [characterSpeech, setCharacterSpeech] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const questions = allQuestions[player.selectedCard || 1]
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleNoAnswer()
          return 120 // Reset timer for next question
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const handleNoAnswer = useCallback(() => {
    ttsService.speak("Tempo esgotado! Passando para a próxima pergunta.")
    setCharacterExpression("thinking")
    setCharacterSpeech("Ops! O tempo acabou. Vamos para a próxima pergunta.")
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setIsAnswerCorrect(null)
        setShowHint(false)
        setShowAudienceHelp(false)
        setTimeLeft(120)
        startTimer()
      } else {
        setIsGameOver(true)
      }
    }, 3000)
  }, [currentQuestionIndex, questions.length, startTimer])

  const handleAnswer = useCallback(
    async (answer: string) => {
      setSelectedAnswer(answer)
      const correct = answer === currentQuestion.correctAnswer
      setIsAnswerCorrect(correct)

      if (correct) {
        setScore((prev) => prev + 50)
        setCharacterExpression("happy")
        setCharacterSpeech("Parabéns! Você acertou!")
        await ttsService.speak("Resposta correta!")
      } else {
        setCharacterExpression("thinking")
        setCharacterSpeech(`Que pena! A resposta correta era: ${currentQuestion.correctAnswer}`)
        await ttsService.speak("Resposta incorreta!")
      }

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1)
          setSelectedAnswer(null)
          setIsAnswerCorrect(null)
          setShowHint(false)
          setShowAudienceHelp(false)
          setTimeLeft(120)
          setCharacterExpression("neutral")
          setCharacterSpeech(null)
          startTimer()
        } else {
          setIsGameOver(true)
        }
      }, 3000)
    },
    [currentQuestion, currentQuestionIndex, questions.length, startTimer],
  )

  const startListening = useCallback(async () => {
    try {
      setIsListening(true)
      setInvalidAnswer(false)
      const command = await speechService.listen()
      const answer = command.trim().toUpperCase()
      if (["A", "B", "C", "D"].includes(answer)) {
        const selectedOption = currentQuestion.options[answer.charCodeAt(0) - 65]
        handleAnswer(selectedOption)
      } else {
        setInvalidAnswer(true)
        setCharacterExpression("thinking")
        setCharacterSpeech("Desculpe, não entendi. Por favor, responda A, B, C ou D.")
        ttsService.speak("Resposta inválida. Por favor, responda A, B, C ou D.")
      }
    } catch (err) {
      console.error("Speech recognition error:", err)
    } finally {
      setIsListening(false)
    }
  }, [currentQuestion, handleAnswer])

  const useHint = useCallback(() => {
    if (helpUsed < 3 && !showHint) {
      setHelpUsed((prev) => prev + 1)
      setShowHint(true)
      setCharacterExpression("thinking")
      setCharacterSpeech(`Aqui está uma dica: ${currentQuestion.hint}`)
      ttsService.speak(currentQuestion.hint)
    }
  }, [helpUsed, showHint, currentQuestion.hint])

  const useAudienceHelp = useCallback(() => {
    if (helpUsed < 3 && !showAudienceHelp) {
      setHelpUsed((prev) => prev + 1)
      setShowAudienceHelp(true)
      setCharacterExpression("happy")
      setCharacterSpeech("O público está ajudando! Veja os resultados na tela.")
      ttsService.speak("O público está ajudando. Veja os resultados na tela.")
    }
  }, [helpUsed, showAudienceHelp])

  const skipQuestion = useCallback(() => {
    if (helpUsed < 3) {
      setHelpUsed((prev) => prev + 1)
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setIsAnswerCorrect(null)
        setShowHint(false)
        setShowAudienceHelp(false)
        setTimeLeft(120)
        setCharacterExpression("neutral")
        setCharacterSpeech("Pulamos esta pergunta. Vamos para a próxima!")
        ttsService.speak("Pergunta pulada. Vamos para a próxima.")
        startTimer()
      }
    }
  }, [helpUsed, currentQuestionIndex, questions.length, startTimer])

  useEffect(() => {
    if (isGameOver) {
      updatePlayer({ ...player, score })
    }
  }, [isGameOver, player, score, updatePlayer])

<<<<<<< HEAD
  useEffect(() => {
    const checkGameCompletion = async () => {
      if (isGameOver) {
        try {
          // Marca o cartão atual como concluído
          await gameStore.markCardAsCompleted(sessionId, player.selectedCard || 1)

          // Verifica se todos os cartões foram completados
          const isCompleted = await gameStore.isGameCompleted(sessionId)

          if (isCompleted) {
            // Atualiza o status do jogador
            const updatedPlayer = {
              ...player,
              isGameCompleted: true,
              score: score,
            }
            await updatePlayer(updatedPlayer)

            // Redireciona para a página de ranking
            router.push(`/game/${sessionId}/ranking`)
          } else {
            // Redireciona de volta para a seleção de cartões
            router.push(`/game/${sessionId}`)
          }
        } catch (error) {
          console.error("Error checking game completion:", error)
        }
      }
    }

    checkGameCompletion()
  }, [isGameOver, sessionId, player, score, updatePlayer, router])

=======
>>>>>>> 4608d31 (456789)
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFD700] via-[#FF6B6B] to-[#4834d4] flex items-center justify-center p-8">
        <Particles className="absolute inset-0" />
        <BackgroundMusic />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/20 backdrop-blur-lg rounded-xl p-8 max-w-2xl w-full text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Fim de Jogo!</h2>
          <p className="text-2xl text-white mb-8">Sua pontuação: {score} pontos</p>
          <Button
            onClick={() => router.push(`/game/${sessionId}`)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-xl"
          >
            Voltar ao Início
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD700] via-[#FF6B6B] to-[#4834d4] flex items-center justify-center p-8">
      <Particles className="absolute inset-0" />
      <BackgroundMusic />

      <div className="relative z-10 max-w-4xl w-full">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: timeLeft <= 10 ? Number.POSITIVE_INFINITY : 0, duration: 0.5 }}
            className="bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 text-white"
          >
            Tempo: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </motion.div>
          <div className="bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 text-white">Pontos: {score}</div>
        </div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/20 backdrop-blur-lg rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Questão {currentQuestionIndex + 1} de {questions.length}
          </h2>

          <p className="text-xl text-white mb-8">{currentQuestion.text}</p>

          <div className="grid gap-4">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option}
                onClick={() => !selectedAnswer && handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`
                  p-4 rounded-lg text-left text-lg transition-all
                  ${
                    selectedAnswer === option
                      ? isAnswerCorrect
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-white/30 hover:bg-white/40 text-white"
                  }
                `}
                whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </motion.button>
            ))}
          </div>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-yellow-500/20 backdrop-blur-lg rounded-lg text-white"
            >
              <p className="text-lg">💡 Dica: {currentQuestion.hint}</p>
            </motion.div>
          )}

          {showAudienceHelp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-500/20 backdrop-blur-lg rounded-lg text-white"
            >
              <p className="text-lg">📊 Resultado da audiência:</p>
              <div className="mt-2 grid gap-2">
                {currentQuestion.options.map((option, index) => {
                  const percentage =
                    option === currentQuestion.correctAnswer
                      ? Math.floor(Math.random() * 20) + 60
                      : Math.floor(Math.random() * 20)
                  return (
                    <div key={option} className="flex items-center gap-2">
                      <span>{String.fromCharCode(65 + index)}:</span>
                      <div className="flex-1 h-4 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                      <span>{percentage}%</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={useHint}
              disabled={helpUsed >= 3 || showHint || selectedAnswer !== null}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Dica
            </Button>
            <Button
              onClick={useAudienceHelp}
              disabled={helpUsed >= 3 || showAudienceHelp || selectedAnswer !== null}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Users className="mr-2 h-4 w-4" />
              Ajuda do Público
            </Button>
            <Button
              onClick={skipQuestion}
              disabled={helpUsed >= 3 || selectedAnswer !== null}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Pular
            </Button>
          </div>

          <div className="mt-4 text-center text-white">
            <p>Ajudas restantes: {3 - helpUsed}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center"
          >
            <Button
              onClick={startListening}
              disabled={isListening || selectedAnswer !== null}
              className={`
                px-8 py-4 rounded-full text-xl font-semibold
                bg-gradient-to-r from-emerald-500 to-teal-500
                hover:from-emerald-600 hover:to-teal-600
                transform transition-all duration-300
                ${isListening ? "scale-95 opacity-90" : "hover:scale-105 hover:shadow-lg"}
              `}
            >
              <Mic className={`mr-2 h-6 w-6 ${isListening ? "animate-pulse" : ""}`} />
              {isListening ? "Ouvindo..." : "Responder por Voz"}
            </Button>
          </motion.div>

          {invalidAnswer && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-red-500 text-center"
            >
              Resposta inválida. Por favor, responda A, B, C ou D.
            </motion.p>
          )}
        </motion.div>
      </div>

      <Character
        className="fixed bottom-4 left-4 w-48 h-48"
        expression={characterExpression}
        speech={characterSpeech}
      />
    </div>
  )
}
<<<<<<< HEAD

=======
>>>>>>> 4608d31 (456789)
