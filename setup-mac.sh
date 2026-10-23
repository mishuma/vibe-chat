#!/bin/bash
# Vibe Chat workshop setup - MAC.
# Run it in Terminal:   bash setup-mac.sh        (Optional: bash setup-mac.sh --dir ~/Documents/vibe-chat --no-open)
#
# What it does: checks the laptop, makes a working folder you choose, copies vibe-chat.html into it,
# and writes a short report (setup-report.txt) you can send back if anything fails.
# What it does NOT do: install software, change system settings, set environment variables, or copy any API key.
# vibe-chat.html is one file that runs in a browser. It needs no packages.
# Safe to run again: an existing folder is reused, an unchanged file is left alone.
# Works with the bash that ships with macOS (3.2).

APP_FILE="vibe-chat.html"
APP_TITLE='<title>Vibe Coding Chat</title>'
KEY_PATTERN='sk-(or|ant)-[A-Za-z0-9_-]{16,}'
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="${VIBE_DIR:-}"
NO_OPEN=0
FAILS=0; WARNS=0
RESULTS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --dir) WORK_DIR="$2"; shift 2 ;;
    --no-open) NO_OPEN=1; shift ;;
    *) echo "Unknown option: $1"; echo "Usage: bash setup-mac.sh [--dir FOLDER] [--no-open]"; exit 2 ;;
  esac
done

if [ -t 1 ]; then RED=$'\033[31m'; GRN=$'\033[32m'; YEL=$'\033[33m'; GRY=$'\033[90m'; CYN=$'\033[36m'; OFF=$'\033[0m'; else RED=; GRN=; YEL=; GRY=; CYN=; OFF=; fi

add() {  # add LEVEL "message" ["fix"]
  local level="$1" msg="$2" fix="${3:-}" col="$GRY"
  case "$level" in PASS) col="$GRN";; WARN) col="$YEL"; WARNS=$((WARNS+1));; FAIL) col="$RED"; FAILS=$((FAILS+1));; esac
  RESULTS+=("[$level] $msg")
  printf '%s[%s] %s%s\n' "$col" "$level" "$msg" "$OFF"
  if [ -n "$fix" ]; then RESULTS+=("       Fix: $fix"); printf '%s       Fix: %s%s\n' "$col" "$fix" "$OFF"; fi
}

finish() {  # finish REPORT_DIR
  local dir="$1"; echo
  if [ "$FAILS" -gt 0 ]; then printf '%sRESULT: %d problem(s) must be fixed before the workshop. Warnings: %d.%s\n' "$RED" "$FAILS" "$WARNS" "$OFF"
  elif [ "$WARNS" -gt 0 ]; then printf '%sRESULT: ready, with %d warning(s). Read the lines marked WARN.%s\n' "$YEL" "$WARNS" "$OFF"
  else printf '%sRESULT: all checks passed. You are ready for the workshop.%s\n' "$GRN" "$OFF"; fi
  if [ -z "$dir" ] || [ ! -d "$dir" ]; then dir="$SCRIPT_DIR"; fi
  if { echo "Vibe Chat setup report - $(date '+%Y-%m-%d %H:%M')"
       echo "Computer: $(hostname)  macOS $(sw_vers -productVersion 2>/dev/null)  $(uname -m)"; echo
       printf '%s\n' "${RESULTS[@]}"; } > "$dir/setup-report.txt" 2>/dev/null; then
    echo "A copy of this report is in: $dir/setup-report.txt"
    [ "$FAILS" -gt 0 ] && echo "If you cannot fix a problem, email that file to the workshop organizer."
  else
    echo "(Could not write the report file in $dir)"
  fi
  [ "$FAILS" -gt 0 ] && exit 1
  exit 0
}

printf '%sVibe Chat - workshop setup (Mac)%s\n\n' "$CYN" "$OFF"

