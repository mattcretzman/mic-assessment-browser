import { motion } from 'framer-motion'
import { fadeVariants } from '../utils/animations.js'
import { primeAudio, playWhoosh } from '../utils/hudAudio.js'

export default function PersonalDisclaimer({ onContinue }) {
  const handleContinue = () => {
    primeAudio()
    playWhoosh()
    onContinue()
  }

  return (
    <motion.div
      className="personal-disclaimer-screen hex-grid scanlines"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="corner-tl" />
      <div className="corner-tr" />
      <div className="corner-bl" />
      <div className="corner-br" />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        style={{ textAlign: 'center', marginBottom: 12 }}
      >
        <span className="section-label">HEADS UP</span>
      </motion.div>

      <motion.h1
        className="personal-disclaimer-title"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        This is about to get personal.
      </motion.h1>

      <motion.p
        className="personal-disclaimer-lede"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        Enter at your own risk.
      </motion.p>

      <motion.div
        className="personal-disclaimer-box"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <p className="personal-disclaimer-privacy">
          Whatever you submit stays private — you, Morgan, and this assessment. That&apos;s it.
        </p>
        <p className="personal-disclaimer-note">
          The next section (The Healing Circle) goes deeper than tactics. Take your time.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
      >
        <button type="button" className="btn-primary" onClick={handleContinue}>
          <span>I&apos;m ready — continue</span>
        </button>
      </motion.div>
    </motion.div>
  )
}
