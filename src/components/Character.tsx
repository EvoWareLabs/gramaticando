"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface CharacterProps {
  className?: string
  expression: "neutral" | "waiting" | "happy" | "thinking"
  speech?: string
}

export default function Character({ className = "", expression, speech }: CharacterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

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
      return () => {
        clearInterval(intervalId)
      }
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
                  <p className="text-black text-lg leading-tight min-h-[3em]">{displayedText}</p>
                  {isTyping && (
                    <motion.span
                      className="absolute -right-2 bottom-0 text-lg text-primary"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
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
            transition: { duration: 0.5, repeat: isTyping ? Number.POSITIVE_INFINITY : 0 },
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Base Circle */}
            <circle cx="50" cy="50" r="45" fill="#2ECC71" />

            {/* Eyes */}
            <g>
              {/* Left Eye */}
              <circle cx="35" cy="40" r="6" fill="white" />
              <motion.circle
                cx="35"
                cy="40"
                r="3"
                fill="black"
                animate={{
                  cx: expression === "thinking" ? 37 : 35,
                  cy: expression === "thinking" ? 39 : 40,
                }}
              />

              {/* Right Eye */}
              <circle cx="65" cy="40" r="6" fill="white" />
              <motion.circle
                cx="65"
                cy="40"
                r="3"
                fill="black"
                animate={{
                  cx: expression === "thinking" ? 67 : 65,
                  cy: expression === "thinking" ? 39 : 40,
                }}
              />
            </g>

            {/* Mouth */}
            <motion.path
              d="M 30,50 Q 50,60 70,50"
              stroke="black"
              strokeWidth="2"
              fill="transparent"
              animate={{
                d:
                  expression === "happy"
                    ? "M 30,50 Q 50,60 70,50"
                    : expression === "thinking"
                      ? "M 30,55 Q 50,50 70,55"
                      : "M 30,52 Q 50,52 70,52",
              }}
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

