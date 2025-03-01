<<<<<<< HEAD
import { ref, get, set, update } from "firebase/database"
import { db } from "./firebase"
import type { GameSession, Player, RankingPlayer } from "@/types/types"
=======
import { ref, get, set } from "firebase/database"
import { db } from "./firebase"
import type { GameSession, Player } from "@/types/types"
>>>>>>> 4608d31 (456789)

class GameStore {
  async createSession(): Promise<GameSession> {
    const session: GameSession = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: Date.now(),
      status: "active",
      players: {},
<<<<<<< HEAD
      completedCards: {},
=======
>>>>>>> 4608d31 (456789)
    }

    try {
      await set(ref(db, `sessions/${session.id}`), session)
      return session
    } catch (error) {
      console.error("Error creating session:", error)
      throw error
    }
  }

  async getSession(sessionId: string): Promise<GameSession | null> {
    try {
      const snapshot = await get(ref(db, `sessions/${sessionId}`))
      if (snapshot.exists()) {
        return snapshot.val() as GameSession
      }
      return null
    } catch (error) {
      console.error("Error getting session:", error)
      throw error
    }
  }

  async updatePlayer(player: Player): Promise<void> {
    if (!player.sessionId) throw new Error("No session ID")
    try {
      await set(ref(db, `sessions/${player.sessionId}/players/${player.id}`), player)
    } catch (error) {
      console.error("Error updating player:", error)
      throw error
    }
  }
<<<<<<< HEAD

  async markCardAsCompleted(sessionId: string, cardId: number): Promise<void> {
    try {
      await update(ref(db, `sessions/${sessionId}/completedCards`), {
        [cardId]: true,
      })
    } catch (error) {
      console.error("Error marking card as completed:", error)
      throw error
    }
  }

  async getRanking(sessionId: string): Promise<RankingPlayer[]> {
    try {
      const session = await this.getSession(sessionId)
      if (!session || !session.players) return []

      const players = Object.values(session.players)
      const sortedPlayers = players
        .sort((a, b) => b.score - a.score)
        .map((player, index) => ({
          ...player,
          position: index + 1,
          medal: index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : undefined,
        }))

      return sortedPlayers
    } catch (error) {
      console.error("Error getting ranking:", error)
      throw error
    }
  }

  async isGameCompleted(sessionId: string): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId)
      if (!session) return false

      // Verifica se todos os cartões foram completados
      const totalCards = 10 // Total de cartões no jogo
      const completedCards = session.completedCards ? Object.keys(session.completedCards).length : 0

      return completedCards === totalCards
    } catch (error) {
      console.error("Error checking game completion:", error)
      throw error
    }
  }
=======
>>>>>>> 4608d31 (456789)
}

export const gameStore = new GameStore()