# 1. Operating system
OS="${VIBE_TEST_OS:-$(uname -s)}"     # VIBE_TEST_OS exists only so the script can be tested off a Mac
case "$OS" in
  Darwin) add PASS "macOS $(sw_vers -productVersion 2>/dev/null) on $(uname -m)" ;;
  MINGW*|MSYS*|CYGWIN*) add FAIL "This is Windows, but you ran the Mac script." "Double-click setup-windows.cmd instead."; finish "" ;;
  *) add FAIL "This script supports macOS and Windows only (found: $OS)." "Use a Mac or Windows laptop for the workshop."; finish "" ;;
esac

# 2. The app file next to this script, and no API key inside it
SRC="$SCRIPT_DIR/$APP_FILE"; SRC_OK=0
if [ ! -f "$SRC" ]; then
  add FAIL "Cannot find $APP_FILE next to this script (looked in $SCRIPT_DIR)." "Unzip the whole workshop folder first (double-click the zip), then run the script from inside the unzipped folder."
else
  SIZE=$(wc -c < "$SRC" | tr -d ' ')
  if [ "$SIZE" -lt 50000 ] || ! grep -qF "$APP_TITLE" "$SRC"; then
    add FAIL "$APP_FILE looks incomplete or damaged ($SIZE bytes)." "Download the workshop folder again."
  elif grep -qE "$KEY_PATTERN" "$SRC"; then
    add FAIL "$APP_FILE contains text that looks like an API key. Nothing was copied." "Tell the workshop organizer. Do not share this file. Keys are handed out during the workshop."
  else
    SRC_OK=1; add PASS "$APP_FILE found ($((SIZE/1024)) KB) and contains no API key."
  fi
fi

# 3. Browser. Safari cannot use the camera from a local file, so Chrome or Edge is needed for the QR scan.
BROWSERS=""
for b in "Google Chrome" "Microsoft Edge"; do
  if [ -d "/Applications/$b.app" ] || [ -d "$HOME/Applications/$b.app" ]; then BROWSERS="$BROWSERS${BROWSERS:+, }$b"; fi
done
if [ -n "$BROWSERS" ]; then add PASS "Browser found: $BROWSERS."
else add WARN "Neither Chrome nor Edge was found. Safari and Firefox may block the camera QR scan." "Install Google Chrome (https://www.google.com/chrome). Without it you can still paste the key by hand."; fi

# 4. Camera
CAM="$(system_profiler SPCameraDataType 2>/dev/null)"
if echo "$CAM" | grep -qE 'Model ID|Unique ID'; then add PASS "Camera found."
else add WARN "No camera detected. You will not be able to scan the key QR code." "Check System Settings > Privacy & Security > Camera. Otherwise you can paste the key by hand."; fi

# 5. Internet access to OpenRouter
CODE="$(curl -sS -m 15 -o /dev/null -w '%{http_code}' https://openrouter.ai/api/v1/models 2>/tmp/vibe-curl-err.$$)"
if [ "$CODE" = "200" ]; then add PASS "Can reach openrouter.ai (HTTP 200)."
else add FAIL "Cannot reach openrouter.ai (result: ${CODE:-none} $(tr -d '\n' < /tmp/vibe-curl-err.$$ 2>/dev/null))." "Connect to a network that allows it (try a phone hotspot). On a school or work network, ask IT to allow https://openrouter.ai. Also check any VPN or proxy."; fi
rm -f /tmp/vibe-curl-err.$$

# 6. Working folder
DEFAULT_DIR="$HOME/Documents/vibe-chat"
if [ -z "$WORK_DIR" ]; then
  if [ -t 0 ]; then
    echo; echo "Where should the Vibe Chat working folder be?"
    read -r -p "Press Enter to use $DEFAULT_DIR, or type another folder: " ANS
    WORK_DIR="${ANS:-$DEFAULT_DIR}"
  else WORK_DIR="$DEFAULT_DIR"; fi
