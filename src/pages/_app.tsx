import type { AppProps } from 'next/app'
import { GameProvider } from '../providers/GameContext'
import '../app/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  )
}

export default MyApp
