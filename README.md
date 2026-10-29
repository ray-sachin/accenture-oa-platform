# CampusReady

> Update: The subsequently supplied Campus campus notification confirms the campus-specific assessment areas and stipend. See [Campus notice update](docs/CAMPUS_NOTICE.md); older statements that no notice was supplied are superseded.


An independent preparation workspace for Accenture internship assessments. It combines the repository's research with a reviewed practice bank, a focused IDE and exactly three study tracks: **10, 20 and 30 days**. The complete pass costs **₹499 once**.

The interface is inspired by familiar assessment conventions. It is not an official Accenture site, a verified clone of a particular vendor, or a guarantee of selection. The supplied material does not establish one universal current campus format.

## Start locally

Use **Node.js 26** (minimum 24.10 for the SQLite authorizer). No npm dependencies or build step are required.

```powershell
node server.js
```

Open **http://localhost:3000**, or use `start.bat`. The server binds to `127.0.0.1` by default. Keep the hostname consistent: `APP_ORIGIN` is checked exactly for state-changing requests.

The requested `.env` file has been created and is ignored by Git. It contains empty integration fields. Paste your Gemini key into `GEMINI_API_KEY`, then restart the server. `.env.example` is the shareable configuration template. No real credentials are included in the repository.

## What is implemented

- Responsive overview, study planner, practice bank, mock hub, source library, AI mentor, communication practice and account screens.
- **60 curated questions:** 10 DSA, 4 SQL, 6 frontend, and 40 MCQs across pseudocode, core CS, Office, reasoning, English and workplace judgement. The original eight-question bank is preserved privately; its SQL placeholder was replaced with real query execution.
- **10/20/30-day schedules**, with objectives, readings, daily tasks and linked exercises. Study completion is self-reported; verified exercise progress is separate.
- An IDE with syntax colouring, line numbers, indentation, undo/redo, find, language/file switching, saved code, samples, custom input, hidden-case evaluation, and a server-enforced 20-minute solution wait.
- Frontend preview in an opaque-origin sandbox, with network-resource restrictions and explicit advisory test results. Browser checks never award verified credit.
- SQL execution in a disposable child process against in-memory fixture databases. Read-only authorization, a function allow-list, row/output bounds, and a two-second process deadline keep it separate from the account database.
- DSA execution through a configurable isolated Judge0 CE-compatible service; Python, JavaScript, Java, C++ and C# editors. **No submitted general-purpose code is run on the application host.** Actual language versions depend on the runner and should be checked against the candidate's real invite.
- Timed diagnostics, 45-minute two-problem coding mocks, 60-minute three-domain mocks, and a 40-question fundamentals circuit. These are training presets, not official patterns.
- Server-side Gemini integration with bounded conversation context, daily per-account quotas, and no AI access during an active timed mock.
- Speaking prompts, browser speech playback, local microphone recording/playback and a timed email-writing exercise. There is no fabricated Versant/CEFR score or uploaded audio.
- Email/password accounts with scrypt hashes, opaque HttpOnly sessions, CSRF protection, exact-origin checks, rate limits, ownership checks, and one active browser session.
- A valid concurrent login from another browser revokes sessions and starts a **6-hour cooldown**, or **12 hours on a later repeat**. Incorrect passwords cannot trigger it. Signing out before a legitimate device change is allowed.
- Razorpay order creation at **49900 paise / INR**, callback HMAC checks, server fetch of captured payment details, signed idempotent webhooks, and full-refund access revocation. No browser flag or fake checkout unlocks the pass.
- A private SQLite database for accounts, sessions, orders, progress, practice sessions and limited security events.

## Integrations to configure

| Feature | Required `.env` values | Behavior without them |
| --- | --- | --- |
| AI mentor | `GEMINI_API_KEY`; optionally `GEMINI_MODEL` | A clear unavailable state; no fake AI answer. |
| ₹499 checkout | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | No payment is taken and no access is granted. |
| DSA execution | `JUDGE0_URL`, plus the authentication fields for your service | Code editing/saving works; running explains that the runner is unavailable. |
| Database | Optional `DATABASE_PATH` | Creates `private/runtime/campusready.sqlite`. |

