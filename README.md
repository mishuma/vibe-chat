# vibe-chat

Single-file browser chat for learning vibe coding. Students use their own OpenRouter key and a chosen model; generated TypeScript appears in a read-only code window with a Copy button. Tracks tokens and spend against a user-set limit. Works with LTR and RTL languages.

## Run (no setup)
Open `vibe-chat.html` in Chrome or Edge. No server, no install. Camera QR scanning needs https or localhost (Chrome usually allows it from a file too).

## Develop (optional)
- Edit `src/app-template.html`, then `python3 build.py` to regenerate `vibe-chat.html`.
- `npm install && npm test` runs the jsdom checks against the built file.
- `vendor/jsQR.lite.min.js` is jsQR 1.4.0 (Apache-2.0), minified, with the Shift-JIS table removed. Kanji-mode QR codes will not decode; API-key QR codes are unaffected.

## Not yet verified against a real key
Streaming, attachments (PDF via OpenRouter file input), key test, QR scan, file downloads, and the assumption that `usage.cost` is in USD.
