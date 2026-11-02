# Intent-Based Development: Teacher's Guide

Version 0.1. Companion document: Intent-Based Development: Student Guide, version 0.1.
Author: Jeff Freilich. Replaces the Teacher Starter Guide of Oct 23, 2026.

#### Teacher Note: Disclaimer: Age requirements

Anthropic's consumer Claude accounts require users to be 18 or older. A third-party tracker reports that OpenRouter's August 2026 terms raised its minimum age to 18. This module is written for high school students, 9th grade and up. Each school and its instructors must reconcile these age requirements with the services' terms and the school's own policies before using the module. Responsibility for this rests with the school and its instructors, not with the module author.

#### Teacher Note: How to use this guide

This guide covers the tool, vibe-chat. The task students build comes from a separate activity guide, so you can swap activities without changing this guide (see section 5).

Sections 1 to 6 and Appendices A and B match the Student Guide one for one. The numbers and titles are the same in both guides.

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

Students work in teams of 1 or 2, with one laptop per team. You do not need to read or write code to run this workshop. Teacher Notes marked "Technical detail (optional)" are for a technical co-instructor.

Complete the text in [FILL IN: ...] brackets before class. Items marked [TO CONFIRM] are open questions about the tools. Resolve them before the workshop.

#### Teacher Note: Fill in before class

