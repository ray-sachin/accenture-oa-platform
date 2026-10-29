# Research and implementation references

Reviewed on **29 October 2026**. These references inform conventions and implementation; none establishes the exact interface or pattern for the user's upcoming campus invitation.

| Source | What it supports | What it does not establish |
| --- | --- | --- |
| [Accenture recruiting process](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture) | Accenture's published hiring guidance and the need to follow communications for the particular role. | A universal 2026 ATE question count, cutoff, stipend, four interviews, or one assessment vendor. |
| [Mercer Mettl frontend developer assessment](https://mettl.com/test/front-end-web-developer-basic/) | Hands-on frontend simulation is an assessment capability; HTML/CSS/JS tasks are a reasonable preparation domain. | Confirmation that a particular campus uses this vendor or this exact screen. |
| [Mettl coding interview guide](https://resources.mettl.com/wp-content/uploads/2021/04/Coding-interview-Platforms-1.pdf) | A coding-workspace reference with language selection, editing and execution. | An up-to-date Accenture-specific candidate UI. |
| [Aon candidate preparation](https://www.aon.com/en/capabilities/talent-and-rewards/prepare-for-your-online-assessment) | Candidate preparation and assessment guidance. | A universal Accenture round sequence. |
| [Google Gemini API reference](https://ai.google.dev/api) | Server requests authenticated using `x-goog-api-key`; generated model output is returned as content. | Guaranteed factual correctness, selection prediction, or calibrated speech scores. |
| [Razorpay server integration](https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/) | Server-created orders, signature verification, and payment validation. | Live merchant readiness without the user's credentials and webhook configuration. |
| [Judge0 CE API](https://ce.judge0.com/) | Isolated code execution API, execution limits and result statuses. | Safety or availability of an unconfigured/self-hosted Judge0 deployment. |

The repository's 43-file ZIP, seven original planning documents, and source-quality audit are indexed separately in `private/research/manifest.json`, `private/research/library.json`, and `docs/RESEARCH_AUDIT.md`. Ten byte-identical duplicates were collapsed; the library contains 33 archive sources plus seven original project-note snapshots.

Campus names and the reported ₹60,000/month stipend came from the user's project notes. An official current campus notice was not present in the supplied material. These claims are not used as guaranteed marketing outcomes. The product is deliberately labelled as independent preparation and uses familiar assessment conventions rather than claiming an authenticated pixel-for-pixel clone.

The six other project folders requested by the user were reviewed for principles only. `docs/REUSABLE_PATTERNS.md` records their Obsidian/Markdown locations and the selected lessons. Their content, accounts, code, branding and datasets were not imported.
