# Reusable patterns from the adjacent projects

Reviewed read-only on 29 October 2026 for CampusReady. This comparison uses product, design, architecture, and decision notes from the six folders named by the user. It transfers principles rather than code, branding, deployment configuration, accounts, or project datasets. No files in those folders were modified. Environment files, credential files, databases, student/customer datasets, media, and contact lists were not imported or used as application content.

The source documents describe their own projects at particular points in time. Their implementation claims were not independently re-tested during this review; they are design evidence, not a security certification of those applications.

## Where the notes are

| Project folder | Notes and vault findings | Local instructions relevant to the read-only review |
| --- | --- | --- |
| `C:\Users\rayne\Downloads\Parakeet Papa` | Populated `vault/` with `.obsidian/`, architecture, features, knowledge, research, and ADR notes. | No `AGENTS.md` found in the reviewed root/vault paths. |
| `C:\Users\rayne\Downloads\super_himride` | Linked Markdown notes in `Knowledge Base/`; no `.obsidian/` configuration found there. | Root `AGENTS.md` inspected. Its module boundaries and validation principles are useful; its project-specific workflows and persona instructions do not become CampusReady requirements. Nested app instructions were not needed because those apps were not edited. |
| `C:\Users\rayne\Downloads\Club Management System` | `vault/` and an empty `.obsidian/` directory exist, but no Markdown notes were found in that vault. Useful documentation is at the root: `design.md`, `component-design.md`, `prd.md`, and `rules.md`. | No root/vault `AGENTS.md` found. Root engineering rules were inspected as design evidence, not applied as instructions to change that project. |
| `C:\Users\rayne\Downloads\Valentine project` | No Obsidian vault found in the inspected project; `README.md` describes its day-based experience. | No root `AGENTS.md` found. Only the generic daily-journey and quiz ideas are relevant. |
| `C:\Users\rayne\Downloads\SPR` | Linked architecture, decision, reference, and operation notes in `docs/`; no `.obsidian/` configuration found there. | No root/docs `AGENTS.md` found. |

Generated output, dependency trees, repository internals, and personal-data folders were excluded from the documentation search. The absence statements refer to the inspected source/documentation paths.

## Recommended transfers

### 1. A calm study workspace with readable states

The Parakeet design note makes state readable through **an icon, a label, and color together**, uses semantic styling tokens, and respects reduced-motion preferences. The Club Management design and engineering notes reinforce visible keyboard focus, consistent spacing, theme contrast, and keeping wide tables within their own scroll container.

For CampusReady, use those principles for `Not started`, `In progress`, `Completed`, `Needs review`, `Locked`, and execution results. Keep the timer and primary action immediately visible. A student should understand an error or a locked exercise without interpreting a red/purple dot. The dashboard can be calm and spacious while the IDE uses a denser, task-focused layout.

Do not reuse the source projects' teal, gold, typography identities, logos, decorative effects, or named components as a branding system.

Evidence: [Parakeet design language](<C:/Users/rayne/Downloads/Parakeet Papa/vault/knowledge/design-language.md>), [Club Management design](<C:/Users/rayne/Downloads/Club Management System/design.md>), [Club Management engineering rules](<C:/Users/rayne/Downloads/Club Management System/rules.md>).

### 2. Daily progression that always answers “what next?”

The Valentine README describes daily units, one-question-at-a-time quizzes, and per-day progress. Those generic mechanisms fit a study course even though the source content and visual style do not. The Club Management PRD adds the useful pattern of a dashboard combining the current agenda with a small number of meaningful actions.

For CampusReady, retain exactly **10-, 20-, and 30-day tracks**. Show today's objective, estimated effort, relevant exercises, and the next action. Distinguish visiting a day from completing a task or passing a test. Preserve progress when changing track; the schedule should arrange learning, not erase it. Use an error-review step after a mock so completion leads to a concrete next practice session.

Do not import the romantic content, dates, media, evasive buttons, default accounts, or an unrelated day count. In particular, a button that avoids being clicked has no place in a paid learning flow.

Evidence: [Valentine experience overview](<C:/Users/rayne/Downloads/Valentine project/README.md>), [Club Management PRD](<C:/Users/rayne/Downloads/Club Management System/prd.md>), [Parakeet practice and analytics](<C:/Users/rayne/Downloads/Parakeet Papa/vault/features/mock-and-analytics.md>).

### 3. Minimal onboarding and explanations at the point of refusal

The placement-portal form note limits collection to what the task actually requires. Its student-portal note explains eligibility decisions with a reason and the rule behind it, and rechecks the same decision when the action reaches the server. Its session ADR separates initial identity proof from ordinary sign-in and provides a recovery path.

For CampusReady, collect the minimum account information and let students select their study track without filling an institutional profile. Explain the ₹499 one-time purchase before checkout. An account-sharing cooldown should state the reason, the server-recorded expiry, and how a legitimate user can recover access. A missing Gemini configuration should be described as unavailable, not as a failed answer or a fabricated response.

Do not import a college-specific email domain, roll-number parser, roster requirement, staff roles, or identity assumptions. Avoid treating an unverified email-shaped string as proof of a particular student's identity. Payment/access checks must remain independent of the onboarding form.


### 4. Responsive layouts proven against narrow screens

HimRide's support-layout ADR records two concrete failures: a horizontal CTA compressed the heading into single-word lines, and a form input inherited `flex: 1` from a chat composer and collapsed. Its responsive-grid ADR replaces viewport arithmetic with fluid container-relative sizing.

