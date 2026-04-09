/**
 * Procedural sci-fi HUD sounds (Web Audio API) — inspired by classic FPS HUDs.
 * No copyrighted game audio; all synthesized in-browser.
 */

let ctx = null
let master = null
let noiseBuffer = null

function getMuted() {
  try {
    return localStorage.getItem('mic-audio-muted') === '1'
  } catch {
    return false
  }
}

export function isMuted() {
  return getMuted()
}

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.28
    master.connect(ctx.destination)
  }
  return ctx
}

/**
 * Must run synchronously inside pointer / click / keydown handlers (same call stack as the user gesture).
 * Browsers block Web Audio until then; using await or .then() after the gesture ends keeps output silent.
 */
export function primeAudio() {
  if (typeof window === 'undefined') return
  if (getMuted()) return
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') {
    void c.resume()
  }
}

/** Sync unlock — prefer primeAudio() at the start of event handlers. */
export function unlockAudio() {
  primeAudio()
}

function now() {
  const c = getCtx()
  return c ? c.currentTime : 0
}

function connectToMaster(node) {
  if (!master || getMuted()) return
  node.connect(master)
}

/** Short UI tick */
export function playBlip(freq = 880, dur = 0.04) {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g)
  connectToMaster(g)
  o.start(t)
  o.stop(t + dur + 0.02)
}

/** Boot sequence line */
export function playBootLine(type = 'normal') {
  if (type === 'warning') {
    playBlip(420, 0.06)
    setTimeout(() => playBlip(380, 0.05), 60)
    return
  }
  if (type === 'ready') {
    playPowerUp()
    return
  }
  playBlip(660 + Math.random() * 40, 0.035)
}

/** Rising "shields charging" feel */
export function playShieldTick(step = 0) {
  const base = 520 + step * 35
  playBlip(base, 0.03)
}

/** Menu / option select */
export function playSelect() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(180, t)
  o.frequency.exponentialRampToValueAtTime(520, t + 0.06)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.1, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
  o.connect(g)
  connectToMaster(g)
  o.start(t)
  o.stop(t + 0.12)
}

/** Rating number chosen — pitch scales with commitment */
export function playCommit(value, max = 5) {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const f0 = 320 + (value / max) * 480
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'square'
  o.frequency.setValueAtTime(f0 * 0.6, t)
  o.frequency.exponentialRampToValueAtTime(f0, t + 0.05)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.06, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 2400
  o.connect(filter)
  filter.connect(g)
  connectToMaster(g)
  o.start(t)
  o.stop(t + 0.15)
}

function getNoiseBuffer() {
  const c = getCtx()
  if (!c) return null
  if (noiseBuffer) return noiseBuffer
  const len = c.sampleRate * 0.4
  const buffer = c.createBuffer(1, len, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  noiseBuffer = buffer
  return noiseBuffer
}

/** Slide / screen transition */
export function playWhoosh() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const src = c.createBufferSource()
  const buf = getNoiseBuffer()
  if (!buf) return
  src.buffer = buf
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(800, t)
  filter.frequency.exponentialRampToValueAtTime(2200, t + 0.12)
  filter.Q.value = 0.7
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.07, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
  src.connect(filter)
  filter.connect(g)
  connectToMaster(g)
  src.start(t)
  src.stop(t + 0.2)
}

/** Mission intro countdown */
export function playCountdown(tick = 3) {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const freq = tick <= 1 ? 280 : 420
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(tick <= 1 ? 0.18 : 0.1, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + tick <= 1 ? 0.35 : 0.15)
  o.connect(g)
  connectToMaster(g)
  o.start(t)
  o.stop(t + 0.4)
}

/** Section / mission complete */
export function playMissionComplete() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(freq, t + i * 0.07)
    g.gain.setValueAtTime(0.0001, t + i * 0.07)
    g.gain.exponentialRampToValueAtTime(0.05, t + i * 0.07 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.2)
    const f = c.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 2800
    o.connect(f)
    f.connect(g)
    connectToMaster(g)
    o.start(t + i * 0.07)
    o.stop(t + i * 0.07 + 0.25)
  })
}

/** System online / begin */
export function playPowerUp() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  ;[
    { f: 130.81, d: 0.15 },
    { f: 164.81, d: 0.15 },
    { f: 196.0, d: 0.2 },
  ].forEach((note, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'triangle'
    o.frequency.setValueAtTime(note.f, t + i * 0.06)
    g.gain.setValueAtTime(0.0001, t + i * 0.06)
    g.gain.exponentialRampToValueAtTime(0.1, t + i * 0.06 + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.06 + note.d)
    o.connect(g)
    connectToMaster(g)
    o.start(t + i * 0.06)
    o.stop(t + i * 0.06 + note.d + 0.05)
  })
}

/** Archetype scan line */
export function playScanPulse() {
  playBlip(1200, 0.02)
}

/** Big reveal */
export function playRevealSting() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(220, t)
  o.frequency.exponentialRampToValueAtTime(880, t + 0.35)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.09, t + 0.05)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
  o.connect(g)
  connectToMaster(g)
  o.start(t)
  o.stop(t + 0.5)
}

/** Results screen impact */
export function playReportOpen() {
  playWhoosh()
  setTimeout(() => playBlip(440, 0.08), 40)
}

export function setMuted(muted) {
  try {
    localStorage.setItem('mic-audio-muted', muted ? '1' : '0')
  } catch {
    /* ignore */
  }
}

export function toggleMute() {
  const next = !getMuted()
  setMuted(next)
  return next
}
