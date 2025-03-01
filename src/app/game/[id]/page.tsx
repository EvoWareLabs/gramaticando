import { Suspense } from "react"
import GamePage from "./GamePage"
import LoadingSpinner from "@/components/LoadingSpinner"

interface PageProps {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  const id = await Promise.resolve(params.id)

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GamePage id={id} />
    </Suspense>
  )
}

