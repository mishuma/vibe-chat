# Cutebot Explorer for vibe-chat: Teacher's Guide

Template. Version 0.1.
Companion document: Cutebot Explorer for vibe-chat: Student Guide, version 0.1.
Runs inside: Intent-Based Development: Teacher's Guide, version 0.1 (the vibe-chat guide).
Based on: Cutebot Explorer: Teacher's Guide, version 0.2.

#### Teacher Note: How to use this guide

This guide is an activity for the vibe-chat guide. Teams set up and connect vibe-chat first, using the vibe-chat guide. This guide covers the robot, MakeCode, and the task. Before you use it, read the age disclaimer at the top of the vibe-chat Teacher's Guide.

Students work in teams of 1 or 2, with one laptop and one Cutebot per team.

Sections 1 to 9 match the Student Guide one for one. The numbers and titles are the same in both guides.

Each section starts with a marker, such as [STUDENT: 2. Set-Up]. The marker is the exact number and title of the matching Cutebot Explorer Student Guide section. Say it aloud or write it on the board. Markers are plain text, so they also work on printed copies.

References to the vibe-chat guide are written as "vibe-chat guide, 4.3." The number is the same in the vibe-chat Teacher's Guide and Student Guide.

| Label | Meaning | In Student Guide? |
| :---- | :---- | :---- |
| Concept | The idea behind the activity | Yes |
| Activity | What students do | Yes |
| Questions | Questions to ask the class | Yes, shorter |
| Troubleshooting | A problem students may hit at this step, and the fix | Yes |
| Extension | Optional deeper exploration | Yes |
| Key Terms | AI and hardware terms, at the end of a section | Yes |
| Teacher Note | Coaching, timing, setup, and technical detail | No |

Complete the text in [FILL IN: ...] brackets before class. Make a copy of both guides for each class first.

#### Teacher Note: Running order and timing

The session takes 90 to 120 minutes. vibe-chat set-up (vibe-chat guide, section 2) is done on each team's laptop before the session and is not part of this time.

| When | Guide | Sections |
| :---- | :---- | :---- |
| Before the session | vibe-chat guide | 2, on each team's laptop |
| Session | vibe-chat guide | 1, 3, 4, and 5 |
| Session | This guide | 1 to 9 |
| Session | vibe-chat guide | 6 |
| Optional | vibe-chat guide | Appendix A |

#### Teacher Note: Fill in before class

Class, date, teams, model, spend limit, and contact go in the vibe-chat Teacher's Guide fill-in table. In that table, set the activity guide to "Cutebot Explorer for vibe-chat, version 0.1."

| Item | Your answer |
| :---- | :---- |
| Where the tracks are laid out | [FILL IN: room or area] |

#### Teacher Note: How the two guides stay matched

This guide is the master. The Student Guide is made from it. To change what students see, change this guide first. Then update the Student Guide to match. An AI assistant can do the check. Do not edit the Student Guide on its own, or the two will stop matching. When the vibe-chat guide changes a section number, update the references in both guides. Add a row to the version log for every update.

| Version | Date | What changed in this guide | Student guide updated |
| :---- | :---- | :---- | :---- |
| 0.1 | 2026-11-02 | First version of the vibe-chat edition, based on Cutebot Explorer v0.2. The AI is reached through vibe-chat. The loop is Prompt, Paste, Run, Observe. Flash means only downloading the program to the micro:bit. Section 6 has two parts: 6.1 Flash and 6.2 Run. Browsers are named only in 2.1. Track width is 1.5 to 2 cm (about ⅝ to ¾ in). Teams of 1 or 2. Session 90 to 120 minutes after set-up. | Yes, version 0.1 |

### 1. Introduction

**Direct students to:** [STUDENT: 1. Introduction]

#### 1.1 Concept: What this activity is

Students program an ELECFREAKS Cutebot robot without writing code. They ask an AI coding assistant in vibe-chat for a complete MakeCode JavaScript program. They test the robot on a paper track, describe what went wrong, and ask for a revised program. They repeat this loop until the robot stays inside a black line border. This way of working is called vibe coding (vibe-chat guide, 1.2).

The student's job is to observe and test. The AI writes the code. The student decides whether the robot's behavior matches the goal.

**Teacher Note:** You do not need programming experience. You need to be able to watch the robot and tell whether it did what the student asked for. Teams must finish vibe-chat guide sections 1, 3, and 4 before they start this guide.

