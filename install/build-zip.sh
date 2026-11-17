#!/bin/bash
# Rebuilds vibe-chat-workshop.zip (the bundle sent to students) from the current files.
# Run from anywhere: bash install/build-zip.sh. Run it after changing vibe-chat.html or anything in install/.
set -euo pipefail
repo="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
dir="$tmp/vibe-chat-workshop"; mkdir "$dir"
cp "$repo/vibe-chat.html" "$repo/LICENSE" "$repo/NOTICE-jsQR.txt" \
   "$repo/install/SETUP.txt" "$repo/install/setup-mac.sh" "$repo/install/setup-windows.cmd" "$repo/install/setup-windows.ps1" "$dir/"
(cd "$tmp" && zip -qrX vibe-chat-workshop.zip vibe-chat-workshop)
cp "$tmp/vibe-chat-workshop.zip" "$repo/vibe-chat-workshop.zip"
echo "Built $repo/vibe-chat-workshop.zip"
