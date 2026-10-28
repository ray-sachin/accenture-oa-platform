# Product Requirements Document (PRD)
## Accenture Online Assessment (OA) Simulation & Preparation Platform

**Document Version:** 1.0.0  
**Target Audience:** Engineering Students, MCA Graduates, Off-Campus Job Seekers  
**Target Roles:** Associate Software Engineer (ASE) & Advanced Associate Software Engineer (AASE)  
**Author:** Antigravity Architecture & Engineering Team  
**Status:** Approved for Implementation  

---

## 1. Product Vision & Value Proposition

### 1.1 Problem Statement
Every year, over 300,000 engineering and computer science students in India and globally sit for the Accenture on-campus and off-campus recruitment drives. More than 70% of candidates fail in the initial 90-minute online assessment round due to:
1. **Unfamiliarity with the strict assessment interface:** Enterprise assessment portals (HirePro, Mercer Mettl, Wheebox, Aon CoCubes) employ strict section timers, no-negative-marking traps, and unique pseudocode syntax.
2. **Elimination gate shock:** Round 1 (Cognitive + Technical) acts as an automated elimination barrier with sectional cutoffs; candidates failing even one sub-section are immediately disqualified before reaching the coding test.
3. **Coding test friction:** Candidates waste crucial minutes grappling with input parsing (stdin/stdout vs function templates), strict memory/time constraints, and hidden edge cases.
4. **Communication round unpreparedness:** The Versant/Aon AI spoken English test catches candidates off-guard with audio prompts and strict oral fluency scoring.

### 1.2 The Solution
A unified, browser-based, proctored **Accenture Assessment Simulator and 30-Day Preparation Platform** that replicates 100% of the live hiring exam experience. It combines:
- An authentic, pixel-perfect test portal simulator.
- Full-length 90-minute Cognitive & Technical exams.
- Real-time multi-language coding compiler with public and hidden test case runners.
- Browser-based AI spoken English (Versant) simulator.
- Adaptive 30-day curriculum with daily fresh question drops.
- Seamless student enrollment and instant INR 500 unlock via payment gateway.

---

## 2. User Personas & Journey

### 2.1 Personas
| Persona | Profile | Core Pain Point | Goal on Platform |
|---|---|---|---|
| **P1: Final Year College Fresher** | B.Tech/BE student with on-campus drive scheduled in 2-4 weeks. | Struggles with time management (1 min/question) and pseudocode bitwise questions. | Practice daily timed mocks, clear sectional cutoffs, and build confidence. |
| **P2: Off-Campus Aspirant** | 2024-2026 graduate looking for off-campus openings. | Unaware of the latest 2025-2026 syllabus changes and communication round. | Complete full 30-day path, pass all tests, and track performance percentiles. |
| **P3: Non-CS / MCA Candidate** | Mechanical/Civil/ECE or MCA student. | Weak in computer networking, cloud fundamentals, and DSA coding. | Step-by-step topic mastery, curated video/text explanations, and locked solution guides. |

### 2.2 Student Experience Journey
1. **Landing & Discovery:** Student arrives on the platform, views the Accenture hiring breakdown, syllabus roadmap, and takes a free Day 1 Diagnostic Assessment.
2. **Signup & Onboarding:** Fast sign-in using Email / Google OAuth. Profile captures target role (ASE vs AASE) and drive date.
3. **Paywall / Checkout:**
   - Free tier grants access to Day 1 Diagnostic Mock and 2 coding problems.
   - Student prompts to unlock the **Accenture 30-Day Mastery Pass** for **INR 500**.
   - Razorpay / Stripe modal opens; on successful transaction, instant database webhook unlocks all 30 days and full question vault.
4. **Daily Practice & Mocks:**
   - Daily structured drills (Cognitive + Technical + Coding).
   - Weekend full-length proctored mock examinations (90 min + 45 min + 25 min Versant).
5. **Analytics & Performance Heatmap:**
   - Real-time score report with sectional percentile, speed analysis, and accuracy per topic.

---

## 3. Product Architecture & Feature Scope

### 3.1 Module 1: Authentic Assessment Engine (HirePro / Mettl UI)
- **Exam Layout:**
  - Header: Signature branding (`> accenture`), candidate avatar, remaining time ticker (HH:MM:SS), Section navigator tabs, and Finish Test button.
  - Question View: High-contrast question card, multi-choice radio options, clear selection button, "Mark for Review" checkbox, Next/Previous controls.
  - Question Palette (Sidebar): 90-grid palette showing 5 live statuses:
    1. *Not Visited* (Gray `#9E9E9E`)
    2. *Visited & Not Answered* (Amber/Red `#FF5722`)
    3. *Answered* (Green `#4CAF50`)
    4. *Marked for Review* (Purple `#9C27B0`)
    5. *Answered & Marked for Review* (Purple badge with green indicator)
- **Time Constraints:**
  - Global countdown timer with persistent session storage (preventing page refresh cheating).
  - Visual alert triggers when $< 5$ minutes remain (pulsing red header).
  - Auto-submission on timer expiry.

