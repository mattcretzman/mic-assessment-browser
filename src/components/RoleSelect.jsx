import { motion } from 'framer-motion'
import { screenSlide } from '../utils/animations.js'
import { primeAudio, playSelect } from '../utils/hudAudio.js'

const ROLES = [
  {
    id: 'sdr',
    title: 'SDR / BDR',
    desc: "You're in the trenches. First contact.",
  },
  {
    id: 'ae',
    title: 'ACCOUNT EXECUTIVE',
    desc: 'You close. Pipeline is everything.',
  },
  {
    id: 'am',
    title: 'ACCOUNT MANAGER',
    desc: 'You retain and expand. Relationships are your weapon.',
  },
  {
    id: 'leader',
    title: 'SALES LEADER',
    desc: "You lead the mission. Your ceiling is your team's ceiling.",
  },
]

export default function RoleSelect({ onSelect }) {
  return (
    <motion.div
      className="role-screen hex-grid scanlines"
      variants={screenSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="role-header">
        <h1 className="role-title">IDENTIFY YOUR RANK</h1>
        <p className="role-subtitle">
          Select your current role. This calibrates your mission parameters.
        </p>
      </div>

      <div className="role-grid">
        {ROLES.map((role, i) => (
          <motion.div
            key={role.id}
            className="role-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
            onClick={() => {
              primeAudio()
              playSelect()
              onSelect(role.title)
            }}
          >
            <div className="role-card-title">{role.title}</div>
            <div className="role-card-desc">{role.desc}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
