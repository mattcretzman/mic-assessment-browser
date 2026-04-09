import { useState, useCallback } from 'react'
import { isMuted, toggleMute, primeAudio } from '../utils/hudAudio.js'

export default function MuteButton() {
  const [muted, setMuted] = useState(() => isMuted())

  const onToggle = useCallback(() => {
    const nextMuted = toggleMute()
    setMuted(nextMuted)
    if (!nextMuted) primeAudio()
  }, [])

  return (
    <button
      type="button"
      className="mute-btn"
      onClick={onToggle}
      aria-label={muted ? 'Unmute HUD sounds' : 'Mute HUD sounds'}
      title={muted ? 'Sound off — click to enable' : 'Sound on — click to mute'}
    >
      <span className="mute-btn-icon" aria-hidden>
        {muted ? '◇' : '◈'}
      </span>
      <span className="mute-btn-label">{muted ? 'AUDIO OFF' : 'AUDIO ON'}</span>
    </button>
  )
}