### 3.2 Module 2: Anti-Cheat & Proctoring Lockdown Simulator
- **Tab Switch & Focus Detection:**
  - Listens to `visibilitychange` and `window.onblur`.
  - Increments violation counter with modal alert: *"Warning [X]/3: You navigated away from the exam. Further violations will terminate your test."*
- **Clipboard Interception:**
  - Disables `copy`, `paste`, `cut`, and mouse right-click (`contextmenu`) on all question and code panes.
- **Fullscreen Enforcer:**
  - Demands HTML5 Fullscreen mode on test launch (`document.documentElement.requestFullscreen()`).
  - Warns on `fullscreenchange` if user exits fullscreen.
- **Webcam & Audio Activity Indicator:**
  - Floating video overlay in top-right corner simulating live proctoring stream.

### 3.3 Module 3: Coding IDE & Multi-Language Sandboxed Runner
- **Supported Languages:** C, C++, Java, Python (3.x), C# / .NET.
- **Editor Features:**
  - Line numbering gutter, syntax highlighting, bracket matching.
  - Tab indentation handling (2 spaces).
  - Split draggable pane between problem statement and code workspace.
- **Test Case Execution Engine:**
  - **Compile & Run:** Evaluates against visible public test cases with input, expected output, and actual output diff.
  - **Submit Code:** Evaluates against comprehensive hidden test cases (boundary values, large arrays, negative inputs, null checks).
  - Detailed Execution Metrics: Runtime (ms), Memory (KB), Test cases passed (e.g., `8/10 Passed`).

### 3.4 Module 4: Versant Communication Assessment Simulator
- **Audio Prompts:** Text-to-speech engine speaks sentences with natural accents.
- **Mic Input & Speech Recognition:** Uses Web Speech API / MediaRecorder to capture candidate voice response.
- **6 Standard Sections:**
  1. *Reading Aloud* (8 sentences)
  2. *Repeat Sentences* (16 audio prompts)
  3. *Oral Q&A* (20 short factual questions)
  4. *Sentence Rearranging* (10 jumbled audio phrases)
  5. *Story Retelling* (30-sec story audio + 30-sec candidate recording)
  6. *Open Speaking Topic* (1 general topic + 60-sec speech capture)
- **Automated AI Scoring:** Evaluates Fluency, Pronunciation, Sentence Mastery, and Vocabulary.

### 3.5 Module 5: Monetization & User Authentication
- **User Authentication:**
  - Supabase Auth / Local JWT with Email + Password or Google OAuth.
  - Profile state tracks: `user_id`, `email`, `full_name`, `is_premium`, `payment_id`, `created_at`.
- **Payment Gateway Integration:**
  - Primary: Razorpay Checkout (INR 500 one-time).
  - Secondary: Stripe Checkout fallback.
  - Webhook endpoint (`/api/payments/webhook`) validates cryptographic signature (`hmac_sha256`) and sets `is_premium: true`.
- **Protected Content Guards:**
  - API middleware verifies token and subscription tier before serving Day 2–30 questions, premium mocks, and solution source code.

---

## 4. 30-Day Preparation Curriculum Framework

| Week | Focus Area | Daily Modules |
|---|---|---|
| **Week 1** | Cognitive Ability Mastery | **Day 1:** Full Diagnostic Test (Free)  <br>**Day 2-3:** English Grammar, Error Spotting, Sentence Arrangement  <br>**Day 4-5:** Critical Reasoning, Syllogisms, Blood Relations  <br>**Day 6-7:** Abstract Reasoning, Visual Matrices, Series Completion |
| **Week 2** | Technical Fundamentals | **Day 8-10:** Pseudocode: Bitwise Operations (`XOR`, `AND`, `OR`, shifts)  <br>**Day 11-12:** Pseudocode: Recursion, Loops, Pre/Post Increment  <br>**Day 13-14:** MS Office Shortcuts, Excel Formulas (`VLOOKUP`, `SUMIF`), File Extensions |
| **Week 3** | Networking, Cloud & Core Coding | **Day 15-16:** OSI Layers, TCP/UDP, IP Addressing, Firewalls, Cryptography  <br>**Day 17-18:** Cloud Models (IaaS, PaaS, SaaS), Virtualization, Cloud Security  <br>**Day 19-21:** Top 20 Accenture Coding Patterns: Array & String Manipulation |
| **Week 4** | Advanced Coding & Communication | **Day 22-24:** Medium Coding Patterns: Two Pointers, Greedy, Dynamic Programming  <br>**Day 25-27:** Versant Communication Assessment Audio Drills  <br>**Day 28-30:** Full-Length Proctored Mocks (Rounds 1, 2, and 3 back-to-back) |

---

## 5. Non-Functional & Operational Requirements

- **Performance:** Question navigation transition $< 50\text{ ms}$; code compilation response $< 2.5\text{ s}$.
- **Cross-Platform Compatibility:** Runs on Google Chrome, Microsoft Edge, Firefox, and Safari on desktop and laptop browsers.
- **Reliability & State Persistence:** Test state, answers, and code automatically saved to `localStorage` and periodic background cloud sync every 30 seconds.
- **Security:** CSRF protection, secure HTTP-only cookies, sanitized user inputs to prevent XSS, isolated sandbox container for code execution.
