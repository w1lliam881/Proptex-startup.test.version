#!/bin/bash
# Dubbelklicka för att öppna sidan på din Mac.
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Node.js saknas. Installera det från https://nodejs.org (välj LTS) och dubbelklicka igen."
  open "https://nodejs.org"
  read -n 1 -s -r -p "  Tryck valfri tangent för att stänga."
  exit 1
fi
node scripts/start.mjs
