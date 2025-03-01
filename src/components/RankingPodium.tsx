"use client"

import { motion } from "framer-motion"
import { Trophy, Award } from "lucide-react"
import type { RankingPlayer } from "@/types/types"

interface RankingPodiumProps {
  players: RankingPlayer[]
}

export default function RankingPodium({ players }: RankingPodiumProps) {
  const podiumPlayers = players.slice(0, 3)
  const otherPlayers = players.slice(3)

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "from-yellow-300 to-yellow-500"
      case 2:
        return "from-gray-300 to-gray-500"
      case 3:
        return "from-amber-600 to-amber-800"
      default:
        return "from-gray-200 to-gray-400"
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* Pódio */}
      <div className="relative h-80 mb-12 flex items-end justify-center gap-4">
        {podiumPlayers.map((player, index) => {
          const position = index + 1
          const height = position === 1 ? "h-64" : position === 2 ? "h-52" : "h-40"
          const order = position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"

          return (
            <motion.div
              key={player.id}
              className={`${order} w-48 flex flex-col items-center`}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="mb-4 text-center">
                <motion.div
                  className="inline-block"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                >
                  {position === 1 ? (
                    <Trophy className="w-12 h-12 text-yellow-500" />
                  ) : (
                    <Award className={`w-10 h-10 ${position === 2 ? "text-gray-400" : "text-amber-700"}`} />
                  )}
                </motion.div>
                <h3 className="font-bold text-white text-lg mt-2">{player.name}</h3>
                <p className="text-white/80">{player.score} pontos</p>
              </div>
              <motion.div
                className={`w-full ${height} rounded-t-lg bg-gradient-to-b ${getMedalColor(position)} relative overflow-hidden`}
                initial={{ height: 0 }}
                animate={{ height: height }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-white/10 transform -skew-y-12" />
                <div className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-xl">
                  {position}º
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Lista de outros jogadores */}
      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Outros Participantes</h2>
        {otherPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex items-center justify-between"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {player.position}
              </div>
              <div>
                <h3 className="font-semibold text-white">{player.name}</h3>
                <p className="text-sm text-white/60">{player.score} pontos</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

