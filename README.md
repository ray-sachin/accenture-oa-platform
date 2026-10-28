# Accenture Online Assessment (OA) Simulator Platform

A zero-dependency, lightweight local web platform designed to simulate the exact environment, layout, proctoring constraints, and technical evaluation methods of the **Accenture Campus Hiring Technical Assessment**.

---

## 🚀 Quick Start (Zero Dependencies)

1. Open your terminal in this directory:
   ```bash
   cd accenture-ide
   node server.js
   ```
   *(Or on Windows, simply double-click `start.bat`)*

2. Open your browser at:
   ```
   http://localhost:3000
   ```

No `npm install`, no external packages, no build steps required—it runs on native Node.js and Vanilla web technologies.

---

## 🌟 Key Features & Implementation Architecture

### 1. Authentic Accenture / Mettl OA Theme & Split UI
- **Top Header:**
  - Accenture signature brand styling (`> accenture`).
  - Question navigation pills with active states, category badges, and bookmark indicators.
  - **45-minute global assessment timer** that turns urgent red when $< 5$ minutes remain.
  - **"🔖 Revisit Later"** checkbox to mark questions for review.
- **Left Pane:**
  - Split view containing "How to Attempt?", Scenario, Objectives, and Constraints.
  - Smooth draggable resizer divider between the left and right panes.
- **Right Pane:**
  - Tabbed editor: `</> HTML`, `# CSS`, `{}` JS, `👁️ Live Preview`, and `🧪 Test Console`.
  - Custom line numbering gutter synchronized with textarea scrolling.
  - Automatic `Tab` indentation handling (2 spaces, no focus loss).

### 2. Simulated Anti-Cheat & Proctoring Lockdown
- Simulates real enterprise proctoring platforms (Mettl / CoCubes / HackerRank):
- Intercepts and blocks **Copy (`Ctrl+C`), Paste (`Ctrl+V`), Cut (`Ctrl+X`), and Right-Click (Context Menu)** on the code editor.
- Displays an animated warning toast:  
  *⚠️ "Proctoring Notice: Action Prohibited in the Accenture Online Assessment."*
- Logs and tracks proctoring violation counts.

### 3. 20-Minute Locked Solution Tab
- Located directly in the left pane as a dedicated tab.
- Persisted in `localStorage` per question.
- Remains **locked for 20 minutes** of active practice time with a live ticking countdown and progress fill bar.
- Encourages genuine problem-solving effort under pressure before unlocking full explanations and code.
- Includes an **"Instructor / Emergency Unlock"** bypass and a **"Load Solution into Code Editor"** button once unlocked.

### 4. Sandboxed Auto-Grader & Test Runner
- **"▶ Run Code"**: Immediately bundles HTML, CSS, and JS and renders it inside an isolated `<iframe>`.
- **"✔ Submit & Run Tests"**: Evaluates test assertions against the sandboxed DOM/CSS context and renders a detailed score report with:
  - Total Tests, Passed, Failed, and Score Percentage.
  - Color-coded badges (`PASS` green, `FAIL` red).
  - Explicit error messages explaining why a test failed.
  - Automatically marks the question pill as solved upon achieving 100%.

### 5. Extensibility via `questions.json`
All questions are driven by `public/data/questions.json`:
- **5 Core Web Development Questions:**
  1. *Day 1: iPod Interactive Interface*
  2. *Day 2: Product Rating Star Widget*
  3. *Day 3: Product Search Filter*
  4. *Day 4: Shopping Cart Application*
  5. *Day 5: Interactive Chatbot Interface*
- **Bonus DSA & SQL Questions:**
  - *Day 6: String Consecutive Character Compression (DSA)*
  - *Day 7: Active Sports Registrations Query (SQL)*
- Adding new questions or categories only requires adding an entry to `questions.json` without modifying any UI or engine code.
