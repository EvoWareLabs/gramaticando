"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/providers/GameContext"
import QuestionInterface from "@/components/QuestionInterface"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function QuestionPage({ id }: { id: string }) {
  const router = useRouter()
  const { player, getSession } = useGame()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const initQuestion = async () => {
      try {
        const session = await getSession(id)
        if (!session || !player?.selectedCard) {
          router.push(`/game/${id}`)
          return
        }
        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing question:", err)
        setError("Erro ao carregar a questão")
        setIsLoading(false)
      }
    }

    initQuestion()
  }, [id, player, getSession, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFD700] via-[#FF6B6B] to-[#4834d4] flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 text-center">
          <p className="text-white text-xl">{error}</p>
        </div>
      </div>
    )
  }

  if (!player) {
    return null
  }

  return <QuestionInterface player={player} sessionId={id} />
}

