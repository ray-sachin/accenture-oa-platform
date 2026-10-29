# 1-2 Day Sprint Execution Roadmap & Phases
## Accenture Online Assessment (OA) Simulation & Preparation Platform

**Timeline:** 48-Hour Sprint Target  
**Execution Methodology:** Incremental, Test-Driven Delivery  
**Author:** Antigravity Engineering Team  
**Status:** In Progress (Phase 0 Complete, Phase 1 Ready for Execution)  

---

## 1. Overview of Execution Phases

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 0: Deep Research, Syllabus & System Architecture [COMPLETED]     │
│ - Live web & candidate research from Reddit, LeetCode, PrepInsta, Aon   │
│ - Exact 2024-2026 pattern: 90Q/90min Cognitive+Tech, 2Q/45min Coding   │
│ - Core documentation: CAREER_MEMORY.md, PRD.md, ARCHITECTURE.md,       │
│   UI_SPECIFICATION.md, SYLLABUS_AND_QUESTION_BANK.md                   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Auth, Monetization (₹500 Paywall) & Data Persistence          │
│ - Fast student registration/login (Email & Google OAuth)               │
│ - Razorpay / Stripe INR 500 checkout modal with webhook unlock         │
│ - Supabase / Local JSON storage for user profile & unlocked status     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Authentic Assessment Engine & Proctoring Lockdown             │
│ - Pixel-perfect replication of HirePro / Mercer Mettl test layout      │
│ - 90-question palette with 5 states (Not Visited, Answered, Review...) │
│ - Strict 90-minute persistent countdown timer with auto-submit         │
│ - Anti-cheat proctoring: Fullscreen enforcer, tab-switch counter modal,│
│   clipboard blocker (Ctrl+C/V disabled), webcam activity preview       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: Multi-Language Coding IDE & Sandboxed Test Runner             │
│ - Split-screen IDE supporting Python, Java, C++, and C#                │
│ - Sandboxed execution engine against public & hidden test cases        │
│ - 20-minute locked solution drawer with auto-loader                    │
│ - Top 20 recurring Accenture coding problems pre-loaded                │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: Versant AI Spoken Communication Simulator                     │
│ - Interactive audio prompt engine for Modules A-F                      │
│ - Web Speech API microphone capture & real-time audio waveform         │
│ - Automated speech transcription & fluency/accuracy scoring            │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: 30-Day Question Ingestion, GitHub Wrapper & Live Deployment   │
│ - Full 30-day question bank bundled into questions.json                │
│ - Comprehensive test runner & score analytics dashboard                │
│ - Git commit, GitHub wrapper repository release, and live hosting      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Granular Task Breakdown

### Phase 1: Authentication, Monetization & State Persistence
- [x] Design PostgreSQL schema for `profiles`, `payments`, `assessment_sessions`.
- [ ] Build mock and live Razorpay checkout flow:
  - Free tier: Day 1 Diagnostic Mock Exam.
  - Pro tier: INR 500 one-time payment unlocking Days 2-30.
- [ ] Create simple modal for Student Onboarding (`Name`, `Email`, `Target Role`).
- [ ] Store payment verification and session status in `localStorage` + backend JSON state.

### Phase 2: Assessment Portal Engine & Proctoring Simulator
- [ ] Create dedicated Round 1 interface matching `UI_SPECIFICATION.md`:
  - Section tabs: `English Ability`, `Critical Reasoning`, `Abstract Reasoning`, `MS Office`, `Pseudocode`, `Cloud & Network`.
  - 90-grid question palette with 5 distinct dynamic color badges.
  - 90-minute countdown timer with persistent storage and `< 5m` red alert.
  - Clear choice, bookmark for review, and next/prev controls.
- [ ] Implement Anti-Cheat Lockdown:
  - Detect `visibilitychange` and `window.blur` (Tab-switch count warning modal).
  - Intercept and block `copy`, `paste`, `cut`, and `contextmenu`.
  - Enforce HTML5 fullscreen mode.
  - Overlay floating webcam proctoring widget.

### Phase 3: Multi-Language Coding IDE & Sandboxed Evaluator
- [ ] Integrate lightweight code editor with language selector:
  - Python 3, Java, C++, C#
- [ ] Wire execution backend:
  - Execute against visible public cases with formatted diff viewer.
  - Execute against hidden edge cases with score computation.
- [ ] Implement the 20-minute locked solution drawer (encouraging deep effort before revealing code).
- [ ] Load Top 20 Accenture coding problems into `questions.json`.

### Phase 4: Versant AI Communication Simulator
- [ ] Synthesize speech prompts using Web Speech `SpeechSynthesisUtterance`.
- [ ] Record candidate audio response using `MediaRecorder` / `webkitSpeechRecognition`.
- [ ] Compute Levenshtein distance & word matching accuracy for reading and sentence repetition.
- [ ] Generate comprehensive CEFR / Versant score report (Scale 10-90).

### Phase 5: Verification, GitHub Wrapper & Deployment
- [ ] Validate end-to-end user flow: Signup $\to$ Free Mock $\to$ Paywall ₹500 $\to$ Unlocked 30-Day Curriculum $\to$ Results.
- [ ] Run zero-dependency Node.js server test.
- [ ] Finalize clean `.gitignore` and README documentation.
- [ ] Stage and commit all files to Git.