### 2. Set-Up

**Direct students to:** [STUDENT: 2. Set-Up]

**Problem to solve:** Every team needs working hardware, a MakeCode project in JavaScript mode, and vibe-chat connected before anyone writes a prompt. Most "the code is wrong" reports later in the session come from skipped set-up steps.

#### 2.1 Activity: Get ready

**What each team needs**

* The team's laptop, set up for vibe-chat before the session (vibe-chat guide, section 2), with Chrome or Edge and internet access.
* One BBC micro:bit, version 2 or later.
* One ELECFREAKS Cutebot. Use the standard Cutebot, not the Cutebot Pro. The Pro has four line sensors, and this activity assumes two.
* A micro-USB cable that carries data. A charge-only cable will not show the MICROBIT drive on the laptop.
* Three AAA batteries for the Cutebot.
* A paper track on the floor, with a dark black line at least 1.5 to 2 cm (about ⅝ to ¾ in) wide.
* vibe-chat, connected with the team's key (vibe-chat guide, section 3).

**What students do**

1. Open https://makecode.microbit.org and create a new project.
2. Switch from Blocks to JavaScript. Students use the JavaScript editor only, not Blocks and not Python.
   **Troubleshooting: MakeCode is in Blocks mode:** Use the Blocks/JavaScript switch at the top of the editor.
3. Add the Cutebot extension. Open Extensions, search for "Cutebot," and choose the ELECFREAKS Cutebot. If both "Cutebot" and a Pro version appear, choose the plain Cutebot.
   **Troubleshooting: No Cutebot in the extension search:** Check the internet connection, then search for "ELECFREAKS Cutebot."
4. In vibe-chat, check that the team's key passed Test (vibe-chat guide, 3.2). Teams use this one conversation for the whole activity and do not click Reset conversation. The only exception is in 5.2.

**Teacher checkpoint.** Before moving on, look at each team's screen and robot. Check that:

* MakeCode is in JavaScript mode.
* The Cutebot extension appears in the MakeCode toolbox.
* Batteries are in and the track is on the floor.
* vibe-chat is open, and the team's key passed Test.

**Teacher Note: Before class**

* Install fresh batteries in every Cutebot. Replace all three at the same time. Weak batteries make a robot act as if the code is wrong when it is not.
* If a Cutebot has the ultrasonic sensor module attached, check that it is plugged into the front row of sockets marked for the sonar. A wrongly installed sensor can stop the robot from moving at all. The border task does not use this sensor, so you can leave it off until section 8.
* Lay out the tracks on the floor, away from stairs and walkways. Many Cutebot kits include a printed line-tracking map. To make your own, draw a black border on a large white sheet with dark black ink at least 1.5 to 2 cm (about ⅝ to ¾ in) wide. Check that the ink does not soak through onto the floor.

**Teacher Note: Technical detail (optional)**

MakeCode extensions are versioned. The AI may have been trained on an older version of the extension, so function names in its code can differ from the current extension. That is the usual cause of the errors in section 5.

### 3. The Loop: Prompt, Paste, Run, Observe

**Direct students to:** [STUDENT: 3. The Loop: Prompt, Paste, Run, Observe]

**Problem to solve:** Teams learned the loop in vibe-chat guide section 4. They need to see what each step means for the robot, and that flashing is only the download onto the micro:bit.

#### 3.1 Concept: The four steps

1. **Prompt.** Tell the AI what the robot should do. Ask for a complete MakeCode JavaScript program.
2. **Paste.** Wait for Copy code to turn on. Copy the code and replace everything in MakeCode with it. If MakeCode shows errors, send them to the AI and paste the corrected program.
3. **Run.** Run has two parts. First, flash the micro:bit: download the program from MakeCode onto it. Then put the micro:bit in the Cutebot and run the robot on the track.
4. **Observe.** Compare what the robot did with what the student wanted. If it is different, describe the difference to the AI and ask for a revised program. Then repeat the loop.

Flashing is only the download onto the micro:bit. The robot runs the program after that.

| Step | Section |
| :---- | :---- |
| Prompt | 4. Prompt: Your first objective for Cutebot |
| Paste | 5. Paste: MakeCode shows errors |
| Run | 6. Run: Flash the micro:bit and test the robot |
| Observe | 7. Observe: The robot does the wrong thing |

The rule for the whole activity is in vibe-chat guide 4.1: students never edit the code line by line.

**Teacher Note: How to teach it**