Razorpay webhook URL: `https://YOUR-DOMAIN/api/payments/webhook`. Subscribe to `payment.captured`, `order.paid` and `refund.processed`. Configure automatic capture at the merchant/provider level; an authorized but uncaptured payment does not unlock access. Test with Razorpay test credentials before switching to live credentials. The ₹499 fee is this independent preparation product's fee, not an Accenture application fee.

Judge0 language IDs in the adapter are Python 71, JavaScript 63, Java 62, C++ 54 and C# 51. Validate these against your runner's `/languages` response before launch. Configure the runner with network isolation and CPU/memory/process limits at the infrastructure layer too. Do not expose its administrator credentials to the client.

## Research and provenance

The supplied ZIP contains **43 entries**, reduced to **33 byte-distinct sources**: 28 PDFs / 273 pages and five DOCX files. Seven original planning documents are also snapshotted. With the new campus notice, all **41** are indexed in the source library. Several archived answer keys are incorrect, so they are reference material rather than automatically scored questions.

- [Research audit](docs/RESEARCH_AUDIT.md): dates, contradictions, concrete answer-key errors and confidence limits.
- [External references](docs/REFERENCES.md): primary-source hiring, assessment and integration references.
- [Reusable patterns](docs/REUSABLE_PATTERNS.md): the six requested projects' vault/Markdown findings and the UX/security ideas adopted here. Their content, code, credentials and datasets were not imported.
- `private/research/manifest.json`: hashes, duplicate provenance, extraction coverage.
- `private/research/library.json`: source catalog and annotated descriptions.
- `private/research/project-*.txt`: original planning notes preserved before the current documentation update.

The reported ₹60,000/month stipend and modern campus claims are retained as owner-supplied context, not advertised as established facts. No official current campus invitation was present. Use the actual invitation to confirm eligibility, stipend, round order, timings and permitted languages.

## Verification

```powershell
node --experimental-vm-modules scripts/check.cjs
node --test tests/platform.test.js
```

The syntax check parses browser ES modules as modules. The test suite invokes the real HTTP request handler without requiring external network access. Payment, Gemini and Judge0 tests use explicit fake upstream responses and do not charge money, contact real students or claim live-provider verification.

`scripts/check-reference-solutions.py` executes only trusted repository-owned Python reference solutions against all 36 public/hidden DSA cases. It must never be used for student submissions. `node scripts/build-content.js` regenerates the bank and schedules. The extraction script uses Python + pypdf; these are development tools, not runtime dependencies.

See [verification record](docs/VERIFICATION.md) for browser journeys and remaining live-integration checks.

## Operator recovery

After independently verifying ownership, a trusted server operator can inspect an account, revoke its sessions and clear a cooldown, or reset its password with hidden terminal input:

```powershell
node scripts/account.js inspect student@example.com
node scripts/account.js clear-cooldown student@example.com
node scripts/account.js reset-password student@example.com
```

There is no public admin endpoint, hard-coded administrator account, email-verification service or self-service password-reset email. Add a verified email/recovery service and a real support channel before broad public onboarding. Do not reset an account merely because someone knows its email address.

## Deployment and honest limits

The website is implemented locally; it has **not been published** and no live payment or AI credentials have been tested. Use a Node host with a persistent private volume. In production set `NODE_ENV=production`, `APP_ORIGIN=https://YOUR-DOMAIN`, and an appropriate `HOST` behind a trusted HTTPS reverse proxy. Production cookies are Secure and use the `__Host-` prefix. Do not publish the repository or `private/` as static hosting.

SQLite currently targets one application instance; use a shared transactional database/limiter before scaling to multiple instances. Protect and back up the database, configure retention and support/refund policies, and test restart/recovery, expected load and provider failure modes before taking live payments. Behind a proxy, the current IP limiter sees the proxy address; configure deployment-level rate limiting and review limits for campus/NAT traffic rather than blindly trusting forwarded headers.

Visible HTML/CSS/JavaScript, viewed source documents, screenshots and text can be copied. Browser-device tokens deter casual sharing; they do not identify an uncopyable physical device. The security boundary is server-side entitlement and private data, not right-click blocking, obfuscation or a claim that the website cannot be hacked. See [security review](docs/SECURITY_REVIEW.md).

Legacy candidate log files were moved out of `public/` into ignored `private/legacy-logs/`; they are not discarded or exposed by an endpoint. Historical Git commits may still contain the previous public files; review repository access separately if that history has ever been shared.
