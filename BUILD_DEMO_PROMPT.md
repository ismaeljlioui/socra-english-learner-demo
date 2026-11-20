# Implementation handoff prompt

Paste the following into a new implementation chat attached to this same workspace. This handoff creates no chat and sends no external messages.

---

Build the standalone Socra English-learner humanities research demo in:
`/Users/ismaeljlioui/Desktop/Socra/EL Education`

Read these files first:
1. `AGENTS.md` and `RESEARCH_BRIEF.md`
2. `DEMO_SPEC.md` — authoritative v0.1 build specification
3. `DEMO_CASES.md` — authored dialogues, evaluation cases, and acceptance checks
4. `SOURCES.md` and `EL_SUPPORT_RESEARCH.md` as needed for evidence/context

The user has authorized moving from research into this narrowly scoped implementation. The older brief's setup-only restriction does not block this build. Do not expand the product scope or wait for educator approval to implement the explicitly provisional demo. Preserve unanswered educational decisions as assumptions, not resolved facts.

Create the app in `demo/`, choosing a lightweight stack after inspecting the environment. Complete the build, appropriate tests, and browser verification. Do not stop after a plan or skeleton.

Build one text-based experience around the adapted Glaucon task and exact source material in DEMO_SPEC.md. Include the task panel, conversation, student final response, evidence/support review, fixture examples, JSON export, and the optional separate learning note. Use a restrained, readable interface suitable for a CTO walkthrough. No official Socra branding, accounts, database, voice, external deployment, or invented product integrations.

Implement the strong baseline and proposed-policy conditions specified in the spec using the same configurable model. Proposed-policy learner messages use validated fixed actions/templates; server controls state, limits, and provenance. Reports must cite exact student words, distinguish source from student stance, preserve ambiguity/revisions, and never produce general ability labels, WIDA levels, grades, or fabricated certainty. Do not treat an action's planned category as proof of no leakage.

Keep model credentials server-side. If suitable credentials are unavailable, finish a fully usable fixture walkthrough visibly labeled "Scripted example — not live AI", plus the live adapter/configuration path. Never silently substitute fixtures for live failures. Do not inspect or print secret values. Read current official provider documentation if needed; do not guess model names or SDK behavior. Use an existing suitable provider configuration if available; otherwise choose one documented provider and expose it through configuration. No need for multiple provider integrations.

Convert DEMO_CASES into runnable fixtures and meaningful checks. Provide a way to execute and export paired next-turn baseline/policy evaluations. Do not launch paid evaluation batches automatically. Run local build/type checks and meaningful state/provenance/error-path tests, and inspect the actual UI in the browser. If live calls are unavailable, report that limitation plainly; do not claim pedagogical tests passed based only on fixtures. Never invent benchmark scores, educator review, or student outcomes.

Deliver the working local app, concise README with exact run/configuration/evaluation commands, screenshots of verified UI, and a short report of what was tested and what remains untested. Include a five-minute walkthrough and remaining CTO/educator questions. Keep changes inside the project, preserve research provenance, and avoid unrelated infrastructure.

---

Current handoff status (2026-11-05): local implementation and software/browser verification completed in `demo/`; see `demo/README.md`. The user-authorized Gemini 3.1 Flash-Lite alternate is configured and responds. Narrow live integration checks and rejected substantive outputs are documented in the demo README; no full paired evaluation, educator review, or student testing was performed. The instructions above are preserved as the original build handoff.
