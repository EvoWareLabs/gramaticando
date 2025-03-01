"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface CharacterProps {
  className?: string
  expression?: "neutral" | "happy" | "thinking"
  speech?: string
}

export default function Character({ 
  className = "", 
  expression = "neutral", 
  speech 
}: CharacterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Definir posições padrão dos olhos para cada expressão
  const eyePositions = {
    neutral: { x: 35, y: 40 },
    thinking: { x: 37, y: 39 },
    happy: { x: 35, y: 38 }
  }

  // Definir caminhos do sorriso para cada expressão
  const mouthPaths = {
    neutral: "M 30,52 Q 50,52 70,52",
    thinking: "M 30,55 Q 50,50 70,55",
    happy: "M 30,50 Q 50,60 70,50"
  }

  useEffect(() => {
    if (speech) {
      setIsTyping(true)
      setDisplayedText("")
      let i = 0
      const intervalId = setInterval(() => {
        setDisplayedText(speech.slice(0, i))
        i++
        if (i > speech.length) {
          clearInterval(intervalId)
          setIsTyping(false)
        }
      }, 30)
      return () => clearInterval(intervalId)
    }
  }, [speech])

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-full max-w-[500px]">
        {/* Speech Bubble */}
        <AnimatePresence mode="wait">
          {speech && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+20px)] w-full"
              style={{ zIndex: 10 }}
            >
              <div className="relative bg-white rounded-[20px] p-6 shadow-lg">
                <div className="relative">
                  <p className="text-black text-lg leading-tight min-h-[3em]">
                    {displayedText}
                  </p>
                  {isTyping && (
                    <motion.span
                      className="absolute -right-2 bottom-0 text-lg text-primary"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      ▋
                    </motion.span>
                  )}
                </div>
                {/* Speech Bubble Tail */}
                <div
                  className="absolute left-1/2 bottom-0 w-8 h-8 transform -translate-x-1/2 translate-y-1/2 rotate-45 bg-white"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character */}
        <motion.div
          className="relative z-0"
          animate={{
            scale: isTyping ? [1, 1.02, 1] : 1,
            transition: { 
              duration: 0.5, 
              repeat: isTyping ? Infinity : 0 
            },
          }}
        >
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Base Circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="#2ECC71" 
            />

            {/* Eyes */}
            <g>
              {/* Left Eye */}
              <circle 
                cx={eyePositions[expression].x} 
                cy={eyePositions[expression].y} 
                r="6" 
                fill="white" 
              />
              <motion.circle
                cx={eyePositions[expression].x}
                cy={eyePositions[expression].y}
                r="3"
                fill="black"
                animate={{
                  cx: eyePositions[expression].x,
                  cy: eyePositions[expression].y,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Right Eye */}
              <circle 
                cx={eyePositions[expression].x + 30} 
                cy={eyePositions[expression].y} 
                r="6" 
                fill="white" 
              />
              <motion.circle
                cx={eyePositions[expression].x + 30}
                cy={eyePositions[expression].y}
                r="3"
                fill="black"
                animate={{
                  cx: eyePositions[expression].x + 30,
                  cy: eyePositions[expression].y,
                }}
                transition={{ duration: 0.3 }}
              />
            </g>

            {/* Mouth */}
            <motion.path
              d={mouthPaths[expression]}
              stroke="black"
              strokeWidth="2"
              fill="transparent"
              animate={{
                d: mouthPaths[expression]
              }}
              transition={{ duration: 0.3 }}
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
