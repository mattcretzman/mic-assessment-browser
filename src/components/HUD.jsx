import { MISSIONS } from '../data/questions.js'

const SEGMENT_COUNT = 20

export default function HUD({ currentMission, currentQuestion, totalQuestions }) {
  const mission = MISSIONS[currentMission]
  const globalQ = MISSIONS.slice(0, currentMission).reduce((sum, m) => sum + m.questions.length, 0) + currentQuestion
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
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`hud-shield-seg ${i < filledCount ? segmentColor : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
