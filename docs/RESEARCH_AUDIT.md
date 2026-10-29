# Repository research audit

Reviewed on 29 October 2026. This audit distinguishes material supplied with the project from evidence of a current Accenture internship assessment. The archive is useful for foundational practice, but it does not establish the 2026 ATE test format, current platform, stipend, cutoff, or interview count.

## Inventory and review coverage

- The supplied `ACCENTURE-20261028T172758Z-1-001.zip` has **43 document entries**: **33 byte-distinct documents** and **10 exact duplicates**.
- The 33 distinct documents comprise **28 PDFs with 273 pages** and **5 DOCX files**. Their extracted text contains 393,601 characters before platform newline conversion.
- Several byte-distinct PDFs repackage the same questions with additional advertisements. The catalog groups them into **18 named content families**; these are editorial groups, not 18 independent reports or verified assessment events.
- All 33 extracted texts were processed for inventory, dates, content coverage, and source relationships. Representative complete question blocks and answer keys were reviewed for correctness. **This is not a claim that every archived question or answer was independently solved.** Image-only diagrams and layout-dependent questions still need visual review before use in a scored bank.
- All seven original root Markdown documents were inspected and copied to `private/research/project-*.txt` before replacement documentation is written. Their original claims remain available for traceability.
- `private/research/manifest.json` records the archive names, SHA-256 hashes, duplicates, page counts, and text files. `private/research/library.json` provides **40 annotated library records**: 33 archive sources and seven original planning documents. `scripts/catalog_research.cjs` regenerates that metadata without overwriting the original Markdown snapshots.

The automated extractor's `needsVisualReview: false` means only that substantial text was extracted. It is not a visual-layout or question-quality approval.

## What the supplied evidence establishes

The material establishes a broad practice syllabus: English grammar and comprehension; quantitative arithmetic; direction, ranking and set reasoning; attention to detail; C/C++ fundamentals; basic database concepts; and conventional programming exercises. The newer project notes add arrays, strings, number theory, dynamic programming, SQL aggregation, frontend widgets, cloud/network fundamentals, communication, and interview preparation.

The archive includes a paper explicitly dated **29 August 2004**, a **2007 graduate's recollection**, a paper explicitly dated **31 July 2008**, and a **2011-labelled technical prompt list**. A saved web page has a **3 January 2019 update timestamp**, and another has a **2019 site footer**. A site footer or update date is not an assessment-event date. Undated versions of these same question families must not be relabelled as recent because the ZIP was collected in 2026.

No official 2026 campus joining notification, assessment invitation, vendor candidate guide, or original linked first-hand campus debrief was found inside the supplied archive. The root notes name campuses and a candidate source, but do not include retrievable source URLs or the claimed official JNF. Treat these attributions as **owner-supplied campus reports awaiting source confirmation**. Public research performed separately should retain its own source URL, retrieval date, and evidence level.

## Claims that require qualification

