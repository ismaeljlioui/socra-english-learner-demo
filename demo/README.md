# Humanities English-learner support demo

A **local text research prototype** based on `../DEMO_SPEC.md` v0.1, with a newer language-observation case library from `../ILLINOIS_LANGUAGE_DETECTION.md`. It retains the fixed Glaucon passage and question, support messages, and six authored conversations. It is independent of Socra's codebase and has no official branding or production integration.

**Scripted chat playback:** Choose a card and **Play example** to start automatically. **Pause / Resume**, **Next response**, and **Replay** control the sequence. Each comparison starts its own separate playback; missing-text cases show an input notice instead of inventing a student message. Playback pauses while another app tab, the passage, settings, or card picker is open. The conversation and unsent draft stay intact. Only presentation changes: no model call, generated follow-up, or analysis rerun occurs, and the full authored transcript remains the analysis input. Review guidance stays clearly separate from scripted chat turns. Browser checks covered ordered guide/student turns, automatic completion, pause/resume, manual stepping, replay, example/comparison isolation, tab persistence, a missing-input case, the retained draft, and the 390×844 layout. The production build and all 93 existing offline tests pass; no live model calls were made for this change. [Playback screenshot](screenshots/44-scripted-chat-playback.jpg) · [Mobile playback](screenshots/45-scripted-chat-mobile.jpg).

## Vercel deployment — 2026-11-20

Set Vercel's **Root Directory to `demo`**, framework **Vite**, build command **`npm run build`**, and output directory **`dist`**. `vercel.json` routes `/api/*` to the shared Node function in `api/index.ts`; building the static frontend alone is insufficient. The local server and hosted function use the same API/controller/provider. Set the server's Gemini variables from `.env.example` in Vercel's environment settings and redeploy. Never use `VITE_` for credentials or commit `.env`. A missing key or missing matching Free-tier confirmation shows explicit setup instructions; live AI is not silently replaced with scripted responses.

This remains a temporary, synthetic-data demo with **no durable database**. Hosted requests carry authenticated AES-GCM encrypted state, kept in browser tab storage, so consecutive requests can use different function instances. A random encryption key is generated during installation/build, stays in the server function, and is excluded from Git and the frontend. The shared controller restores the last acknowledged session and analysis records for each request; the browser serializes requests to avoid overwriting newer state. Export before closing the tab, 12 hours of inactivity, or redeployment. A same-tab `?session=ID` link can resume a saved encrypted session; the ID alone on another browser cannot. Local sessions still use process memory.

A response lost in transit leaves the last acknowledged snapshot in the browser. An explicit retry can repeat a model call; this stateless demo cannot promise durable exactly-once requests or cross-device history. No automatic retry occurs. The recovery download contains the visible conversation and can omit server-only analysis history. Persistent storage and access controls remain future production work. No database, paid billing, or alternate model was provisioned for this fix.

Individual hosted analyses are awaited before the function returns. Long scenario/comparison batches explicitly require the local server or evaluation CLI, rather than starting unfinished background jobs on Vercel. The configured model is still identical for baseline and policy.

**Routing verification:** `npm run check:server` compiles the API with NodeNext and exercises config, scripted session creation and a scripted response using plain Node (without tsx). The production build includes this check, so extensionless ESM imports or missing JSON import attributes fail before deployment. 98 offline tests pass (93 existing + 5 hosting/completion regression tests), and the TypeScript/Vite production build passes. Coverage includes the rewritten API URL, HTTPS same-origin requests, Vercel's parsed request body, scripted create/advance/replay/export, context, missing-input no-call analysis, expired-session errors, body limits, cross-origin rejection, and readable non-JSON/429 errors. A separate hosted transport test restores chat/context/analysis in a fresh runtime on every request and rejects tampered encrypted state. These checks make no Gemini requests and establish no educational validity. The existing bundle-size advisory remains.

## Teacher language observations — 2026-11-20

The second tab now implements **student context → existing transcript snapshot → explicit analysis → exact evidence → teacher review → JSON export**. It leaves the Glaucon assignment, original chat, support controls, card animations/search, and unsent draft intact. Analysis itself never adds turns, answers, support, or student follow-ups.

