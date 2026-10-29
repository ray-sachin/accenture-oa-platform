# Verification record

Verified locally on Windows with Node.js 26.2.0 on 29 October 2026. This records what was actually exercised; it is not a security certification or a live-provider acceptance report.

## Automated checks

| Check | Result |
| --- | --- |
| `node --experimental-vm-modules scripts/check.cjs` | All server scripts and browser ES modules parsed. |
| `node --test tests/platform.test.js` | **18 tests passed**, zero failures or skips. |
| `python scripts/check-reference-solutions.py` | **36 public/hidden cases passed** across all 10 DSA reference implementations. Uses trusted reference code only. |
| `git diff --check` | No whitespace errors; only Windows line-ending normalization notices. |
| Git secret/runtime exclusions | `.env`, private runtime database, legacy candidate logs and screenshots are ignored. |

The API suite invokes the actual HTTP request handler with in-memory SQLite databases. It covers:

- Exactly 60 unique questions and complete 10/20/30-day schedules, with nonempty linked exercises and lessons on every day.
- Public metadata redaction and denied access to private files, answer banks, logs, server source and `.env`.
- CSRF/origin checks, password hashing, hashed opaque sessions, cookie flags and session expiry.
- Single-browser enforcement: wrong passwords do not trigger cooldown; valid concurrent sessions trigger six hours, then twelve hours on repetition; sign-out permits deliberate device changes.
- Server-side entitlement gates, rejected client premium flags, and no fake checkout unlock.
- Attempt ownership, one active attempt, empty-code persistence, type validation, solution delay, timer expiry and idempotent submission.
- Server MCQ grading and answer review after submission.
- Real SQL execution for all four SQL reference queries across both fixture sets; denied writes, attachment/extensions, expensive allocation functions and recursion.
- SQL comments, hidden-fixture redaction and verified progress.
- Payment ownership, fixed INR 49900 amount, signatures, captured-payment verification, signed webhook deduplication and full-refund revocation.
- Authenticated opaque-origin frontend previews with a restrictive CSP.
- Server-only Gemini credentials, per-account quotas and blocked assistance during timed mocks.
- Judge0 resource/network settings and hidden-output redaction.
- Rechecking current entitlement after an asynchronous runner response, so revoked access cannot record a paid solution.

Payment, Gemini and Judge0 tests use explicit fake upstream adapters. They do not contact real providers or make payments. SQL tests execute the actual isolated SQL child process. Python reference validation executes only repository-owned trusted solutions and is not a student-code execution service.

## Browser journeys

The application was served at `http://localhost:3000` and exercised through the in-app browser.

1. Inspected the desktop dashboard, bank search, track selection, planner, source library, mentor, communication and account pages.
2. Registered a synthetic local QA account and completed the free diagnostic: **4/4**, with explanations after submission.
3. Resumed saved frontend code; observed server-expired practice close on resume. Verified the early solution lock.
4. Ran the iPod starter, observed failing checks, then corrected it and passed **4/4**. Ran the rating, product filter, cart, chatbot and corrected carousel reference implementations: **4/4 each**. These 24 browser checks are advisory; they do not award verified server scores.
5. Cleared an editor file, switched files and returned: the empty file stayed empty rather than reverting to the starter. Restored the reference afterward.
6. Submitted the sports-registration SQL query, including a leading explanatory comment: **2/2 server fixtures passed**; hidden data remained undisclosed.
7. Switched to the 30-day track, reloaded and confirmed persistence. Marked a day complete and confirmed the dashboard advanced to the next study day. Reviewed the worked lesson and learning/practice/review phases.
8. Verified the ₹499 pass dialog and unavailable-checkout state. Free-account access did not grant premium features.
9. Searched the research library and opened the original career notes with provenance and confidence annotations.
10. Sent a mentor question without a configured key: a clear unavailable message appeared, with no fabricated AI response.
11. Typed an email practice draft and confirmed the live word count and writing timer. Microphone hardware/permission and speech synthesis playback were not exercised.
12. Checked the dashboard at a 390 × 844 viewport: no horizontal overflow; the navigation opened and closed; hidden navigation was absent from the accessible controls. Restored the normal desktop viewport.
13. Signed out, removed the synthetic QA account and its test records, and saved the anonymous ten-day dashboard preview. No payment records existed for this account.

The paid browser flows used a temporary entitlement on the synthetic QA fixture, set locally in the test database, not a public unlock route. That fixture and entitlement were removed after verification. No production admin account or premium bypass was added.

Saved visual evidence (local, ignored by Git):

- `output/dashboard-desktop.jpg`
- `output/dashboard-mobile.jpg`
- `output/ide-verified.jpg`

The final browser error/warning log was empty. These are representative interaction checks, not exhaustive cross-browser, screen-reader, load or penetration tests.

## Required before taking live payments

Configure the provider credentials in `.env`, then validate Razorpay test-mode checkout, capture, webhook retries and refunds; actual Gemini responses; and all configured Judge0 language IDs and resource limits. Also complete HTTPS hosting, durable private storage/backups, verified account recovery/support, operational rate limits and content-rights review as described in `ROADMAP_AND_PHASES.md` and `docs/SECURITY_REVIEW.md`.

No deployment, real payment, real AI response, or real remote compiler run was performed. An authentic current campus invitation is still needed to confirm the actual round order, timings, language versions, eligibility and stipend.

## Campus rehearsal update

The suite now passes 19 tests. Browser checks confirmed the instruction acknowledgement gate, sign-in requirement, full 43-task campus attempt, switching between Technical, Coding and Behavioural sections, and corrected account labels showing all tracks unlocked. No browser errors/warnings were recorded. The temporary campus QA fixture was removed; the owner account was not modified. The new notice was extracted and page 2 rendered and inspected. See CAMPUS_NOTICE.md for evidence boundaries and explicit practice timing.