Draw the four steps on the board. Under Run, write its two parts: flash the micro:bit, then run the robot. If a team skips Observe and sends "it doesn't work" to the AI, send them to section 7. Ask what they saw the robot do.

#### 3.2 Questions

* Ask any team that is stuck: "Which step are you on?"
* **Listen for:** every team can name the four steps and say which step it is on.
* "What is the difference between flashing the micro:bit and running the robot?"
* **Listen for:** flashing copies the program onto the micro:bit. Running is when the robot carries out the program.

#### 3.3 Key Terms

* **Flash (flashing):** Downloading a program from the laptop onto the micro:bit. Flashing is only the download. The robot runs the program afterward.

### 4. Prompt: Your first objective for Cutebot

**Direct students to:** [STUDENT: 4. Prompt: Your first objective for Cutebot]

**Problem to solve:** Students do not yet know how to ask an AI for code that works in MakeCode.

#### 4.1 Concept: How the robot sees the line

The Cutebot has two line sensors on its underside. Each sensor measures reflected infrared light. Black absorbs more light than white, so a sensor over black reads differently from a sensor over white. One sensor on black means the robot is near the line and drifting across it. Both sensors on black means the robot is directly on the line. [ADD IMAGE: underside of the Cutebot with the two line sensors labeled]

#### 4.2 Activity: Write your first prompt

**Cutebot objective:** The Cutebot explores a random path inside a thick black line (the track). Whenever it reaches the edge, it turns and continues in a different direction.

**Prompting objective:** Students turn the Cutebot objective into a clear, well-worded prompt. Example: "Make my Cutebot drive around randomly without crossing a black line."

**What students do**

1. In vibe-chat, send a prompt that describes the Cutebot objective, such as the example above (vibe-chat guide, 4.2).
2. Wait for the AI to finish. Read the response. Look for what the AI assumed, such as speed, turning, and what happens at the start. If it added something that was not requested, ask the AI why.
   **Troubleshooting: The AI gives blocks or Python:** Tell it, "Use MakeCode JavaScript only."
   **Troubleshooting: The AI lists changes instead of complete code:** Tell it, "Return the complete code I should paste into MakeCode." This is the most common cause of mismatched code later.
3. When Copy code turns on, click it. Paste the code into MakeCode, replacing everything that was there (vibe-chat guide, 4.3).
4. Run the rest of the loop: sections 5, 6, and 7.

**Backup prompt (students also have this in their guide):**

Write complete MakeCode JavaScript for a micro:bit with the ELECFREAKS Cutebot extension (the standard Cutebot, not Cutebot Pro). The code must paste directly into the MakeCode JavaScript editor. The Cutebot should wait for Button A, count down 3-2-1, then drive around on the floor. It should use the line sensors to avoid crossing a thick black border. Return only the complete code in one JavaScript code block.

**What you should see:** One block of JavaScript code in the vibe-chat code window. Not all versions will be the same. A good first program might wait for Button A, so the robot does not drive away the moment it is switched on.

**Teacher Note: Timing**

If you are short on time, tell teams to use the backup prompt. It usually works on the first try, but students learn less about the AI's assumptions.

#### 4.3 Questions

* "What did your AI decide on its own, such as speed, turning, or how the robot starts?"
* Poll the class: "Did your AI add something that other teams did not get?"
* "What does it mean when one line sensor is on black? When both are?"

#### 4.4 Key Terms

* **Line sensor:** A small sensor under the robot. It tells dark from light by measuring how much light bounces back from the floor.

### 5. Paste: MakeCode shows errors

**Direct students to:** [STUDENT: 5. Paste: MakeCode shows errors]

**Problem to solve:** The pasted program has red errors, and students want to fix them by hand.

#### 5.1 Concept: Why the AI's code can be out of date

An AI coding assistant learns from information collected up to a certain date, called its training cutoff. The Cutebot extension can change after that date. So the AI may use names that no longer work. This is normal. It is why the tester, not the AI, decides whether the code works.

**Teacher Note: Technical detail (optional)**

[TO CONFIRM] Whether the models in vibe-chat can read web pages. If they cannot, students can paste text from the current ELECFREAKS Cutebot documentation into the message box, or save the page as a PDF and attach it with the paperclip. Use this moment to talk about why the AI was wrong, not only how to fix it.

#### 5.2 Activity: Fix errors with the AI