- **Context:** Illinois is the only enabled state on a local SVG map and native state selector. Framework is fixed to WIDA. Writing and reading are independent, default to Not provided, and accept teacher-selected broad Level 1–6 values. They are a simulated profile, not official scores; both are withheld from the detector. Selections survive tabs/cards and are locally remembered. Changing them makes no analysis request. Exports distinguish current settings from immutable context-at-request.
- **Five proposed categories:** C02 contextual word meaning, C06 logical relationship, C10 reference, C11 attribution, C15 claim–evidence connection. C15 cannot be returned as a reasoning difficulty. Strengths, uncertainty, later repairs, and assistance are part of the contract. These are not official WIDA codes or validated diagnoses.
- **Snapshots and validation:** fixed source/question, recorded student/guide turns, assistance order/status, and input limits. Exact contiguous student/source spans, roles, IDs, separate repairs, and source paragraph provenance are checked on the server. No case title, target category, expected interpretation, opposite variant, or proficiency levels enter the model data. Blank input makes no model call. Quotes matching the transcript do **not** establish semantic correctness. A model could still misinterpret a correction even after referencing its turn; teacher review remains necessary.
- **Review:** results, empty findings, missing input, pending, failed, and stale states; View evidence highlights quoted snapshot text. Confirm/dismiss/edit decisions are append-only and tied to one analysis. The original suggestion is preserved. Tab switches retain pending request IDs; double clicks and replayed requests are deduplicated. Another case or variant cannot inherit findings or decisions.
- **Scope:** all 24 authored case cards remain. Both variants of the five categories can be analyzed; the other 19 retain authored guidance and a not-implemented notice. C04/C14 remain task-not-elicited. The original 17 assessment fixtures and old rubric remain separate.

### Actual verification and remaining live limitations

**Latest readiness recheck, 2026-11-20:** Three new synthetic requests completed using unchanged `gemini-3.1-flash-lite` and prompt v2, with no retries, fallback, or billing changes. C06 example returned a source-grounded logical-relationship difficulty. C06 comparison recognized the protective motive in its explanation, but returned C15 insufficient evidence for the broader assignment rather than a standalone strength; do not describe it as a clean no-flag result. C10 example identified ambiguous pronouns but incorrectly used difficulty instead of unclear and added an unsupported attribution difficulty. This exposes overflagging and uncertainty-handling problems despite structurally valid quotations. The schema fix now works on these requests; reliable classification is not established. [Actual three-request record](evaluations/language-live-smoke-2026-11-20T19-03-04.863Z.json). All 93 offline tests and the production build were rerun successfully. The earlier failed run below remains historical evidence.

**Offline:** 93 automated tests passed (the prior 80 plus 13 detector tests), and the TypeScript/Vite production build passed. [Software output](evaluations/software-tests.tap). Coverage includes provenance rejection, missing-input no-call behavior, no conversation mutation, deduplication/replay, stale snapshots, teacher decision isolation, repairs/later context, all five pairs' input isolation, settings, and small provider grammar with strict local bounds. These are mocked software checks, not detector performance measurements.

**Initial live run, before the recheck above:** one C06 example request returned HTTP 400 `INVALID_ARGUMENT` because the schema produced too many constraint states. That run stopped with zero usable observations and two cases unrun. The provider grammar was simplified while retaining strict server validation. [Preserved initial failure](evaluations/language-live-smoke.json) · [Initial app export](evaluations/language-live-export.json). The saved Free-tier confirmation remains operator-supplied, not a fresh billing check.

**Browser:** verified Illinois-only map/text selection and keyboard activation, independent reading/writing including Not provided, settings across tabs/cards, preserved draft, example/comparison isolation, real failure display, missing-input no-call state, and JSON download. The final production server was also checked; C04/C14 analysis was disabled with task-opportunity notices. A separate **offline mock UI server** verified pending tab/case changes, exact evidence highlighting, confirm/dismiss/edit separation, historical context, stale snapshots after a scripted turn, and a 390×844 layout without horizontal overflow or console errors. Its hand-authored observations are explicitly labeled, never served by the ordinary app or counted as live outcomes. [Mock UI export](evaluations/language-MOCK-ui-export.json).

[Student settings](screenshots/43-production-student-context.jpg) · [Actual live failure](screenshots/40-language-live-failure.jpg) · [Teacher review — MOCK](screenshots/41-language-review-MOCK.jpg) · [Mobile evidence — MOCK](screenshots/42-language-mobile-MOCK.jpg)

### Use and reproduce

Open Chat studio, choose a case or use an existing conversation, then **Language observations → Analyze conversation**. Browse authored expectations separately. Open **View evidence**, review a suggestion, and **Export record**. Settings are in Research controls. Export before restarting: sessions/analyses remain in server memory. An explicit `?session=ID` link can reopen an existing session while that server process lives; it is not durable storage.

