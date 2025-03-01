"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { gameStore } from "@/lib/store"
import RankingPodium from "./RankingPodium"
import Particles from "./Particles"
import type { RankingPlayer } from "@/types/types"

interface GameRankingProps {
  sessionId: string
}

export default function GameRanking({ sessionId }: GameRankingProps) {
  const router = useRouter()
  const [players, setPlayers] = useState<RankingPlayer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const ranking = await gameStore.getRanking(sessionId)
        setPlayers(ranking)
      } catch (error) {
        console.error("Error loading ranking:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRanking()
    // Atualiza o ranking a cada 30 segundos
    const interval = setInterval(loadRanking, 30000)
    return () => clearInterval(interval)
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFD700] via-[#FF6B6B] to-[#4834d4] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD700] via-[#FF6B6B] to-[#4834d4] relative overflow-hidden">
      <Particles className="absolute inset-0" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Ranking Final</h1>
          <p className="text-xl text-white/80">Confira a classificação dos jogadores!</p>
        </motion.div>

        <RankingPodium players={players} />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => router.push("/")}
            className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4 rounded-full text-lg font-semibold"
          >
            Voltar ao Início
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

