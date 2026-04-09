import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTier } from '../data/archetypes.js'
import { MAX_HEALING, MAX_SKILL, MAX_AI, MAX_TOTAL } from '../data/questions.js'
import { fadeVariants } from '../utils/animations.js'
import { primeAudio, playReportOpen, playWhoosh } from '../utils/hudAudio.js'

function useCountUp(target, duration = 1800, delay = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
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
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, duration, delay])
  return count
}

function StatBlock({ label, score, max, color, delay = 0 }) {
  const displayScore = useCountUp(score, 1200, delay)
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setBarWidth((score / max) * 100), delay + 200)
    return () => clearTimeout(t)
  }, [score, max, delay])

  return (
    <motion.div
      className="stat-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 + 0.2, duration: 0.4 }}
    >
      <div className="stat-block-label">{label}</div>
      <div className="stat-block-score" style={{ color }}>{displayScore}</div>
      <div className="stat-block-max">/ {max}</div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${barWidth}%`, background: color, boxShadow: `0 0 8px ${color}66` }}
        />
      </div>
    </motion.div>
  )
}

export default function FinalResults({ healingScore, skillScore, aiScore, onReveal }) {
  const total = healingScore + skillScore + aiScore
  const displayTotal = useCountUp(total, 2000, 800)
  const tier = getTier(total)

  useEffect(() => {
    playReportOpen()
  }, [])

  return (
    <motion.div
      className="results-screen hex-grid scanlines"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="results-header">
        <div className="results-title">AFTER ACTION REPORT</div>
        <div className="results-subtitle">ASSESSMENT COMPLETE — MIC METHOD PROTOCOL</div>
      </div>

      <div className="stat-blocks">
        <StatBlock
          label="HEALING CIRCLE"
          score={healingScore}
          max={MAX_HEALING}
          color="#ff6a00"
          delay={0}
        />
        <StatBlock
          label="SKILL DIAGNOSTIC"
          score={skillScore}
          max={MAX_SKILL}
          color="#00b4ff"
          delay={200}
        />
        <StatBlock
          label="AI READINESS"
          score={aiScore}
          max={MAX_AI}
          color="#00ff8c"
          delay={400}
        />
      </div>

      <div className="total-score-block">
        <div className="total-score-label">TOTAL MIC SCORE</div>
        <div className="total-score-num">{displayTotal}</div>
        <div className="total-score-denom">/ {MAX_TOTAL} POINTS</div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        style={{ textAlign: 'center', marginBottom: 20 }}
      >
        <div
          className="tier-badge"
          style={{ color: tier.color, borderColor: tier.color, boxShadow: `0 0 20px ${tier.color}44` }}
        >
          {tier.tier}
        </div>
      </motion.div>

      <motion.p
        className="score-interpretation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        {tier.description}
      </motion.p>

      <motion.button
        className="btn-orange"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.4 }}
        style={{ marginBottom: 40 }}
        onClick={() => {
          primeAudio()
          playWhoosh()
          onReveal()
        }}
      >
        REVEAL YOUR ARCHETYPE →
      </motion.button>
    </motion.div>
  )
}
