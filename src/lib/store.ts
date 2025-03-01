import { ref, get, set } from "firebase/database"
import { db } from "./firebase"
import type { GameSession, Player } from "@/types/types"

class GameStore {
  async createSession(): Promise<GameSession> {
    const session: GameSession = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: Date.now(),
      status: "active",
      players: {},
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
}

export const gameStore = new GameStore()

