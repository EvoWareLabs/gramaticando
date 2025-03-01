"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD700] via-[#FF6B6B] to-[#4834d4] flex items-center justify-center p-8">
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 max-w-2xl w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Algo deu errado!</h2>
        <p className="text-white mb-8">Desculpe pelo inconveniente. Por favor, tente novamente.</p>
        <Button onClick={reset} className="bg-emerald-500 hover:bg-emerald-600 text-white">
          Tentar Novamente
        </Button>
      </div>
    </div>
  )
}

