#!/usr/bin/env bash
# Run this from Terminal on your Mac (not inside a restricted sandbox).
# Prerequisites: GitHub CLI (`brew install gh`), Vercel CLI (`npm i -g vercel`).
set -euo pipefail
cd "$(dirname "$0")"

REPO_NAME="${1:-mic-assessment-browser}"

if [[ ! -d .git ]]; then
  git init -b main
fi

git add -A
if git diff --cached --quiet; then
  echo "Nothing new to commit."
else
  git commit -m "MIC Method assessment — Vite + React"
fi

if ! gh auth status &>/dev/null; then
  echo "Log in to GitHub (opens browser):"
  gh auth login -h github.com
fi

if git remote get-url origin &>/dev/null; then
  echo "Remote origin exists. Pushing..."
  git push -u origin main
else
  echo "Creating GitHub repo: $REPO_NAME (public) and pushing..."
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
fi

echo "Deploy: import the repo at https://vercel.com/new or run:"
echo "  vercel login && cd \"$(pwd)\" && vercel --prod"
if [[ "${DEPLOY_VERCEL:-}" == "1" ]] && command -v vercel &>/dev/null; then
  vercel --prod
fi