```bash
npm test
npm run build
npm run check:language                 # prepares 10 category variants + 4 safeguards; no AI calls
# Only when intentionally authorizing a new bounded live check:
npm run check:language -- --live-three  # at most 3 requests; stops on config/quota failure
# Separate offline browser verification; keep npm run dev running on 4317:
npm run test:language-ui               # prints a 4318 URL; MOCK banner; never loads .env
```

The [14-check plan](evaluations/language-check-plan.json) is prepared, not passed. Clear meaning in imperfect English, self-correction, substantive help, and unresolved ambiguity are included. The offline fixture server is a development verification tool, not a substitute for live analysis. Stop it with Ctrl+C. Production serves only the built app.

### Three-minute walkthrough for Deniz

1. **0:00–0:30:** Research controls: show Illinois/WIDA, Writing Level 2 and Reading Not provided, and the provisional Grades 9–12 note. These are simulated teacher inputs, withheld from analysis.
2. **0:30–1:10:** Open the retained readiness-check session while its server remains running, then C06 example's Language observations. Show the actual logical-relationship observation and its student/source evidence. Distinguish it from authored guidance.
3. **1:10–1:40:** Show the C06 comparison result. The explanation recognizes its meaning despite grammar, but the observation concerns the missing connection to the full assignment. Explain why task scope and unnecessary flags need review.
4. **1:40–2:40:** Show C10's actual output and its incorrect treatment of ambiguity as difficulty, including the extra attribution flag. Demonstrate how a teacher can edit/dismiss a suggestion without replacing the original. The earlier mock UI record remains software-test evidence, not a live result.
5. **2:40–3:00:** Show current versus context-at-request and Export record. Ask which observations EL teachers find useful. Next work is reducing overflagging, enforcing appropriate uncertainty statuses, and educator review of additional cases.

Suggested factual update: “Following our call, I added a teacher-facing EL observation flow with Illinois/WIDA context, 24 authored example cases, and an initial detector covering five patterns. Teachers can inspect exact evidence and confirm, edit, or dismiss suggestions. All 93 offline checks pass. Three live checks now complete after resolving an API schema issue; they also exposed overflagging of ambiguous language. Next I’m focusing on uncertainty handling and educator review.”

**Current case browser (2026-11-20):** The 17 visible assessment-test cards have been replaced by **24 language cases**, retaining the card-stack UI, numbered selectors, search, and chat styling. Each case contains an original example and a separate comparison, context, a proposed observation, interpretation limits, and research provenance. **Play example** replays the fixed question and authored transcript one message at a time, then reveals review guidance; **Return to your conversation** preserves the main session and unsent draft. Opening or switching examples makes no model call and generates no follow-up. These are not AI-detected findings or WIDA level-specific errors. The teacher-facing analysis flow added later the same day is described above.

The examples keep the same Glaucon assignment. C04 (figurative interpretation) and C14 (multiple-source comparison) explicitly show that this task does not elicit the category. C16 and C19–C23 include strengths and interpretation safeguards; C24 simulates missing text without claiming an audio test. Observations apply to the selected pattern, not the whole assignment. The original 17 cases remain in `data/cases.json`, the evaluation CLI, and backend regression coverage.

Earlier case-library verification: **80 existing offline tests** and the **TypeScript/Vite production build** passed. Browser checks covered all 24 card selections, ID search, example/comparison switching for C04/C10/C14/C19/C21/C22/C24, passage access, Escape/focus return, preserved unsent input, and no browser error logs. A bounded independent content critique corrected source/student attribution, overlap between observation categories, and the scope of displayed expectations. No new live model calls, detection evaluation, or student study was run. Existing dependency and bundle-size build advisories remain. [Updated case browser](screenshots/38-language-case-cards.jpg).

**Educational assumptions are provisional.** The task, grade assumption, rubric, glossary boundary, clarification, and probe limits await educator/CTO review. No student outcomes, fairness, proficiency, or assessment validity have been established.

## Run locally

Requires Node.js 22.12+ and npm. Built and tested here with Node 25.0.0.

