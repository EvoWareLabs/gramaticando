import { Suspense } from "react"
import GameInitPageContent from "./GameInitPageContent"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function GameInitPage({ params }: { params: { id: string } }) {
  if (!params?.id) {
    return null
  }

  return (
    <Suspense fallback={<LoadingSpinner message="Carregando..." />}>
      <GameInitPageContent params={params} />
    </Suspense>
  )
}

