import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { sectionCompleteVariants } from '../utils/animations.js'
import { getMissionRead } from '../utils/scoring.js'
import { playButtonNav, playMissionComplete } from '../utils/hudAudio.js'

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

export default function SectionComplete({ mission, score, onNext }) {
  const displayScore = useCountUp(score)
  const read = getMissionRead(mission.id, score, mission.maxScore)

  useEffect(() => {
    playMissionComplete()
  }, [])

  return (
    <motion.div
      className="section-complete-screen hex-grid"
      variants={sectionCompleteVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="corner-tl" />
      <div className="corner-tr" />
      <div className="corner-bl" />
      <div className="corner-br" />

      <motion.div
        className="section-complete-icon"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        ◈
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="section-complete-label">MISSION {mission.number} COMPLETE</div>
        <div className="section-complete-title">{mission.label}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="section-score-display">{displayScore}</div>
        <div className="section-score-max">OUT OF {mission.maxScore} POINTS</div>
      </motion.div>

      <motion.div
        className="section-read"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {read}
      </motion.div>

      <motion.button
        className="btn-orange"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        onClick={() => {
          playButtonNav()
          onNext()
        }}
      >
        {mission.id < 2 ? `NEXT MISSION →` : 'VIEW RESULTS →'}
      </motion.button>
    </motion.div>
  )
}
