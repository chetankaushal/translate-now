#!/usr/bin/env bash
# Creates the GitHub repos for the portfolio in one pass.
#
# This is the only manual step in the whole pipeline. Run it once:
#   gh auth login
#   ./scripts/bootstrap-repos.sh <your-github-org-or-username>
#
# Repos are created public by default — macOS runners are free on public
# repos and bill at a 10x minute multiplier on private ones. Pass
# VISIBILITY=private if you need them closed.

set -euo pipefail

OWNER="${1:?usage: bootstrap-repos.sh <github-owner>}"
VISIBILITY="${VISIBILITY:-public}"

APPS=(
  translate-now
  calculator-air
  scanner-air
  translator-keyboard
  find-air
  speech-air
  oweme
)

command -v gh >/dev/null || { echo "gh CLI not found: https://cli.github.com"; exit 1; }

for app in "${APPS[@]}"; do
  if gh repo view "$OWNER/$app" >/dev/null 2>&1; then
    echo "skip  $OWNER/$app (already exists)"
    continue
  fi
  gh repo create "$OWNER/$app" "--$VISIBILITY" \
    --description "React Native — $app" \
    --disable-wiki
  echo "created $OWNER/$app"
done

echo
echo "Done. To push this project:"
echo "  git init && git add -A && git commit -m 'Initial commit'"
echo "  git branch -M main"
echo "  git remote add origin git@github.com:$OWNER/translate-now.git"
echo "  git push -u origin main"