| Claim in the original notes | Evidence limit or contradiction | Product treatment |
| --- | --- | --- |
| 90 questions in 90 minutes is the official current pattern | The archive describes older MeritTrac 55-question tests and a separate AMCAT 25/25/24 pattern. The current campus invitation is absent. | Offer explicitly labelled practice presets; ask candidates to follow their own invitation. |
| Coding always consists of two DSA problems in 45 minutes | The notes also describe DSA + SQL + frontend and a 45–60-minute range. | Prepare all three domains and label durations as simulator settings. |
| Cognitive/behavioral occurs at one fixed stage | `CAREER_MEMORY.md` places it before coding; the syllabus places it after coding. | Show subject coverage without claiming a universal sequence. |
| Python, Java, C# only; C++ frequently disabled | The PRD and architecture also request C++ support. No current invite confirms language availability. | Distinguish platform practice languages from languages permitted in a candidate's real test. |
| Both coding questions must pass to qualify | No official selection or cutoff policy is attached. | Do not present this as a guaranteed cutoff. Encourage complete, efficient solutions. |
| Four interviews always take place | PRD says up to four; other notes label four fixed panels. | Present four preparation themes, not a promised interview schedule. |
| ₹60,000 monthly stipend, ₹10–12.1 LPA PPO, all-branch eligibility | These appear in the project notes, without an attached current official notice. | Keep them as reported drive context; do not guarantee compensation, eligibility, or a PPO. |
| Benchmark email guarantees a 100% score | No scoring rubric or validated evaluator is attached. | Use it as a sample response and assess clarity, tone, structure, and task completion. |
| 1,000+ authentic questions / 35 coding questions already exist | The original runnable JSON contains **eight** problems: six frontend, one DSA, and one SQL. | Display actual curated counts from the database. |
| Exact reproduction of Accenture/Mettl/HirePro/Wheebox/Aon | Multiple distinct vendors are named, with no current screenshot establishing one target interface. | Use familiar assessment conventions and an explicit independent-preparation identity. |
| ₹500 unlock and only a 30-day course | Superseded by the current user request. | **₹499 once; exactly 10-, 20-, and 30-day study tracks.** |

## Concrete question-quality findings

These examples justify a reviewed question bank instead of automatically importing archived answer keys. Locations use the source identifier and original page/question where available.

| Source and location | Finding | Required treatment |
| --- | --- | --- |
| `22b3459d6f47`, pp. 1–2, Q4 | 624 km in 6½ hours is keyed as 104 km/h. Division gives **96 km/h**, which is absent from the options. | Correct the key and options, or omit the item. |
| `22b3459d6f47`, p. 2, Q5 | The stem already says A and B together take 6 days, then asks their joint duration and keys 3.75 days. | Rewrite the stem; do not infer the author's intended problem. |
| `22b3459d6f47`, p. 1, Q3 | A distance calculation gives options in km/h. The numerical result is 15 **km**. | Fix dimensions in all options. |
| `60d8661016c9`, p. 1, Q4; repackaged in `ea2e2d4b7da7` | Twelve dozen mangoes per box across 43 boxes is **6,192**, while the key selects 61,920. | Correct the item before scoring. |
| `60d8661016c9`, p. 1, Q3 | Two options both contain 128. | Remove duplicate correct choices. |
| `3b99800d4f15`, p. 1, Q3 | The explanation calls a horse omnivorous. | The horse is herbivorous; replace the explanation and review the classification criterion. |
| `3b99800d4f15`, pp. 2–3, Q7 | Classification depends on historical political offices and has no date in the question. | Exclude from a timeless reasoning bank or state and verify a historical date. |
| `146d98f6760f`, p. 1, Q2 | “VITUPERATE” is keyed to “praise” without specifying synonym or antonym. | Add an explicit instruction; the original isolated prompt is ambiguous. |
| `80a6ef1e1437`, p. 1; `afd7c9b1a35e`, p. 2 | A pointer/array question keys both statements false although the pointer-address statement is true. | State the programming language and replace the answer key. |
| `80a6ef1e1437`, pp. 5–6; `5c5271f63d6f`, pp. 5–6 | File-handling snippets mix `FILE*` operations with `lseek`; compiler-size claims are tied to obsolete assumptions. | Replace with valid modern code and explicit language/runtime assumptions. |
| `619cc30a88f2`, Q7; related `0d3b1c28bf38` and `5a5e9f034606` | Article-selection options repeat “A, the.” | Deduplicate options and verify that only one answer is acceptable. |
| Original `public/data/questions.json`, q8 | The supplied JavaScript solution contains unquoted SQL; the test merely looks for SQL keywords. The objectives mention `sports_registration` while the solution uses `registration`. | Use a defined schema and executable SQL with result-based tests; keyword presence is not correctness. |
| Original `public/data/questions.json`, q6 | The objectives ask for `display: block` and opacity, while starter comments/solution use `display: flex`; its CSS test only checks that display is not `none`. | Align the requirement, starter, solution, and assertions. |
| `CAREER_MEMORY.md`, prime-neighbor note vs. syllabus Problem D | One note allows both-neighbors-prime **or** sum-prime; the worked solution tests both neighbors individually. | Specify the exact condition and include discriminating tests. |

