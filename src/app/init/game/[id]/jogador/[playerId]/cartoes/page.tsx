"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { gameStore } from "@/lib/store"
import { speechService } from "@/lib/speech"
import type { Player } from "@/types/types"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function CardsPage({
  params,
}: {
  params: { id: string; playerId: string }
}) {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        const loadedPlayer = await gameStore.getPlayer(params.id, params.playerId)
        if (!loadedPlayer) {
          router.push("/")
          return
        }
        setPlayer(loadedPlayer)
      } catch (err) {
        console.error("Erro ao carregar jogador:", err)
        setError("Ocorreu um erro ao carregar os dados do jogador.")
      } finally {
        setIsLoading(false)
      }
    }
    loadPlayer()
  }, [params.id, params.playerId, router])

  const startListening = async () => {
    try {
      setIsListening(true)
      setError("")
      const command = await speechService.listen()
      const cardNumber = Number.parseInt(command.match(/\d+/)?.[0] || "")

      if (cardNumber >= 1 && cardNumber <= 10) {
        selectCard(cardNumber)
      } else {
        setError("Por favor, diga um número entre 1 e 10")
      }
    } catch (err) {
      setError("Não foi possível reconhecer sua voz. Tente novamente.")
    } finally {
      setIsListening(false)
    }
  }

  const selectCard = async (number: number) => {
    if (player) {
      const updatedPlayer = { ...player, selectedCard: number }
      await gameStore.updatePlayer(params.id, updatedPlayer)
      // Aqui você redirecionaria para a página de perguntas
      // router.push(`/init/game/${params.id}/jogador/${params.playerId}/perguntas`)
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="Carregando..." />
  }

  if (!player) return null

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

