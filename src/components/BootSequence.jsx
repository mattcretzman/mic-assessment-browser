import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { primeAudio, playPowerUp, playSelect } from '../utils/hudAudio.js'

const BOOT_LINES = [
  { text: '> AMP SOCIAL SYSTEMS ONLINE', type: 'normal' },
  { text: '> INITIALIZING MIC METHOD PROTOCOL...', type: 'normal' },
  { text: '> CALIBRATING OUTBOUND INTELLIGENCE MATRIX...', type: 'normal' },
  { text: '> SCANNING OPERATOR NEURAL SIGNATURE...', type: 'normal' },
  { text: '> WARNING: HONESTY REQUIRED FOR ACCURATE RESULTS', type: 'warning' },
  { text: '> SYSTEM READY', type: 'ready' },
]

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i])
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setShowButton(true), 800)
        }
      }, i * 400)
    })
  }, [])

  const handleBegin = () => {
    primeAudio()
    playSelect()
    playPowerUp()
    setTimeout(onComplete, 320)
  }

  return (
    <div className="boot-screen scanlines hex-grid boot-screen-halo">
      <div className="boot-energy-ring" aria-hidden />
      <div className="boot-lines">
        {BOOT_LINES.map((line, i) => (
          <div
            key={i}
            className={`boot-line ${line.type}`}
            style={{
              opacity: visibleLines.includes(i) ? 1 : 0,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.button
            className="boot-begin-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleBegin}
          >
            [ PRESS TO BEGIN ]
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
