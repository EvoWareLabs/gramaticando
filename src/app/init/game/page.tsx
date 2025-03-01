"use client"
import { useRouter } from "next/navigation"
import Bubbles from "@/components/Bubbles"
import { Button } from "@/components/ui/button"
import { useGame } from "@/providers/GameContext"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Home() {
  const router = useRouter()
  const { createSession, isLoading, error } = useGame()

  const startGame = async () => {
    try {
      const session = await createSession()
      router.push(`/init/game/${session.id}`)
    } catch (error) {
      console.error("Error creating session:", error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="Iniciando o jogo..." />
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#FCE762] via-[#FF715B] to-[#3498DB]">
      <Bubbles />
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg">Verbos</h1>
        <Button
          onClick={startGame}
          className="px-8 py-6 text-2xl font-bold text-white bg-[#3498DB] hover:bg-[#2980B9] rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Iniciar Jogo
        </Button>
        {error && <p className="text-white bg-red-500 p-2 rounded">{error}</p>}
      </div>
    </div>
  )
}

