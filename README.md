# vibe-chat

Single-file browser chat for learning vibe coding. Students use their own OpenRouter key and a chosen model; generated TypeScript appears in a read-only code window with a Copy button. Tracks tokens and spend against a user-set limit. Works with LTR and RTL languages.

## Run (no setup)
Open `vibe-chat.html` in Chrome or Edge. No server, no install. Camera QR scanning needs https or localhost (Chrome usually allows it from a file too).

## Develop (optional)
- Edit `vibe-chat.html` directly. It is the only source file. The QR decoder (jsQR 1.4.0, minified, Shift-JIS table removed) is the single long `<script>` line near the end; Kanji-mode QR codes will not decode, API-key QR codes are unaffected.
- `npm install && npm test` runs the jsdom checks against it.

## Not yet verified against a real key
Streaming, attachments (PDF via OpenRouter file input), key test, QR scan, file downloads, and the assumption that `usage.cost` is in USD.

## License

MIT (see `LICENSE`). The QR decoder inlined in `vibe-chat.html` is jsQR, Apache-2.0 (see `NOTICE-jsQR.txt`).
