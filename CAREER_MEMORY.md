# Project Memory & Ground Truth Ledger: Accenture OA Preparation & Simulation Platform

Last Updated: October 28, 2026
Status: Active - Phase 0: Research, Architecture & Base Foundation Complete
Author: Antigravity Assistant

---

## 1. Executive Summary & Vision

The objective of this initiative is to build a high-fidelity, end-to-end recruitment preparation and assessment platform specifically tailored for students preparing for **Accenture Campus and Off-Campus Hiring Drives** (Associate Software Engineer - ASE, and Advanced Associate Software Engineer - AASE).

The platform transforms student preparation from scattered PDF question banks into an authentic, proctored, real-time exam simulation that exactly mirrors the real assessment engines used by Accenture (Mercer Mettl, HirePro, Wheebox, and Aon CoCubes).

### Commercial & Monetization Model
- **Student Onboarding:** Simple, frictionless signup (Email / Google authentication).
- **Paywall & Access Tier:**
  - **Free Tier:** Day 1 Diagnostic Mock Exam + 2 classic coding questions + basic test runner.
  - **Full Pro Access (INR 500 one-time):** Unlocks the full 30-day adaptive roadmap, complete 1,000+ question bank, full-length timed proctored mocks, AI code analyzer, and Versant-style AI communication evaluation.
- **Delivery Target:** Complete baseline architecture and documentation established immediately, followed by structured phase delivery within 1-2 development sprints.

---

## 2. Ground Truth Assessment Structure (Accenture 2024-2026)

Based on comprehensive live web research, candidate debriefs, and authentic past drive papers, the recruitment process consists of four sequential stages:

```
+-------------------------------------------------------------+
| Stage 1: Cognitive & Technical Assessment                   |
| 90 Questions | 90 Minutes | Elimination Round               |
| No Negative Marking | Sectional & Aggregate Cutoffs Apply   |
+-------------------------------------------------------------+
                              |
                     [Pass Cutoff ~65-70%]
                              v
+-------------------------------------------------------------+
| Stage 2: Coding Assessment                                  |
| 2 Questions | 45 Minutes | Elimination / Role Differentiator|
| Allowed: C, C++, Java, Python, .NET                         |
+-------------------------------------------------------------+
                              |
                     [At least 1-2 Questions Passed]
                              v
+-------------------------------------------------------------+
| Stage 3: Communication Assessment (Versant / Aon AI)        |
| ~20-30 Minutes | AI Spoken Voice Analysis                   |
| Reading, Repeating, Q&A, Sentence Builds, Story Retelling   |
+-------------------------------------------------------------+
                              |
                     [Cleared Communication Threshold]
                              v
+-------------------------------------------------------------+
| Stage 4: Technical & HR Interview                           |
| 30-45 Minutes | Virtual Interview via Platform              |
+-------------------------------------------------------------+
```

### Stage 1: Cognitive & Technical Assessment (90 Questions in 90 Minutes)
- **Cognitive Section (50 Questions):**
  1. *English Ability* (17 Questions): Sentence completion, prepositions, reading comprehension, error spotting, tenses, idioms.
  2. *Critical Thinking & Problem Solving* (18 Questions): Blood relations, syllogisms, arrangement puzzles, statement & assumptions, analogies.
  3. *Abstract Reasoning* (15 Questions): Visual sequences, figure series, matrix pattern completion, mirror & water images.
- **Technical Section (40 Questions):**
  4. *Common Applications & MS Office* (12 Questions): Microsoft Excel formulas (`VLOOKUP`, `SUMIF`, pivot tables), MS Word shortcuts, PowerPoint navigation, computer file extensions.
  5. *Pseudocode* (18 Questions): Bitwise operations (`XOR`, `AND`, `OR`, bit-shifts), loop iterations, recursion trees, pre/post-increment execution, variable scope.
  6. *Network Security & Cloud* (10 Questions): OSI layers, TCP/UDP protocols, IP addressing/subnets, firewalls, encryption basics, Cloud service models (IaaS, PaaS, SaaS), cloud deployment models.

### Stage 2: Coding Assessment (2 Questions in 45 Minutes)
- **Time:** 45 minutes total (shared across both problems).
- **Languages:** C, C++, Java, Python, C# / .NET.
- **Problem 1 (Easy):** String manipulation, array scanning, basic mathematics, or character replacements (e.g., *Rat Count House*, *Difference of Sum*, *Large Small Sum*, *Password Checker*).
- **Problem 2 (Medium):** Two-pointer techniques, sliding windows, bit manipulation, greedy choices, dynamic programming basics (e.g., *Binary Operations String*, *Superior Elements*, *Max Exponent in Range*, *Matrix Path Sum*).
- **Grading:** Automatic evaluation against Public Test Cases (visible inputs/outputs) and Hidden Test Cases (edge cases, negative numbers, large constraints, boundary values).

### Stage 3: Communication Assessment (Versant AI Format)
- Non-elimination in some drives, but mandatory score threshold required for interview scheduling.
- **6 Modules:**
  1. *Reading Aloud* (8-10 sentences on screen)
  2. *Repeating Sentences* (16-20 audio sentences, 6-14 words each)
  3. *Questions & Answers* (20-25 quick factual oral responses)
  4. *Sentence Builds / Jumbled Sentences* (10-12 scrambled phrases rearranged)
  5. *Story Retelling* (30-second audio narrative retold in candidate's words)
  6. *Open Speaking* (1-2 topics, 45-60 seconds speaking uninterrupted)

---

## 3. Honesty Ledger & Realistic Constraints

- **Execution Environment:** In-browser compilation requires either a secure backend sandboxed code runner (Docker / Piston / Judge0 / WebAssembly for client-side JS/Python) to prevent server exploitation.
- **Audio Evaluation:** Browser SpeechRecognition API (Web Speech API) provides native client-side pronunciation and transcription, supplemented by server-side whisper/Gemini AI evaluation for scoring accuracy.
- **Commercial Feasibility:** Razorpay / Stripe checkout requires verified merchant accounts for production INR billing. A mock payment simulator + sandbox integration ensures seamless testing prior to merchant activation.
- **Zero Fabrication:** Question banks and patterns are verified against authentic Accenture hiring tests, LeetCode records, PrepInsta past drive analyses, and verified candidate experiences.

---

## 4. Current Repository State & Baseline Assets

- **Location:** `C:\Users\rayne\Downloads\accenture-ide`
- **Initial Prototype:** Vanilla Node.js `server.js` with static web IDE (`public/index.html`, `public/css/style.css`, `public/js/app.js`, `editor.js`, `runner.js`).
- **Archive Resources:** `ACCENTURE-20261028T172758Z-1-001.zip` containing 43 authentic past question papers, placement guides, and test booklets (used strictly for 1-2% verification).
- **Git Repository:** Initialized with clean local configuration.

---

## 5. Next Planned Actions

1. Establish `PRD.md` with complete functional and business specifications.
2. Establish `ARCHITECTURE.md` with system design, database schemas, and sandboxed runner specs.
3. Establish `UI_SPECIFICATION.md` detailing the HirePro / Mercer Mettl authentic exam layout.
4. Establish `SYLLABUS_AND_QUESTION_BANK.md` with 100+ fully-solved questions and 30-day curriculum.
5. Establish `ROADMAP_AND_PHASES.md` defining sprint execution.
6. Commit all architectural artifacts to Git.
