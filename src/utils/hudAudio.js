/**
 * Procedural sci-fi HUD sounds (Web Audio API) — inspired by classic FPS HUDs.
 * No copyrighted game audio; all synthesized in-browser.
 */

let ctx = null
let master = null
let noiseBuffer = null

/** Cycles menu / button clicks: reload → MG → shield → rocket */
let uiClickVariant = 0

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

/** Short bandpassed noise burst — metal, shells, air */
function noiseBurst(t0, { dur = 0.04, freq = 2000, q = 2.5, peak = 0.09 }) {
  const c = getCtx()
  if (!c || getMuted()) return
  const src = c.createBufferSource()
  const buf = getNoiseBuffer()
  if (!buf) return
  src.buffer = buf
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(freq, t0)
  filter.Q.value = q
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(filter)
  filter.connect(g)
  connectToMaster(g)
  src.start(t0, 0, dur + 0.02)
  src.stop(t0 + dur + 0.03)
}

/** Magazine seat + rack (FPS reload click) */
function playMagReloadClick() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  noiseBurst(t, { dur: 0.028, freq: 2400, q: 3, peak: 0.085 })
  noiseBurst(t + 0.052, { dur: 0.022, freq: 1800, q: 2.2, peak: 0.07 })
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(110, t + 0.05)
  g.gain.setValueAtTime(0.0001, t + 0.05)
  g.gain.exponentialRampToValueAtTime(0.11, t + 0.056)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
  o.connect(g)
  connectToMaster(g)
  o.start(t + 0.05)
  o.stop(t + 0.1)
}

/** Short automatic burst */
function playMachineGunTap() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const pulses = 6
  for (let i = 0; i < pulses; i++) {
    const o = c.createOscillator()
    const g = c.createGain()
    const bp = c.createBiquadFilter()
    o.type = 'square'
    o.frequency.setValueAtTime(165 + i * 8, t + i * 0.011)
    bp.type = 'bandpass'
    bp.frequency.value = 1100
    bp.Q.value = 1.2
    g.gain.setValueAtTime(0.0001, t + i * 0.011)
    g.gain.exponentialRampToValueAtTime(0.055, t + i * 0.011 + 0.002)
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.011 + 0.014)
    o.connect(bp)
    bp.connect(g)
    connectToMaster(g)
    o.start(t + i * 0.011)
    o.stop(t + i * 0.011 + 0.02)
  }
}

/** Shield charge / power-up ping */
function playShieldActivateTap() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const o = c.createOscillator()
  const g = c.createGain()
  const f = c.createBiquadFilter()
  o.type = 'triangle'
  o.frequency.setValueAtTime(380, t)
  o.frequency.exponentialRampToValueAtTime(1400, t + 0.07)
  f.type = 'lowpass'
  f.frequency.value = 3200
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.1, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11)
  o.connect(f)
  f.connect(g)
  connectToMaster(g)
  o.start(t)
  o.stop(t + 0.13)
  noiseBurst(t + 0.04, { dur: 0.035, freq: 5200, q: 4, peak: 0.04 })
}

/** Rocket tube / arming whoosh */
function playRocketTap() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const src = c.createBufferSource()
  const buf = getNoiseBuffer()
  if (!buf) return
  src.buffer = buf
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(4200, t)
  filter.frequency.exponentialRampToValueAtTime(450, t + 0.14)
  filter.Q.value = 0.85
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.09, t + 0.025)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
  src.connect(filter)
  filter.connect(g)
  connectToMaster(g)
  src.start(t, 0, 0.18)
  src.stop(t + 0.2)
  const o = c.createOscillator()
  const g2 = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(95, t)
  o.frequency.exponentialRampToValueAtTime(45, t + 0.12)
  g2.gain.setValueAtTime(0.0001, t)
  g2.gain.exponentialRampToValueAtTime(0.08, t + 0.02)
  g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
  o.connect(g2)
  connectToMaster(g2)
  o.start(t)
  o.stop(t + 0.16)
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
  const c = getCtx()
  if (!c || getMuted()) return
  const base = 520 + step * 35
  const t = now()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(base * 0.85, t)
  o.frequency.exponentialRampToValueAtTime(base * 1.15, t + 0.04)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.08, t + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
  o.connect(g)
  connectToMaster(g)
  o.start(t)
  o.stop(t + 0.07)
}

/** Menu / option select — rotates reload / MG / shield / rocket */
export function playSelect() {
  if (getMuted()) return
  const kinds = [playMagReloadClick, playMachineGunTap, playShieldActivateTap, playRocketTap]
  kinds[uiClickVariant % kinds.length]()
  uiClickVariant++
}

/**
 * Rating chosen — quartile maps to weapon metaphor (low → reload … high → rocket).
 */
export function playCommit(value, max = 5) {
  if (getMuted()) return
  const ratio = max <= 1 ? 1 : (value - 1) / (max - 1)
  const q = Math.min(3, Math.floor(ratio * 4))
  if (q === 0) playMagReloadClick()
  else if (q === 1) playMachineGunTap()
  else if (q === 2) playShieldActivateTap()
  else playRocketTap()
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

/** System online / begin — shield full charge + power stinger */
export function playPowerUp() {
  const c = getCtx()
  if (!c || getMuted()) return
  const t = now()
  const src = c.createBufferSource()
  const buf = getNoiseBuffer()
  if (buf) {
    src.buffer = buf
    const nf = c.createBiquadFilter()
    nf.type = 'bandpass'
    nf.frequency.setValueAtTime(400, t)
    nf.frequency.exponentialRampToValueAtTime(2800, t + 0.22)
    nf.Q.value = 0.6
    const ng = c.createGain()
    ng.gain.setValueAtTime(0.0001, t)
    ng.gain.exponentialRampToValueAtTime(0.055, t + 0.04)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
    src.connect(nf)
    nf.connect(ng)
    connectToMaster(ng)
    src.start(t, 0, 0.3)
    src.stop(t + 0.32)
  }
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
  setTimeout(() => {
    if (getMuted()) return
    noiseBurst(now(), { dur: 0.045, freq: 1900, q: 2.8, peak: 0.07 })
  }, 40)
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
