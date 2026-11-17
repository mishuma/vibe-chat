# Intent-Based Development: Student Guide

Version 0.2. Made from the Teacher's Guide, version 0.2.

This guide shows you how to use vibe-chat. What you build comes from a separate activity guide. You work in a team of 1 or 2, on one laptop. Your teacher will tell you which section to open next. If you are working on your own, go through the sections in order.

**How this guide is labeled:** Concept (light blue): the idea behind it · Activity (light green): what you do · Questions (light purple): things to think about · Troubleshooting (light orange): if something goes wrong · Extension (light gray): go further · Key Terms (light yellow): new words

### 1. Introduction

#### 1.1 Concept: What this activity is

In this activity, you build a program without writing code yourself. You tell your AI coding assistant what you want in plain language. The AI writes the code. You test the code and tell the AI what went wrong. Then the AI writes a better version. You repeat this until the code does what you want.

You talk to the AI in vibe-chat, a chat page that opens in your browser. The chat is on the left. The code appears on the right, with buttons to copy and save it, and a Files tab for any other files the AI makes. You paste the code into a testing app, where you run it. Your activity guide names the testing app.

**Your job:** You describe the goal and test the result. The AI writes the code. You decide whether it does what you wanted.

This way of working is called intent-based development, or vibe coding. If something goes wrong, look for the orange Troubleshooting notes at the step you are on.

**Help:** [FILL IN: who to ask]

#### 1.2 Key Terms

* **Intent-based development (vibe coding):** Making a program by describing what you want to an AI, testing the result, and asking for changes. You do not write the code yourself.

### 2. Set-Up

**Problem:** Your team's laptop needs vibe-chat, and it must pass a few checks. Do this before the session.

#### 2.1 Activity: Run the setup script

**What you need**

* Your team's Mac or Windows laptop with Chrome or Edge, a camera, and internet access. Other browsers may block the camera.
* vibe-chat-workshop.zip, from [FILL IN: link or location].
* Anything else your activity guide lists.

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

**Problem:** Before you send your first message, you need your team's key and the right model. A spend limit of your own is optional.

#### 3.1 Concept: Keys, tokens, and cost

The AI reads and writes text in small chunks called tokens. Each token costs a little money. Your messages and the AI's replies both use tokens.

An API key lets vibe-chat use the AI. Your team has its own key. Your teacher puts a credit limit on it: the most money the key can spend. vibe-chat shows how much is left and stops sending when it runs out. Your team can also set a lower spend limit of its own in vibe-chat.

Your teacher may show token spending on the main screen, for the whole class or for each team.

#### 3.2 Activity: Open vibe-chat and connect

1. Open vibe-chat.html from your working folder.
2. Click the camera icon and scan the QR code your teacher shows your team. Or paste the key by hand. Then click Test.
   **Your key is a secret, like a password.** Do not share it or post it.
   **Troubleshooting: The camera is blocked or the scan fails:** Allow camera access if your browser asks. If the scan still fails, paste the key by hand.
   **Troubleshooting: Test shows a problem:** Read the message in the chat. It gives advice in English or Hebrew.
3. Pick the model your teacher names: [FILL IN: model]. If it is not in the list, choose Other model and type its name.
4. Optional: open Settings and enter a spend limit: [FILL IN: dollar amount, or skip this step].
   **Look for:** The colored bar at the top. It goes from green to red as your key's money runs out. "Key credit" next to it shows the dollars left out of your key's limit. The panel shows tokens in, tokens out, and cost for your last turn and for the whole session. A tilde (~) means the number is an estimate.
   **Troubleshooting: The bar says "Budget spent" instead of "Key credit":** Click Test. If it still says "Budget spent," tell your teacher.
   **Troubleshooting: You closed or reloaded the tab:** Enter your key again, and choose your save folder again (step 5). Your spending totals start over.
5. Click Choose save folder at the top. Pick the vibe-chat folder in Documents (the one the setup script made). The top now says "Saving to: vibe-chat." Everything you save goes there.
   **Troubleshooting: Chrome says the folder "contains system files":** Pick the vibe-chat folder inside Documents, not Documents itself.
   **Troubleshooting: There is no Choose save folder button:** Your browser is not Chrome or Edge. Saving still works; files go to your Downloads folder.

#### 3.3 Questions

* What uses up tokens?

#### 3.4 Key Terms

* **API key:** A secret password that lets a program use an AI service and be billed for it.
* **Token:** A small chunk of text. Cost depends on how many are used.
* **Model:** The AI itself. Some models are smaller and cheaper. Others are more capable and cost more.

### 4. The Loop: Prompt, Paste, Run, Observe

**Problem:** You need to know the steps you repeat, and which vibe-chat buttons to use for each one.

#### 4.1 Concept: The four steps

Every activity uses the same loop. Learn it once here.

1. **Prompt.** Tell the AI what you want. Send your message.
2. **Paste.** Wait for the code to finish. Click Copy code. In your testing app, replace everything with the new code. If you see errors, send them to the AI and paste the corrected code.
3. **Run.** Run the code the way your activity guide says. In some activities, you download the code to a device first.
4. **Observe.** Compare what happened with what you wanted. If it is different, tell the AI exactly what you saw and ask for revised code. Then run the loop again.

Your activity guide tells you what each step means for your task.

**Rule for the whole activity:** Never change the code line by line. Every time the AI gives you a new version, replace all the code in your testing app. That way, the AI and your testing app always have the same code.

#### 4.2 Activity: Prompt in vibe-chat

