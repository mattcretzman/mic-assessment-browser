import { useState } from 'react'
import { motion } from 'framer-motion'
import { getTier } from '../data/archetypes.js'
import { MAX_HEALING, MAX_SKILL, MAX_AI, MAX_TOTAL } from '../data/questions.js'
import { fadeVariants } from '../utils/animations.js'
import { primeAudio, playSelect } from '../utils/hudAudio.js'

export default function ShareCard({ archetype, healingScore, skillScore, aiScore, onRetake }) {
  const total = healingScore + skillScore + aiScore
  const tier = getTier(total)
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const postText = `Just took the MIC Method Assessment by @MorganJIngram.\n\nMy score: ${total}/${MAX_TOTAL}.\nI'm ${archetype.name}.\nMy biggest gap is: ${archetype.weakness}.\n\nTake the assessment: https://mic-assessment.com`

  const handleCopy = () => {
    primeAudio()
    playSelect()
    navigator.clipboard.writeText(postText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleCopyLink = () => {
    primeAudio()
    playSelect()
    navigator.clipboard.writeText('https://mic-assessment.com').then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  const healingPct = (healingScore / MAX_HEALING) * 100
  const skillPct = (skillScore / MAX_SKILL) * 100
  const aiPct = (aiScore / MAX_AI) * 100

  return (
    <motion.div
      className="share-screen hex-grid scanlines"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      style={{ paddingTop: 40, paddingBottom: 60 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 11,
          letterSpacing: '0.2em',
          color: 'var(--muted)',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        YOUR RESULTS CARD
      </motion.div>

      {/* Share Card */}
      <motion.div
        className="share-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="share-card-header">
          <div className="share-card-brand">MIC METHOD ASSESSMENT</div>
          <div className="share-card-watermark">AMP SOCIAL</div>
        </div>

        <div
          className="share-archetype-name"
          style={{ color: archetype.color, textShadow: `0 0 20px ${archetype.color}55` }}
        >
          {archetype.name}
        </div>

        <div className="share-bars">
          <div className="share-bar-row">
            <div className="share-bar-label">HEALING</div>
            <div className="share-bar-track">
              <div
                className="share-bar-fill"
                style={{ width: `${healingPct}%`, background: '#d4a230', boxShadow: '0 0 6px #d4a23066' }}
              />
            </div>
            <div className="share-bar-val">{healingScore}/{MAX_HEALING}</div>
          </div>
          <div className="share-bar-row">
            <div className="share-bar-label">SKILLS</div>
            <div className="share-bar-track">
              <div
                className="share-bar-fill"
                style={{ width: `${skillPct}%`, background: '#7c5fd4', boxShadow: '0 0 6px #7c5fd466' }}
              />
            </div>
            <div className="share-bar-val">{skillScore}/{MAX_SKILL}</div>
          </div>
          <div className="share-bar-row">
            <div className="share-bar-label">AI</div>
            <div className="share-bar-track">
              <div
                className="share-bar-fill"
                style={{ width: `${aiPct}%`, background: '#b8a4dc', boxShadow: '0 0 6px #b8a4dc66' }}
              />
            </div>
            <div className="share-bar-val">{aiScore}/{MAX_AI}</div>
          </div>
        </div>

        <div className="share-total">
          <div className="share-total-num">{total}</div>
          <div className="share-total-label">MIC SCORE / {MAX_TOTAL}</div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div
            className="share-tier"
            style={{ color: tier.color, borderColor: tier.color, boxShadow: `0 0 12px ${tier.color}44` }}
          >
            {tier.tier}
          </div>
        </div>

        <div className="share-credit">@MorganJIngram · mic-assessment.com</div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="share-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="section-label"
          style={{ marginBottom: 8, fontSize: 10, letterSpacing: '0.2em' }}
        >
          COPY POST TEXT FOR LINKEDIN:
        </div>
        <div className="copy-text-box">{postText}</div>

        <div className="share-btn-row">
          <button className="btn-primary" onClick={handleCopy}>
            <span>{copied ? '✓ COPIED!' : 'COPY POST TEXT'}</span>
          </button>
          <button className="btn-green" onClick={handleCopyLink}>
            {linkCopied ? '✓ LINK COPIED' : 'CHALLENGE A TEAMMATE →'}
          </button>
        </div>

        <button
          className="btn-orange"
          style={{ marginTop: 8, width: '100%' }}
          onClick={onRetake}
        >
          RETAKE ASSESSMENT
        </button>

        <div className="retake-note">
          ↻ Retake in 45 days to track your growth
        </div>
      </motion.div>
    </motion.div>
  )
}
