import { Suspense } from "react"
import GameRanking from "@/components/GameRanking"
import LoadingSpinner from "@/components/LoadingSpinner"

interface PageProps {
  params: {
    id: string
  }
}

export default function RankingPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GameRanking sessionId={params.id} />
    </Suspense>
  )
}

