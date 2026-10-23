# vibe-chat

Single-file browser chat for learning vibe coding. Students use their own OpenRouter key and a chosen model; generated TypeScript appears in a read-only code window with a Copy button. Tracks tokens and spend against a user-set limit. Works with LTR and RTL languages.

## Run (no setup)
Open `vibe-chat.html` in Chrome or Edge. No server, no install. Camera QR scanning needs https or localhost (Chrome usually allows it from a file too).

## Develop (optional)
- Edit `vibe-chat.html` directly. It is the only source file. The QR decoder (jsQR 1.4.0, minified, Shift-JIS table removed) is the single long `<script>` line near the end; Kanji-mode QR codes will not decode, API-key QR codes are unaffected.
- `npm install && npm test` runs the jsdom checks against it.

## Not yet verified against a real key
Streaming, attachments (PDF via OpenRouter file input), key test, QR scan, file downloads, and the assumption that `usage.cost` is in USD.

## Cost board (instructor projector view)
`cost-board.html` shows, in large type for a projector, how much money one OpenRouter key has left and how much the class has spent, updating every few seconds while students use the key.

1. On openrouter.ai, create a **management key** at Settings → Management Keys (openrouter.ai/settings/management-keys). A regular API key will not work.
2. Open `cost-board.html` in Chrome or Edge, paste the management key, click **Show keys**, then click the key the class is using.
3. Press **F** for full screen. **T** switches light/dark (use light in bright rooms), **Esc** goes back to the key list.

**Hebrew and shekels:** at the top of the setup screen, set **Language** to עברית and/or **Currency** to Israeli new shekels. The two are independent. Hebrew switches the student-facing text and turns the layout right-to-left; the instructor notes stay in English. OpenRouter bills in dollars, so shekel amounts use an exchange rate: the page fetches the European Central Bank rate (via frankfurter.dev, no key needed) when you pick shekels, and you can type your own instead. The board shows which rate it is using at the bottom. If the rate cannot be fetched and none is typed, the board will not start in shekels.

The management key can create and delete every key in the workspace. The page never displays it and keeps it only in that browser tab unless you tick "Remember", so leave that unticked on shared computers. The board only reads keys and never changes them.

Optional detail: it polls `GET /api/v1/keys/{hash}` and shows `limit_remaining` (or `usage` if the key has no limit). "Spent this class" counts from when the board opened; each jump is usually one request, but requests landing in the same poll interval merge into one jump. Tests: `node cost-board.test.js`.

## License

MIT (see `LICENSE`). The QR decoder inlined in `vibe-chat.html` is jsQR, Apache-2.0 (see `NOTICE-jsQR.txt`).
