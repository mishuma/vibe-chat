# Intent-Based Development: Student Guide

Version 0.2. Made from the Teacher's Guide, version 0.2.

Your teacher will tell you which section to open next. If you are working on your own, go through the sections in order.

**How this guide is labeled:** Concept (light blue): the idea behind it · Activity (light green): what you do · Questions (light purple): things to think about · Troubleshooting (light orange): if something goes wrong · Extension (light gray): go further · Key Terms (light yellow): new words

### 1. Introduction

#### 1.1 Concept: What this activity is

In this activity, you build a program without writing code yourself. You tell your AI coding assistant what you want in plain language. The AI writes the code. You test the code and tell the AI what went wrong. Then the AI writes a better version. You repeat this until the code does what you want.

You talk to the AI in vibe-chat, a chat page that opens in your browser. The chat is on the left. The code appears on the right.

**Your job:** You describe the goal and test the result. The AI writes the code. You decide whether it does what you wanted.

This way of working is called intent-based development, or vibe coding. First, get ready in section 2, Set-Up. If something goes wrong, look for the orange Troubleshooting notes at the step you are on.

**Help:** [FILL IN: who to ask]

#### 1.2 Key Terms

* **Intent-based development (vibe coding):** Making a program by describing what you want to an AI, testing the result, and asking for changes. You do not write the code yourself.

### 2. Set-Up

**Problem:** You need vibe-chat on your laptop, and your laptop must pass a few checks.

#### 2.1 Activity: Run the setup script

**What you need**

* A Mac or Windows laptop with Chrome or Edge, a camera, and internet access. Safari and Firefox may block the camera.
* vibe-chat-workshop.zip, from [FILL IN: link or location].
* Your testing app: [FILL IN: app].

**Steps**

1. Unzip vibe-chat-workshop.zip.
   * **Windows:** Right-click the zip and choose Extract All.
   * **Mac:** Double-click the zip.
   Do not run anything from inside the zip window.
2. Run the setup.
   * **Windows:** Double-click setup-windows.cmd.
   * **Mac:** Open the Terminal app (in Applications, then Utilities). Type bash and a space. Drag setup-mac.sh into the Terminal window. Press Enter.
   **Troubleshooting: Windows says it protected your PC:** Click More info, then Run anyway.
3. The script asks where to put your working folder. Press Enter to accept the suggestion, a folder called vibe-chat inside Documents. Or type another folder.
4. Read the last lines. "All checks passed" or "ready with warnings" means you are done. Each problem has a line starting with Fix: under it. Fix the problem and run the script again. Running it again is safe.
   **Troubleshooting: The connection check to openrouter.ai fails:** Your school network may block it. Try a phone hotspot.
5. Still stuck? Email the file setup-report.txt to [FILL IN: teacher email].

**Check before you move on**

* vibe-chat.html is in your working folder.
* The script said "All checks passed" or "ready with warnings."

### 3. Connect: Your key, model, and spend limit

**Problem:** Before you send your first message, you need your team's key, the right model, and a spend limit.

#### 3.1 Concept: Keys, tokens, and cost

The AI reads and writes text in small chunks called tokens. Each token costs a little money. Your messages and the AI's replies both use tokens.

An API key lets vibe-chat use the AI. Your team has its own key. Your teacher sets a credit limit on it. You also set your own spend limit in vibe-chat. When you reach it, vibe-chat stops sending.

Your teacher may show token spending on the main screen, for the whole class or for each team.

#### 3.2 Activity: Open vibe-chat and connect

1. Open vibe-chat.html from your working folder.
2. Click the camera icon and scan the QR code your teacher shows your team. Or paste the key by hand. Then click Test.
   **Your key is a secret, like a password.** Do not share it or post it.
   **Troubleshooting: The camera is blocked or the scan fails:** Use Chrome or Edge. If it still fails, paste the key by hand.
   **Troubleshooting: Test shows a problem:** Read the message in the chat. It gives advice in English or Hebrew.
3. Pick the model your teacher names: [FILL IN: model]. If it is not in the list, choose Other model and type its name.
4. Open Settings and enter your spend limit: [FILL IN: dollar amount].
   **Look for:** The colored bar at the top. It goes from green to red as you spend. The text next to it shows dollars spent out of your limit. The panel shows tokens in, tokens out, and cost for your last turn and for the whole session. A tilde (~) means the number is an estimate.
   **Troubleshooting: The bar stays empty:** No spend limit is set. Enter it in Settings.
   **Troubleshooting: You closed or reloaded the tab:** Enter your key again. Your spending totals start over.

#### 3.3 Questions

* What uses up tokens?

#### 3.4 Key Terms

* **API key:** A secret password that lets a program use an AI service and be billed for it.
* **Token:** A small chunk of text. Cost depends on how many are used.
* **Model:** The AI itself. Some models are smaller and cheaper. Others are more capable and cost more.

### 4. The Loop: Prompt, Paste, Run, Observe

#### 4.1 Concept: The four steps

Every goal in this guide uses the same loop. Learn it once here.

1. **Prompt.** Tell the AI what you want. Send your message.
2. **Paste.** Wait for the code to finish. Click Copy code. In your testing app, replace everything with the new code. If you see errors, send them to the AI and paste the corrected code.
3. **Run.** Run the code in your testing app.
4. **Observe.** Compare what happened with what you wanted. If it is different, tell the AI exactly what you saw and ask for revised code. Then run the loop again.

Repeat the loop until the code does what you wanted. Each step has its own section:

| Step | Section |
| :---- | :---- |
| Prompt | 5. Prompt: Describe your goal |
| Paste | 6. Paste: Copy the code into your testing app |
| Run | 7. Run: Test the code |
| Observe | 8. Observe: Tell the AI what went wrong |

