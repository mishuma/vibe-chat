# Cutebot Explorer for vibe-chat: Student Guide

Version 0.1. Made from the Teacher's Guide, version 0.1.

Before you start this guide, work through your vibe-chat guide up to section 5. Your teacher will tell you which section to open next. If you are working on your own, go through the sections in order. For help, see your vibe-chat guide, section 1.

**How this guide is labeled:** Concept (light blue): the idea behind it · Activity (light green): what you do · Questions (light purple): things to think about · Troubleshooting (light orange): if something goes wrong · Extension (light gray): go further · Key Terms (light yellow): new words

### 1. Introduction

#### 1.1 Concept: What this activity is

In this activity, you make a Cutebot robot drive around on its own and stay inside a black line. You do not write the program yourself. You tell your AI coding assistant in vibe-chat what you want, and the AI writes the code. You test the robot and tell the AI what went wrong. Then the AI writes a better version. You repeat this until the robot does what you want.

**Your job:** You are the observer and tester. The AI writes the code. You decide whether the robot does what you wanted.

First, get ready in section 2, Set-Up. Then see what the loop means for the robot in section 3, The Loop. If something goes wrong, look for the orange Troubleshooting notes at the step you are on.

### 2. Set-Up

**Problem:** You need a working robot, a MakeCode project, and vibe-chat connected before you start.

#### 2.1 Activity: Get ready

**What you need**

* Your team's laptop, set up for vibe-chat, with Chrome or Edge and internet access.
* One BBC micro:bit, version 2 or later.
* One ELECFREAKS Cutebot (the standard Cutebot, not the Cutebot Pro).
* A micro-USB cable that carries data. Some cables only charge and will not work.
* Three AAA batteries in the Cutebot.
* A paper track on the floor with a dark black line at least 1.5 to 2 cm (about ⅝ to ¾ in) wide. Track location: [FILL IN: where]
* vibe-chat, connected with your team's key (vibe-chat guide, section 3).

**Before you start**

* Check the batteries. Weak batteries can make the robot act as if your code is wrong when it is not. If you replace batteries, replace all three at the same time.
* If your Cutebot has the ultrasonic sensor attached, check that it is plugged into the front row of sockets marked for the sonar. A wrongly plugged sensor can stop the robot from moving. You do not need this sensor until section 8.

**Steps**

1. Go to https://makecode.microbit.org and create a new project.
2. Switch from Blocks to JavaScript. You use the JavaScript editor only, not Blocks and not Python.
   **Troubleshooting: MakeCode shows blocks:** Use the Blocks/JavaScript switch at the top of the editor.
3. Add the Cutebot extension. Open Extensions, search for "Cutebot," and choose the ELECFREAKS Cutebot. If you see both "Cutebot" and a Pro version, choose the plain Cutebot.
   **Troubleshooting: You can't find Cutebot in the extension search:** Check your internet connection. Then search for "ELECFREAKS Cutebot."
4. In vibe-chat, check that your key passed Test. Use this one conversation for the whole activity. Do not click Reset conversation. The only exception is in 5.2.

**Check before you move on**

* MakeCode is in JavaScript mode.
* You can see the Cutebot extension in the MakeCode toolbox.
* Batteries are in and the track is on the floor.
* vibe-chat is open, and your key passed Test.

### 3. The Loop: Prompt, Paste, Run, Observe

**Problem:** You know the loop from vibe-chat. Now you need to know what each step means for the robot.

#### 3.1 Concept: The four steps

You learned the loop in your vibe-chat guide, section 4. Here is what each step means for the Cutebot.

1. **Prompt.** Tell the AI what you want the robot to do. Ask for a complete MakeCode JavaScript program.
2. **Paste.** Wait for Copy code to turn on. Copy the code. In MakeCode, select everything, delete it, and paste the new code in its place. If MakeCode shows errors, send them to the AI and paste the corrected program.
3. **Run.** Run has two parts. First, flash the micro:bit: download the program from MakeCode onto it. Then put the micro:bit in the Cutebot and run the robot on the track.
4. **Observe.** Watch what the robot does and compare it with what you wanted. If it is different, tell the AI exactly what you saw and ask for a revised program. Then run the loop again.

Flashing is only the download onto the micro:bit. The robot runs the program after that.

Repeat the loop until the robot does what you wanted. Each step has its own section:

| Step | Section |
| :---- | :---- |
| Prompt | 4. Prompt: Your first objective for Cutebot |
| Paste | 5. Paste: MakeCode shows errors |
| Run | 6. Run: Flash the micro:bit and test the robot |
| Observe | 7. Observe: The robot does the wrong thing |

Remember the rule from vibe-chat guide 4.1: never change the code line by line.

#### 3.2 Questions

* When you get stuck, ask yourself: Which step am I on?
* What is the difference between flashing the micro:bit and running the robot?