```bash
cd "/Users/ismaeljlioui/Desktop/Socra/EL Education/demo"
npm ci
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317). The server binds only to loopback. The default is **Live AI · guided assessment** when the server is configured. If setup is missing, the app shows a setup card; it never silently substitutes examples. Choose **Research controls → Scripted walkthrough → Start fresh session** for the credential-free examples. Stop with Ctrl+C. Restart after server-side changes; frontend development changes reload through Vite.

For a production build served locally:

```bash
npm run build
npm start
```

Do not run dev and start on the same port simultaneously. Change `PORT` in `.env` if needed. Use these commands to restart the local app whenever needed.

## What's implemented

- Exact P1/P2 source, attribution, adapted question, and provisional task notice.
- Text conversation, requested repeat/clarification, optional student-authored final response, and early finish.
- Server-owned action eligibility, one probe per criterion / three total, ambiguity repair, idempotent retries, frozen pre-help cutoff, and cumulative support history.
- Evidence review with exact student quotations, preserved revisions, unresolved questions, unmet support requests, reviewer corrections, and JSON inspection/export. Corrections never rewrite the original transcript or frozen review.
- Optional authored learning note and separately recorded post-help reflections.
- Six explicitly labeled scripted paths. Scripted mode accepts only authored turns and fixed repeat/clarification controls. A custom final response is retained **without invented interpretation**.
- Strong baseline and proposed-policy live conditions using the same configured model, source, rubric, report schema, and limits. A condition change starts a fresh session with an export reminder.
- Paired evaluation plans, explicit live-run controls, randomized A/B presentation, reviewer sheets, preserved failures, full outputs, latency, token usage when returned, and JSON exports. Cost is `null` because no pricing is inferred.

Sessions are in server memory. Reloading the plain URL opens a fresh session; an explicit ?session=ID link resumes an existing in-memory session. Restarting the server discards all sessions. Export explicitly to keep a record. Fonts are bundled locally; scripted mode makes no external model calls. There are no accounts, database, analytics, speech input, or external deployment. Optional response narration uses a device-local English voice, when available.

## Chat studio styling — 2026-11-09

The default **Chat studio** tab uses the user's supplied `PromptInput` component in `src/components/ui/ai-chat-input.tsx`, with a full-page background. The original 320→480 px expansion, 24 px corner radius, spring timing, animated model menu, icon transitions, and multiline resizing are retained. Scoped Tailwind utilities isolate the component from the research interface; `npm run build` and `npm run dev` generate them automatically. The passage opens in a drawer, and conversation messages move the composer to the bottom.

Integration changes preserve the text-demo boundaries: the menu shows only the server-configured Gemini model, generation settings remain identical across conditions, and voice/attachment controls show explicit unavailable notices. No simulated speech is used. Scripted-mode submission retains the draft and explains that arbitrary input needs live mode; it does not invent an answer. The separate Conversation, Evidence review, and Baseline comparison navigation pages have been removed at the user’s request. The frozen record opens in a dialog within Chat studio; paired comparison remains available through the evaluation command below.

For this styling update, all **67 offline tests** and the **TypeScript/Vite production build** passed. Browser checks covered desktop and a 390×844 viewport, collapsed/expanded input, multiline scrolling, empty-Escape collapse, model-menu display, capability notices, scripted-submit draft preservation, passage access, and a scripted exchange through final skip and evidence review. Screenshots 14–16 below capture the rendered build. No new live model requests or educational evaluations were run. At that time, the earlier Free-tier confirmation had expired under the original 24-hour timer. The current live-default update below supersedes that timer.

## Dashboard shell — 2026-11-09

The user's dashboard attachment is the documentation for [ObsidianUI Analytics Dashboard](https://www.obsidianui.dev/docs/analytics-dashboard). Its original [registry source](https://www.obsidianui.dev/r/analytics-dashboard.json) is installed under `src/components/block/` and `src/components/analytics-dashboard/`, with its listed dependencies. The local extension adds content/navigation/header/footer slots, keeps the original rail, animated active indicator, container breakpoints and sidebar transitions, and gives the sidebar/top bar translucent surfaces over the chosen background. `src/HumanitiesDashboard.tsx` maps the four existing humanities sections to the dashboard pages; `src/dashboard-theme.css` holds the integration styling.

The registry's engineering demo data and PR assistant are not displayed. The record action becomes available after a conversation is finalized. Chat still uses the previously supplied input component. On narrow screens, the sidebar floats over the page; Escape closes it and returns focus to the toggle. This interface source is not educational evidence.

Dashboard verification: all 67 offline tests and the TypeScript/Vite production build passed. Browser checks covered the four page entries, a full D1 scripted exchange through final skip and evidence review, comparison's zero-result state, desktop sidebar navigation, the 390×844 mobile input, floating sidebar, Escape/focus return, and research controls. No live model calls were made. Vite reports a bundle-size advisory because the complete upstream dashboard includes its optional analytics/animation modules.

Earlier background iterations used the supplied `InteractiveGrid` component and a pearl/sage gradient. Those implementations and screenshots remain in the workspace; the grid is not rendered over the current image.

On 2026-11-15, the user supplied the current green-and-cream textured background. The original PNG is bundled locally as `public/images/humanities-background.png` and displayed with a centered cover crop beneath a 65% pearl overlay, leaving the image at 35% visual strength. The sidebar, top bar, and labels use translucent blurred surfaces; the input keeps its supplied styling. The production build passed, the image endpoint returned HTTP 200, and browser checks covered the desktop rendering and mobile crop. The softened background was checked on desktop. No live AI calls were made. [Current background screenshot](screenshots/22-image-background.jpg).

The chat now displays the exact task question in a soft white card above the composer, with source attribution and a working **Read passage** button. It remains accessible by scrolling up after the conversation starts. The production build/type check passed; browser checks covered desktop and 390×844 layouts, passage opening/closing, expanded input, and a scripted exchange into the optional final response. No browser console errors were observed or live AI calls made. [Desktop card](screenshots/23-question-card.jpg) · [Mobile card](screenshots/24-question-card-mobile.jpg).

## Gemini live configuration

### Live default and response controls — 2026-11-15

Live proposed-policy mode now opens automatically when configuration is ready. An unavailable configuration shows a setup card, with explicitly selected scripted examples still available. Live policy mode uses Gemini to select validated actions and evidence; its learner-facing wording remains the specified fixed templates. Baseline mode retains model-written responses with the same configured model and settings.

Each guide response has **Listen / Stop**, **Copy**, and **Helpful / Unhelpful** controls. Listen reads the exact text with a device-local English voice; unsupported browsers show an unavailable notice, with no remote audio fallback. Speech input remains unavailable. Feedback is stored in the local session/export, can be changed or removed, and never changes the transcript, evidence, rubric, or model context. Test feedback is not educator judgment or an evaluation result. The progress indicator shows conversation phases, not achievement. A visible notice explains that live text goes to Google and synthetic text should be used.

Verification: **70 offline tests** and the production build/type check passed. Browser checks covered live default, a real substantive response, HTTP 503 followed by a successful manual retry without duplicate turns, a live question clarification, exact copy/paste, saved feedback with an unsent draft preserved, narration starting and ending, desktop and 390×844 layouts, and an isolated no-credentials setup path with explicit scripted selection. The first attempt failed; the retry and clarification succeeded. [Retained actual failure/success record](evaluations/live-ui-smoke-2026-11-15.json). Narration's controls were observed; audio quality was not evaluated. No new full comparison batch, educational evaluation, or student study was run, and no billing was enabled.

The user's earlier project Free-tier confirmation is retained with its **original date**, not re-labelled as a fresh billing audit. Current model metadata and Google's published free-tier eligibility were rechecked; the actual successful requests establish availability at test time, not future quota or an independent check of the project's billing tier. See S32 in `../SOURCES.md`.

[Live default screenshot](screenshots/25-live-default.jpg) · [Live response controls](screenshots/26-live-response-actions.jpg) · [Phone layout](screenshots/27-live-response-mobile.jpg).

**All assistance in Chat studio (2026-11-15):** The **Assistance** panel exposes repeat/clarification, the two permitted word meanings, thinking time, hypothetical responses without personal disclosure, an invitation to get started, and the concept-help boundary. It also explains automatic meaning repairs and bounded follow-ups, lists the actual delivered support history, and links to evidence review and the optional learning note. Support requests preserve an unsent draft. Live shortcuts use the same model path as typed requests; scripted shortcuts use bounded authored requests/templates and log their provenance. Neither mode silently supplies a conceptual answer during assessment.

Finishing now keeps Chat studio open with review/export/learning actions. Optional post-help reflections are labeled, stored locally, and excluded from earlier assessment evidence. Custom finals in scripted mode are explicitly labeled **not interpreted**. Read-aloud, copy, and feedback remain on guide responses. Translation and speech input are not implemented.

Assistance verification: **74 offline tests** passed, including every shortcut in both conditions with mocked model outputs, support provenance, zero probe consumption, phase guards, immutable pre-help review, and a regression check for request IDs matching object properties. The production build/type check passed. Browser checks covered a successful **live** glossary → finish → review → authored learning note → local reflection path (two actual successful model calls), retained draft, recorded history, Escape/focus return, mobile assistance, scripted thinking-time/concept-boundary controls, and custom-final provenance. [Actual live record](evaluations/live-assistance-smoke-2026-11-15.json). The live check supplied no substantive assessment answer; it is an integration check, not evidence of learning or assessment validity. No new paired evaluation or student/educator study was run. [Assistance panel](screenshots/28-assistance-panel.jpg) · [Separate reflection](screenshots/29-chat-learning-reflection.jpg) · [Phone panel](screenshots/30-assistance-mobile.jpg).

**Compact card controls (2026-11-15):** Assistance now sits to the left of the composer and **17 test scenarios** to the right, using small circular controls inspired by the supplied Seek component. Both panels retain the supplied CardSwap depth, drag, and settle animation with the local background artwork. Numbered selectors choose any card, while the expanding Seek input filters by title/category/ID. Support history, guidance, and test setup details are collapsed by default. The original chat input and translucent dashboard styling remain.

Verification: **80 offline tests** and the production build/type check passed. New tests cover all 17 zero-call preparations, isolation from the original conversation, authored-prefix labeling, one-request execution and idempotent replay, same-model settings, T13 blank rejection, T14 review, T15 cumulative assistance, and quota failure without retry/fallback. Browser checks covered all 17 scenario and 8 support card selections, search, drag, keyboard card swapping, Escape/focus return, desktop and 390×844 rendering, a retained unsent draft after returning from a scenario, a scripted concept-help request and frozen-record dialog, and one successful real T06 Gemini request. No browser console errors were observed. [Actual live scenario record](evaluations/live-card-scenario-2026-11-15.json). This is an integration check, not an educational evaluation; the other 16 scenarios were not run against the live model in this change.

[Compact chat controls](screenshots/34-compact-chat-controls.jpg) · [Assistance cards](screenshots/35-lean-assistance-cards.jpg) · [Scenario cards](screenshots/36-lean-test-cards.jpg) · [Phone panel](screenshots/37-compact-cards-mobile.jpg).

The adapter uses **Google Gemini `gemini-3.1-flash-lite`** by default, selected with the user’s permission after the requested 3.8 model and two other current alternatives returned 503. `GEMINI_MODEL` is configurable; the same exact model and generation settings serve baseline and policy. There is no automatic retry, alternate provider, model fallback, or billing setup. Changing the key or model invalidates the recorded free-tier check.

A server-only `.env` was configured locally for this workspace (mode `0600`, ignored by Git). **Do not overwrite it with the example.** For a new checkout without `.env`, copy `.env.example`, then edit the placeholders locally:

```dotenv
GEMINI_API_KEY=replace_with_your_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_MAX_OUTPUT_TOKENS=5000
PORT=4317
```

Run the read-only metadata check:

```bash
npm run check:gemini
```

This confirms exact model metadata and `generateContent` support. It makes **zero generation calls** and cannot determine project billing or available quota. In your signed-in [AI Studio API Keys](https://aistudio.google.com/api-keys) / [Projects](https://aistudio.google.com/projects) page, identify the key's project and verify **Free** tier; review its [model rate limits](https://aistudio.google.com/rate-limit). Check the exact configured model's published free-tier eligibility in [Google pricing](https://aistudio.google.com/docs/pricing#gemini-3.1-flash-lite). Never enable billing for this demo.

Only after that review, record the observation (replace the project and model as appropriate):

```bash
npm run check:gemini -- --confirm-free-project="Default Gemini Project" --confirm-free-model=gemini-3.1-flash-lite
npm run dev
```

The command records an **operator confirmation**, not a Google billing API result. It binds a timestamp and SHA-256 fingerprint to the exact key/model in `.env`; the key and fingerprint are never sent to the client. The adapter checks the saved confirmation, key/model binding, and timestamp validity before every request. The original 24-hour expiry was removed when live mode became the default: the existing user confirmation persists, retaining its original observation date. This is not a fresh billing check. Reconfirm if the project, credentials, model, or billing tier changes. Restart after recording a new check. Then choose **Research controls → Live Gemini → condition → Start fresh session**.

Google has no documented per-request “free only” switch. Keys inherit their project's tier, so a local observation cannot guarantee against someone changing billing externally later. Keep the project on Free tier and recheck when configuration changes. Published eligibility and metadata do not establish remaining quota; a generation request may still return 429 or 503.

Credentials travel only from the Node server to Google's documented `generativelanguage.googleapis.com` endpoint in the `x-goog-api-key` header. The adapter uses `generateContent`, `responseMimeType: application/json`, and `responseJsonSchema`, followed by strict server validation. It rejects missing/mismatched returned model identity. Provider payloads are redacted before export. Google says free-tier inputs/outputs may be used to improve its products; use authored synthetic text here. See [structured output](https://aistudio.google.com/docs/structured-output), [billing](https://aistudio.google.com/docs/billing), and S30–S31 in `../SOURCES.md`.

Quota errors identify zero-limit, daily, cooldown, or unspecified exhaustion when Google supplies that information. Retry metadata and sanitized quota details are exported. The server respects reported retry delays; comparison batches stop on the first 429, retaining the attempted failure and marking the remaining runs unattempted. No fixture replaces a failed live output. A 503 shows a temporary-unavailability message.

The adapter rejects incomplete/refused/malformed results, retains the student turn, and offers retry. It never substitutes fixtures. If final review remains unavailable, **Keep unreviewed record** explicitly retains that limitation before allowing the learning note. Typed Finish and the Finish control do not depend on a model response. A client transport failure exposes **Retry same request**, reusing its original request ID.

The model still can select an inappropriate action or misinterpret a valid quote. Baseline free-form wording can perform a different semantic action from the declared category. Fixed templates and structural validation are not proof of no leakage. Inspect actual wording and record reviewer findings.

## Evaluation commands

A plan is free and makes **zero model calls**:

```bash
npm run evaluate -- --out=evaluations/all-cases-plan.json
npm run evaluate -- --cases=T01,T02,T03 --repeats=3 --out=evaluations/meaning-pair-plan.json
```

Live evaluations are never started automatically. After recording the Free-tier check, the following explicitly starts up to six requests for one case (three independent outputs per condition unless quota stops the batch):

```bash
npm run evaluate -- --live --confirm-live --cases=T01 --repeats=3 --out=evaluations/T01-runs.json
```

All 17 cases at three repeats require 102 requests. Keep the `--cases` subset explicit when testing. Live runs also write a timestamped `.jsonl` journal alongside the output, so completed runs survive interruption. A full result preserves failures in the denominator. No success rate or human finding is prefilled.

The former **Baseline comparison** page has been removed from navigation. The commands above retain paired, same-model comparisons of the original 17 cases. Their former UI picker was replaced by the **24 language cases** browser on 2026-11-20; that new browser does not run the old assessment guide. The original scenario endpoints remain for regression/development use. T14 uses the Finish/finalize path and requests a model evidence review. T15 deliberately seeds an answer leak and retains its assistance provenance. Sessions are held in server memory, not persisted across restarts.

These are fixed authored prefixes, not real learners responding to different prompts. T01/T02 do not establish population fairness. Obtain fresh educator-authored cases before broader claims; three outputs support only a small descriptive comparison.

## Verification and honest limits — 2026-11-05

```bash
npm test
npm run build
```

- **67 offline tests passed:** six full authored flows; exact-quote/referent validation; unknown/extra payloads; injection treated as content; probe eligibility and budgets; explicit access/wait/finish; retry idempotence and concurrency; immutable pre-help review; separate corrections; post-help provenance; missing credentials; mocked Gemini timeout/refusal/incomplete/HTTP/network failures; exact-model matching; key redaction; stale/key/model-mismatched verification blocks; zero/daily/cooldown quota errors; quota batch stop and retry-delay enforcement; paired-run settings and retained errors; T13/T14/T15 evaluation handling.
- **HTTP smoke checks passed:** strict request-field validation, arbitrary fixture input rejection, absent-live 503, cross-origin rejection, idempotent replay, and consistent exported events.
- **Strict TypeScript check and Vite production build passed.** The built app was served locally for browser QA.
- **Browser QA:** all six scripted paths; repeat/clarify keyboard activation; final skip and custom final; exact-quote viewer; separate reviewer correction; JSON download/inspection; frozen review compared before/after a learning note and reflection; case browsing and zero-result comparison state; desktop and narrow-screen layouts. Screenshots below show actual rendered UI. The final Gemini build was additionally checked for configuration disclosure, live 503 handling, retained JSON, comparison controls, and the absence of fabricated results.
- **Live integration failures preserved:** `gemini-3.8-flash` returned two HTTP 503 failures; `gemini-3.6-flash` and `gemini-3.5-flash-lite` each returned one 503; `gemini-2.5-flash` returned 404 (Google said unavailable to new users). These are saved separately under `evaluations/gemini-*-smoke.json` and are not counted as generated answers.
- **Working alternate:** `gemini-3.1-flash-lite` returned actual structured outputs and its exact model identity. Two D1 development attempts were rejected: one stitched quotations with an ellipsis; the next selected a probe for a criterion it had already marked present. The quote instruction was clarified for both conditions; the evidence/action guards were not relaxed, failures were retained, and no invalid message was delivered. These are unresolved model-behavior failures, not successful pedagogical checks.
- **Bounded integration check:** the authored “What is reputation?” access/finish/review path was used to check functioning requests and schema/controller handling on the alternate model. It does not test interpretation of substantive reasoning. Both conditions completed this path with the same model and generation settings: two accepted calls each (access response and frozen review). Policy was exercised in the browser. Records are `evaluations/gemini-31-policy-access.json` and `evaluations/gemini-31-baseline-access.json`; no cost was inferred. No paired three-repeat comparison, educator review, or student pilot was run.
- **Gemini project check:** user confirmed “Default gemini project on free tier.” Exact model metadata returned HTTP 200. The browser session available to the agent stopped at onboarding, so the project tier is user-confirmed, not independently read from a billing dashboard. Live integration details are recorded here. No billing changes, paid evaluation runs, educator reviews, or student pilots occurred.
- Still untested: reliability across sessions, baseline semantic behavior across cases, educator agreement, learning/assessment outcomes, English-learner fairness, and all speech/ASR behavior. Gemini HTTP 503 handling was exercised in the browser. Browser transport-loss recovery was code-reviewed; it was not fault-injected in the browser. Keyboard/viewport checks are not a formal accessibility certification.

## Verified screenshots

- [Conversation and optional final response](screenshots/01-conversation.jpg)
- [Evidence review](screenshots/02-evidence-review.jpg)
- [Meaning repair](screenshots/03-meaning-repair.jpg)
- [Deferred help and separate learning note](screenshots/04-learning-note.jpg)
- [Comparison setup, with no fabricated results](screenshots/05-comparison.jpg)
- [Narrow-screen conversation](screenshots/06-mobile.jpg)
- [Initial Gemini 3.8 configuration (historical)](screenshots/07-gemini-configuration.jpg)
- [Actual Gemini 503 failure and recovery controls](screenshots/08-gemini-live-error.jpg)
- [Initial Gemini 3.8 comparison setup (historical)](screenshots/09-gemini-comparison.jpg)
- [Actual live policy review after access-only input](screenshots/10-gemini-live-review.jpg)
- [Current Gemini 3.1 Flash-Lite configuration](screenshots/11-alternate-model.jpg)
- [Supplied input, collapsed on the exact gradient](screenshots/14-reference-input-collapsed.jpg)
- [Supplied input, expanded](screenshots/15-reference-input-expanded.jpg)
- [Supplied input, mobile multiline layout](screenshots/16-reference-input-mobile.jpg)
- [Dashboard with translucent sidebar and original chat input](screenshots/17-dashboard-chat.jpg)
- [Evidence review inside the dashboard](screenshots/18-dashboard-evidence.jpg)
- [Mobile dashboard and input](screenshots/19-dashboard-mobile.jpg)

## Five-minute CTO walkthrough

1. **0:00–1:00:** Show the exact passage and adapted question. Explain the provisional task/rubric and text-first scope. Step through D1; point out relevant reasoning without grading the grammar or preferring the moral stance.
2. **1:00–2:00:** Choose **Use earlier responses**. Open an exact quote, inspect support context, and show how a reviewer correction stays separate. D3 illustrates access before the first substantive answer.
3. **2:00–3:00:** Start D4. The unclear first response receives a meaning-repair question; the app does not invent its intended meaning. D2 preserves both a misconception and an explicit revision.
4. **3:00–4:00:** Start D5; step twice, Finish, use earlier responses. Inspect unmet content help, then open the learning note and save a reflection. The pre-help record stays unchanged. This blocked access path is not claimed as successful teaching.
5. **4:00–5:00:** Open Baseline comparison. Inspect T01/T02/T03 and T15. Export a paired plan. Unless actual configured runs exist, show the explicit zero-result state; do not narrate a hypothetical model failure as observed.

## Remaining CTO / educator decisions

- Is this task and the grades 9–12 desk-testing assumption appropriate? Do C1–C3 capture the intended subject evidence?
- Does the question clarification preserve meaning? Which conceptual definitions, language aids, or frames should be permitted?
- Are the probe order, maximums, ambiguity handling, and transition to teaching useful and acceptable?
- Does the evidence wording preserve source versus student stance, uncertainty, revisions, and assistance without penalizing support use?
- What fresh cases, reviewer procedure, authorized data collection, and learner/task fit are needed before a student pilot? What separate audio experiment should follow text testing?

Main files: `src/task.ts` (stable material/templates), `server/controller.ts` (state/provenance/validation), `server/provider.ts` (optional adapter), `server/evaluation.ts` (paired runs), `src/main.tsx` (interface), `data/*.json` (authored fixtures), `tests/*.test.ts` (offline checks). The original workspace research documents retain their provenance.