| Item | Your answer |
| :---- | :---- |
| Class | [FILL IN: name] |
| Date | [FILL IN: date] |
| Number of teams (1 or 2 students each, one laptop per team) | [FILL IN: number] |
| Team names (each team's key is named for its team) | [FILL IN: team names] |
| Who runs set-up (section 2) on each team's laptop before the session | [FILL IN: you or each team] |
| Session length, after set-up | [FILL IN: minutes. See "Available activities" in section 5] |
| Activity guide students will use | [FILL IN: activity name and version, from "Available activities" in section 5] |
| Model teams pick in vibe-chat | [FILL IN: the latest Claude Haiku, Sonnet, or Opus, or another model name] |
| Spend limit teams enter in Settings | [FILL IN: dollar amount] |
| cost-board.html mode to start in | [FILL IN: whole class or each team] |
| Where teams get vibe-chat-workshop.zip | [FILL IN: link or location] |
| Who to contact for help, and where teams email setup-report.txt | [FILL IN: name and email] |

#### Teacher Note: What is in the kit

* **vibe-chat.html**: the chat page teams use (sections 3 to 5).
* **vibe-chat-workshop.zip**: vibe-chat.html plus SETUP.txt and the Windows and Mac setup scripts (section 2).
* **qr-key.html** and **test-keys.csv**: shows a key as a QR code, with 20 fake keys for practice (section 3).
* **cost-board.html**: shows on the main screen the current token spend of every key in the class's OpenRouter workspace, for the whole class or for each team (section 3).
* **token-usage-tracker**: an optional skill for Claude Code (Appendix A).
* **Activity guides**: a Teacher's Guide and Student Guide pair for each activity (section 5).
* **Source code**: <https://github.com/mishuma/vibe-chat>. A local copy is on Jeff's Mac at /Users/jeff/Github/personal/vibe-chat. [TO CONFIRM] Check that the repository holds the current source, qr-key.html, cost-board.html, and test-keys.csv. qr-key.html and cost-board.html have no known location. How to fix: add them to the repository and write their paths here.

**Teacher Note: Technical detail (optional)**

Edit src/app-template.html in the source folder, then run python3 build.py to regenerate vibe-chat.html. The commands npm install and npm test run the simulated-browser checks included in the folder. The QR reader is the jsQR library with its Japanese Kanji table removed, which does not affect API-key QR codes.

#### Teacher Note: Pre-workshop checklist

1. Read the age disclaimer at the top of this guide, and settle it with your school.
2. Choose the activity (see section 5). Complete the activity guide's own fill-in table and before-class Teacher Notes.
3. Set up OpenRouter. In a workspace used only for this class, create one key per team. Give each key a credit limit and name it for its team. Get the workspace's Management key for cost-board.html (see section 3).
4. Run the setup scripts on one real Windows laptop and one real Mac. Then run set-up on every team's laptop (section 2).
5. With one low-limit test key, do a full round trip on a team laptop. Send a message, send a screenshot, send a PDF, scan a QR code, and watch the spend appear on cost-board.html. Check that the dollars in vibe-chat and on cost-board.html match OpenRouter's own figure.
   [TO CONFIRM] Not yet verified against a real key: live streaming of code, attachments (images and PDFs), the Test button, the QR camera, how the paperclip and airplane icons look, and that OpenRouter reports cost in US dollars.
6. Try the QR scan with test-keys.csv (see 3.2).
7. Start cost-board.html on the main screen once in each mode. Check that the Management key is concealed after you paste it, and that no secret key appears on screen (see section 3).
8. Delete the test key before class. The board reads every key in the workspace, so a test key would appear on the board and count in the whole-class total.
9. If you plan to use Appendix A, test it too (see the Teacher Notes there).
10. Write down where each file lives, and fill in every [TO CONFIRM] in this guide.
11. Check that SETUP.txt matches Student Guide 2.1 word for word.

#### Teacher Note: How the two guides stay matched

This guide is the master. The Student Guide is made from it. To change what students see, change this guide first. Then update the Student Guide to match. SETUP.txt in the zip repeats Student Guide 2.1, so update it too. Activity guides point to section numbers in this guide, so when a number changes here, update every activity guide too. An AI assistant can do the check. Do not edit the Student Guide on its own, or the two will stop matching. Add a row to the version log for every update.

| Version | Date | What changed in this guide | Student guide updated |
| :---- | :---- | :---- | :---- |
| 0.1 | 2026-11-02 | First version. Made from the Teacher Starter Guide (Oct 23, 2026) in the paired-guide format. Generic tool guide with an activity slot (section 5). Set-up done before the session. One key per team, teams of 1 or 2 with one laptop. cost-board.html. Age disclaimer. Saved chats, memory, and skills in optional Appendix A. Trademarks in Appendix B. | Yes, version 0.1 |

### 1. Introduction

**Direct students to:** [STUDENT: 1. Introduction]

#### 1.1 Concept: What this activity is

Intent-based development (often called vibe coding) means students describe what they want in plain language, an AI writes the code, and students test the result and refine it by describing what is wrong.

Students use vibe-chat, one web page that opens in a browser. The chat is on the left. On the right is a read-only code window with a Copy code button. Students describe what they want, copy the finished code into their testing app, see whether it works, and return to the chat to describe what is wrong. The testing app, and the task itself, come from the activity guide (section 5).

The student's job is to describe the goal and test the result. The AI writes the code. The student decides whether the result matches the goal.

**Teacher Note:** You do not need programming experience. You need to be able to tell whether the code did what the student asked for.

#### 1.2 Key Terms

* **Intent-based development (vibe coding):** Making a program by describing what you want to an AI, testing the result, and asking for changes. You do not write the code yourself.

### 2. Set-Up

**Direct students to:** [STUDENT: 2. Set-Up]

**Problem to solve:** Each team's laptop needs vibe-chat in a working folder, and must pass the setup checks. Do this before the session, so class time goes to the activity. Most problems later come from a failed or skipped check.

#### 2.1 Activity: Run the setup script

**What each team needs**

* A Mac or Windows laptop with Chrome or Edge, a camera, and internet access. Other browsers may block the camera needed to scan a key.
* vibe-chat-workshop.zip, from [FILL IN: link or location].
* Anything else the activity guide lists, such as hardware or a testing app.

**What students do (also in SETUP.txt)**

1. Unzip vibe-chat-workshop.zip. On Windows, right-click the zip and choose Extract All. On a Mac, double-click it. Do not run anything from inside the zip window.
2. Run the setup.
   * **Windows:** double-click setup-windows.cmd.
   * **Mac:** open the Terminal app, type bash and a space, drag setup-mac.sh into the Terminal window, and press Enter.
   **Troubleshooting: Windows says it protected the PC:** Click More info, then Run anyway.
3. When asked where to put the working folder, press Enter to accept the suggestion (a folder called vibe-chat inside Documents), or type another folder.
4. Read the last lines. "All checks passed" or "ready with warnings" means done. Each problem shows a line starting with Fix: beneath it. Fix it and run the script again.
   **Troubleshooting: The connection check to openrouter.ai fails:** A school network may block openrouter.ai. A phone hotspot is the quick test.
5. If a team cannot fix a problem, they email setup-report.txt to you.

**Teacher checkpoint.** Before the session, check that each team's laptop:

* Has vibe-chat.html in the working folder.
* Showed "All checks passed" or "ready with warnings."

**Teacher Note: Timing**

Do this section on each team's laptop before the session. Who does it: [FILL IN: you or each team]. The session length in the fill-in table starts after set-up.

**Teacher Note: What the setup scripts do**

They check the laptop, the browser, the camera, and the connection to openrouter.ai. They create a working folder and copy vibe-chat.html into it. They do not install software, change settings, or copy any API key. Running them again is safe: an existing folder and an unchanged file are left alone. They write a file called setup-report.txt that a team can email you if something fails.

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
| Spend limit | The team | vibe-chat Settings, on the team's laptop | vibe-chat stops sending at this amount. The app enforces only this limit. |

#### 3.2 Activity: Open vibe-chat and connect

1. Open vibe-chat.html from the working folder.
2. Enter the team's key: click the camera icon and scan the QR code you show the team, or paste the key by hand. Click Test.
   **Troubleshooting: The camera is blocked or the scan fails:** Allow camera access if the browser asks. If the scan still fails, paste the key by hand.
   **Troubleshooting: Test shows a problem:** The problem appears as a message in the chat window, with advice in English or Hebrew.
3. Pick a model: [FILL IN: model]. Choose it from the list, or choose Other model and type a model name.
4. Open Settings and enter the spend limit: [FILL IN: dollar amount].
   **Look for:** A colored bar at the top runs from green to red as the session spends toward the spend limit. The text beside it shows dollars spent out of the limit. A panel shows tokens in, tokens out, and cost for the last turn, plus the session total. A tilde (~) marks an estimate.
   **Troubleshooting: The bar stays empty:** No spend limit is set, and nothing is stopped. Enter the limit in Settings.
   **Troubleshooting: The team closed or reloaded the tab:** The key is kept only while the tab is open. The team enters it again. The spending totals restart, but the spend limit stays saved in the browser.

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

CSV reading and the arrows passed in a simulated browser only. A row with fewer than three columns or an empty key is skipped, and a warning names the skipped rows. The camera scan has not been tried. How to fix: show a test-keys.csv row on your laptop and scan it with a team laptop. If the camera is blocked, teams can paste the key by hand.

**Teacher Note: Show spending on the main screen: cost-board.html**

cost-board.html shows the current token spend of each team's OpenRouter API key, so the class can watch spending during the workshop. It reads every key in the workspace through the workspace's Management key.

*The Management key.* It belongs to the OpenRouter workspace and can read and manage every API key in it. Only you use it. Never give it to students, put it in the CSV, or show it in qr-key.html. You copy it into cost-board.html. Once pasted, its value is concealed, so you can show the page to the class.

*Two modes, set at start.* You choose the mode when you start the board. To switch modes, start the board again.

| Mode | What the class sees |
| :---- | :---- |
| Whole class | The total spend of every key in the workspace |
| Each team | The spend of each team's key, one line per team |

1. Open cost-board.html by double-clicking it.
2. Paste the workspace's Management key into the page. The value is concealed once pasted.
3. Choose the mode: [FILL IN: whole class or each team]. [TO CONFIRM] How you choose the mode at start.
4. Put the board on the main screen. [TO CONFIRM] Whether it updates on its own, and how often.
5. Afterwards, close the tab.

**Good to know**

* Every key in the workspace appears on the board, and the whole-class total counts all of them. Keep only the team keys in this workspace, and delete test keys before class.
* With one key per team, each line on the board is one team.
* The board reads spending from OpenRouter. Its totals keep counting when a team reloads vibe-chat, unlike the session totals in vibe-chat. [TO CONFIRM] Whether the board shows spending since each key was created or for today only.

**[TO CONFIRM] Test status:** I have no test notes for cost-board.html. How to fix: include it in checklist items 5 and 7.

**Teacher Note: Choosing a model**

Haiku is the smallest and cheapest, Sonnet sits in the middle, and Opus is the most capable.

**Teacher Note: Good to know**

The spend limit is saved in the browser. Totals restart when the page is closed or reloaded, so the key's credit limit in OpenRouter is the only cap teams cannot reset. English and Hebrew messages are built in, and Hebrew text displays right to left. Other languages get English messages.

**Teacher Note: Checking a key outside vibe-chat (optional, technical)**

*Check a key's remaining credit.* OpenRouter reports a key's limit, remaining credit, and usage when asked. In a Mac terminal, with the key in place of PASTE_KEY_HERE:

    curl -s https://openrouter.ai/api/v1/key -H 'Authorization: Bearer PASTE_KEY_HERE'

In Windows PowerShell, type curl.exe instead of curl. Look for limit_remaining and usage in the reply. A key with no limit shows no remaining amount.

*OpenRouter website.* [TO CONFIRM] I did not check where per-key usage appears on the OpenRouter website. How to fix: sign in, open the keys and activity pages, and write here which page shows each key's spending.

Token tracking in Claude Code is in Appendix A.

#### 3.3 Questions

* "What uses up tokens?"
* **Listen for:** both the team's messages (tokens in) and the AI's replies (tokens out).
* "Who sets the spend limit, and who sets the key's credit limit?"
* **Listen for:** the team sets the spend limit in vibe-chat. The teacher's limit in OpenRouter is the real cap.

#### 3.4 Key Terms

* **API key:** A secret password that lets a program use an AI service and be billed for it.
* **Token:** A small chunk of text. Cost depends on how many are used.
* **Model:** The AI itself. Some models are smaller and cheaper. Others are more capable and cost more.

### 4. The Loop: Prompt, Paste, Run, Observe

**Direct students to:** [STUDENT: 4. The Loop: Prompt, Paste, Run, Observe]

**Problem to solve:** Students need one picture of the whole process, and the vibe-chat controls for each step, before they start an activity. Without it, every new goal feels like a new problem, and teams stop at the first thing that goes wrong.

#### 4.1 Concept: The four steps

1. **Prompt.** Describe the goal to the AI in the message box, and send it.
2. **Paste.** Wait for the code to finish. Click Copy code and replace everything in the testing app with it. If the testing app shows errors, send them to the AI and paste the corrected code.
3. **Run.** Run the code the way the activity guide says. For some activities, Run starts with downloading the code to a device.
4. **Observe.** Compare what happened with what the student wanted. If it is different, describe the difference to the AI and ask for revised code. Then repeat the loop.

The activity guide says what each step means for its task.

**Rule for the whole activity:** Students never edit the code line by line. Every revision is a complete replacement. vibe-chat supports this: Copy code stays greyed out until the code is complete, so students cannot copy half a program, and only the latest version is kept.

**Teacher Note: How to teach it**

Draw the four steps on the board before teams start the activity. If a team skips Observe and sends "it doesn't work," send them to 4.4. Ask what they saw.

#### 4.2 Activity: Prompt in vibe-chat

1. Describe the goal in the message box. The activity guide says what to ask for.
2. To add an image or file, click the paperclip. Pasting a screenshot also works.
3. Click the paper airplane to send.
4. Wait for the AI to finish. Code appears in the code window on the right. Read the reply.
   **Troubleshooting: Send is greyed out:** The spend bar is full. Raising the limit in Settings turns Send back on and keeps the chat. [FILL IN: whether teams may raise it or must ask you]
   **Troubleshooting: An error from OpenRouter appears in the chat:** The team's key may have reached its credit limit. The team tells you.

**Starting over:** Reset conversation clears the chat and starts a new conversation. The session's spending totals keep counting. Teams use it only when the activity guide or you say so.

**Teacher Note: Technical detail (optional)**

A reply's cost is known only after it finishes, so spending can land slightly over the spend limit.

#### 4.3 Activity: Paste from vibe-chat

1. Wait until Copy code turns on.
   **Troubleshooting: Copy code stays greyed out:** The code is not complete yet. Wait for the reply to finish.
2. Click Copy code. In the testing app, replace everything with the new code.
3. If the testing app shows errors, copy the exact error text or paste a screenshot into the message box. Ask: "I got these errors. Please return the complete corrected code."
4. Replace all the code with the new version. Repeat until there are no errors.

**Teacher Note: Coaching**

Show students how to take a screenshot if they don't know how. The Student Guide lists the Mac and Windows shortcuts in 4.3.

#### 4.4 Activity: Run and Observe

1. Run the code the way the activity guide says. Let it run long enough to see a pattern, not just a few seconds.
2. Compare what happened with what you wanted.
3. Send the AI a three-part message: "The code did [what you saw]. I wanted it to do [what you expected]. Please return the complete revised code." The activity guide may give its own words for this message.
4. Paste and run the new code. Test again.

| Weak feedback | Stronger feedback |
| :---- | :---- |
| It doesn't work. | When I click the button, nothing happens. I expected the score to go up by one. |

**Teacher Note: How to coach**

Ask, "What did you see?" Do not tell students the fix.

**Teacher Note: Technical detail (optional)**

The loop mirrors how an AI agent works: act, observe the result, compare it with the goal, and adjust. Here, the student is the observer. How much detail the student gives limits how well the AI can revise the code.

#### 4.5 Questions

* Ask any team that is stuck: "Which step are you on?"
* **Listen for:** every team can name the four steps and say which step it is on.
* "Why does Copy code wait until the code is complete?"
* **Listen for:** so you never paste half a program.

#### 4.6 Key Terms

* **Prompt:** The message you send to an AI to tell it what you want.

### 5. Your activity

**Direct students to:** [STUDENT: 5. Your activity]

**Problem to solve:** This guide teaches the tool. The task comes from a separate activity guide, so you can swap tasks without changing this guide.

#### 5.1 Activity: Open your activity guide

1. Open the activity guide: [FILL IN: activity guide name and version].
2. Work through it in order, or as you direct.
3. Keep using the vibe-chat conversation from section 3. The activity guide says when, if ever, to click Reset conversation (see 4.2).
4. When finished, go to section 6.

**Teacher checkpoint.** Before teams start, check that each team has the Student Guide for the activity.

**Teacher Note: Running order**

| When | Guide | Sections |
| :---- | :---- | :---- |
| Before the session | This guide | 2, on each team's laptop |
| Session | This guide | 1, 3, 4, and 5 |
| Session | Activity guide | All sections |
| Session | This guide | 6 |
| Optional | This guide | Appendix A |

**Teacher Note: Swapping in an activity**

To use a different activity, change only the activity guide row in the fill-in table, and hand out that activity's guide pair. Nothing else in this guide changes.

Each activity guide pair must:

1. State its name and version, and the version of this guide it was made for.
2. Name the testing app, where students paste the code.
3. Say what Run means for its task. If the code must first be downloaded to a device, describe that as part of Run, using the device's own word for it (for example, flashing a micro:bit).
4. Have its own Set-Up section for materials, hardware, and the testing app, with a teacher checkpoint. It does not repeat vibe-chat set-up.
5. Give a first objective and a backup prompt that names the language or platform.
6. Have loop sections in the order Prompt, Paste, Run, Observe. Each starts with the step name.
7. Put its own troubleshooting at the step where the problem is expected.
8. Include at least one Extension that changes one thing at a time.
9. List its own learning objectives.
10. State its session length, after set-up.
11. End with its own Appendix A: Trademarks.

Activity guides point to this guide for vibe-chat steps (sending, attaching, Copy code, screenshots, Reset conversation, the spend limit) instead of repeating them. References use the form "vibe-chat guide, 4.3." They never name a different AI tool.

**Teacher Note: Available activities**

| Activity | Guide version | Made for this guide's version | Testing app | Session length, after set-up |
| :---- | :---- | :---- | :---- | :---- |
| Cutebot Explorer for vibe-chat | 0.1 | 0.1 | MakeCode (JavaScript), with a micro:bit and Cutebot | 90 to 120 minutes |

To build a new activity, copy the Cutebot Explorer for vibe-chat guides as a template. Add a row here.

#### 5.2 Questions

* Show cost-board.html in each-team mode. If it is running in whole-class mode, start it again in each-team mode. Poll the class: "Which team has used the most tokens so far? What did they do differently?"
* **Listen for:** more rounds, longer messages, screenshots and files, or a more capable model.

### 6. Summary of Learning Objectives

**Direct students to:** [STUDENT: 6. Summary of Learning Objectives]

[TO CONFIRM] Draft objectives. Approve before use. Each activity guide lists its own objectives too.

| Learning objective | Practiced in | What to look for |
| :---- | :---- | :---- |
| Describe a goal clearly enough for an AI to write code for it | 4.2, activity | The prompt states the goal and what should happen |
| Use the four-step loop: Prompt, Paste, Run, Observe | 4, activity | The team completes more than one full round |
| Give an error back to the AI instead of guessing a fix | 4.3, activity | The team pastes the exact error or a screenshot |
| Describe results in terms of what happened and what was expected | 4.4, activity | Feedback uses "The code did... I wanted..." or the activity's version |
| Explain what tokens are and what uses them | 3 | The student can read the spend bar and name tokens in and out |
| Optional: Explain what a memory file keeps and what is lost | Appendix A | The student can say what the AI forgot after a reset |

### Appendix A: Optional: Saved chats and memory

**Direct students to:** [STUDENT: Appendix A: Optional: Saved chats and memory]

**Problem to solve:** This appendix is optional. No activity needs it. Use it if a team finishes early, or if you want to show how AI memory works. It also holds the optional skill tools.

#### A.1 Concept: How the AI remembers

Two teaching buttons show how memory works. Save chat downloads the conversation as a markdown file. Save memory has the model summarize the conversation into a markdown memory file that a team can load into a new conversation.

#### A.2 Extension: Save and reload a memory

1. Click Save chat. The conversation downloads as a markdown file.
2. Click Save memory. The AI summarizes the conversation into a memory file. The summary costs a few tokens, which count toward spending.
3. Click Reset conversation. The chat starts over, but the session's spending totals keep counting.
4. Load the memory file into the new conversation. [TO CONFIRM: how teams load the memory file]
5. Ask the AI about your earlier work.

**Teacher Note: Before you use this appendix**

Test it on a team laptop with a low-limit key: save the chat, then save and load a memory. [TO CONFIRM] File downloads have not been verified against a real key.

#### A.3 Questions

* "What did the AI remember after you loaded the memory file? What did it forget?"
* **Listen for:** the AI knows only what is in the summary.

**Teacher Note: The Settings skill file**

Settings in vibe-chat holds an optional skill file. [TO CONFIRM] What it does, and whether teams use it.

**Teacher Note: Claude Code and the token-usage-tracker skill (optional, technical)**

If you plan to use Claude Code, start it once with the workshop key. [TO CONFIRM] The steps are not written. How to fix: write them here.

The token-usage-tracker skill makes Claude end every reply in Claude Code with a line in this form, where each x, a, and b stands for a number:

    Last inference used ~xxx tokens (~aaa in / ~bbb out). Entire conversation used ~yyy tokens (~$z.zzzz on <model>, estimated).

The numbers are estimates at roughly four characters per token, not billing. The skill is not used inside vibe-chat, because the app reads exact counts from OpenRouter.

* [TO CONFIRM] Installing it. My notes say students get the skill through Google Drive. I did not find the steps. How to fix: write down where the skill folder goes for Claude Code.
* [TO CONFIRM] Price file. The copy I read takes prices from a file named token-prices.json beside it, and leaves out the dollar figure if the model is not listed. A copy attached in an earlier chat told the model to look prices up online, which a plain chat cannot do. How to fix: use the copy with token-prices.json, and check that its model names match what OpenRouter shows in /model.
* [TO CONFIRM] Other tools. My notes list a token-gym-audit skill that reads Claude Code, Codex, and Cursor logs into a Token Report Card, and OpenRouter's Claude Code guide appears to show a cost display in the status line. I found neither in this project. How to fix: add the first skill's files here, and check OpenRouter's Claude Code guide for the second.

#### A.4 Key Terms

* **Memory file:** A short summary of a conversation that you can load into a new conversation.

### Appendix B: Trademarks

*(Same text in both guides. Check each [VERIFY] line before publishing. Each activity guide has its own trademarks appendix.)*

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
