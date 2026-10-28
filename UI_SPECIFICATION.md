# UI & UX Design System Specification
## Accenture Online Assessment (OA) Portal Simulator

**Platform Target:** High-Fidelity Replication of Mercer Mettl / HirePro / Wheebox / Aon CoCubes Enterprise Assessment Engines  
**Version:** 1.0.0  
**Author:** Antigravity Architecture & Design  
**Status:** Approved for Implementation  

---

## 1. Design Principles & Aesthetic Blueprint

The simulator must evoke the exact visual and psychological experience of sitting for an enterprise campus recruitment exam:
1. **High Focus & Zero Distractions:** Crisp, enterprise layout with neutral high-contrast surfaces and purposeful accent colors.
2. **Signature Accent Branding:** High-visibility corporate purple (`#460073` / `#A100FF`) reflecting Accenture's signature branding symbol (`> accenture`).
3. **Information Density with Clean Separation:** Two-pane or three-pane split layouts with smooth draggable splitters, clear headers, persistent timers, and real-time status badges.
4. **Authentic Psychological Pressure:** Timers that shift from neutral slate to alarming amber and urgent pulsing red as time dwindles, accompanied by prominent proctoring status badges.

---

## 2. Color Palette & Typography Tokens

### 2.1 Color Palette
```css
:root {
  /* Brand Tokens */
  --accent-purple: #7500C0;
  --accent-purple-dark: #460073;
  --accent-purple-light: #F3E8FF;
  --accent-purple-border: #D8B4FE;

  /* Surface & Background */
  --bg-app: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-surface-subtle: #F1F5F9;
  --border-color: #E2E8F0;
  --border-strong: #CBD5E1;

  /* Dark Mode & Code Editor */
  --editor-bg: #1E1E1E;
  --editor-gutter: #2D2D2D;
  --editor-text: #D4D4D4;
  --editor-selection: #264F78;

  /* Status Tokens (Palette Indicators) */
  --status-not-visited-bg: #FFFFFF;
  --status-not-visited-text: #64748B;
  --status-not-visited-border: #CBD5E1;

  --status-unanswered-bg: #FEE2E2;
  --status-unanswered-text: #DC2626;
  --status-unanswered-border: #F87171;

  --status-answered-bg: #10B981;
  --status-answered-text: #FFFFFF;
  --status-answered-border: #059669;

  --status-review-bg: #8B5CF6;
  --status-review-text: #FFFFFF;
  --status-review-border: #6D28D9;

  --status-urgent-timer: #EF4444;
  --status-warning-timer: #F59E0B;
}
```

