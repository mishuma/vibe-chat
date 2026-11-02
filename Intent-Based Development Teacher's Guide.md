# Intent-Based Development: Teacher's Guide

Version 0.2. Companion document: Intent-Based Development: Student Guide, version 0.2.
Author: Jeff Freilich. Replaces the Teacher Starter Guide of Oct 23, 2026.

#### Teacher Note: How to use this guide

Sections 1 to 10 match the Student Guide one for one. The numbers and titles are the same in both guides.

Each section starts with a marker, such as [STUDENT: 2. Set-Up]. The marker is the exact number and title of the matching Student Guide section. Say it aloud or write it on the board. Markers are plain text, so they also work on printed copies.

| Label | Meaning | In Student Guide? |
| :---- | :---- | :---- |
| Concept | The idea behind the activity | Yes |
| Activity | What students do | Yes |
| Questions | Questions to ask the class | Yes, shorter |
| Troubleshooting | A problem students may hit at this step, and the fix | Yes |
| Extension | Optional deeper exploration | Yes |
| Key Terms | AI terms, at the end of a section | Yes |
| Teacher Note | Coaching, timing, setup, and technical detail | No |

You do not need to read or write code to run this workshop. Teacher Notes marked "Technical detail (optional)" are for a technical co-instructor.

Complete the text in [FILL IN: ...] brackets before class. Items marked [TO CONFIRM] are open questions about the tools. Resolve them before the workshop.

#### Teacher Note: Read this first: Age limits

Anthropic's consumer Claude accounts require users to be 18 or older. A third-party tracker reports that OpenRouter's August 2026 terms raised its minimum age to 18. The kit was built for college students.

#### Teacher Note: Fill in before class

