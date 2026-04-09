import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BootSequence from './components/BootSequence.jsx'
import RoleSelect from './components/RoleSelect.jsx'
import MissionIntro from './components/MissionIntro.jsx'
import QuestionSlide from './components/QuestionSlide.jsx'
import SectionComplete from './components/SectionComplete.jsx'
import FinalResults from './components/FinalResults.jsx'
import ArchetypeReveal from './components/ArchetypeReveal.jsx'
import LeadCapture from './components/LeadCapture.jsx'
import ShareCard from './components/ShareCard.jsx'
import { MISSIONS } from './data/questions.js'
import { calcHealingScore, calcSkillScore, calcAiScore, getMissionScore } from './utils/scoring.js'
import { getArchetype } from './data/archetypes.js'

// Screen state machine:
// boot → roleSelect → missionIntro → questions → sectionComplete → [next mission] → finalResults → archetypeReveal → leadCapture → shareCard

export default function App() {
  const [screen, setScreen] = useState('boot')
  const [role, setRole] = useState(null)
  const [currentMission, setCurrentMission] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [missionScores, setMissionScores] = useState([])

  // Computed
  const healingScore = calcHealingScore(answers)
  const skillScore = calcSkillScore(answers)
  const aiScore = calcAiScore(answers)
  const archetype = getArchetype(healingScore, skillScore, aiScore)

  const handleBoot = () => setScreen('roleSelect')

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setCurrentMission(0)
    setScreen('missionIntro')
  }

  const handleMissionIntroComplete = () => {
    setCurrentQuestion(0)
    setScreen('questions')
  }

  const handleAnswer = useCallback(
    (questionId, value) => {
      const newAnswers = { ...answers, [questionId]: value }
      setAnswers(newAnswers)

      const mission = MISSIONS[currentMission]
      const nextQ = currentQuestion + 1

      if (nextQ >= mission.questions.length) {
        // Mission complete — show section complete screen
        const score = getMissionScore(currentMission, newAnswers)
        setMissionScores((prev) => {
          const updated = [...prev]
          updated[currentMission] = score
          return updated
        })
        setScreen('sectionComplete')
      } else {
        setCurrentQuestion(nextQ)
      }
    },
    [answers, currentMission, currentQuestion]
  )

  const handleSectionNext = () => {
    const nextMission = currentMission + 1
    if (nextMission >= MISSIONS.length) {
      setScreen('finalResults')
    } else {
      setCurrentMission(nextMission)
      setCurrentQuestion(0)
      setScreen('missionIntro')
    }
  }

  const handleRevealArchetype = () => setScreen('archetypeReveal')
  const handleLeadCapture = () => setScreen('leadCapture')
  const handleShareCard = () => setScreen('shareCard')

  const handleRetake = () => {
    setScreen('boot')
    setRole(null)
    setCurrentMission(0)
    setCurrentQuestion(0)
    setAnswers({})
    setMissionScores([])
  }

  const mission = MISSIONS[currentMission]

  return (
    <div className="app-wrapper">
      <AnimatePresence mode="wait">
        {screen === 'boot' && (
          <motion.div key="boot" style={{ width: '100%', minHeight: '100vh' }}>
            <BootSequence onComplete={handleBoot} />
          </motion.div>
        )}

        {screen === 'roleSelect' && (
          <motion.div key="roleSelect" style={{ width: '100%', minHeight: '100vh' }}>
            <RoleSelect onSelect={handleRoleSelect} />
          </motion.div>
        )}

        {screen === 'missionIntro' && (
          <motion.div key={`missionIntro-${currentMission}`} style={{ width: '100%', minHeight: '100vh' }}>
            <MissionIntro
              mission={mission}
              onContinue={handleMissionIntroComplete}
            />
          </motion.div>
        )}

        {screen === 'questions' && (
          <motion.div
            key={`question-${currentMission}-${currentQuestion}`}
            style={{ width: '100%', minHeight: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <QuestionSlide
              mission={mission}
              missionIndex={currentMission}
              questionIndex={currentQuestion}
              answers={answers}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}

        {screen === 'sectionComplete' && (
          <motion.div
            key={`complete-${currentMission}`}
            style={{ width: '100%', minHeight: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionComplete
              mission={mission}
              score={getMissionScore(currentMission, answers)}
              onNext={handleSectionNext}
            />
          </motion.div>
        )}

        {screen === 'finalResults' && (
          <motion.div
            key="finalResults"
            style={{ width: '100%', minHeight: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FinalResults
              healingScore={healingScore}
              skillScore={skillScore}
              aiScore={aiScore}
              answers={answers}
              onReveal={handleRevealArchetype}
            />
          </motion.div>
        )}

        {screen === 'archetypeReveal' && (
          <motion.div
            key="archetypeReveal"
            style={{ width: '100%', minHeight: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ArchetypeReveal
              archetype={archetype}
              onNext={handleLeadCapture}
            />
          </motion.div>
        )}

        {screen === 'leadCapture' && (
          <motion.div
            key="leadCapture"
            style={{ width: '100%', minHeight: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LeadCapture
              archetype={archetype}
              totalScore={healingScore + skillScore + aiScore}
              onContinue={handleShareCard}
            />
          </motion.div>
        )}

        {screen === 'shareCard' && (
          <motion.div
            key="shareCard"
            style={{ width: '100%', minHeight: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ShareCard
              archetype={archetype}
              healingScore={healingScore}
              skillScore={skillScore}
              aiScore={aiScore}
              onRetake={handleRetake}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
