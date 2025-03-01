"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useGame } from "@/providers/GameContext"
import LoadingSpinner from "@/components/LoadingSpinner"

const QuestionInterface = dynamic(() => import("@/components/QuestionInterface"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})

export default function QuestionPage({ id }: { id: string }) {
  const router = useRouter()
  const { player, getSession } = useGame()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasAttemptedInit, setHasAttemptedInit] = useState(false)

  const initQuestion = useCallback(async () => {
    if (!id || hasAttemptedInit) return

    try {
      setHasAttemptedInit(true)
      const session = await getSession(id)

      if (!session) {
        setError("Sessão não encontrada")
        router.push("/")
        return
      }

      if (!player?.selectedCard) {
        router.push(`/game/${id}`)
        return
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error initializing question:", err)
      setError("Erro ao carregar a questão")
      setIsLoading(false)
    }
  }, [id, player, getSession, router, hasAttemptedInit])

  useEffect(() => {
    initQuestion()
  }, [initQuestion])

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setError("Tempo limite excedido ao carregar a questão")
        setIsLoading(false)
      }
    }, 10000) // 10 seconds timeout

    return () => clearTimeout(timeoutId)
  }, [isLoading])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFD700] via-[#FF6B6B] to-[#4834d4] flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 text-center">
          <p className="text-white text-xl">{error}</p>
          <button
            onClick={() => router.push(`/game/${id}`)}
            className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  if (!player) {
    router.push("/")
    return null
  }

  return <QuestionInterface player={player} sessionId={id} />
}