| Item | Your answer |
| :---- | :---- |
| Class | [FILL IN: name] |
| Date | [FILL IN: date] |
| Number of teams and students on each team | [FILL IN: number and team size] |
| Team names (each team's key is named for its team) | [FILL IN: team names] |
| Total session length | [FILL IN: minutes] |
| Testing app students paste code into | [FILL IN: app] |
| First objective students give the AI | [FILL IN: objective] |
| Model students pick in vibe-chat | [FILL IN: the latest Claude Haiku, Sonnet, or Opus, or another model name] |
| Spend limit students enter in Settings | [FILL IN: dollar amount] |
| cost-board.html mode to start in | [FILL IN: whole class or each team] |
| Where students get vibe-chat-workshop.zip | [FILL IN: link or location] |
| Who to contact for help, and where students email setup-report.txt | [FILL IN: name and email] |

#### Teacher Note: What is in the kit

* **vibe-chat.html**: the chat page students use (sections 3 to 9).
* **vibe-chat-workshop.zip**: vibe-chat.html plus SETUP.txt and the Windows and Mac setup scripts (section 2).
* **qr-key.html** and **test-keys.csv**: shows a key as a QR code, with 20 fake keys for practice (section 3).
* **cost-board.html**: shows on the main screen the current token spend of every key in the class's OpenRouter workspace, for the whole class or for each team (section 3).
* **token-usage-tracker**: a skill that prints estimated token use after each reply (section 3).
* **Source code**: <https://github.com/mishuma/vibe-chat>. A local copy is on Jeff's Mac at /Users/jeff/Github/personal/vibe-chat. [TO CONFIRM] Check that the repository holds the current source, qr-key.html, cost-board.html, and test-keys.csv. qr-key.html and cost-board.html have no known location. How to fix: add them to the repository and write their paths here.

**Teacher Note: Technical detail (optional)**

Edit src/app-template.html in the source folder, then run python3 build.py to regenerate vibe-chat.html. The commands npm install and npm test run the simulated-browser checks included in the folder. The QR reader is the jsQR library with its Japanese Kanji table removed, which does not affect API-key QR codes.

#### Teacher Note: Pre-workshop checklist

1. Settle the under-18 question (top of this guide).
2. Set up OpenRouter. In a workspace used only for this class, create one key per team. Give each key a credit limit and name it for its team. Get the workspace's Management key for cost-board.html (see section 3).
3. Run the setup scripts on one real Windows laptop and one real Mac (see 2.1).
4. With one low-limit test key, do a full round trip on a student-type laptop. Send a message, send a screenshot, send a PDF, save the chat, save and load a memory, scan a QR code, and watch the spend appear on cost-board.html. Check that the dollars in vibe-chat and on cost-board.html match OpenRouter's own figure.
   [TO CONFIRM] Not yet verified against a real key: live streaming of code, attachments (images and PDFs), the Test button, the QR camera, file downloads, how the paperclip and airplane icons look, and that OpenRouter reports cost in US dollars.
5. Try the QR scan with test-keys.csv (see 3.2).
6. Start cost-board.html on the main screen once in each mode. Check that no secret key and no part of the Management key appears on screen (see section 3).
7. Delete the test key before class. The board reads every key in the workspace, so a test key would appear on the board and count in the whole-class total.
8. If you plan to use Claude Code, start it once with the workshop key. [TO CONFIRM] The Starter Guide pointed to a "Section 1" for these steps, but that section does not exist. How to fix: write the steps here.
9. Write down where each file lives, and fill in every [TO CONFIRM] in this guide.
10. Check that SETUP.txt matches Student Guide 2.1 word for word.

#### Teacher Note: How the two guides stay matched

This guide is the master. The Student Guide is made from it. To change what students see, change this guide first. Then update the Student Guide to match. SETUP.txt in the zip repeats Student Guide 2.1, so update it too. An AI assistant can do the check. Do not edit the Student Guide on its own, or the two will stop matching. Add a row to the version log for every update.

| Version | Date | What changed in this guide | Student guide updated |
| :---- | :---- | :---- | :---- |
| 0.1 | 2026-11-02 | Restructured the Teacher Starter Guide (Oct 23, 2026) into the paired-guide format used by Cutebot Explorer. Added section markers, labels, Questions, Key Terms, draft learning objectives, and Appendix A. Added the GitHub address. | Yes, version 0.1 (first version) |
| 0.2 | 2026-11-02 | Added cost-board.html (new Teacher Note in section 3, kit list, fill-in table, checklist items 4, 6, and 7). One key per team, named for the team, in a class-only workspace. "Team" replaces "student" where a team acts together. Added a cost-board poll to 8.2. Checklist items 6 to 8 are now 8 to 10. | Yes, version 0.2 |

### 1. Introduction

**Direct students to:** [STUDENT: 1. Introduction]

#### 1.1 Concept: What this activity is

Intent-based development (often called vibe coding) means students describe what they want in plain language, an AI writes the code, and students test the result and refine it by describing what is wrong.

Students use vibe-chat, one web page that opens in Chrome or Edge. The chat is on the left. On the right is a read-only code window with a Copy code button. Students describe what they want, copy the finished code into their testing app, see whether it works, and return to the chat to describe what is wrong. Nothing needs installing.

The student's job is to describe the goal and test the result. The AI writes the code. The student decides whether the result matches the goal.

**Teacher Note:** You do not need programming experience. You need to be able to tell whether the code did what the student asked for.

#### 1.2 Key Terms

* **Intent-based development (vibe coding):** Making a program by describing what you want to an AI, testing the result, and asking for changes. You do not write the code yourself.

### 2. Set-Up

**Direct students to:** [STUDENT: 2. Set-Up]

**Problem to solve:** Every student needs vibe-chat in a working folder, on a laptop that passes the setup checks. Most problems later in the session come from a failed or skipped check.

#### 2.1 Activity: Run the setup script

**What each student needs**

* A Mac or Windows laptop with Chrome or Edge, a camera, and internet access. Safari and Firefox may block the camera needed to scan a key.
* vibe-chat-workshop.zip, from [FILL IN: link or location].
* The testing app: [FILL IN: app].

**What students do (also in SETUP.txt)**

1. Unzip vibe-chat-workshop.zip. On Windows, right-click the zip and choose Extract All. On a Mac, double-click it. Do not run anything from inside the zip window.
2. Run the setup.
   * **Windows:** double-click setup-windows.cmd.
   * **Mac:** open the Terminal app, type bash and a space, drag setup-mac.sh into the Terminal window, and press Enter.
   **Troubleshooting: Windows says it protected the PC:** Click More info, then Run anyway.
3. When asked where to put the working folder, press Enter to accept the suggestion (a folder called vibe-chat inside Documents), or type another folder.
4. Read the last lines. "All checks passed" or "ready with warnings" means done. Each problem shows a line starting with Fix: beneath it. Fix it and run the script again.
   **Troubleshooting: The connection check to openrouter.ai fails:** A school network may block openrouter.ai. A phone hotspot is the quick test.
5. If a student cannot fix a problem, they email setup-report.txt to you.

**Teacher checkpoint.** Before moving on, check that each student:

* Has vibe-chat.html in the working folder.
* Saw "All checks passed" or "ready with warnings."

**Teacher Note: What the setup scripts do**

They check the laptop, the browser, the camera, and the connection to openrouter.ai. They create a working folder and copy vibe-chat.html into it. They do not install software, change settings, or copy any API key. Running them again is safe: an existing folder and an unchanged file are left alone. They write a file called setup-report.txt that a student can email you if something fails.

**Teacher Note: [TO CONFIRM] Test status of the scripts**

The Mac script was tested only on a Linux machine with stand-in commands. The Windows script has never been run. How to fix: follow the steps above on one real Mac and one real Windows laptop, including the Windows warning screen, before you send out the zip.

### 3. Connect: Your key, model, and spend limit

**Direct students to:** [STUDENT: 3. Connect: Your key, model, and spend limit]

**Problem to solve:** Before the first message, each team needs its own working API key, the right model, and a spend limit. Typing a long key by hand is slow, so teams scan a QR code instead.

#### 3.1 Concept: Keys, tokens, and cost

Tokens are the small chunks of text an AI reads and writes, and the cost depends on how many are used. An API key lets vibe-chat reach the AI through OpenRouter, a service that lets one key reach many AI models. Each team has its own key, and each use is billed to that key.

There are two limits:

| Limit | Who sets it | Where | What it does |
| :---- | :---- | :---- | :---- |
| Credit limit | You | OpenRouter, on each team's key | The real cap. OpenRouter enforces it. |
| Spend limit | The student | vibe-chat Settings | vibe-chat stops sending at this amount. The app enforces only this limit. |

#### 3.2 Activity: Open vibe-chat and connect

1. Open vibe-chat.html from the working folder.
2. Enter the team's key: click the camera icon and scan the QR code you show the team, or paste the key by hand. Click Test.
   **Troubleshooting: The camera is blocked or the scan fails:** Use Chrome or Edge. If it still fails, paste the key by hand.
   **Troubleshooting: Test shows a problem:** The problem appears as a message in the chat window, with advice in English or Hebrew.
3. Pick a model: [FILL IN: model]. Choose it from the list, or choose Other model and type a model name.
4. Open Settings and enter the spend limit: [FILL IN: dollar amount].
   **Look for:** A colored bar at the top runs from green to red as the session spends toward the spend limit. The text beside it shows dollars spent out of the limit. A panel shows tokens in, tokens out, and cost for the last turn, plus the session total. A tilde (~) marks an estimate.
   **Troubleshooting: The bar stays empty:** No spend limit is set, and nothing is stopped. Enter the limit in Settings.
   **Troubleshooting: A student closed or reloaded the tab:** The key is kept only while the tab is open. The student enters it again. The spending totals restart, but the spend limit stays saved in the browser.

**Teacher checkpoint.** Check that each team has a passing Test, the right model, and a spend limit set.

**Teacher Note: Before class: create and share keys**

1. **Create the keys in OpenRouter.** Use a workspace for this class only. Make one key per team, and name each key for its team. Each key can have its own credit limit. The key names appear on cost-board.html, so choose names you are happy to show the class.
2. **Make a CSV file** (a plain-text table any spreadsheet program can open) with one row per team and three columns: index (row number), key name (the team name, shown on screen), and secret key. A header row is optional and extra columns are ignored. Column order matters, because the page cannot tell if columns are swapped.
3. **Open qr-key.html** by double-clicking it, click Load CSV, and choose your file. The page shows the key name, the QR code, and the key text underneath. The arrows step through the rows, and a counter such as 2 of 8 shows your place. Back is disabled on the first row and forward on the last. qr-key.html works offline and uploads nothing.
4. **Teams scan** with the camera icon in vibe-chat, then click Test.
5. **Afterwards**, click Clear, close the tab, delete the CSV, and delete the keys in OpenRouter. Deleting the keys ends every team's access at once.

Example CSV (the key is fake):

    index,key_name,secret_key
    1,Alpha Lab,sk-test-EXAMPLE-NOT-A-REAL-KEY

Spreadsheet programs can silently change long keys, for example into scientific notation or different capitalization. Set the key column to Text before saving, and save as plain CSV.

**Teacher Note: Safety**

The key is fully visible on screen in qr-key.html. Show one team at a time, and never screen-share or project this page. Close qr-key.html before you put cost-board.html on the main screen.

**Teacher Note: [TO CONFIRM] Test status of qr-key.html**

CSV reading and the arrows passed in a simulated browser only. A row with fewer than three columns or an empty key is skipped, and a warning names the skipped rows. The camera scan has not been tried. How to fix: show a test-keys.csv row on your laptop and scan it with a student-type laptop in Chrome or Edge. If the camera is blocked, students can paste the key by hand.

**Teacher Note: Show spending on the main screen: cost-board.html**

cost-board.html shows the current token spend of each team's OpenRouter API key, so the class can watch spending during the workshop. It reads every key in the workspace through the workspace's Management key.

*The Management key.* It belongs to the OpenRouter workspace and can read and manage every API key in it. Treat it as the master password for the class's keys. Only you use it. Never give it to students, put it in the CSV, or show it in qr-key.html.

*Two modes, set at start.* You choose the mode when you start the board. To switch modes, start the board again.

| Mode | What the class sees |
| :---- | :---- |
| Whole class | The total spend of every key in the workspace |
| Each team | The spend of each team's key, one line per team |

1. Open cost-board.html by double-clicking it.
2. Enter the workspace's Management key. Do this before you put the board on the main screen. [TO CONFIRM] Whether the board hides the key as you type it, and keeps it only while the tab is open.
3. Choose the mode: [FILL IN: whole class or each team]. [TO CONFIRM] How you choose the mode at start.
4. Put the board on the main screen. [TO CONFIRM] Whether it updates on its own, and how often.
5. Afterwards, close the tab.

**Safety:** Before you project the board, check that it shows key names only. No secret key and no part of the Management key may appear.

**Good to know**

* Every key in the workspace appears on the board, and the whole-class total counts all of them. Keep only the team keys in this workspace, and delete test keys before class.
* With one key per team, each line on the board is one team.
* The board reads spending from OpenRouter. Its totals keep counting when a student reloads vibe-chat, unlike the session totals in vibe-chat. [TO CONFIRM] Whether the board shows spending since each key was created or for today only.

**[TO CONFIRM] Test status:** I have no test notes for cost-board.html. How to fix: include it in checklist items 4 and 6.

**Teacher Note: Choosing a model**

Haiku is the smallest and cheapest, Sonnet sits in the middle, and Opus is the most capable.

**Teacher Note: Good to know**

The spend limit is saved in the browser. Totals restart when the page is closed or reloaded, so the key's credit limit in OpenRouter is the only cap students cannot reset. English and Hebrew messages are built in, and Hebrew text displays right to left. Other languages get English messages.

**Teacher Note: Monitoring spending outside vibe-chat (optional, technical)**

*Check a key's remaining credit.* OpenRouter reports a key's limit, remaining credit, and usage when asked. In a Mac terminal, with the key in place of PASTE_KEY_HERE:

    curl -s https://openrouter.ai/api/v1/key -H 'Authorization: Bearer PASTE_KEY_HERE'

In Windows PowerShell, type curl.exe instead of curl. Look for limit_remaining and usage in the reply. A key with no limit shows no remaining amount.

*OpenRouter website.* [TO CONFIRM] I did not check where per-key usage appears on the OpenRouter website. How to fix: sign in, open the keys and activity pages, and write here which page shows each key's spending.

*In Claude Code: the token-usage-tracker skill.* This skill makes Claude end every reply with a line in this form, where each x, a, and b stands for a number:

    Last inference used ~xxx tokens (~aaa in / ~bbb out). Entire conversation used ~yyy tokens (~$z.zzzz on <model>, estimated).

The numbers are estimates at roughly four characters per token, not billing. The skill is not used inside vibe-chat, because the app reads exact counts from OpenRouter.

* [TO CONFIRM] Installing it. My notes say students get the skill through Google Drive. I did not find the steps. How to fix: write down where students put the skill folder for Claude Code.
* [TO CONFIRM] Price file. The copy I read takes prices from a file named token-prices.json beside it, and leaves out the dollar figure if the model is not listed. A copy attached in an earlier chat told the model to look prices up online, which a plain chat cannot do. How to fix: give every student the copy with token-prices.json, and check that its model names match what OpenRouter shows in /model.
* [TO CONFIRM] Other tools. My notes list a token-gym-audit skill that reads Claude Code, Codex, and Cursor logs into a Token Report Card, and OpenRouter's Claude Code guide appears to show a cost display in the status line. I found neither in this project. How to fix: add the first skill's files here, and check OpenRouter's Claude Code guide for the second.

#### 3.3 Questions

* "What uses up tokens?"
* **Listen for:** both the student's messages (tokens in) and the AI's replies (tokens out).
* "Who sets the spend limit, and who sets the key's credit limit?"
* **Listen for:** the student sets the spend limit in vibe-chat. The teacher's limit in OpenRouter is the real cap.

#### 3.4 Key Terms

* **API key:** A secret password that lets a program use an AI service and be billed for it.
* **Token:** A small chunk of text. Cost depends on how many are used.
* **Model:** The AI itself. Some models are smaller and cheaper. Others are more capable and cost more.

### 4. The Loop: Prompt, Paste, Run, Observe

**Direct students to:** [STUDENT: 4. The Loop: Prompt, Paste, Run, Observe]

**Problem to solve:** Students need one picture of the whole process before they start. Without it, every new goal feels like a new problem, and teams stop at the first thing that goes wrong.

#### 4.1 Concept: The four steps

1. **Prompt.** Describe the goal to the AI in the message box, and send it.
2. **Paste.** Wait for the code to finish. Click Copy code and replace everything in the testing app with it. If the testing app shows errors, send them to the AI and paste the corrected code.
3. **Run.** Run the code in the testing app.
4. **Observe.** Compare what happened with what the student wanted. If it is different, describe the difference to the AI and ask for revised code. Then repeat the loop.

| Step | Section |
| :---- | :---- |
| Prompt | 5. Prompt: Describe your goal |
| Paste | 6. Paste: Copy the code into your testing app |
| Run | 7. Run: Test the code |
| Observe | 8. Observe: Tell the AI what went wrong |

**Rule for the whole activity:** Students never edit the code line by line. Every revision is a complete replacement. vibe-chat supports this: Copy code stays greyed out until the code is complete, so students cannot copy half a program, and only the latest version is kept.

**Teacher Note: How to teach it**

Draw the four steps on the board before students open vibe-chat. If a team skips Observe and sends "it doesn't work," send them to section 8. Ask what they saw.

#### 4.2 Questions

* Ask any team that is stuck: "Which step are you on?"
* **Listen for:** every team can name the four steps and say which step it is on.

#### 4.3 Key Terms

* **Prompt:** The message you send to an AI to tell it what you want.

### 5. Prompt: Describe your goal

**Direct students to:** [STUDENT: 5. Prompt: Describe your goal]

**Problem to solve:** Students do not yet know how to describe a goal clearly, or how to give the AI files and screenshots.

#### 5.1 Activity: Send your first prompt

**First objective:** [FILL IN: objective]

1. Describe the goal in the message box.
2. To add an image or file, click the paperclip. Pasting a screenshot also works.
3. Click the paper airplane to send.
4. Wait for the AI to finish. Code appears in the code window on the right. Read the reply. Look for what the AI assumed. If it added something that was not requested, ask the AI why.
   **Troubleshooting: Send is greyed out:** The spend bar is full. Raising the limit in Settings turns Send back on and keeps the chat. [FILL IN: whether students may raise it or must ask you]
   **Troubleshooting: An error from OpenRouter appears in the chat:** The team's key may have reached its credit limit. The team tells you.

**What you should see:** Code in the window on the right. Not every team's code will be the same.

**Teacher Note: Technical detail (optional)**

A reply's cost is known only after it finishes, so spending can land slightly over the spend limit.

#### 5.2 Questions

* "What did the AI decide on its own?"
* Poll the class: "Did your AI add something that other teams did not get?"

### 6. Paste: Copy the code into your testing app

**Direct students to:** [STUDENT: 6. Paste: Copy the code into your testing app]

**Problem to solve:** The code is ready in vibe-chat. Students need to move all of it into the testing app, and send any errors back to the AI instead of fixing them by hand.

#### 6.1 Activity: Copy, paste, and fix errors

1. Wait until Copy code turns on.
   **Troubleshooting: Copy code stays greyed out:** The code is not complete yet. Wait for the reply to finish.
2. Click Copy code. In the testing app, replace everything with the new code.
3. If the testing app shows errors, copy the exact error text or paste a screenshot into the message box. Ask: "I got these errors. Please return the complete corrected code."
4. Replace all the code with the new version. Repeat until there are no errors.

**What you should see:** No errors, usually within a few rounds.

**Teacher Note: Coaching**

Show students how to take a screenshot if they don't know how. The Student Guide lists the Mac and Windows shortcuts.

#### 6.2 Questions

* "Why does Copy code wait until the code is complete?"
* **Listen for:** so you never paste half a program.

### 7. Run: Test the code

**Direct students to:** [STUDENT: 7. Run: Test the code]

**Problem to solve:** The code has no errors. Students need to run it and watch long enough to see what it really does.

#### 7.1 Activity: Run it

1. Run the code in the testing app: [FILL IN: steps for the testing app].
2. Let it run long enough to see a pattern, not just a few seconds.

**What you should see:** The code runs. It may not yet do what the student wanted.

**Teacher Note:** If the testing app has its own guide (for example, Cutebot Explorer), point students to its run steps here.

### 8. Observe: Tell the AI what went wrong

**Direct students to:** [STUDENT: 8. Observe: Tell the AI what went wrong]

**Problem to solve:** The code runs, but not as the student wanted. Students tend to report "it doesn't work," which gives the AI nothing to act on.

#### 8.1 Activity: Observe, then tell the AI

1. Compare what happened with what you wanted.
2. Send the AI a three-part message: "The code did [what you saw]. I wanted it to do [what you expected]. Please return the complete revised code."
3. Paste and run the new code. Test again.

| Weak feedback | Stronger feedback |
| :---- | :---- |
| It doesn't work. | When I click the button, nothing happens. I expected the score to go up by one. |

**Teacher Note: How to coach**

Ask, "What did you see?" Do not tell students the fix.

**Teacher Note: Technical detail (optional)**

The loop mirrors how an AI agent works: act, observe the result, compare it with the goal, and adjust. Here, the student is the observer. How much detail the student gives limits how well the AI can revise the code.

#### 8.2 Questions

* "What did your code do the first time you tested it?"
* "What did you tell the AI after something did not work?"
* "What changed after the AI revised the code?"
* Show cost-board.html in each-team mode. If it is running in whole-class mode, start it again in each-team mode. Poll the class: "Which team has used the most tokens so far? What did they do differently?"
* **Listen for:** more rounds, longer messages, screenshots and files, or a more capable model.

### 9. Memory: Save your chat and start fresh

**Direct students to:** [STUDENT: 9. Memory: Save your chat and start fresh]

**Problem to solve:** Reset conversation starts over. Students need to see what the AI keeps, and what it loses, when a conversation ends.

#### 9.1 Concept: How the AI remembers

Two teaching buttons show how memory works. Save chat downloads the conversation as a markdown file. Save memory has the model summarize the conversation into a markdown memory file that a student can load into a new conversation.

#### 9.2 Extension: Save and reload a memory

1. Click Save chat. The conversation downloads as a markdown file.
2. Click Save memory. The AI summarizes the conversation into a memory file. The summary costs a few tokens, which count toward spending.
3. Click Reset conversation. The chat starts over, but the session's spending totals keep counting.
4. Load the memory file into the new conversation. [TO CONFIRM: how students load the memory file]
5. Ask the AI about your earlier work.

**Teacher Note:** Settings also holds an optional skill file. [TO CONFIRM: whether students use it in this activity]

#### 9.3 Questions

* "What did the AI remember after you loaded the memory file? What did it forget?"
* **Listen for:** the AI knows only what is in the summary.

#### 9.4 Key Terms

* **Memory file:** A short summary of a conversation that you can load into a new conversation.

### 10. Summary of Learning Objectives

**Direct students to:** [STUDENT: 10. Summary of Learning Objectives]

[TO CONFIRM] Draft objectives. Approve before use.

| Learning objective | Practiced in | What to look for |
| :---- | :---- | :---- |
| Describe a goal clearly enough for an AI to write code for it | 5 | The prompt states the goal and what should happen |
| Use the four-step loop: Prompt, Paste, Run, Observe | 4 to 8 | The student completes more than one full round |
| Give an error back to the AI instead of guessing a fix | 6 | The student pastes the exact error or a screenshot |
| Describe results in terms of what happened and what was expected | 8 | Feedback uses "The code did... I wanted..." |
| Explain what tokens are and what uses them | 3 | The student can read the spend bar and name tokens in and out |
| Explain what a memory file keeps and what is lost | 9 | The student can say what the AI forgot after a reset |

### Appendix A: Trademarks

*(Same text in both guides. Check each [VERIFY] line before publishing.)*

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