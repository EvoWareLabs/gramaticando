export default function LoadingSpinner({ message = "Carregando..." }: { message?: string }) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FCE762] via-[#FF715B] to-[#3498DB]">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xl text-white">{message}</p>
      </div>
    )
  }
  
  