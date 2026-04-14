import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeVariants } from '../utils/animations.js'
import { submitResultsToTeam } from '../utils/submitResultsToTeam.js'
import { primeAudio, playSelect } from '../utils/hudAudio.js'

export default function LeadCapture({
  archetype,
  totalScore,
  healingScore,
  skillScore,
  aiScore,
  role,
  tierLabel,
  onContinue,
}) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [notifyError, setNotifyError] = useState(null)
  const [sending, setSending] = useState(false)

  const basePayload = () => ({
    archetypeName: archetype?.name || '',
    tierLabel: tierLabel || '',
    healingScore,
    skillScore,
    aiScore,
    totalScore,
    role: role || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    primeAudio()
    playSelect()
    setSending(true)
    setNotifyError(null)
    let hadError = false
    try {
      await submitResultsToTeam({
        anonymous: false,
        name,
        company,
        email,
        ...basePayload(),
      })
    } catch (err) {
      console.error('[MIC Assessment] Notify team failed:', err)
      hadError = true
      setNotifyError(
        err?.status === 503
          ? 'Team email not configured on server yet — results were not sent.'
          : 'Could not notify the team automatically. Your results still appear on the next screen.'
      )
    } finally {
      setSending(false)
      setSubmitted(true)
      setTimeout(onContinue, hadError ? 2200 : 1200)
    }
  }

  const handleSkip = async () => {
    primeAudio()
    playSelect()
    setNotifyError(null)
    let skipError = false
    try {
      await submitResultsToTeam({
        anonymous: true,
        name: '',
        company: '',
        email: '',
        ...basePayload(),
      })
    } catch (err) {
      console.error('[MIC Assessment] Anonymous notify failed:', err)
      skipError = true
      setNotifyError(
        err?.status === 503
          ? 'Team email not configured on server yet — results were not sent.'
          : 'Could not notify the team automatically. Your results still appear on the next screen.'
      )
    }
    if (skipError) {
      setSubmitted(true)
      setTimeout(onContinue, 2200)
    } else {
      onContinue()
    }
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
          Enter your details so we can send a personalized breakdown and the exact playbook to level up as{' '}
          <strong style={{ color: 'var(--electric)' }}>{archetype.name}</strong>. On the next screen you&apos;ll see your
          full after-action scores. Morgan&apos;s team gets a copy so they can follow up.
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
              textShadow: '0 0 20px rgba(196,176,232,0.45)',
            }}
          >
            ◈ OPERATOR VERIFIED
            {notifyError && (
              <div
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  fontFamily: 'Share Tech Mono, monospace',
                  color: 'var(--amber)',
                  maxWidth: 360,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  lineHeight: 1.5,
                }}
              >
                {notifyError}
              </div>
            )}
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
                autoComplete="name"
              />
            </div>

            <div className="form-field">
              <label className="form-label">COMPANY</label>
              <input
                className="form-input"
                type="text"
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                autoComplete="organization"
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
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="btn-orange"
              style={{ width: '100%', marginTop: 8, fontSize: 14 }}
              disabled={sending}
            >
              {sending ? 'TRANSMITTING…' : 'SEND MY RESULTS →'}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={sending}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 11,
                cursor: sending ? 'default' : 'pointer',
                marginTop: 12,
                display: 'block',
                width: '100%',
                textAlign: 'center',
                opacity: sending ? 0.3 : 0.5,
                textDecoration: 'underline',
              }}
            >
              skip — show my report
            </button>
          </motion.form>
        )}
      </div>
    </motion.div>
  )
}