**Rule for the whole activity:** Never change the code line by line. Every time the AI gives you a new version, replace all the code in your testing app. That way, the AI and your testing app always have the same code.

#### 4.2 Questions

* When you get stuck, ask yourself: Which step am I on?

#### 4.3 Key Terms

* **Prompt:** The message you send to an AI to tell it what you want.

### 5. Prompt: Describe your goal

**Problem:** You need to tell the AI clearly what you want.

#### 5.1 Activity: Send your first prompt

**Your first objective:** [FILL IN: objective]

1. Describe your goal in the message box.
2. To add an image or a file, click the paperclip. You can also paste a screenshot.
3. Click the paper airplane to send.
4. Wait for the AI to finish. The code appears on the right. Read the AI's answer. **Look for:** What did the AI decide on its own? Did it add anything you did not ask for? If so, ask the AI why.
   **Troubleshooting: Send is greyed out:** You reached your spend limit. Ask your teacher. Raising the limit in Settings turns Send back on and keeps your chat.
   **Troubleshooting: An error from OpenRouter appears in the chat:** Tell your teacher. Your team's key may be out of credit.

**You should see:** Code in the window on the right. Your code may be different from other teams' code.

#### 5.2 Questions

* What did the AI decide that you did not ask for?

### 6. Paste: Copy the code into your testing app

**Problem:** The code is ready. You need to move all of it into your testing app.

#### 6.1 Activity: Copy, paste, and fix errors

1. Wait until Copy code turns on. It stays greyed out until the code is complete. vibe-chat keeps only the latest version.
   **Troubleshooting: Copy code stays greyed out:** The AI is still writing. Wait for it to finish.
2. Click Copy code. In your testing app, select everything, delete it, and paste the new code.
3. Do you see errors? Copy the exact error text, or take a screenshot and paste it into the message box:
   * **Mac:** Press Control+Shift+Command+4, then drag over the error.
   * **Windows:** Press Windows key+Shift+S, then drag over the error.
   Then ask: "I got these errors. Please return the complete corrected code."
4. Replace all the code with the new version. Repeat until there are no errors.

**You should see:** No errors, usually within a few rounds.

#### 6.2 Questions

* Why does Copy code wait until the code is complete?

### 7. Run: Test the code

**Problem:** Your code has no errors. Now you need to see what it really does.

#### 7.1 Activity: Run it

1. Run the code in your testing app: [FILL IN: steps for the testing app].
2. Let it run long enough to see a pattern, not just a few seconds.

**You should see:** The code runs. It may not do what you wanted yet. That is what section 8 is for.

### 8. Observe: Tell the AI what went wrong

**Problem:** The code runs, but it does not do what you wanted.

#### 8.1 Activity: Observe, then tell the AI

1. Compare what happened with what you wanted.
2. Send the AI this message, with your own words filled in: "The code did [what you saw]. I wanted it to do [what you expected]. Please return the complete revised code."
3. Paste and run the new code. Test again. **Look for:** What changed after the AI revised the code?

Be specific. Compare these:

| Weak | Stronger |
| :---- | :---- |
| It doesn't work. | When I click the button, nothing happens. I expected the score to go up by one. |

#### 8.2 Questions

* What did your code do the first time you tested it?

### 9. Memory: Save your chat and start fresh

**Problem:** Reset conversation starts over. What does the AI keep, and what does it lose?

#### 9.1 Concept: How the AI remembers

vibe-chat has two buttons that show how AI memory works. Save chat downloads your whole conversation. Save memory asks the AI to write a short summary of it, called a memory file. You can load the memory file into a new conversation.

#### 9.2 Extension: Save and reload a memory

1. Click Save chat. Your conversation downloads as a markdown file.
2. Click Save memory. The AI writes a memory file. This uses a few tokens.
3. Click Reset conversation. The chat starts over. Your spending totals keep counting.
4. Load the memory file into the new conversation. [TO CONFIRM: how students load the memory file]
5. Ask the AI about your earlier work. **Look for:** What does the AI remember? What did it forget?

#### 9.3 Questions

* What did the AI remember after you loaded the memory file? What did it forget?

#### 9.4 Key Terms

* **Memory file:** A short summary of a conversation that you can load into a new conversation.

### 10. Summary of Learning Objectives

By the end of this activity, you can:

* Describe a goal clearly enough for an AI to write code for it.
* Use the four-step loop: Prompt, Paste, Run, Observe.
* Give an error message back to the AI instead of guessing a fix.
* Describe results in terms of what happened and what you expected.
* Explain what tokens are and what uses them.
* Explain what a memory file keeps and what is lost.

### Appendix A: Trademarks

*(Same as the Teacher's Guide.)*

* Anthropic, Claude, and Claude Code are trademarks of Anthropic, PBC. [VERIFY]
* OpenRouter is a trademark of OpenRouter, Inc. [VERIFY]
* Microsoft, Windows, Edge, and PowerShell are trademarks of the Microsoft group of companies. [VERIFY]
* GitHub and npm are trademarks of GitHub, Inc. [VERIFY]
* Apple, Mac, and Safari are trademarks of Apple Inc., registered in the U.S. and other countries. [VERIFY]
* Google, Chrome, and Google Drive are trademarks of Google LLC. [VERIFY]
* Firefox is a trademark of the Mozilla Foundation. [VERIFY]
* Codex is a trademark of OpenAI. [VERIFY]
* Cursor is a trademark of Anysphere, Inc. [VERIFY]
* Python is a trademark of the Python Software Foundation. [VERIFY]
* All other trademarks are the property of their respective owners.
