"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useGame } from "@/providers/GameContext"
import Character from "@/components/Character"
import { ttsService } from "@/lib/tts"
import CardsInterface from "@/components/CardsInterface"

export default function GamePage({ id }: { id: string }) {
  const router = useRouter()
  const { createPlayer, getSession, player } = useGame()
  const [playerName, setPlayerName] = useState("")
  const [stage, setStage] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState("")
  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    const initSession = async () => {
      try {
        const currentSession = await getSession(id)
        if (!currentSession) {
          console.error("No valid session found")
          router.push("/")
        }
      } catch (err) {
        console.error("Error initializing session:", err)
        router.push("/")
      }
    }

    initSession()
  }, [id, getSession, router])

  const stages = [
    { speech: "Olá! Qual é o seu nome?", expression: "neutral" },
    { speech: "Hmm, deixe-me ver se entendi...", expression: "thinking" },
    { speech: `Seu nome é ${playerName}?`, expression: "happy" },
  ]

  useEffect(() => {
    if (stage === 0) {
      setTimeout(() => {
        startListening()
      }, 2000)
    }
  }, [stage])

  const startListening = async () => {
    try {
      setIsListening(true)
      setError("")
      const { speechService } = await import("@/lib/speech")
      const speech = await speechService.listen()
      const name = extractName(speech)
      setPlayerName(name)
      setStage(1)
      setTimeout(() => setStage(2), 2000)
    } catch (err) {
      setError("Não foi possível reconhecer sua voz. Tente novamente.")
      setStage(0)
    } finally {
      setIsListening(false)
    }
  }

  const extractName = (speech: string) => {
    const nameRegex = /(?:meu nome[eé]\s*|me chamo\s*|sou\s*)(.+)/i
    const match = speech.match(nameRegex)
    return match ? match[1].trim() : speech.trim()
  }

  const confirmName = async () => {
    try {
      await createPlayer(playerName)
      ttsService.speak(`Ótimo, ${playerName}! Vamos começar o jogo.`)
      setTimeout(() => {
        setShowCards(true)
      }, 2000)
    } catch (err) {
      console.error("Error creating player:", err)
      setError("Ocorreu um erro ao salvar o jogador. Por favor, tente novamente.")
      setStage(0)
    }
  }

  const rejectName = () => {
    ttsService.speak("Desculpe, vamos tentar novamente. Qual é o seu nome?")
    setPlayerName("")
    setStage(0)
  }

  if (showCards && player) {
    return <CardsInterface player={player} sessionId={id} />
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FCE762] via-[#FF715B] to-[#3498DB]">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Character
                className="w-64 h-64 mx-auto mb-8"
                expression={stages[stage].expression as "neutral" | "thinking" | "happy"}
                speech={stages[stage].speech}
              />
            </motion.div>
          </AnimatePresence>

          {error && <p className="text-white text-center mt-4">{error}</p>}

          {stage === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4 mt-4"
            >
              <button
                onClick={confirmName}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                Sim, está correto
              </button>
              <button
                onClick={rejectName}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                Não, tentar novamente
              </button>
            </motion.div>
          )}
        </div>
      </div>
      <motion.div
        className="absolute bottom-4 left-0 right-0 text-center text-white text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {isListening ? "Estou ouvindo... Fale seu nome." : "Aguarde a pergunta e então fale seu nome."}
      </motion.div>
    </div>
  )
}