The original frontend bank also relies on local-browser tests and exposes its solutions as public JSON. Its existing runtime should not be interpreted as secure grading or protected content delivery; implementation work handles those access issues separately.

## Useful material to turn into guided preparation

| Domain | Retained insights | Practical exercise design |
| --- | --- | --- |
| Arrays and strings | Parity-index counting, run compression, matching-word concatenation, palindrome/string reversal | Define zero-based indexing, signed-number behavior, output formatting, empty/one-element cases, and complexity. |
| Number theory | Prime neighbors, factorization exponent dot product, factorial factors/trailing zeros | Include 0/1/non-prime boundaries, repeated factors, a remaining prime factor, and arrays shorter than the factor list. |
| Dynamic programming | Non-adjacent-house maximum | Teach the recurrence, two rolling states, empty input, one house, and equal alternatives. |
| SQL | Registration counts, paid-only filters, joins, grouping, `HAVING`, database keys | Supply actual schemas, seed rows, duplicate registrations, unpaid rows, and exact expected result columns. |
| Frontend | iPod/media controls, star rating, product search, cart, chatbot, carousel | Preserve the six existing tasks and evaluate DOM behavior, state transitions, edge cases, and accessibility. |
| Technical fundamentals | Bitwise tracing, recursion, arrays/pointers, OOP, DBMS, networking/cloud and Office topics from the root syllabus | Separate language-specific output tracing from language-independent pseudocode; use current semantics. |
| Reasoning and aptitude | Sets, direction tracking, rankings, work rates, ratios, averages, mixtures, interest and series | Use original, independently solved variants with unambiguous options; avoid copying uncertain historical keys. |
| Communication | Read/repeat, answer, sentence building, retell, monologue, professional email | Provide practice prompts and qualitative feedback; do not claim a licensed Versant/CEFR score. |
| Interview preparation | Complexity explanation, project architecture, SQL vs NoSQL, core CS, STAR stories | Use these as preparation modules, with no guarantee that a particular panel or question will occur. |

### Three schedules

The **10-day track** can progress through: (1) diagnostic, input/output and parity; (2) strings; (3) primes and factorization; (4) dynamic programming; (5) SQL; (6) frontend; (7) pseudocode, Office, network and cloud; (8) reasoning, behavioral and communication; (9) timed mixed practice and error review; and (10) rehearsal and targeted revision. Include brief communication and retrieval practice throughout rather than introducing them only on day eight.

The **20-day track** expands each phase into a concept session and an application/review session. The **30-day track** expands it into concepts, deliberate practice, and timed retrieval. These are preparation schedules, not a promise that every beginner will master every topic by day ten.

## Source catalog

The following inventory is generated from `private/research/library.json`. “Repackaged” means substantially overlapping content with a different file hash; it is not an independent campus report. Original filenames and exact duplicate aliases remain in the JSON manifest and catalog.

