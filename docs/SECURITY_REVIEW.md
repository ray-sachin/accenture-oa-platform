# Security implementation review

Reviewed 29 October 2026. This is a repository-grounded review and test record, not a penetration-test certificate or a promise of invulnerability.

## High-impact issues fixed

1. **Public candidate telemetry:** the old server served JSON/CSV candidate logs. Those routes were removed, existing log files moved to ignored private storage, and a fixed static-asset allow-list replaced arbitrary file serving.
2. **Public answers and test bank:** the old question endpoint returned solutions and assertions with every question. Curated prompts are now released through authenticated, entitlement-checked attempts; answer keys and hidden tests remain server-side. Frontend acceptance checks are intentionally inspectable and explicitly advisory.
3. **Untrusted client identity:** the original login collected telemetry but did not establish secure access. The current flow uses salted scrypt password hashes, random hashed session tokens, HttpOnly cookies, a separate server-issued device token, expiry, exact-origin checks and CSRF tokens.
4. **Client-only solution lock and bypass:** the emergency instructor bypass was removed. The server checks elapsed practice time and refuses solution access during mocks.
5. **Unsafe same-origin preview coupling:** frontend submissions use an opaque-origin sandbox with no same-origin privilege, restrictive response CSP, parent message source/channel validation, and no trusted grade derived from client results.
6. **SQL keyword pseudo-grading:** the malformed legacy SQL string and keyword check were replaced with real fixture evaluation in a separate restricted process. SQL cannot access the account database through this process.
7. **Payment spoofing:** fixed server amount/currency, stored order ownership, timing-safe HMAC checks, provider capture confirmation, idempotent signed webhooks and refund handling replace any prospective client-side unlock flag.
8. **Account sharing enforcement:** sessions and conflict counters are server-owned. Only correct credentials can trigger a 6/12-hour conflict cooldown; other sessions are revoked. A browser cannot submit its own premium/cooldown/score state.

## Residual and deployment limits

| Priority | Limitation | Required treatment |
| --- | --- | --- |
| Before public onboarding | Email ownership is not verified; recovery is operator-only. | Add an authenticated mail/identity provider and a verified support workflow. Do not claim a typed email proves student identity. |
| Before paid launch | Real gateway, AI and compiler credentials are absent. | Validate real test-mode transactions, webhook delivery and actual runner/model responses; do not describe mocked upstream tests as live integration testing. |
| Before multi-instance use | SQLite, quotas and preview handles assume one instance. | Use shared transactional storage and centralized quotas, or keep the documented single-instance deployment. |
| Deployment | The SQL subprocess is not a full OS container. Browser frontend code may consume local CPU. | Add OS/process resource quotas and isolate heavier browser evaluation if authoritative frontend scoring is needed. General-purpose code must remain in isolated Judge0 infrastructure. |
| Deployment | IP-based authentication limits see the direct peer; behind a proxy that may be shared. | Configure trusted edge controls and load-test campus/NAT traffic; do not blindly trust arbitrary X-Forwarded-For values. |
| Deployment | Prior Git history may contain the old public telemetry. | Review actual repository visibility and any historical distribution; current HTTP protections do not rewrite Git history. |
| Content | A paid user can copy downloaded/rendered material or share browser credentials/cookies. | Use terms, support and abuse monitoring proportionately. No anti-copy, obfuscation, device fingerprint or right-click block can guarantee prevention. |
| Product policy | Old notes include unsupported pay, cutoff and selection guarantees. | The product labels them as source material and does not use them as established promises. Verify the current campus invitation. |

Server errors avoid printing credential-bearing payloads. AI and compiler output is HTML-escaped in the interface. SQL fixtures and user-code paths do not interpolate into shell commands. The database and `.env` are never listed as static assets. The frontend does not store auth or premium flags in localStorage.

Implementation pointers: `server/app.js` (route checks/integrations), `server/db.js` (schema/unique active attempt), `server/sql-process.js` (query authorization), `public/js/ide.js` (sandbox output and save flow), `scripts/account.js` (operator-only recovery), `tests/platform.test.js` (boundary regression checks).
