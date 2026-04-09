import { healingCircleQuestions, skillQuestions, aiQuestions } from '../data/questions.js'

const HEALING_IDS = healingCircleQuestions.map((q) => q.id)
const SKILL_IDS = skillQuestions.map((q) => q.id)
const AI_IDS = aiQuestions.map((q) => q.id)

export function calcHealingScore(answers) {
  return HEALING_IDS.reduce((sum, id) => sum + (answers[id] || 0), 0)
}

export function calcSkillScore(answers) {
  return SKILL_IDS.reduce((sum, id) => sum + (answers[id] || 0), 0)
}

export function calcAiScore(answers) {
  return AI_IDS.reduce((sum, id) => sum + (answers[id] || 0), 0)
}

export function getMissionScore(missionIndex, answers) {
  if (missionIndex === 0) return calcHealingScore(answers)
  if (missionIndex === 1) return calcSkillScore(answers)
  if (missionIndex === 2) return calcAiScore(answers)
  return 0
}

export function getMissionRead(missionIndex, score, max) {
  const pct = score / max
  if (missionIndex === 0) {
    if (pct < 0.4) return "The inner game needs work. That's the real pipeline problem."
    if (pct < 0.65) return "There's foundation here — and real gaps worth addressing."
    if (pct < 0.85) return 'Strong inner game. Your mindset is an asset in the field.'
    return "The circle is full. You show up whole. That's rare."
  }
  if (missionIndex === 1) {
    if (pct < 0.4) return 'Skills are the gap. These are learnable. The path is clear.'
    if (pct < 0.6) return 'Real skill in some areas. Fix the weak links.'
    if (pct < 0.8) return 'Solid execution. Optimize your best channels now.'
    return "Elite execution. You're operating at the top of the skill curve."
  }
  if (missionIndex === 2) {
    if (pct < 0.4) return 'AI is an untapped multiplier. The reps who learn this win.'
    if (pct < 0.6) return "You're aware of AI — but not fully weaponizing it yet."
    if (pct < 0.8) return "Strong AI integration. You're ahead of most of your competition."
    return "AI-native seller. You're already playing the game ahead of the curve."
  }
  return ''
}
