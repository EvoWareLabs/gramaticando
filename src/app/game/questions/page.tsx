import { Suspense } from "react"
import dynamic from "next/dynamic"
import LoadingSpinner from "@/components/LoadingSpinner"

// Use dynamic import to avoid initialization issues
const QuestionPage = dynamic(() => import("./QuestionPage"), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR for this component to avoid hydration issues
})

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

