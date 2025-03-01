"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useGame } from "@/providers/GameContext"
import { speechService } from "@/lib/speech"
import Character from "@/components/Character"

export default function PlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { createPlayer } = useGame()
  const [playerName, setPlayerName] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState("")

  const startListening = async () => {
    try {
      setIsListening(true)
      setError("")
      const name = await speechService.listen()
      setPlayerName(name)
    } catch  {
      setError("Não foi possível reconhecer sua voz. Tente novamente.")
    } finally {
      setIsListening(false)
    }
  }

  const confirmName = async () => {
    try {
      const player = await createPlayer(playerName)
      router.push(`/init/game/${params.id}/jogador/${player.id}/cartoes`)
    } catch  {
      setError("Ocorreu um erro ao salvar o jogador. Por favor, tente novamente.")
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FCE762] via-[#FF715B] to-[#3498DB]">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Character className="w-64 h-64 mx-auto mb-8" />
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="speech-bubble relative bg-[#3498DB] text-white p-4 rounded-lg">
              {!playerName ? <p>Olá! Qual é o seu nome?</p> : <p>Seu nome é {playerName}? É isso mesmo?</p>}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!playerName ? (
              <Button onClick={startListening} disabled={isListening} className="w-full">
                {isListening ? "Ouvindo..." : "Falar Nome"}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={confirmName} className="flex-1">
                  Sim, está correto
                </Button>
                <Button onClick={() => setPlayerName("")} variant="outline" className="flex-1">
                  Não, tentar novamente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