1. Describe your goal in the message box. Your activity guide tells you what to ask for.
2. To add an image or a file, click the paperclip. You can also paste a screenshot.
3. Click the paper airplane to send.
4. Wait for the AI to finish. The code appears on the right. Read the AI's answer.
   **Troubleshooting: Send is greyed out:** Hold the mouse over Send to see why. "This key has no credit left": ask your teacher. "Spend limit reached": ask your teacher; raising your limit in Settings turns Send back on and keeps your chat.
   **Troubleshooting: An error from OpenRouter appears in the chat:** Tell your teacher. Your team's key may be out of credit.
   **Troubleshooting: The chat says the model is only offered by providers that may keep or train on what you send:** vibe-chat protects what you send, so it will not use that model. Choose another model, such as one of the Claude options.

**Starting over:** Reset conversation clears the chat and starts a new conversation. Your spending totals keep counting. Use it only when your activity guide or your teacher says so.

#### 4.3 Activity: Paste from vibe-chat

1. Wait until Copy code turns on. It stays greyed out until the code is complete. vibe-chat keeps only the latest version.
   **Troubleshooting: Copy code stays greyed out:** The AI is still writing. Wait for it to finish.
2. Click Copy code. In your testing app, select everything, delete it, and paste the new code.
3. Do you see errors? Copy the exact error text, or take a screenshot and paste it into the message box:
   * **Mac:** Press Control+Shift+Command+4, then drag over the error.
   * **Windows:** Press Windows key+Shift+S, then drag over the error.
   Then ask: "I got these errors. Please return the complete corrected code."
4. Replace all the code with the new version. Repeat until there are no errors.

**Saving your work.** Nothing is saved on your laptop until you press a Save button. Everything goes to the folder you chose in section 3.2.

* **Save code** saves the latest code as program.ts (or .py or .js). Saving again never replaces an earlier file: the next one is program (2).ts.
* **The Files tab** shows your latest code at the top, then any other files the AI made, such as notes or an image. Each has a Save button. Save all as zip saves them all in one file.
* Files in the Files tab are lost when you close the tab or click Reset. Save anything you want to keep first.

#### 4.4 Activity: Run and Observe

1. Run the code the way your activity guide says. Let it run long enough to see a pattern, not just a few seconds.
2. Compare what happened with what you wanted.
3. Send the AI this message, with your own words filled in: "The code did [what you saw]. I wanted it to do [what you expected]. Please return the complete revised code." Your activity guide may give you its own words for this message.
4. Paste and run the new code. Test again. **Look for:** What changed after the AI revised the code?

Be specific. Compare these:

| Weak | Stronger |
| :---- | :---- |
| It doesn't work. | When I click the button, nothing happens. I expected the score to go up by one. |

#### 4.5 Questions

* When you get stuck, ask yourself: Which step am I on?

#### 4.6 Key Terms

* **Prompt:** The message you send to an AI to tell it what you want.

### 5. Your activity

**Problem:** You know how to use vibe-chat. Now you need something to build.

#### 5.1 Activity: Open your activity guide

1. Open your activity guide: [FILL IN: activity guide name].
2. Work through it in the order your teacher gives.
3. Keep using the vibe-chat conversation from section 3. Your activity guide tells you if you should ever start over (see 4.2).
4. When you finish, go to section 6 of this guide.

#### 5.2 Questions

* If your teacher shows the cost board: What did your team do that used the most tokens?

### 6. Summary of Learning Objectives

By the end of this activity, you can:

* Describe a goal clearly enough for an AI to write code for it.
* Use the four-step loop: Prompt, Paste, Run, Observe.
* Give an error message back to the AI instead of guessing a fix.
* Describe results in terms of what happened and what you expected.
* Explain what tokens are and what uses them.
* Optional (Appendix A): Explain what a memory file keeps and what is lost.

Your activity guide lists more objectives for your task.

### Appendix A: Optional: Saved chats and memory

**Problem:** You finished early, or you want to see how an AI remembers. This part is optional.

#### A.1 Concept: How the AI remembers

vibe-chat has two buttons that show how AI memory works. Save chat saves your whole conversation. Save memory asks the AI to write a short summary of it, called a memory file. You can load the memory file into a new conversation.

#### A.2 Extension: Save and reload a memory

1. Click Save chat. Your conversation is saved in your save folder as a markdown file. The chat tells you where.
2. Click Save memory. The button says "Saving memory…" while the AI writes a memory file. The file goes in your save folder, and the summary appears in the chat. This uses a few tokens.
3. Click Reset conversation. The chat starts over. Your spending totals keep counting.
4. Click Load memory. Your save folder opens. Choose the memory file (its name starts with memory-). A Memory label appears above the chat.
5. Ask the AI about your earlier work. **Look for:** What does the AI remember? What did it forget?

#### A.3 Questions

* What did the AI remember after you loaded the memory file? What did it forget?

#### A.4 Key Terms

* **Memory file:** A short summary of a conversation that you can load into a new conversation.

### Appendix B: Trademarks

*(Same as the Teacher's Guide.)*

* Anthropic, Claude, and Claude Code are trademarks of Anthropic, PBC. [VERIFY]
* OpenRouter is a trademark of OpenRouter, Inc. [VERIFY]
* Microsoft, Windows, Edge, and PowerShell are trademarks of the Microsoft group of companies. [VERIFY]
* GitHub and npm are trademarks of GitHub, Inc. [VERIFY]
* Apple and Mac are trademarks of Apple Inc., registered in the U.S. and other countries. [VERIFY]
* Google, Chrome, and Google Drive are trademarks of Google LLC. [VERIFY]
* Codex is a trademark of OpenAI. [VERIFY]
* Cursor is a trademark of Anysphere, Inc. [VERIFY]
* Python is a trademark of the Python Software Foundation. [VERIFY]
* All other trademarks are the property of their respective owners.
