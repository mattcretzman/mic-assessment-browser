import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { primeAudio, playCountdown, playWhoosh } from '../utils/hudAudio.js'

export default function MissionIntro({ mission, onContinue }) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (countdown < 1 || countdown > 3) return
    playCountdown(countdown)
  }, [countdown])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          setTimeout(onContinue, 300)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [onContinue])

  return (
    <motion.div
      className="mission-intro-screen hex-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="corner-tl" />
      <div className="corner-tr" />
      <div className="corner-bl" />
      <div className="corner-br" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="mission-number-label">MISSION {mission.number}</div>
      </motion.div>

      <motion.h1
        className="mission-intro-title"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
      >
        {mission.title}
      </motion.h1>

      <motion.p
        className="mission-intro-desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        {mission.description}
      </motion.p>

      <motion.div
        className="mission-score-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        /{mission.maxScore} POINTS
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
      >
        <button
          className="btn-primary"
          onClick={() => {
            primeAudio()
            playWhoosh()
            onContinue()
          }}
        >
          <span>BEGIN MISSION {mission.number}</span>
        </button>
        <div
          className="skip-hint"
          onClick={() => {
            primeAudio()
            playWhoosh()
            onContinue()
          }}
        >
          Auto-advancing in {countdown}s — click to skip
        </div>
      </motion.div>
    </motion.div>
  )
}
