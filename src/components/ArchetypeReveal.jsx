import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { archetypeContainer, archetypeItem, archetypeNameVariants } from '../utils/animations.js'
import { primeAudio, playScanPulse, playRevealSting, playWhoosh } from '../utils/hudAudio.js'

const SCAN_LINES = [
  '> ANALYZING COMBAT PROFILE...',
  '> CROSS-REFERENCING HEALING INDEX...',
  '> MAPPING SKILL EXECUTION PATTERNS...',
  '> EVALUATING AI INTEGRATION DEPTH...',
  '> PROFILE MATCH FOUND.',
]

export default function ArchetypeReveal({ archetype, onNext }) {
  const [phase, setPhase] = useState('scan') // scan | reveal
  const [visibleScanLines, setVisibleScanLines] = useState([])

  useEffect(() => {
    SCAN_LINES.forEach((_, i) => {
      setTimeout(() => {
        setVisibleScanLines((prev) => [...prev, i])
        playScanPulse()
        if (i === SCAN_LINES.length - 1) {
          setTimeout(() => {
            playRevealSting()
            setPhase('reveal')
          }, 800)
        }
      }, i * 350)
    })
  }, [])

  return (
    <div className="archetype-screen hex-grid scanlines">
      <AnimatePresence mode="wait">
        {phase === 'scan' ? (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', maxWidth: 480 }}
          >
            {SCAN_LINES.map((line, i) => (
              <motion.div
                key={i}
                className="archetype-scan-text"
                style={{
                  opacity: visibleScanLines.includes(i) ? 1 : 0,
                  marginBottom: 8,
                  transition: 'opacity 0.3s',
                }}
              >
                {line}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            variants={archetypeContainer}
            initial="hidden"
            animate="visible"
            style={{ textAlign: 'center', maxWidth: 600, width: '100%' }}
          >
            <motion.div variants={archetypeItem} style={{ marginBottom: 8 }}>
              <span
                className="section-label"
                style={{ fontSize: 12, letterSpacing: '0.3em' }}
              >
                ARCHETYPE IDENTIFIED
              </span>
            </motion.div>

            <motion.h1
              className="archetype-name"
              variants={archetypeNameVariants}
              style={{ color: archetype.color, textShadow: `0 0 40px ${archetype.color}66` }}
            >
              {archetype.name}
            </motion.h1>

            <motion.p className="archetype-subtitle" variants={archetypeItem}>
              {archetype.subtitle}
            </motion.p>

            <motion.div
              variants={archetypeItem}
              style={{
                width: '100%',
                height: 2,
                background: `linear-gradient(to right, transparent, ${archetype.color}, transparent)`,
                margin: '20px 0',
              }}
            />

            <motion.p className="archetype-desc" variants={archetypeItem}>
              {archetype.description}
            </motion.p>

            <motion.div className="archetype-stats" variants={archetypeItem}>
              <div className="archetype-stat-row">
                <div className="archetype-stat-label">STRENGTH:</div>
                <div className="archetype-stat-value" style={{ color: '#d4a230' }}>
                  {archetype.strength}
                </div>
              </div>
              <div className="archetype-stat-row">
                <div className="archetype-stat-label">BLIND SPOT:</div>
                <div className="archetype-stat-value" style={{ color: '#7c5fd4' }}>
                  {archetype.weakness}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={archetypeItem}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
            >
              <button
                className="btn-primary"
                onClick={() => {
                  primeAudio()
                  playWhoosh()
                  onNext()
                }}
              >
                <span>SHARE YOUR RESULTS →</span>
              </button>
              <div className="archetype-retake">
                Retake recommended in 45 days to track your progress
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
