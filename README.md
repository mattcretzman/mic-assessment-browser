# MIC Method Assessment (browser)

Interactive MIC Method assessment built with **Vite** and **React**. Styled as a sci-fi HUD experience with procedural sound (Web Audio). Results can be emailed to Morgan’s team via **Resend** on **Vercel**.

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm**

## Local development

```bash
cd mic-assessment-browser
npm install
npm run dev
```

Open the URL Vite prints (often `http://localhost:5173`). The dev server may use another port if the default is busy (see `vite.config.js`).

## Production build

```bash
npm run build
npm run preview
```

Output is written to `dist/`.

## Environment variables (Vercel)

Set these in the Vercel project under **Settings → Environment Variables** (use **Production** and **Preview** as needed). See `.env.example` for names.

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes (for email) | API key from [Resend](https://resend.com/api-keys). Without it, `/api/send-results` returns 503 and the UI still continues. |
| `RESEND_FROM` | No | Sender, e.g. `MIC Assessment <notify@yourdomain.com>`. Defaults to Resend’s onboarding sender until you verify a domain. |
| `NOTIFY_EMAIL` | No | Where submissions go. Defaults to **mji@ampcreative.io**. |

Redeploy after changing env vars.

## Deploy (Vercel CLI)

From this folder, logged in (`vercel login`):

```bash
vercel --prod --yes
```

First time in this directory, run `vercel link` and choose the existing project if prompted.

## GitHub

Remote repo: `mattcretzman/mic-assessment-browser` (push from this folder after `git init` / `git remote` if you use a copy).

## Sound and HUD audio

Browsers block audio until a **user gesture** (click/tap). The app calls `primeAudio()` on interaction and uses a one-time pointer listener so timer-based effects work after the first tap. If you hear nothing, check the **AUDIO ON** control (bottom-right), tab mute, and system volume.

## Serverless API

`api/send-results.js` runs on Vercel only. It is not used by `npm run dev` alone; use `vercel dev` if you need to exercise the API locally with env vars loaded.
