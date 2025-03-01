"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/providers/GameContext"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function GameInitPageContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getSession, isLoading, error } = useGame()
  const [localError, setLocalError] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    let mounted = true

    const initGame = async () => {
      if (isNavigating || !params?.id) {
        console.log("No session ID or already navigating", { id: params?.id, isNavigating })
        router.push("/")
        return
      }

      try {
        console.log("Fetching session with ID:", params.id)
        const currentSession = await getSession(params.id)

        if (!mounted) return

        if (currentSession?.id === params.id) {
          console.log("Valid session found, proceeding to player page")
          setIsNavigating(true)
          router.push(`/init/game/${params.id}/jogador`)
        } else {
          console.log("Invalid session, returning to home")
          setLocalError("Sessão inválida")
          router.push("/")
        }
      } catch (err) {
        if (!mounted) return
        console.error("Error in game initialization:", err)
        setLocalError("Erro ao inicializar o jogo")
        router.push("/")
      }
    }

    initGame()

    return () => {
      mounted = false
    }
  }, [params, getSession, router, isNavigating])

  if (isLoading) {
    return <LoadingSpinner message="Preparando o jogo..." />
  }

  if (error || localError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FCE762] via-[#FF715B] to-[#3498DB]">
        <p className="text-xl text-white mb-4">{error || localError}</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-white text-[#3498DB] rounded-md hover:bg-opacity-90 transition-colors"
        >
          Voltar para o início
        </button>
      </div>
    )
  }

  return <LoadingSpinner message="Inicializando o jogo..." />
}