For CampusReady, stack price and checkout actions on narrow screens, give textareas their own minimum height, and let the IDE switch between problem/editor/output panels when there is not enough width for a split view. Question palettes and day grids should follow the container's width. Verify real text, loading errors, and long question names rather than only an empty layout.

Transfer the layout lessons, not React Native implementation details, navigation route names, or ride-booking features.

Evidence: [HimRide support layout fixes](<C:/Users/rayne/Downloads/super_himride/Knowledge Base/15 ADR/ADR-003-Consumer-App-Support-Screen-Layout-And-Navigation-Fixes.md>), [HimRide responsive grids](<C:/Users/rayne/Downloads/super_himride/Knowledge Base/15 ADR/ADR-002-Consumer-App-Responsive-And-React19-Compatibility.md>).

### 5. Show provenance and define what progress means

The placement-portal proof-bar note uses a stated period, a source line, and a readable underlying record. Its statistics ADR insists that a metric state what was counted and use deterministic calculation functions rather than generated prose.

For CampusReady, source labels should distinguish **official guidance**, **reported campus experience**, **project notes**, and **archival practice**. Counts should come from the actual curated bank. Explain whether a progress percentage measures tasks completed, questions attempted, or tests passed; these are different values. Do not promote an archived question's existence into a probability that it will appear in the next assessment.

Do not import the institution's figures, placements, alumni claims, logos, source slogans, or unverified conversion statistics. The transferable idea is traceability, not a claim that merely adding a footnote proves a number true.


### 6. Server-owned rules and explicit state transitions

SPR's security note demonstrates why authenticating a row's owner is insufficient if a direct write can bypass the business rule. Its counter ADR makes state and attempt counts server-owned; its phase engine defines precedence and deadline behavior. The placement portal applies the same principle to assessment clocks and counters.

For CampusReady, the server must own payment entitlement, active session/device binding, cooldown expiry, attempt deadlines, solution-release eligibility, and submission state. Requests should derive the user from the session and recheck ownership and state on every protected action. A disabled button, hidden link, local-storage flag, or edited browser timer cannot be the enforcement point. Replayed submissions and payment callbacks should not grant additional access or change a finished attempt.

A device cookie identifies a browser installation, not an uncopyable physical device. The policy should deter casual sharing while allowing legitimate device loss or replacement. Do not count arbitrary unauthenticated login attempts as proof of account sharing; that would let strangers trigger someone else's cooldown.

Do not import election rules, identities, schema names, student lists, privileged accounts, or any source project's test shortcuts.


### 7. Gemini teaches within a bounded context

Parakeet's grounding ADR chooses explicit document context when the relevant corpus is small and names the point where retrieval becomes worthwhile. The placement-portal AI ADR constrains model output to reviewed capabilities and keeps access scope outside the model.

For CampusReady, supply Gemini with the selected exercise, allowed lesson excerpts, the student's question, and bounded recent conversation. Treat imported research and model output as untrusted content. Keep account records, secrets, payment state, private test cases, and unrelated project notes out of its context. The model may explain a concept or suggest a hint; it must not authorize access, certify a payment, mutate scores, execute source code, or query the account database.

The full archive is too large and too inconsistent to paste into every request. A small, curated context selected by exercise/topic is the appropriate transfer of the grounding principle. Do not adopt the source project's exact context budgets, provider choices, local database contents, or live-interview assistance features.


### 8. Honest execution and practice safeguards

Parakeet's untrusted-execution ADR explicitly distinguishes resource limits from a filesystem/network sandbox. The placement-portal proctoring ADR distinguishes browser signals from proof, keeps clock/severity decisions on the server, and describes capability gaps honestly.

For CampusReady, never run student or model-written code with the web server's privileges. A compiler timeout alone does not isolate files or network access. Keep browser preview restrictions, remote execution isolation, hidden-test protection, and entitlement checks as separate controls. The frontend should accurately label what was executed and what was only previewed or inspected.

Practice-mode clipboard and focus behavior should serve learning and timed rehearsal, not promise impossible copy protection. A tab switch does not establish cheating, and the absence of an event does not prove compliance. Camera/microphone collection should not be imported merely because another project has it; it is unnecessary for the requested paid preparation platform unless a separately defined feature needs it.

Do not import stealth overlays, screen-capture bypasses, live-assessment assistance, local privileged execution, or claims of an “uncheatable” browser. These are outside CampusReady's preparation purpose.


## Implementation discipline to retain

The Club Management component note separates presentation, state, and services. Its rules require loading, empty, and error states and verification records with coverage gaps. HimRide's root instructions similarly discourage embedding complex business logic in screen files. These are useful at CampusReady's scale without copying either project's framework, dependency tree, or file-size policy.

Keep the account/payments layer, curriculum data, question service, runner adapter, and UI responsibilities understandable. Verify both successful and refused paths, including direct requests to protected endpoints. Record which checks ran and which live integrations remain untested without credentials. This is more useful than a general claim that everything is secure.

Evidence: [Component boundaries](<C:/Users/rayne/Downloads/Club Management System/component-design.md>), [Verification and UI states](<C:/Users/rayne/Downloads/Club Management System/rules.md>), [HimRide engineering instructions](<C:/Users/rayne/Downloads/super_himride/AGENTS.md>).
