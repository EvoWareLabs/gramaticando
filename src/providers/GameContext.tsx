"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { gameStore } from "../lib/store"
import type { GameSession, Player } from "../types/types"

interface GameContextType {
  session: GameSession | null
  player: Player | null
  createSession: () => Promise<GameSession>
  createPlayer: (name: string) => Promise<Player>
  updatePlayer: (player: Player) => Promise<void>
  getSession: (sessionId: string) => Promise<GameSession | null>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<GameSession | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)

  const createSession = async () => {
    try {
      const newSession = await gameStore.createSession()
      setSession(newSession)
      localStorage.setItem("sessionId", newSession.id)
      return newSession
    } catch (error) {
      console.error("Error creating session:", error)
      throw error
    }
  }

  const createPlayer = async (name: string) => {
    if (!session) throw new Error("No active session")
    try {
      const newPlayer: Player = {
        id: Math.random().toString(36).substring(2, 15),
        name,
        sessionId: session.id,
        score: 0,
        currentQuestion: 0,
        answers: [],
        helpUsed: 0,
      }
      await gameStore.updatePlayer(newPlayer)
      setPlayer(newPlayer)
      return newPlayer
    } catch (error) {
      console.error("Error creating player:", error)
      throw error
    }
  }

  const updatePlayer = async (updatedPlayer: Player) => {
    try {
      await gameStore.updatePlayer(updatedPlayer)
      setPlayer(updatedPlayer)
    } catch (error) {
      console.error("Error updating player:", error)
      throw error
    }
  }

  const getSession = async (sessionId: string) => {
    try {
      const existingSession = await gameStore.getSession(sessionId)
      if (existingSession) {
        setSession(existingSession)
        return existingSession
      }
      return null
    } catch (error) {
      console.error("Error getting session:", error)
      throw error
    }
  }

  return (
    <GameContext.Provider
      value={{
        session,
        player,
        createSession,
        getSession,
        createPlayer,
        updatePlayer,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

