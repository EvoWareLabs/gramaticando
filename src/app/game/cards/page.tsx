"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useGame } from "@/providers/GameContext"
import { speechService } from "@/lib/speech"

export default function Page() {
  const router = useRouter()
  const { player, updatePlayer } = useGame()
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState("")

  const startListening = async () => {
    try {
      setIsListening(true)
      setError("")
      const command = await speechService.listen()
      const cardNumber = Number.parseInt(command.match(/\d+/)?.[0] || "")

      if (cardNumber >= 1 && cardNumber <= 10) {
        await selectCard(cardNumber)
      } else {
        setError("Por favor, diga um número entre 1 e 10")
      }
    } catch  {
      setError("Não foi possível reconhecer sua voz. Tente novamente.")
    } finally {
      setIsListening(false)
    }
  }

  const selectCard = async (number: number) => {
    if (!player) {
      router.push("/")
      return
    }

    try {
      const updatedPlayer = { ...player, selectedCard: number }
      await updatePlayer(updatedPlayer)
      router.push("/game/questions")
    } catch (err) {
      setError("Erro ao selecionar cartão. Tente novamente.")
    }
  }

  // Se não houver jogador, redireciona para a página inicial
  if (!player?.name) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCE762] via-[#FF715B] to-[#3498DB] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Escolha um cartão, {player.name}!</h1>
          <Button onClick={startListening} disabled={isListening} className="bg-[#2ECC71] hover:bg-[#27AE60]">
            {isListening ? "Ouvindo..." : "Falar número do cartão"}
          </Button>
          {error && <p className="text-white mt-2">{error}</p>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
            <motion.div key={number} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => selectCard(number)} className="w-full h-32 text-3xl font-bold" variant="secondary">
                {number}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

