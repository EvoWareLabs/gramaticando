"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mic } from 'lucide-react'
import Character from "@/components/Character"
import { ttsService } from "@/lib/tts"
import { useGame } from "@/providers/GameContext"
import { speechService } from "@/lib/speech"
import type { Player } from "@/types/types"
import Particles from "./Particles"

interface CardsInterfaceProps {
  player: Player
  sessionId: string
}

export default function CardsInterface({ player, sessionId }: CardsInterfaceProps) {
  const router = useRouter()
  const { updatePlayer, getSession } = useGame()
  const [stage, setStage] = useState(0)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [isExplanationDone, setIsExplanationDone] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const explanationStages = [
    {
      speech: "Bem-vindo ao Gramaticando, o jogo educativo criado pelos alunos para testar seus conhecimentos!",
      expression: "happy",
    },
    {
      speech:
        "Este jogo foi desenvolvido como um projeto escolar, onde seus colegas irão apresentar o conteúdo através das perguntas.",
      expression: "neutral",
    },
    {
      speech: "Vou explicar como funciona. Preste muita atenção!",
      expression: "neutral",
    },
    {
      speech:
        "Você vai escolher um cartão numerado de 1 a 10. Cada cartão contém uma pergunta sobre o conteúdo apresentado.",
      expression: "neutral",
    },
    {
      speech: "Ao abrir o cartão, você verá a pergunta e quatro opções de resposta: A, B, C e D.",
      expression: "neutral",
    },
    {
      speech: "Você tem três tipos de ajuda que pode usar até 3 vezes no total durante o jogo.",
      expression: "thinking",
    },
    {
      speech: "A primeira ajuda é uma dica sobre a pergunta. A segunda é perguntar ao público.",
      expression: "neutral",
    },
    {
      speech: "A terceira ajuda é pular a pergunta, mas ela aparecerá novamente mais tarde.",
      expression: "thinking",
    },
    {
      speech: "Cada pergunta vale 50 pontos. Quanto mais pontos você fizer, melhor será sua classificação!",
      expression: "happy",
    },
    {
      speech: "O jogador com mais pontos no final ganha um prêmio especial!",
      expression: "happy",
    },
    {
      speech: "Lembre-se: você está competindo com outros jogadores, mas em turnos diferentes.",
      expression: "neutral",
    },
    {
      speech: "Agora que você entendeu tudo, está pronto para começar? Escolha um cartão usando comando de voz!",
      expression: "happy",
    },
  ]

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const session = await getSession(sessionId)
        if (session?.players) {
          const currentPlayer = Object.values(session.players).find((p) => p.id === player.id)
          if (currentPlayer?.hasSeenCardExplanation) {
            setIsFirstTime(false)
            setIsExplanationDone(true)
            setShowCards(true)
          }
        }
      } catch (error) {
        console.error("Error checking first time:", error)
      }
    }
    checkFirstTime()
  }, [sessionId, player.id, getSession])

  const speakAndAdvance = useCallback(async () => {
    if (!isFirstTime || stage >= explanationStages.length || isSpeaking) {
      return
    }

    setIsSpeaking(true)
    try {
      await ttsService.speak(explanationStages[stage].speech)
      handleAdvance()
    } catch (error) {
      console.error("Error in speech:", error)
      setError("Pressione '+' para continuar")
      handleAdvance() // Auto advance even if speech fails
    } finally {
      setIsSpeaking(false)
    }
  }, [stage, isFirstTime, isSpeaking])

  useEffect(() => {
    speakAndAdvance()
  }, [speakAndAdvance])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "+") {
        handleAdvance()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  const handleAdvance = () => {
    setError("")
    if (stage < explanationStages.length - 1) {
      setStage((prevStage) => prevStage + 1)
    } else {
      finishExplanation()
    }
  }

  const finishExplanation = () => {
    setIsExplanationDone(true)
    setShowCards(true)
    updatePlayer({ ...player, hasSeenCardExplanation: true })
    ttsService.speak(`${player.name}, por favor, escolha um cartão usando comando de voz.`)
  }

  const handleCardSelection = async (cardNumber: number) => {
    try {
      const session = await getSession(sessionId)
      if (session?.players) {
        const isCardTaken = Object.values(session.players).some(
          (p) => p.selectedCard === cardNumber && p.id !== player.id
        )
        if (isCardTaken) {
          ttsService.speak("Este cartão já foi escolhido por outro jogador. Por favor, escolha outro.")
          return
        }
      }
      setSelectedCard(cardNumber)
      await updatePlayer({ ...player, selectedCard: cardNumber })
      router.push(`/game/${sessionId}/question`)
    } catch (error) {
      console.error("Error selecting card:", error)
      setError("Erro ao selecionar cartão. Tente novamente.")
    }
  }

  const startListening = async () => {
    try {
      setIsListening(true)
      setError("")
      const command = await speechService.listen()
      const cardNumber = Number.parseInt(command.match(/\d+/)?.[0] || "")

      if (cardNumber >= 1 && cardNumber <= 10) {
        handleCardSelection(cardNumber)
      } else {
        setError("Por favor, diga um número entre 1 e 10")
      }
    } catch (err) {
      setError("Não foi possível reconhecer sua voz. Tente novamente.")
    } finally {
      setIsListening(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFD700] via-[#FF6B6B] to-[#4834d4]">
      <Particles className="absolute inset-0" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-6xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0 }}
              animate={
                isExplanationDone
                  ? { opacity: 1, x: -300, y: 0, scale: 0.7 }
                  : { opacity: 1 }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed left-0 top-1/2 -translate-y-1/2"
            >
              <Character
                className="w-64 h-64"
                expression={explanationStages[stage]?.expression as "neutral" | "thinking" | "happy"}
                speech={isExplanationDone ? `${player.name}, escolha um cartão!` : explanationStages[stage]?.speech}
              />
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg"
            >
              <p>{error}</p>
            </motion.div>
          )}

          {showCards && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full mt-8"
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-bold mb-12 text-center text-white drop-shadow-lg"
              >
                {player.name}, escolha um cartão!
              </motion.h1>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 perspective-1000">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                  <motion.div
                    key={number}
                    initial={{ opacity: 0, rotateY: -180 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ delay: number * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: hoveredCard === number ? 180 : 0,
                      transition: { duration: 0.3 }
                    }}
                    onHoverStart={() => setHoveredCard(number)}
                    onHoverEnd={() => setHoveredCard(null)}
                    onClick={() => handleCardSelection(number)}
                    className="relative preserve-3d cursor-pointer"
                  >
                    <div className="w-full h-48 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl transform transition-transform duration-300 hover:shadow-2xl">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-bold text-white drop-shadow-lg">{number}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-xl" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8 flex justify-center"
              >
                <Button
                  onClick={startListening}
                  disabled={isListening}
                  className={`
                    px-8 py-6 rounded-full text-xl font-semibold
                    bg-gradient-to-r from-emerald-500 to-teal-500
                    hover:from-emerald-600 hover:to-teal-600
                    transform transition-all duration-300
                    ${isListening ? 'scale-95 opacity-90' : 'hover:scale-105 hover:shadow-lg'}
                  `}
                >
                  <Mic className={`mr-2 h-6 w-6 ${isListening ? 'animate-pulse' : ''}`} />
                  {isListening ? "Ouvindo..." : "Falar número do cartão"}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {!isExplanationDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2"
            >
              <p className="text-white text-lg font-medium">
                Pressione '+' para avançar
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