fi
case "$WORK_DIR" in "~") WORK_DIR="$HOME";; "~/"*) WORK_DIR="$HOME/${WORK_DIR#\~/}";; esac
WORK_DIR="${WORK_DIR%/}"
WORK_OK=0
if [ -f "$WORK_DIR" ]; then
  add FAIL "$WORK_DIR is a file, not a folder." "Run the script again and choose a different folder name."
elif [ -d "$WORK_DIR" ]; then
  add PASS "Working folder already exists, reusing it: $WORK_DIR"; WORK_OK=1
elif mkdir -p "$WORK_DIR" 2>/tmp/vibe-mkdir-err.$$; then
  add PASS "Created working folder: $WORK_DIR"; WORK_OK=1
else
  add FAIL "Cannot create $WORK_DIR: $(cat /tmp/vibe-mkdir-err.$$)" "Choose a folder inside your home folder, for example ~/Documents/vibe-chat."
fi
rm -f /tmp/vibe-mkdir-err.$$
if [ "$WORK_OK" = 1 ]; then
  PROBE="$WORK_DIR/.write-test-$$"
  if ( : > "$PROBE" ) 2>/dev/null; then rm -f "$PROBE"
  else WORK_OK=0; add FAIL "Cannot write to $WORK_DIR." "Choose a folder you own, such as one inside Documents."; fi
fi

# 7. Copy the app
DEST=""
if [ "$WORK_OK" = 1 ] && [ "$SRC_OK" = 1 ]; then
  DEST="$WORK_DIR/$APP_FILE"
  if [ -f "$DEST" ] && cmp -s "$SRC" "$DEST"; then add PASS "$APP_FILE is already up to date."
  else
    MSG="Copied $APP_FILE into the working folder."
    if [ -f "$DEST" ]; then BAK="$DEST.bak-$(date +%Y%m%d-%H%M%S)"; mv "$DEST" "$BAK" && MSG="Updated $APP_FILE. The previous copy was kept as $(basename "$BAK")."; fi
    if cp "$SRC" "$DEST" 2>/tmp/vibe-cp-err.$$ && cmp -s "$SRC" "$DEST"; then add PASS "$MSG"
    else add FAIL "Could not copy $APP_FILE: $(cat /tmp/vibe-cp-err.$$ 2>/dev/null)" "Check there is free disk space, then run the script again."; DEST=""; fi
    rm -f /tmp/vibe-cp-err.$$
  fi
  [ -n "$DEST" ] && xattr -d com.apple.quarantine "$DEST" 2>/dev/null
fi

# 8. No stray API keys anywhere in the working folder (top level, small text-like files)
if [ "$WORK_OK" = 1 ]; then
  HITS=""
  for f in "$WORK_DIR"/*; do
    [ -f "$f" ] || continue
    case "$f" in *.html|*.htm|*.txt|*.md|*.json|*.env|*.js|*.ts|*.log|*.csv|*.sh|*.command) ;; *) continue ;; esac
    [ "$(wc -c < "$f")" -lt 2097152 ] || continue
    if grep -qE "$KEY_PATTERN" "$f" 2>/dev/null; then HITS="$HITS${HITS:+, }$(basename "$f")"; fi
  done
  if [ -n "$HITS" ]; then add WARN "These files in the working folder look like they contain an API key: $HITS" "Delete the key from those files or delete the files. Do not share them."
  else add PASS "No API keys found in the working folder."; fi
fi

# 9. Environment variables: none are needed.
add INFO "No environment variables or extra packages are needed. The key is pasted or scanned inside the app at the workshop."

# 10. Open the app as a last check
if [ -n "$DEST" ] && [ "$NO_OPEN" = 0 ] && [ -t 0 ]; then
  if open "$DEST" 2>/dev/null; then add INFO 'Opened the app in your browser. You should see "Vibe Coding Chat" with an empty key box. Close it for now.'
  else add WARN "Could not open the app automatically." "Open this file by double-clicking it: $DEST"; fi
fi
finish "$WORK_DIR"
