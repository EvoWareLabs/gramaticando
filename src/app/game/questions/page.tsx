"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/providers/GameContext"

export default function Page() {
  const router = useRouter()
  const { player } = useGame()

  useEffect(() => {
    if (!player?.selectedCard) {
      router.push("/game/cards")
    }
  }, [player, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCE762] via-[#FF715B] to-[#3498DB] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Perguntas do Cartão {player?.selectedCard}</h1>
        {/* Aqui você pode adicionar a lógica das perguntas */}
      </div>
    </div>
  )
}

