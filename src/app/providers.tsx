'use client'

import { GameProvider } from '@/providers/GameContext'
import React from 'react'; // Added import for React

export function Providers({ children }: { children: React.ReactNode }) {
  return <GameProvider>{children}</GameProvider>
}
