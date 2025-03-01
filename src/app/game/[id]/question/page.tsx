import { Suspense } from "react"
import QuestionPage from "./QuestionPage"
import LoadingSpinner from "@/components/LoadingSpinner"

interface PageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QuestionPage id={params.id} />
    </Suspense>
  )
}