#### 3.3 Key Terms

* **Flash (flashing):** Downloading a program from the laptop onto the micro:bit. Flashing is only the download. The robot runs the program afterward.

### 4. Prompt: Your first objective for Cutebot

**Problem:** You need the AI to write a program that works in MakeCode.

#### 4.1 Concept: How the robot sees the line

The Cutebot has two line sensors on its underside. Each one measures how much light bounces back from the floor. Black paper absorbs light, and white paper reflects it. So a sensor can tell black from white.

* One sensor on black: The robot is at the edge of the line and about to cross it.
* Both sensors on black: The robot is on top of the line.

[ADD IMAGE: underside of the Cutebot with the two line sensors labeled]

#### 4.2 Activity: Write your first prompt

**Cutebot objective:** Your Cutebot explores a random path inside a thick black line (the track). Whenever it reaches the edge, it turns and continues in a different direction.

**Prompting objective:** Turn the Cutebot objective into a clear, well-worded prompt.

**Steps**

1. In vibe-chat, send a prompt that describes the Cutebot objective. For example: "Make my Cutebot drive around randomly without crossing a black line."
2. Wait for the AI to finish writing. Then read its answer. **Look for:** What did the AI decide on its own, such as speed, turning, and what happens at the start? Did it add anything you did not ask for? If so, ask the AI why.
   **Troubleshooting: The AI gives blocks or Python:** Tell it, "Use MakeCode JavaScript only."
   **Troubleshooting: The AI lists changes instead of code:** Tell it, "Return the complete code I should paste into MakeCode."
3. When Copy code turns on, click it. Paste the code into MakeCode, replacing everything that was there.
4. Run the rest of the loop: fix any errors (section 5), flash the micro:bit and run the robot (section 6), and observe the robot (section 7).

**You should see:** One block of JavaScript code in the vibe-chat code window. Your code may be different from other teams' code.

**Backup prompt (use only if your teacher tells you to):**

Write complete MakeCode JavaScript for a micro:bit with the ELECFREAKS Cutebot extension (the standard Cutebot, not Cutebot Pro). The code must paste directly into the MakeCode JavaScript editor. The Cutebot should wait for Button A, count down 3-2-1, then drive around on the floor. It should use the line sensors to avoid crossing a thick black border. Return only the complete code in one JavaScript code block.

#### 4.3 Questions

* What did your AI decide that you did not ask for?
* What does it mean when one sensor is on black? When both are?

#### 4.4 Key Terms

* **Line sensor:** A small sensor under the robot. It tells dark from light by measuring how much light bounces back from the floor.

### 5. Paste: MakeCode shows errors

**Problem:** You pasted the program, and MakeCode shows red errors.

#### 5.1 Concept: Why the AI's code can be out of date

AI coding assistants learn from information that stops at a certain date, called the training cutoff. The Cutebot extension can change after that date. So the AI may use names that are out of date. This is normal, and it is why you test everything.

#### 5.2 Activity: Fix errors with the AI

1. Read the error message. Check that the Cutebot extension is added (see 2.1). If it was missing, add it and see whether the error goes away.
2. If errors remain, copy the exact error text from MakeCode. If that doesn't work, paste a screenshot into vibe-chat instead. The shortcuts are in your vibe-chat guide, 4.3.
3. Send the errors in vibe-chat: "I pasted the code into MakeCode and got these errors: [paste the errors or screenshot]. Please return a complete corrected MakeCode JavaScript program."
4. Optional: MakeCode has a built-in AI that can help fix errors. You can try it. You cannot break anything by experimenting.
5. Replace all the code with the new program. Repeat until there are no errors.
   **Troubleshooting: The same error keeps coming back after three rounds:** Check that the Cutebot extension is added and MakeCode is in JavaScript mode (see 2.1). If both are right, ask your teacher about starting over. If your teacher agrees, click Reset conversation in vibe-chat (vibe-chat guide, 4.2). Send the backup prompt from 4.2, plus the error.

**You should see:** No errors, usually within 1 to 3 rounds.

#### 5.3 Questions

* Why did the AI give you code with errors after it said the code was finished?

#### 5.4 Key Terms

* **Training cutoff:** The date after which an AI has no new information. It may not know about changes made after that date.

### 6. Run: Flash the micro:bit and test the robot

**Problem:** MakeCode shows no errors. You need to flash the program onto the micro:bit, then run it on the Cutebot.

#### 6.1 Activity: Flash the micro:bit

Flashing downloads the program from MakeCode onto the micro:bit. It is the first part of Run.

1. Connect the micro:bit to your laptop with the USB cable.
   **Troubleshooting: Your laptop does not show a MICROBIT drive:** Try a different USB cable. Some cables only charge.
2. Select Download in MakeCode. The first time, MakeCode asks you to pair the micro:bit. Choose the micro:bit from the list.
   **Troubleshooting: MakeCode downloads a .hex file instead:** Drag that file from your Downloads folder onto the drive named MICROBIT.
