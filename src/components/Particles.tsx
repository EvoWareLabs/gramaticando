"use client"

import { useEffect, useRef } from "react"

interface ParticlesProps {
  className?: string
}

export default function Particles({ className = "" }: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const particles: HTMLDivElement[] = []
    const container = containerRef.current
    if (!container) return

    const createParticle = () => {
      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 bg-white rounded-full"

      // Random starting position
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`

      // Random size
      const size = Math.random() * 3 + 1
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      // Random opacity
      particle.style.opacity = (Math.random() * 0.5 + 0.2).toString()

      // Animation
      const duration = Math.random() * 3000 + 2000
      particle.animate(
        [
          { transform: "translate(0, 0)" },
          { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)` },
        ],
        {
          duration,
          iterations: Number.POSITIVE_INFINITY,
          direction: "alternate",
          easing: "ease-in-out",
        },
      )

      container.appendChild(particle)
      particles.push(particle)
    }

    // Create initial particles
    for (let i = 0; i < 50; i++) {
      createParticle()
    }

    return () => {
      particles.forEach((particle) => particle.remove())
    }
  }, [])

  return <div ref={containerRef} className={`${className} pointer-events-none`} />
}