| Source ID | Title | Era | PDF pages |
| --- | --- | --- | --- |
| `0b87686f7c76` | MeritTrac verbal and analytical paper | Undated archival paper | 12 |
| `63dc176f02b3` | December placement paper with answer keys | Undated archival paper | 6 |
| `6ee457e35257` | Bangalore off-campus candidate recollection | 2007 cohort recollection | DOCX |
| `b2e6853e6a63` | July 2008 MeritTrac placement paper | 31 July 2008 | 10 |
| `4d1c7eb5d3ff` | Mumbai August placement paper | Undated archival paper | 8 |
| `619cc30a88f2` | Offline aptitude and essay recollection | Undated historical account | DOCX |
| `3b99800d4f15` | Logical reasoning with explanations | Undated archival collection | 9 |
| `a62b9c9fe05c` | Chandigarh September placement paper | Undated archival paper | 6 |
| `7ccd4f260ae5` | July 2008 MeritTrac placement paper · Repackaged PDF | 31 July 2008 | 15 |
| `d129e3ca5749` | December placement paper with answer keys · Repackaged PDF | Undated archival paper | 9 |
| `0d3b1c28bf38` | Offline aptitude and essay recollection · Repackaged PDF | Undated historical account | 8 |
| `7e996ac96435` | Bhubaneswar off-campus recollection · Repackaged PDF | Undated historical account | 4 |
| `56f59fbc882f` | Bangalore off-campus candidate recollection · Repackaged PDF | 2007 cohort recollection | 5 |
| `48ab14a55063` | Quantitative aptitude with worked explanations · Repackaged PDF | Undated archival collection | 16 |
| `19d7e1405672` | Chandigarh September placement paper · Repackaged PDF | Undated archival paper | 10 |
| `ea2e2d4b7da7` | Arithmetic and computer basics paper · Repackaged PDF | Historical collection; 2019 page snapshot exists | 5 |
| `22b3459d6f47` | Speed, work, ratios and interest drills | Undated archival collection | 5 |
| `564bb18e5ade` | MeritTrac verbal and analytical paper · Repackaged PDF | Undated archival paper | 14 |
| `7ed5debf6e46` | Legacy AMCAT practice compilation · Repackaged PDF | Undated historical AMCAT pattern | 15 |
| `d5b8688931e6` | Legacy AMCAT practice compilation · PDF | Undated historical AMCAT pattern | 13 |
| `351054c4960b` | Quantitative aptitude with worked explanations | Undated archival collection | 10 |
| `60d8661016c9` | Arithmetic and computer basics paper · 2019 page snapshot | Historical collection; 2019 page snapshot exists | 4 |
| `5c5271f63d6f` | August 2004 written and technical paper · Repackaged PDF | 29 August 2004 | 8 |
| `8a4f7bfbf237` | IndiaBIX quantitative model paper | Historical page snapshot with 2019 footer | 5 |
| `4504126d354e` | Bhubaneswar off-campus recollection · Word document | Undated historical account | DOCX |
| `f6df7fcb202a` | C language and programming interview prompts · Word document | 2011-labelled paper | DOCX |
| `e45e7e90e4c1` | Legacy AMCAT practice compilation · Word document | Undated historical AMCAT pattern | DOCX |
| `146d98f6760f` | English vocabulary and grammar drills | Undated archival collection | 6 |
| `5052bbd7736e` | C language and programming interview prompts · Repackaged PDF | 2011-labelled paper | 4 |
| `6d6a79d03358` | Mumbai August placement paper · Repackaged PDF | Undated archival paper | 12 |
| `afd7c9b1a35e` | Legacy C, C++, database and interview bank · Repackaged PDF | Undated historical technology collection | 14 |
| `5a5e9f034606` | Offline aptitude and essay recollection · Partial web-page capture | Undated historical account | 20 |
| `80a6ef1e1437` | Legacy C, C++, database and interview bank · QuestionPaper compilation | Undated historical technology collection | 20 |

## Maintenance rules

1. Keep the archive untouched and keep hashes/source identifiers when curating a question.
2. Store source attribution, whether the item is an original variant, and the reviewer/verification status with each graded question.
3. Label material as official guidance, first-hand report, project note, or archival practice only when the evidence supports that label.
4. Use current official candidate instructions for device, language, timing, and assessment-rule guidance. Do not infer those rules from a historical paper or the current simulator's settings.
5. Keep original document snapshots and the archive private; expose the curated summaries and authorized source views through the application's access controls.

## Subsequent campus notification

The owner supplied the Campus 2026–27 internship notification after this audit. It supplies campus-specific evidence previously missing; see [Campus notice update](CAMPUS_NOTICE.md). The original archive findings remain unchanged.