1. Read the error message. Check that the Cutebot extension is added (see 2.1). If it was missing, add it and see whether the error goes away.
2. If errors remain, copy the exact error text from MakeCode. If that doesn't work, paste a screenshot into vibe-chat instead (vibe-chat guide, 4.3).
3. Send the errors in vibe-chat: "I pasted the code into MakeCode and got these errors: [paste the errors or screenshot]. Please return a complete corrected MakeCode JavaScript program."
4. Optional: try MakeCode's built-in AI feature for fixing errors.
5. Replace all the code with the new program. Repeat until MakeCode shows no errors.
   **Troubleshooting: The same error appears after three rounds:** Check that the Cutebot extension is added and MakeCode is in JavaScript mode (see 2.1). If both are correct, have the team click Reset conversation in vibe-chat (vibe-chat guide, 4.2). They send the backup prompt from 4.2, plus the error. This is the only time teams leave their original conversation.

**What you should see:** No errors, usually within 1 to 3 rounds.

**Teacher Note: Coaching**

* Show students how to take a screenshot if they don't know how. The shortcuts are in vibe-chat guide 4.3.
* Let students experiment with MakeCode's built-in AI. It may fix the problem, and they can't break anything.

#### 5.3 Questions

* "Why did the AI give you code with errors after it said the code was finished?"
* **Listen for:** the AI learned from older information, the extension changed, and testing is how you find out.

#### 5.4 Key Terms

* **Training cutoff:** The date after which an AI has no new information. It may not know about changes made after that date.

### 6. Run: Flash the micro:bit and test the robot

**Direct students to:** [STUDENT: 6. Run: Flash the micro:bit and test the robot]

**Problem to solve:** The program has no errors. Students need to flash it onto the micro:bit, then run it safely on the robot.

#### 6.1 Activity: Flash the micro:bit

Flashing downloads the program from MakeCode onto the micro:bit. It is the first part of Run.

1. Connect the micro:bit to the laptop with the USB cable.
   **Troubleshooting: The laptop does not show a MICROBIT drive:** The USB cable may be charge-only. Try another cable.
2. Select Download in MakeCode. MakeCode sends the program straight to the micro:bit. The first time, MakeCode asks students to pair the micro:bit. They choose it from the list.
   **Troubleshooting: MakeCode downloads a .hex file instead:** Drag that file from the Downloads folder onto the drive named MICROBIT.
3. Wait for the transfer to finish. The yellow light on the back of the micro:bit blinks during the transfer.

**Teacher Note: Technical detail (optional)**

Direct sending uses a browser feature called WebUSB. It also needs micro:bit firmware version 0249 or later, which current micro:bit boards normally have.

#### 6.2 Activity: Run the robot

1. Switch the Cutebot off. Disconnect the micro:bit from the laptop. Insert it into the Cutebot with the 5x5 LED display facing forward.
2. Switch the Cutebot on and place it on the floor inside the track.
3. Start the program. If the program waits for Button A, press it.
   **Troubleshooting: The robot does not move at all:** Likely cause: the Cutebot is off, the batteries are weak, the micro:bit is not seated, or the ultrasonic sensor is in the wrong sockets. Switch it on, replace all three batteries, reseat the micro:bit, and remove the ultrasonic sensor to test.
   **Troubleshooting: The robot starts driving as soon as it is switched on:** The program does not wait for Button A. Ask the AI: "Make the robot wait for Button A, then count down 3-2-1 before driving."

**Safety:** Test on the floor, never on a desk or table. Keep the robot away from feet, cables, bags, and stairs.

**What you should see:** The robot starts when the program tells it to and begins moving on the track.

### 7. Observe: The robot does the wrong thing

**Direct students to:** [STUDENT: 7. Observe: The robot does the wrong thing]

**Problem to solve:** The robot runs, but not as the student wanted. Students tend to report "it doesn't work," which gives the AI nothing to act on.

#### 7.1 Activity: Observe, then tell the AI

1. Rule out hardware problems first. See the Troubleshooting notes in 6.2 and below.
2. Let the robot run long enough to see a pattern, not just a few seconds. Watch what it does near the black line. Does it cross the line? Does it turn enough? Does it stay on one side of the track?
   **Troubleshooting: The robot is slow or stops partway:** Weak batteries. Replace all three batteries together.
   **Troubleshooting: The robot ignores the line:** The line may be too faint or too narrow, or the program may not use the sensors as intended. Check that the ink is dark black and at least 1.5 to 2 cm (about ⅝ to ¾ in) wide. If it is, describe the behavior to the AI.
