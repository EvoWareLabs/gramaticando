"use client"

import { useEffect, useState } from "react"
import styles from "./Bubbles.module.css"

interface Bubble {
  id: number
  size: number
  duration: number
  delay: number
  left: string
}

export default function Bubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    const newBubbles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 20,
      left: `${Math.random() * 100}%`,
    }))
    setBubbles(newBubbles)
  }, [])

  return (
    <>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={styles.bubble}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.left,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </>
  )
}

