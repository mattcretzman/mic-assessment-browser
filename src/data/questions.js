// Short-form MIC: 10 + 10 + 10 — highest-signal items only.
// Max scores: Healing 100 (10×10), Skill 50 (10×5), AI 50 (10×5) → 200 total.

export const MAX_HEALING = 100
export const MAX_SKILL = 50
export const MAX_AI = 50
export const MAX_TOTAL = MAX_HEALING + MAX_SKILL + MAX_AI

export const healingCircleQuestions = [
  {
    id: 'h1',
    category: 'HEALTH / FITNESS',
    question: 'How would you rate your physical health and energy right now?',
    description:
      "Your body is the engine. No energy, no edge. A rep running on empty can't show up magnetic.",
    scale: 10,
  },
  {
    id: 'h2',
    category: 'FINANCES',
    question: 'How would you rate how you feel about your financial situation?',
    description:
      'Not just what you earn — how you feel about money. Financial stress leaks into every call.',
    scale: 10,
  },
  {
    id: 'h3',
    category: 'RELATIONSHIPS',
    question: 'How would you rate the depth and quality of your relationships?',
    description: "Depth over width. Your circle determines your ceiling.",
    scale: 10,
  },
  {
    id: 'h4',
    category: 'CAREER / MISSION',
    question: "How much do you believe in the work you're doing right now?",
    description:
      "Reps who don't believe in the mission can't make buyers believe either.",
    scale: 10,
  },
  {
    id: 'h5',
    category: 'MINDSET / ATTITUDE',
    question: "How would you rate how you talk to yourself when no one's watching?",
    description: 'The OS everything runs on. Your inner voice becomes your cold call voice.',
    scale: 10,
  },
  {
    id: 'h6',
    category: 'SPIRITUALITY',
    question: 'How connected are you to something bigger than your quota?',
    description: 'What anchors you when rejection hits daily?',
    scale: 10,
  },
  {
    id: 'h7',
    category: 'FUN',
    question: 'How much joy and fun do you have in your life right now?',
    description: "If work is all you have — the circle is broken. The best reps don't grind. They play.",
    scale: 10,
  },
  {
    id: 'h8',
    category: 'SLEEP & RECOVERY',
    question: 'How rested and recovered do you feel most days?',
    description: 'Outbound is a volume game. Recovery is part of performance.',
    scale: 10,
  },
  {
    id: 'h9',
    category: 'STRESS UNDER PRESSURE',
    question: 'How well do you handle stress when pipeline or performance dips?',
    description: 'Buyers feel desperation and calm at the same volume.',
    scale: 10,
  },
  {
    id: 'h10',
    category: 'BOUNDARIES',
    question: 'How clean are your boundaries between work and the rest of your life?',
    description: 'Blurry boundaries leak into tone, timing, and follow-through.',
    scale: 10,
  },
]

export const skillQuestions = [
  {
    id: 'sk1',
    category: 'COLD CALLING',
    question: 'I handle objections and early resistance without panicking or giving up the call.',
    scale: 5,
  },
  {
    id: 'sk2',
    category: 'COLD CALLING',
    question: 'I can keep a prospect on the phone past the first 10 seconds.',
    scale: 5,
  },
  {
    id: 'sk3',
    category: 'LINKEDIN',
    question: 'I use LinkedIn as a pipeline tool — not just a profile page.',
    scale: 5,
  },
  {
    id: 'sk4',
    category: 'EMAIL',
    question: 'I personalize every email with a specific observation — not a template.',
    scale: 5,
  },
  {
    id: 'sk5',
    category: 'FOLLOW UP',
    question: 'I follow up more than twice without feeling like I\'m being annoying.',
    scale: 5,
  },
  {
    id: 'sk6',
    category: 'MULTI-CHANNEL',
    question: 'I coordinate LinkedIn, phone, and email together — not as separate silos.',
    scale: 5,
  },
  {
    id: 'sk7',
    category: 'TIME MANAGEMENT',
    question: 'I have a set outbound block every day that I protect from admin and noise.',
    scale: 5,
  },
  {
    id: 'sk8',
    category: 'CONTENT',
    question: 'I know what to post that builds credibility with my buyers.',
    scale: 5,
  },
  {
    id: 'sk9',
    category: 'VIDEO',
    question: 'I send personalized video messages to prospects as part of my outreach.',
    scale: 5,
  },
  {
    id: 'sk10',
    category: 'NEXT STEPS',
    question: 'I know how to end outreach touches with a clear next step.',
    scale: 5,
  },
]

export const aiQuestions = [
  {
    id: 'a1',
    category: 'AWARENESS',
    question: 'I understand the difference between using AI for research vs. using it to write for me.',
    scale: 5,
  },
  {
    id: 'a2',
    category: 'AWARENESS',
    question: 'I know what AI cannot do in outbound — and where the human has to take over.',
    scale: 5,
  },
  {
    id: 'a3',
    category: 'APPLICATION',
    question: 'I use AI as part of my daily outbound workflow — not just occasionally.',
    scale: 5,
  },
  {
    id: 'a4',
    category: 'APPLICATION',
    question: 'I use AI to research a prospect before I reach out — not after.',
    scale: 5,
  },
  {
    id: 'a5',
    category: 'APPLICATION',
    question: 'I use AI to find buying signals and triggers — not just to write messages.',
    scale: 5,
  },
  {
    id: 'a6',
    category: 'APPLICATION',
    question: 'I have a repeatable AI workflow that saves me time every single day.',
    scale: 5,
  },
  {
    id: 'a7',
    category: 'DISCERNMENT',
    question: 'I personalize every AI-drafted message before it goes out — I never copy paste.',
    scale: 5,
  },
  {
    id: 'a8',
    category: 'DISCERNMENT',
    question: 'I can tell when an outreach message sounds AI-generated and I fix it before sending.',
    scale: 5,
  },
  {
    id: 'a9',
    category: 'PROMPTING',
    question: 'I give AI specific context before asking it to write — company, person, pain, channel.',
    scale: 5,
  },
  {
    id: 'a10',
    category: 'PROMPTING',
    question: 'I treat AI like a thinking partner — not a copy machine.',
    scale: 5,
  },
]

export const MISSIONS = [
  {
    id: 0,
    number: '01',
    label: 'THE HEALING CIRCLE',
    title: 'OPERATOR READINESS',
    description:
      "Your pipeline problem might not be a skill problem. It might be an inner problem. Ten questions. Be honest.",
    maxScore: MAX_HEALING,
    questions: healingCircleQuestions,
  },
  {
    id: 1,
    number: '02',
    label: 'SKILL DIAGNOSTIC',
    title: 'COMBAT PROFICIENCY',
    description: 'The moves that actually fill pipeline. Ten questions. No fluff.',
    maxScore: MAX_SKILL,
    questions: skillQuestions,
  },
  {
    id: 2,
    number: '03',
    label: 'AI READINESS CHECK',
    title: 'SYSTEMS INTEGRATION',
    description: 'AI accelerates the human — if you use it like a weapon. Ten questions.',
    maxScore: MAX_AI,
    questions: aiQuestions,
  },
]
