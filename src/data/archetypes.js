export const ARCHETYPES = {
  THE_GHOST: {
    key: 'THE_GHOST',
    name: 'THE GHOST',
    subtitle: 'Invisible to buyers. Invisible to yourself.',
    description:
      'The foundation needs building. You know exactly what needs to change — and that self-awareness is your biggest asset right now.',
    color: '#6a8aaa',
    weakness: 'All three pillars need attention',
    strength: "You're here. That's already different.",
  },
  THE_HUSTLER: {
    key: 'THE_HUSTLER',
    name: 'THE HUSTLER',
    subtitle: 'High output. Hidden ceiling.',
    description:
      "You're grinding hard and leaving energy on the table. The ceiling isn't your calendar. It's your Healing Circle. Fix the foundation and watch the numbers change.",
    color: '#ff6a00',
    weakness: 'Inner game and AI integration',
    strength: 'Execution and skill execution',
  },
  THE_THINKER: {
    key: 'THE_THINKER',
    name: 'THE THINKER',
    subtitle: 'Strong mindset. Inconsistent execution.',
    description:
      "You've got the mindset locked in and you understand the tools. The gap is converting that into consistent pipeline. Execution is the cheat code you haven't fully activated yet.",
    color: '#00b4ff',
    weakness: 'Skill execution consistency',
    strength: 'Mindset and AI awareness',
  },
  THE_NATURAL: {
    key: 'THE_NATURAL',
    name: 'THE NATURAL',
    subtitle: 'Strong foundation. AI is your multiplier.',
    description:
      "Your foundation is solid and your skills are producing. AI is going to 10x what's already working — but only if you stop using it as a copy machine.",
    color: '#00e5ff',
    weakness: 'AI integration depth',
    strength: 'Human foundation and outbound skills',
  },
  THE_MACHINE: {
    key: 'THE_MACHINE',
    name: 'THE MACHINE',
    subtitle: "Efficient. But efficiency isn't magnetic.",
    description:
      "You're running a tight operation — strong skills, strong AI usage. But buyers can feel when the human left the building. The Healing Circle is where your edge is hiding.",
    color: '#9b59b6',
    weakness: 'Whole-person foundation',
    strength: 'Technical skills and AI execution',
  },
  THE_MAGNETIC_SELLER: {
    key: 'THE_MAGNETIC_SELLER',
    name: 'THE MAGNETIC SELLER',
    subtitle: 'This is what it looks like when it all comes together.',
    description:
      'You show up whole. You execute with precision. You use AI as a thinking partner. This is the target state. Now help someone else get here.',
    color: '#00ff8c',
    weakness: 'Keep raising the floor',
    strength: "Everything — and you know it",
  },
}

// Totals are out of 200 (100 + 50 + 50). Thresholds mirror the original PDF bands (~30% / 54% / 72% / 100%).
export const SCORE_TIERS = [
  { max: 60, tier: 'EARLY STAGE', color: '#ff3c3c', description: 'The foundation is being laid. Every expert was here once. The fact that you\'re measuring means you\'re already ahead of most.' },
  { max: 108, tier: 'DEVELOPING', color: '#ffb800', description: 'You have real skills. Now it\'s about consistency, compounding, and closing the gaps you just identified.' },
  { max: 144, tier: 'COMPETENT', color: '#00b4ff', description: 'You are producing. The question now is: are you performing at your ceiling, or just comfortable? This is where growth stalls for most.' },
  { max: 200, tier: 'MAGNETIC', color: '#00ff8c', description: 'You are operating at an elite level. Pipeline is a byproduct of who you are. Now go build a team around this.' },
]

export function getTier(score) {
  return SCORE_TIERS.find((t) => score <= t.max) || SCORE_TIERS[SCORE_TIERS.length - 1]
}

export function getArchetype(healingScore, skillScore, aiScore) {
  const healingPct = healingScore / 100
  const skillPct = skillScore / 50
  const aiPct = aiScore / 50
  const avg = (healingPct + skillPct + aiPct) / 3

  if (avg < 0.35) return ARCHETYPES.THE_GHOST
  if (skillPct > 0.75 && healingPct < 0.55 && aiPct < 0.55) return ARCHETYPES.THE_HUSTLER
  if (healingPct > 0.7 && aiPct > 0.6 && skillPct < 0.55) return ARCHETYPES.THE_THINKER
  if (healingPct > 0.7 && skillPct > 0.7 && aiPct < 0.55) return ARCHETYPES.THE_NATURAL
  if (aiPct > 0.7 && skillPct > 0.7 && healingPct < 0.55) return ARCHETYPES.THE_MACHINE
  if (healingPct >= 0.7 && skillPct >= 0.7 && aiPct >= 0.7) return ARCHETYPES.THE_MAGNETIC_SELLER

  // Default to highest scoring area
  if (skillPct >= healingPct && skillPct >= aiPct) return ARCHETYPES.THE_HUSTLER
  if (healingPct >= skillPct && healingPct >= aiPct) return ARCHETYPES.THE_THINKER
  return ARCHETYPES.THE_NATURAL
}