3. Send the AI a three-part message in vibe-chat: "The robot did [what you saw]. I wanted it to do [what you expected]. Please return a complete revised MakeCode JavaScript program."
4. Replace all the code, flash the micro:bit again, and run the robot again.

| Weak feedback | Stronger feedback |
| :---- | :---- |
| It's not staying inside the track. | It drives too fast across the black line. |
| Make it turn more. | When it detects the line, make it back up slightly more before it turns in another direction. |

**Teacher Note: How to coach**

Ask, "What did you see?" Do not tell students the fix. The message in step 3 is the three-part message from vibe-chat guide 4.4, in robot words.

**Teacher Note: Technical detail (optional)**

The loop mirrors how an AI agent works: act, observe the result, compare it with the goal, and adjust. Here, the student is the observer. How much detail the student gives limits how well the AI can revise the code.

#### 7.2 Questions

* "What did your Cutebot do the first time you tested it?"
* "What did you tell the AI after something did not work?"
* "What changed after the AI revised the program?"

### 8. Try a new behavior

**Direct students to:** [STUDENT: 8. Try a new behavior]

**Problem to solve:** The robot stays inside the border, and the team wants to extend it. Several changes at once make it hard to tell which one broke something.

#### 8.1 Extension: One change at a time

Teams choose one change and ask the AI for a complete new program. Then they run the loop again: Prompt, Paste, Run, Observe.

* **Avoid an obstacle:** The robot turns away from an object, such as a hand, using the ultrasonic sensor at the front. Before this change, check that the ultrasonic sensor is in the front sockets.
* **Beep at the line:** The robot beeps once when it detects the black line. The Cutebot has a built-in buzzer.
* **Extra challenge, follow the line:** The robot follows the black line instead of avoiding it.

Ask for one change at a time. If a new problem appears, students know which change caused it.

**Troubleshooting: An old behavior stops working:** Students tell the AI which behavior broke, using the three-part message from 7.1.

#### 8.2 Questions

* "Which change caused this new behavior or problem?"
* "What would you ask the robot to do next?"

#### 8.3 Key Terms

* **Ultrasonic sensor:** A sensor that measures distance. It sends out sound too high for people to hear and times the echo.

### 9. Summary of Learning Objectives

**Direct students to:** [STUDENT: 9. Summary of Learning Objectives]

By the end of the activity, a student can do the following. The vibe-chat guide, section 6, lists objectives for the tool.

| Learning objective | Practiced in | What to look for |
| :---- | :---- | :---- |
| Describe a robot behavior clearly enough for an AI to write a program for it | 4 | The student's prompt states the robot, the language, and the behavior |
| Use the four-step loop: Prompt, Paste, Run, Observe | 3 to 8 | The team completes more than one full round |
| Give an error message back to the AI instead of guessing a fix | 5 | The team pastes the exact error into vibe-chat |
| Describe robot behavior in terms of what happened and what was expected | 7 | Feedback uses "The robot did... I wanted..." |
| Explain why an AI can produce wrong or out-of-date code, and that the tester decides whether it works | 5 | The student can explain why an error appeared after the AI gave "finished" code |
| Change one thing at a time and identify which change caused a result | 8 | The student can name the change that caused a new behavior or problem |
| Explain how two line sensors tell the robot where it is relative to the line | 4 | The student can say what one sensor on black means and what two sensors on black mean |

### Appendix A: Trademarks

*(Same text in both guides. Check each [VERIFY] line before publishing. The vibe-chat guide has its own trademarks appendix.)*

* BBC is a trademark of the British Broadcasting Corporation. [VERIFY]
* micro:bit is a trademark of the Micro:bit Educational Foundation. Learn more at microbit.org.
* ELECFREAKS and Cutebot are trademarks of Shenzhen ELECFREAKS Technology Co., Ltd. [VERIFY]
* Microsoft, MakeCode, Windows, and Edge are trademarks of the Microsoft group of companies. [VERIFY]
* Apple and Mac are trademarks of Apple Inc., registered in the U.S. and other countries. [VERIFY]
* Google and Chrome are trademarks of Google LLC. [VERIFY]
* JavaScript is a trademark of Oracle Corporation in the U.S. and other countries. [VERIFY]
* Python is a trademark of the Python Software Foundation. [VERIFY]
* All other trademarks are the property of their respective owners.
