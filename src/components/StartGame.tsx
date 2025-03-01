"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StartGame({ onStart }: { onStart: (name: string) => void }) {
  const [playerName, setPlayerName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim()) {
      onStart(playerName.trim())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-2xl"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#3498DB]">Digite seu nome</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full px-4 py-2 border border-[#3498DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498DB]"
          placeholder="Seu nome"
          required
        />
        <Button
          type="submit"
          className="w-full px-4 py-2 bg-[#2ECC71] text-white rounded-md hover:bg-[#27AE60] transition-colors duration-300"
        >
          Começar
        </Button>
      </form>
    </motion.div>
  )
}

