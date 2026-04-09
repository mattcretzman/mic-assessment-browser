import { motion } from 'framer-motion'
import { MISSIONS } from '../data/questions.js'

const SEGMENT_COUNT = 20

export default function HUD({ currentMission, currentQuestion, totalQuestions }) {
  const mission = MISSIONS[currentMission]
  const globalQ =
    MISSIONS.slice(0, currentMission).reduce((sum, m) => sum + m.questions.length, 0) + currentQuestion
  const totalQ = MISSIONS.reduce((sum, m) => sum + m.questions.length, 0)
  const overallProgress = globalQ / totalQ

  const filledCount = Math.round(overallProgress * SEGMENT_COUNT)

  const segmentColor =
    currentMission === 0 ? 'filled-orange' : currentMission === 1 ? 'filled-blue' : 'filled-green'

  return (
    <div className="hud">
      <div className="hud-inner">
        <div className="hud-left">MIC METHOD ASSESSMENT</div>
        <div className="hud-center">
          MISSION {mission.number} OF 03 — {mission.label}
        </div>
        <div className="hud-right">
          {String(currentQuestion + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
        </div>
      </div>
      <div className="hud-progress">
        <div className="hud-shield-bar">
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
            const on = i < filledCount
            return (
              <motion.div
                key={i}
                className={`hud-shield-seg ${on ? segmentColor : ''}`}
                initial={false}
                animate={
                  on
                    ? { opacity: [0.35, 1], scaleY: [0.35, 1] }
                    : { opacity: 0.32, scaleY: 0.42 }
                }
                transition={{ duration: 0.22, delay: on ? i * 0.015 : 0, ease: 'easeOut' }}
                style={{ transformOrigin: '50% 100%' }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
