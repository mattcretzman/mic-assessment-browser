/**
 * POST assessment results to Vercel serverless handler → email to Morgan.
 * No-op failure in local Vite dev if /api is unavailable.
 */

function buildPayload({
  anonymous,
  name,
  email,
  role,
  archetypeName,
  tierLabel,
  healingScore,
  skillScore,
  aiScore,
  totalScore,
}) {
  return {
    anonymous: !!anonymous,
    name: name || '',
    email: email || '',
    role: role || '',
    archetypeName: archetypeName || '',
    tierLabel: tierLabel || '',
    healingScore,
    skillScore,
    aiScore,
    totalScore,
  }
}

export async function submitResultsToTeam(fields) {
  const payload = buildPayload(fields)
  const url = '/api/send-results'

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.error || `Submit failed (${res.status})`)
    err.status = res.status
    err.detail = data.detail
    throw err
  }

  return data
}
