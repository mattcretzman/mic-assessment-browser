/**
 * Vercel Serverless — emails MIC assessment results to Morgan (AMP).
 * Environment (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY   — required (https://resend.com/api-keys)
 *   RESEND_FROM      — optional, default "MIC Assessment <onboarding@resend.dev>"
 *   NOTIFY_EMAIL     — optional, default mji@ampcreative.io
 *
 * Verify your sending domain in Resend for production; trial may only allow your own inbox until verified.
 */

const DEFAULT_NOTIFY = 'mji@ampcreative.io'

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function subjectSafe(s) {
  return String(s ?? '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[^\w\s\-–—.,:/@()[\]']/gi, '')
    .trim()
    .slice(0, 180)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const key = process.env.RESEND_API_KEY
  const notifyTo = process.env.NOTIFY_EMAIL || DEFAULT_NOTIFY
  const from = process.env.RESEND_FROM || 'MIC Assessment <onboarding@resend.dev>'

  if (!key) {
    res.status(503).json({ error: 'RESEND_API_KEY not configured' })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}')
    } catch {
      res.status(400).json({ error: 'Invalid JSON' })
      return
    }
  }
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Invalid body' })
    return
  }

  const {
    anonymous,
    name,
    email,
    company,
    role,
    archetypeName,
    tierLabel,
    healingScore,
    skillScore,
    aiScore,
    totalScore,
  } = body

  const scoresOk =
    typeof healingScore === 'number' &&
    typeof skillScore === 'number' &&
    typeof aiScore === 'number' &&
    typeof totalScore === 'number'

  if (!scoresOk) {
    res.status(400).json({ error: 'Invalid scores' })
    return
  }

  if (!anonymous && (!name || !email || !company)) {
    res.status(400).json({ error: 'Name, company, and email required' })
    return
  }

  const subName = subjectSafe(anonymous ? 'Anonymous' : name)
  const subArch = subjectSafe(archetypeName || 'Unknown')

  const subject = anonymous
    ? `[MIC] No email — ${subArch} — ${totalScore}/200`
    : `[MIC] ${subName} — ${subArch} — ${totalScore}/200`

  const html = `
    <div style="font-family:system-ui,Segoe UI,sans-serif;line-height:1.5;color:#0a1628;">
      <h2 style="margin:0 0 12px;">MIC Method Assessment</h2>
      <p style="color:#555;margin:0 0 16px;">New submission from the web assessment.</p>
      <table style="border-collapse:collapse;width:100%;max-width:480px;">
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Operator</strong></td><td style="padding:8px;border:1px solid #ddd;">${
          anonymous ? '<em>Skipped email step</em>' : escapeHtml(name)
        }</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd;">${
          anonymous ? '—' : escapeHtml(email)
        }</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Company</strong></td><td style="padding:8px;border:1px solid #ddd;">${
          anonymous ? '—' : escapeHtml(company)
        }</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Role</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(
          role || '—'
        )}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Archetype</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(
          archetypeName || '—'
        )}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Tier</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(
          tierLabel || '—'
        )}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Healing</strong></td><td style="padding:8px;border:1px solid #ddd;">${healingScore}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Skills</strong></td><td style="padding:8px;border:1px solid #ddd;">${skillScore}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>AI</strong></td><td style="padding:8px;border:1px solid #ddd;">${aiScore}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Total</strong></td><td style="padding:8px;border:1px solid #ddd;"><strong>${totalScore} / 200</strong></td></tr>
      </table>
    </div>
  `

  const payload = {
    from,
    to: [notifyTo],
    subject,
    html,
  }

  if (!anonymous && email) {
    payload.reply_to = email
  }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!r.ok) {
    const errText = await r.text()
    console.error('[send-results] Resend error:', r.status, errText)
    res.status(502).json({ error: 'Email provider error', detail: errText.slice(0, 200) })
    return
  }

  const data = await r.json().catch(() => ({}))
  res.status(200).json({ ok: true, id: data.id })
}