### 2.2 Typography
- **Primary Interface Font:** `'Inter'`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`.
- **Code & Monospace Font:** `'JetBrains Mono'`, `'Fira Code'`, `'Cascadia Code'`, `Consolas`, `monospace`.
- **Heading Scales:**
  - Screen Title: `1.25rem` (`20px`), Bold (`700`).
  - Section Header: `1.0rem` (`16px`), Semi-bold (`600`).
  - Question Prompt: `1.125rem` (`18px`), Regular (`400`) / Medium (`500`).
  - Options / Code Body: `0.9375rem` (`15px`), Line-height: `1.6`.

---

## 3. Screen Layouts & Component Breakdown

### 3.1 Global Assessment Header
- **Left Wing:**
  - Accenture Corporate Wordmark: `> accenture` in bold white or deep purple font.
  - Test Title Badge: `Accenture Campus Hiring 2025-2026 | Associate Software Engineer (ASE)`.
- **Center Wing:**
  - Section Navigator (Round 1):
    - `English Ability (17)`
    - `Critical Reasoning (18)`
    - `Abstract Reasoning (15)`
    - `Common Apps (12)`
    - `Pseudocode (18)`
    - `Networking & Cloud (10)`
  - Active Section highlighted with a solid purple underline or pill badge.
- **Right Wing:**
  - Candidate Profile Pill: Avatar with Candidate Name and Roll Number.
  - Proctoring Status Pill: `🟢 Webcam Connected | 🎤 Mic Active`.
  - Global Timer Widget: `⏱️ 89:45 Remaining` (Turns pulsing amber at $< 15$ mins, flashing red at $< 5$ mins).
  - Primary Action Button: `[ Finish Test / Submit Exam ]` (with confirmation modal).

---

### 3.2 Round 1: Cognitive & Technical Question Interface

```
+-----------------------------------------------------------------------------------------------+
| > accenture   [English] [Critical Reasoning] [Abstract] [MS Office] [Pseudocode] [Cloud]      |
+-------------------------------------------------------+---------------------------------------+
| QUESTION 42 OF 90                     [🔖 Review Later]| QUESTION PALETTE                      |
+-------------------------------------------------------+                                       |
| Topic: Pseudocode | Difficulty: Medium | Marks: 1.0   | Total: 90 | Answered: 35 | Review: 4  |
|                                                       |                                       |
| What will be the output of the following pseudocode?  |  1   2   3   4   5   6   7   8   9  10|
|                                                       | [G] [G] [G] [R] [P] [G] [G] [W] [W] [W]|
| ```text                                               | 11  12  13  14  15  16  17  18  19  20|
| Integer a, b, c                                       | [W] [W] [W] [W] [W] [W] [W] [W] [W] [W]|
| Set a = 5, b = 10, c = 2                              | ...                                   |
| if ((a ^ b) > (c + 1))                                | 81  82  83  84  85  86  87  88  89  90|
|     a = (b >> 1) + c                                  | [W] [W] [W] [W] [W] [W] [W] [W] [W] [W]|
| else                                                  |                                       |
|     b = (a & c) + 1                                   | LEGEND:                               |
| end if                                                | [G] Answered (35)                     |
| print a + b + c                                       | [R] Visited & Not Answered (1)        |
| ```                                                   | [P] Marked for Review (4)             |
|                                                       | [W] Not Visited (50)                  |
| Select one option:                                    |                                       |
| ( ) A. 19                                             | [📹 WEBCAM PROCTOR PREVIEW]           |
| ( ) B. 12                                             | +-----------------------------------+ |
| ( ) C. 15                                             | | Candidate Face Detected (AI Proct)| |
| ( ) D. 22                                             | +-----------------------------------+ |
|                                                       |                                       |
| [ 🔄 Clear Choice ]         [ ⬅ Previous ] [ Save & Next ➡ ]                                  |
+-----------------------------------------------------------------------------------------------+
```

---

### 3.3 Round 2: Coding IDE Split Screen

- **Left Split (Problem Workspace):**
  - Problem title, difficulty tag, time limit, memory limit.
  - Full problem narrative with edge condition assumptions.
  - Input/Output format specifications.
  - Constraints box with formatted math bounds: $1 \le N \le 10^5$.
  - Sample test cases with formatted explanation callouts.
- **Right Split (Code Workspace):**
  - Top Toolbar:
    - Language Dropdown: `[ Python 3 (3.8) ▼ ]` / `[ Java (OpenJDK 17) ▼ ]` / `[ C++ (g++ 14) ▼ ]` / `[ C# (.NET) ▼ ]`.
    - Editor Settings: Font Size, Theme (`VS Dark` vs `Light`), Reset to Boilerplate.
  - Monaco / Custom Textarea Editor:
    - Line numbering gutter, indentation guides, code completion.
  - Bottom Action Bar:
    - `[ ] Test against custom input` checkbox (reveals custom input textarea).
    - `[ ▶ Compile & Run ]` (evaluates against public sample test cases).
    - `[ ✔ Submit Code ]` (evaluates against all hidden test cases, records score).
- **Execution Output Drawer:**
  - Tab 1: `Sample Test Cases` (shows Test Case 1 PASS/FAIL, Test Case 2 PASS/FAIL with Diff viewer).
  - Tab 2: `Compiler Output / Stderr` (shows exact traceback or compilation flags).

---

### 3.4 Round 3: Versant Communication Assessment Voice Interface

```
+-----------------------------------------------------------------------------------------------+
| > accenture                                      Accenture Communication Assessment (Versant) |
+-----------------------------------------------------------------------------------------------+
| SECTION B: REPEATING SENTENCES (Question 4 of 16)                                             |
|                                                                                               |
|                        +----------------------------------------+                             |
|                        |      🔊 AUDIO PLAYING (DO NOT SPEAK)   |                             |
|                        |  "The engineering team completed the   |                             |
|                        |   project ahead of schedule."          |                             |
|                        +----------------------------------------+                             |
|                                                                                               |
|                                        [ 3.2s ]                                               |
|                                                                                               |
|   ===============================[ LIVE MIC RECORDING ]====================================   |
|   Speak clearly into your microphone after the beep sounds...                                 |
|                                                                                               |
|            [|||||||||||||||||||||||||||||||||||||||||||||||         ] 68%                     |
|                                                                                               |
|   Live Audio Waveform:                                                                        |
|   ~~~/\~/\~/\~~~/\~/\~~~~~~~~/\~/\~~~~~~~~~~~~~~~~                                            |
|                                                                                               |
|   Status: Recording Candidate Voice (Keep speaking naturally, no pauses)                      |
+-----------------------------------------------------------------------------------------------+
```

---

### 3.5 Student Dashboard, Auth & Monetization Modal

- **Landing Dashboard:**
  - Modern hero section: *"Ace Your Accenture OA in 30 Days"*.
  - Curriculum progress bar: `Day 1 of 30 Completed`.
  - Feature comparison table (Free Diagnostic vs 30-Day Mastery Pass).
- **Checkout Modal (INR 500 Unlock):**
  - Title: `Unlock Accenture 30-Day Complete Mastery Pass`.
  - Price: `₹500` (One-time, lifetime access for the hiring season).
  - Included items:
    - 30 Daily Assessment sets with 1,000+ authentic questions.
    - Full-Length 90-minute timed mock exams with sectional analytics.
    - Top 35 Accenture coding questions with auto-grading.
    - AI-powered Versant Communication speech tests.
    - Locked solution explanations with code loading into the editor.
  - Payment Options: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Netbanking.
  - Guarantee: 100% syllabus match to the latest 2025-2026 Accenture pattern.
