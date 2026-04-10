import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RatingInput from './RatingInput.jsx'
import HUD from './HUD.jsx'
import { questionVariants } from '../utils/animations.js'
import { primeAudio, playCommit, playWhoosh } from '../utils/hudAudio.js'

export default function QuestionSlide({ mission, missionIndex, questionIndex, answers, onAnswer }) {
  const question = mission.questions[questionIndex]
  const [selected, setSelected] = useState(answers[question.id] || null)

  useEffect(() => {
    setSelected(answers[question.id] || null)
  }, [question.id, answers])

  const handleSelect = (val) => {
    setSelected(val)
    primeAudio()
    playCommit(val, question.scale === 10 ? 10 : 5)
    setTimeout(() => playWhoosh(), 120)
    setTimeout(() => {
      onAnswer(question.id, val)
    }, 280)
  }

  const totalInMission = mission.questions.length
  const dots = Array.from({ length: Math.min(totalInMission, 10) })

  return (
    <>
      <HUD
        currentMission={missionIndex}
        currentQuestion={questionIndex}
        totalQuestions={totalInMission}
      />
      <div className="assessment-screen hex-grid">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            className="question-card question-card-halo"
            variants={questionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ width: '100%', maxWidth: 680 }}
          >
            <div className="corner-tl" />
            <div className="corner-tr" />
            <div className="corner-bl" />
            <div className="corner-br" />

            <div className="question-category">{question.category}</div>

            <div className="question-dots">
              {dots.map((_, i) => {
                const dotIndex = totalInMission <= 10 ? i : Math.floor((i / 10) * totalInMission)
                const isActive = totalInMission <= 10 ? i === questionIndex : i === Math.floor((questionIndex / totalInMission) * 10)
                return (
                  <div
                    key={i}
                    className={`question-dot ${isActive ? 'active' : ''}`}
                  />
                )
              })}
            </div>

            <h2 className="question-text">{question.question}</h2>

            {question.description && (
              <p className="question-desc">{question.description}</p>
            )}

            <RatingInput
              scale={question.scale}
              selected={selected}
              onSelect={handleSelect}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