3. Wait until the transfer finishes. The yellow light on the back of the micro:bit blinks while it transfers.

#### 6.2 Activity: Run the robot

1. Switch the Cutebot off. Unplug the micro:bit from the laptop. Put it into the Cutebot with the 5x5 light display facing forward.
2. Switch the Cutebot on. Put it on the floor inside the track.
3. Start the program. If it waits for Button A, press A.
   **Troubleshooting: The robot does not move at all:** Switch it on, replace all three batteries, push the micro:bit in fully, and take off the ultrasonic sensor to test.
   **Troubleshooting: The robot starts driving as soon as it is switched on:** Ask the AI, "Make the robot wait for Button A, then count down 3-2-1 before driving."

**Safety:** Test on the floor, never on a desk or table. Keep the robot away from feet, cables, bags, and stairs.

**You should see:** The robot starts when the program tells it to and moves on the track.

### 7. Observe: The robot does the wrong thing

**Problem:** The robot runs, but it does not do what you wanted.

#### 7.1 Activity: Observe, then tell the AI

1. Check the robot first. See the Troubleshooting notes in 6.2 and below. A hardware problem can look like a code problem.
2. Let the robot run long enough to see a pattern, not just a few seconds. **Look for:** What does it do near the black line? Does it cross the line? Does it turn enough? Does it stay on one side of the track?
   **Troubleshooting: The robot is slow or stops partway:** Replace all three batteries together.
   **Troubleshooting: The robot ignores the line:** Check that the line is dark black and at least 1.5 to 2 cm (about ⅝ to ¾ in) wide. If it is, describe what the robot does to the AI.
3. Send the AI this message in vibe-chat, with your own words filled in: "The robot did [what you saw]. I wanted it to do [what you expected]. Please return a complete revised MakeCode JavaScript program."
4. Replace all the code, flash the micro:bit again, and run the robot again. **Look for:** What changed after the AI revised the program?

Be specific. Compare these:

| Weak | Stronger |
| :---- | :---- |
| It's not staying inside the track. | It drives too fast across the black line. |
| Make it turn more. | When it detects the line, make it back up slightly more before it turns in another direction. |

#### 7.2 Questions

* What did your Cutebot do the first time you tested it?

### 8. Try a new behavior

**Problem:** Your robot stays inside the border, and you want it to do more.

#### 8.1 Extension: One change at a time

Choose one change. Ask the AI for a complete new program. Then run the loop again: Prompt, Paste, Run, Observe.

* **Avoid an obstacle:** Make the robot turn away from an object, such as your hand, using the ultrasonic sensor at the front. First, check that the sensor is plugged into the front sockets.
* **Beep at the line:** Make the robot beep once when it detects the black line. The Cutebot has a built-in buzzer.
* **Extra challenge, follow the line:** Make the robot follow the black line instead of avoiding it.

Ask for one change at a time. If something breaks, you will know which change caused it. **Look for:** Which change caused each new behavior or problem?

**Troubleshooting: An old behavior stops working:** Tell the AI which one, using the three-part message from 7.1.

#### 8.2 Questions

* What would you ask the robot to do next?

#### 8.3 Key Terms

* **Ultrasonic sensor:** A sensor that measures distance. It sends out sound too high for people to hear and times the echo.

### 9. Summary of Learning Objectives

By the end of this activity, you can:

* Describe a robot behavior clearly enough for an AI to write a program for it.
* Use the four-step loop: Prompt, Paste, Run, Observe.
* Give an error message back to the AI instead of guessing a fix.
* Describe robot behavior in terms of what happened and what you expected.
* Explain why an AI can produce wrong or out-of-date code, and why you, the tester, decide whether it works.
* Change one thing at a time and tell which change caused a result.
* Explain how two line sensors tell the robot where it is compared with the line.

When you finish, go back to your vibe-chat guide, section 6.

### Appendix A: Trademarks

*(Same as the Teacher's Guide.)*

* BBC is a trademark of the British Broadcasting Corporation. [VERIFY]
* micro:bit is a trademark of the Micro:bit Educational Foundation. Learn more at microbit.org.
* ELECFREAKS and Cutebot are trademarks of Shenzhen ELECFREAKS Technology Co., Ltd. [VERIFY]
* Microsoft, MakeCode, Windows, and Edge are trademarks of the Microsoft group of companies. [VERIFY]
* Apple and Mac are trademarks of Apple Inc., registered in the U.S. and other countries. [VERIFY]
* Google and Chrome are trademarks of Google LLC. [VERIFY]
* JavaScript is a trademark of Oracle Corporation in the U.S. and other countries. [VERIFY]
* Python is a trademark of the Python Software Foundation. [VERIFY]
* All other trademarks are the property of their respective owners.
