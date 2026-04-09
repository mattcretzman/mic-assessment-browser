import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeVariants } from '../utils/animations.js'

export default function LeadCapture({ archetype, totalScore, onContinue }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { name, email, archetype: archetype.name, totalScore }
    console.log('[MIC Assessment] Lead captured:', payload)
    // In production: POST to webhook
    // fetch('/api/leads', { method: 'POST', body: JSON.stringify(payload) })
    setSubmitted(true)
    setTimeout(onContinue, 1200)
  }

  const handleSkip = () => {
    console.log('[MIC Assessment] Lead capture skipped')
    onContinue()
  }

  return (
    <motion.div
      className="lead-capture-screen hex-grid scanlines"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="lead-form">
        <div className="corner-tl" style={{ position: 'absolute', top: 40, left: 24 }} />
        <div className="corner-tr" style={{ position: 'absolute', top: 40, right: 24 }} />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: 8 }}
        >
          <span className="section-label">CLASSIFIED — OPERATOR ONLY</span>
        </motion.div>

        <motion.h2
          className="form-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          UNLOCK YOUR FULL BRIEFING
        </motion.h2>

        <motion.p
          className="form-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Enter your details to receive a personalized breakdown of your results and the exact playbook to level up as <strong style={{ color: 'var(--electric)' }}>{archetype.name}</strong>.
        </motion.p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: 'center',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 18,
              color: 'var(--green)',
              padding: '40px 0',
              textShadow: '0 0 20px rgba(0,255,140,0.5)',
            }}
          >
            ◈ OPERATOR VERIFIED
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="form-field">
              <label className="form-label">OPERATOR NAME</label>
              <input
                className="form-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">SECURE COMMS (EMAIL)</label>
              <input
                className="form-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-orange"
              style={{ width: '100%', marginTop: 8, fontSize: 14 }}
            >
              SEND MY RESULTS →
            </button>

            <button
              type="button"
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 11,
                cursor: 'pointer',
                marginTop: 12,
                display: 'block',
                width: '100%',
                textAlign: 'center',
                opacity: 0.5,
                textDecoration: 'underline',
              }}
            >
              skip — just show me the share card
            </button>
          </motion.form>
        )}
      </div>
    </motion.div>
  )
}
