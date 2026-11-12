# vibe-chat

Single-file browser chat for learning vibe coding. Students use their own OpenRouter key and a chosen model; generated code appears in a read-only code window with Copy and Save buttons, and other files the model makes (Markdown, CSV, SVG images, JSON, HTML) wait in a Files tab until you save them. Tracks tokens and spend against a user-set limit. Works with LTR and RTL languages.

## Run (no setup)
Open `vibe-chat.html` in Chrome or Edge. No server, no install. Camera QR scanning needs https or localhost (Chrome usually allows it from a file too).

## Develop (optional)
- Edit `vibe-chat.html` directly. It is the only source file. The QR decoder (jsQR 1.4.0, minified, Shift-JIS table removed) is the single long `<script>` line near the end; Kanji-mode QR codes will not decode, API-key QR codes are unaffected.
- Tests (jsdom, run from the repo root):
  ```
  npm install --no-save jsdom@26
  node test.js && node dashboard/cost-board.test.js && node test-voice.js && node test-artifacts.js
  ```

## Repo layout
| Path | What it is |
|---|---|
| `vibe-chat.html` | The app. |
| `Intent-Based Development Teacher's Guide.md`, `Intent-Based Development Student Guide.md` | Guides for the vibe-chat module: workflow, classroom setup, and teaching notes. Start with the Teacher's Guide. |
| `activities/` | Swappable activity guides that run inside vibe-chat (currently Cutebot Explorer, teacher and student versions). |
| `install/` | Pre-workshop setup scripts for students' laptops (`setup-windows.cmd`, `setup-mac.sh`) and `SETUP.txt`, the plain-language instructions to send with them. |
| `dashboard/` | `cost-board.html`, the instructor projector view, and its tests. |
| `tools/` | `qr-key.html`, which turns API keys into QR codes for students to scan. See `tools/README.md`. |
| `vibe-chat-workshop.zip` | Distributable bundle: the app plus the install scripts. Git-ignored, so rebuild it after changing `vibe-chat.html` or `install/`. |

## Before a workshop
1. Send students `SETUP.txt` and the zip (or the `install/` scripts plus `vibe-chat.html`). They run the setup script, which checks browser, camera and access to openrouter.ai, and copies the app into a folder.
2. Create one OpenRouter key per student, with a spending limit. Turn the keys into QR codes with `tools/qr-key.html`.
3. On the day, project the cost board (below) so you can see spend per key.

## Settings and Files
**Code language and extra instructions (Settings).** The default is TypeScript. Pick Python, JavaScript, or "Let the model choose", and optionally add your own instructions (up to 4,000 characters). Both are added to the system prompt, and your instructions take priority over the built-in ones. "Show the exact system prompt" displays what is sent. Settings are remembered in this browser.

**Comments and code colors (Settings).** "Add plenty of comments to the code" is on by default: the model is asked to comment generously in the style of the chosen language (`//` and `/** */` for TypeScript and JavaScript, `#` and docstrings for Python). Turn it off for shorter code. "Code colors" picks Dark+ (default), Light+ or High Contrast, using the Visual Studio Code palettes, for TypeScript, JavaScript, Python and Markdown (Markdown files in the Files tab are colored too). Other languages are shown plain. Colors only change how the code looks: Copy and Save use the plain text. Both settings are remembered in this browser.

**Chat layout.** Your messages are always on the left and the assistant's are always on the right, in English and Hebrew alike. Inside each bubble the text runs left-to-right or right-to-left according to its own language.

**Files tab.** When the model makes a file (`.md`, `.txt`, `.csv`, `.json`, `.svg`, `.html`), it appears as a card in the Files tab with a preview. Nothing is written to your computer until you press Save, so the operating system's file rules are never bypassed:
- **Save** opens the browser's own save dialog (Chrome and Edge). In Safari and Firefox it downloads the file to your Downloads folder instead.
- **Choose save folder** (Chrome and Edge only) lets you pick one folder once; Save then writes straight into it. Chrome will not accept Documents, Desktop, Downloads or your home folder themselves ("contains system files"), so make a new folder inside Documents, such as `vibe-chat`, and pick that. An existing file is never overwritten: a taken name becomes `name (2).ext`.
- **Save all as zip** downloads every file in one step.
- **Discard** removes a card from the list (Restore brings it back). Files live only in the open page: Reset or closing the tab loses them, and the browser warns first if any were never saved.

Optional detail: file names from the model are reduced to a plain name with an allowed extension (no folders), SVG is previewed only as an image, and HTML is shown as text and never run.

## Voice typing
The mic button (left of the paperclip) uses the browser's speech recognition, not the operating system's dictation. Chrome and Edge send the audio to Google / Microsoft servers; a notice says so on first use. The small EN/HE button under the mic picks English or Hebrew. Firefox is not supported.

## Not yet verified against a real key
Voice typing on real laptops (English and Hebrew, microphone permission when the page is opened as a local file), streaming, attachments (PDF via OpenRouter file input), key test, QR scan, file downloads, the save dialog and folder picker in real Chrome, Edge, Safari and Firefox, and the assumption that `usage.cost` is in USD.

## Cost board (instructor projector view)
`dashboard/cost-board.html` shows, in large type for a projector, how much money one OpenRouter key has left and how much the class has spent, updating every few seconds while students use the key.

1. On openrouter.ai, create a **management key** at Settings → Management Keys (openrouter.ai/settings/management-keys). A regular API key will not work.
2. Open `dashboard/cost-board.html` in Chrome or Edge, paste the management key, click **Show keys**. Keys from every workspace in the account are listed, grouped by workspace. Then either:
   - click one key to show only that key, or
   - under **Cycle through every key in a workspace**, pick the workspace and how long to show each key (1–60 seconds), then click **Start cycling**. Each enabled key is shown in turn with its name in large type, so each student can find their own key. **Space** pauses on the current key; **←/→** step between keys.
   - **Entire Class** adds up every enabled key in that workspace. Tick "Include Entire Class" to show it first in the cycle, or click **Show Entire Class only** to show just the class total. It shows money left only if every key has a spending limit; otherwise it shows the total spent.
3. Press **F** for full screen. **T** switches light/dark (use light in bright rooms), **L** switches between English with dollars and Hebrew with shekels without resetting the class count (also a button on the board), **Esc** goes back to the key list.

**Hebrew and shekels:** at the top of the setup screen, set **Language** to עברית and/or **Currency** to Israeli new shekels. The two are independent. Hebrew switches the student-facing text and turns the layout right-to-left; the instructor notes stay in English. OpenRouter bills in dollars, so shekel amounts use an exchange rate: the page fetches the European Central Bank rate (via frankfurter.dev, no key needed) when you pick shekels, and you can type your own instead. The board shows which rate it is using at the bottom. If the rate cannot be fetched and none is typed, the board will not start in shekels.

The management key can create and delete every key in the workspace. The page never displays it and keeps it only in that browser tab unless you tick "Remember", so leave that unticked on shared computers. The board only reads keys and never changes them.

Optional detail: it polls `GET /api/v1/keys/{hash}` and shows `limit_remaining` (or `usage` if the key has no limit). "Spent this class" counts from when the board opened; each jump is usually one request, but requests landing in the same poll interval merge into one jump. Tests: `node dashboard/cost-board.test.js` (from the repo root).

## License

MIT (see `LICENSE`). The QR decoder inlined in `vibe-chat.html` is jsQR, Apache-2.0 (see `NOTICE-jsQR.txt`).
