#!/usr/bin/env bash
# Starts the dev server on Node 22 via nvm (this Mac's default Node is older).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 22 >/dev/null
exec npm run dev
