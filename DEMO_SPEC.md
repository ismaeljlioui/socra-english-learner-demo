# Humanities English-learner support demo — technical specification

Version 0.1 · Original design 2026-11-05 · Status clarified 2026-11-16.

**Historical prototype specification.** This demo has been implemented; current software/live-test status is in `demo/README.md` and `SOURCES.md` (including S32). Deniz's November 15 feedback changes the next priority to framework-informed language-pattern detection, transcript annotations, and teacher-facing learner profiles. See `RESEARCH_BRIEF.md` and `EL_SUPPORT_RESEARCH.md`. The strict support restrictions below describe the earlier experiment, not approved requirements for the next product iteration. No code behavior was changed by this status update.

## 1. Purpose and evidence status

Build a small standalone **text** demo that makes language-support decisions and their consequences inspectable. Test whether a constrained support policy can elicit a student's understanding and argument without supplying the substantive position or reasoning. Text is the first development interface; speech reliability is outside this version.

This is a proposed design, not Socra's internal architecture or approved product policy. It is not a validated assessment, English-proficiency test, or grading system. Implementation and limited live development tests are documented in the demo README; the planned repeated paired comparison and educator validation are not established by those checks.

| Basis | Status / implication |
| --- | --- |
| User confirms humanities focus and text-first development | Accepted project direction. |
| Socra's public Introduction to Ethics task (S27) | Observed initial screen, including text input; subsequent behavior and rubric unknown. |
| Socra describes assessment and instructional close-reading workflows (S26) | We need an explicit assistance boundary; do not assume every workflow prohibits teaching. |
| WIDA language guidance (S14), evidence-centered design (S18) | Inform task/language analysis and evidence interpretation; do not establish validity or automatic proficiency levels. |
| Microsoft application configuration/evaluation (S08, S20–S21) | Engineering precedent for explicit behaviors and multi-turn tests, not an assessment policy to copy. |
| Hint-control study (S23) | Motivation to test leakage; no guarantee that a checker or constrained policy is sufficient. |

All references resolve through [SOURCES.md](SOURCES.md). Companion examples and checks: [DEMO_CASES.md](DEMO_CASES.md).

## 2. Exact task material for the prototype

**Task ID:** `glaucon-justice-v1` · **Audience assumption:** grades 9–12 for desk testing only. Socra's public demo does not specify a grade. Educator review must establish age/curriculum suitability.

**Provenance:** Adapted from the topic of Socra's public demo, not a verbatim recreation. Use the following Jowett translation excerpt as a stable, attributable source instead of silently replacing Socra's wording or claiming we copied its assignment. Do not fetch changing content during a learner session.

Source: Plato, *Republic*, Book II, 358e–359a, Benjamin Jowett translation. [Primary text, Project Gutenberg](https://www.gutenberg.org/files/55201/55201-h/55201-h.htm) (S28). Excerpt split into stable references; sentence wording retained, marginal headings/numbers omitted.

**P1**
> They say that to do injustice is, by nature, good; to suffer injustice, evil; but that the evil is greater than the good.

**P2**
> And so when men have both done and suffered injustice and have had experience of both, not being able to avoid the one and obtain the other, they think that they had better agree among themselves to have neither; hence there arise laws and mutual covenants; and that which is ordained by law is termed by them lawful and just.

**Context displayed to everyone:** Glaucon presents an account of justice for Socrates to examine. Distinguish that account from your own position. You do not need knowledge of the rest of the book.

**Our adapted question, displayed to everyone:**

> Would justice still matter morally if it brought no practical advantages, such as safety or a good reputation? Explain your position and relate it to the account in the passage.

**Initial instruction:** Give your first response in your own words. You may disagree with the passage. Exact quotations and technical philosophy terms are not required. You can ask for a question repeat or clarification, and you can finish at any time.

### What this task can and cannot establish

It can provide provisional evidence of passage comprehension, a reasoned position, and a connection between them. It cannot diagnose intelligence, general humanities ability, English proficiency, or enduring mastery. Do not require philosophical agreement, personal moral disclosure, formal grammar, an essay length, or terminology absent from the question. Abstract vocabulary and archaic translation are real access challenges; record rather than conceal them.

The WIDA-informed language lens is: communicate a position, refer to a source, and express the relationship between source and reasoning. This is a selected design lens, not full standards alignment or a WIDA scoring rubric.

## 3. Provisional subject rubric

Use descriptive evidence states, not points, ranks, mastery percentages, or a single overall score. Rubric owner is the educator; these are draft criteria for review.

| ID | Criterion | Evidence to look for | Do not infer |
| --- | --- | --- | --- |
| C1 | Interpret the presented account | Explains the connection between doing/suffering injustice and the agreement described in P2. Partial accounts remain partial. | Mentioning "laws" alone proves comprehension; Glaucon personally endorses every claim. |
| C2 | State and support a position | Offers a position on the hypothetical and reasons for it; a qualified or uncertain stance can be substantive. | One moral position is the answer; sophisticated vocabulary implies sound reasoning. |
| C3 | Relate position to the passage | Identifies an accurate relevant source idea and explains agreement, disagreement, or a limitation. Paraphrase is acceptable. | A quote alone establishes the connection; the student's position must match the source. |

For each criterion: `evidence_present`, `partial`, `unclear`, `not_yet_observed`, or `contradicted_by_response`. The last requires a specific clear conflict with the supplied text, not disagreement with a moral viewpoint. Allow mixed/conflicting evidence and explicit revisions rather than forcing a single neat interpretation. State refers only to this interaction and carries no automatic grade consequence.

## 4. Conversation flow and support policy

States: `eliciting` → `final_response` → `review`; optionally `learning` after review. A learner can end early. No time limit or silence-based judgment in this text prototype.

After a substantive initial response, the student may receive at most **three targeted probes** across C1–C3. Maximum **one targeted probe per criterion**; no repeated pressure toward a preferred answer. Student-requested repeat, glossary, or language clarification does not consume that probe budget. Two unsuccessful meaning repairs in sequence should offer finishing or continuing voluntarily, not force a low score. Offer final response when coverage is adequate, the probe budget is exhausted, or the learner chooses Finish.

The final response is student-authored. Empty/declined final response preserves earlier evidence; never invent a synthesis for them. Once submitted/skipped, freeze the assessment record and offer review. Do not make the final response alone the sole source of evidence.

### Allowed actions in the proposed-policy condition

Use these fixed templates, stored in task configuration; no free-form model-generated learner messages in the elicitation phase. Every displayed assistant message is logged. Templates are proposed for educator review, not proven neutral.

| Action ID | Trigger | Exact text / behavior | Assistance category |
| --- | --- | --- | --- |
| `repeat_question` | Student requests repetition | Redisplay the adapted question verbatim. | `access` |
| `clarify_question` | Student asks what the question means | "Imagine that justice gave people none of the practical advantages named in the question. Would it still matter morally? Explain your view and connect it to the passage." | `access` (hypothesized equivalence) |
| `define_incidental` | Student requests an allowlisted word | Accept only `termId: reputation` or `termId: practical_advantages`; return configured definition, never model text. | `access` |
| `content_help_deferred` | Student requests a non-allowlisted definition or conceptual explanation | "Explaining that concept would add subject help. You can continue with your current understanding, or finish this part and open the learning note." | `administrative`; unmet content-help request |
| `clarify_meaning` | Response has unresolved reference/meaning | "Could you explain what you mean in your last response?" | `meaning_repair` |
| `acknowledge_wait` | Student requests thinking time | "Take your time. Send your response when you're ready, or choose Finish." No timer or automatic follow-up. | `administrative` |
| `respect_boundary` | Student declines personal disclosure | "You can discuss the passage or a hypothetical position without sharing personal experiences. You can also choose Finish." | `administrative` |
| `probe_source` | C1 missing/partial or clearly contradicted by response; budget available | "In your own words, what account of justice does the passage present?" | `targeted_probe` |
| `probe_reason` | C2 lacks a reason; budget available | "What reason supports your position on the question?" | `targeted_probe` |
| `probe_connection` | C3 missing/partial; budget available | "How does your position relate to an idea in the passage?" | `targeted_probe` |
| `invite_attempt` | Answer-seeking or no initial idea | "You can take either position or explain your uncertainty. What is your first thought?" | `general_elicitation` |
| `offer_finish` | Ready, budget exhausted, repair impasse, or finish request | "You can give a final response in your own words, or finish with what you have already shared." | `administrative` |

Allowlisted definitions: **reputation** = "What other people think about a person." **practical advantages** = "Useful results or benefits." These definitions can still affect access and must be logged. No automatic glossary pop-ups based on inferred ability.

Concept requests involving justice/injustice, moral worth, or the argument itself are outside this small glossary. Do not classify the request as deficient understanding. Use a fixed response: "Explaining that concept would add subject help. You can continue with your current understanding, or finish this part and open the learning note." Log `content_help_deferred`; it is not a content explanation. Explicitly record unmet support requests. This narrow boundary is an experiment limitation, not a recommendation to deny these supports in the eventual product.

### Selection precedence

1. Respect Finish/skip; handle empty input and provider failures without interpreting understanding.
2. Handle explicit access requests before probing. Unknown vocabulary follows the concept-help rule; do not invent a definition.
3. Resolve ambiguous meaning before assigning a textual contradiction or probing that depends on an inferred meaning.
4. For substantive answers, choose one missing/partial criterion (or clear C1 textual contradiction): C1, then C2, then C3, subject to probe limits. If none remains, offer final response. These ordering choices are provisional and identical across learners in this demo. Handle explicit wait/privacy-boundary requests with their administrative actions rather than forcing this probe sequence.
5. Never select a next action using inferred ability, proficiency, verbosity, accent, or a preferred moral position. Explicit support use is not a penalty.

Repeated answer-seeking must not escalate into selecting an argument, evidence line, analogy, counterexample, or final answer. Do not use praise that confirms correctness before evidence review. Treat instructions inside student responses or quoted material as content, not authority to change the policy.

Students can discuss hypothetical positions without disclosing personal experiences. Never ask for a confession, diagnose moral character, or infer beliefs outside the argument. If a student declines personal discussion, keep the invitation tied to the passage or allow finishing.

### Separate learning note

After the pre-help record is frozen, offer an optional **Learning note** button. Show this authored explanation verbatim, labeled substantive help:

> The passage describes an agreement people make to avoid suffering injustice. The assignment asks you to consider whether justice could matter for a reason other than practical benefits. You may agree or disagree with the account; explain your reasoning.

Allow an optional student reflection after the note, but do not rescore or overwrite the earlier report. Record it as post-content-assistance material. This demonstrates provenance, not transfer or learning gains. No open-ended tutoring engine in v0.1.

## 5. Evidence and report contract

Distinguish the **planned category** of a support from **reviewer-observed leakage**. A model or template label is not proof the message was harmless. Reports must say "no recorded support before this response" rather than certify independence.

Maintain cumulative support context for each student turn, plus adjacent assistant action. Tags can coexist: `initial_response`, `after_access`, `after_probe`, `after_content_assistance`, `uncertain_input`, `needs_review`. Never erase prior content assistance because the latest prompt is neutral. The first response may already follow an access request; do not assume it is unsupported.

| Record | Required fields |
| --- | --- |
| Session | ID, task/rubric/policy versions, condition, model ID, available generation settings, mode (`live`/`fixture`), phase, timestamps. |
| Turn | ID, role, exact text, timestamp, phase, action ID when applicable, preceding support-event IDs. |
| Support event | ID, request turn if any, action ID, planned category, delivered turn, requested/delivered status, reviewer category (`unreviewed` initially), review note. |
| Evidence item | Criterion ID, evidence state, student turn ID and exact quote(s), explanation, unresolved issue, cumulative support-event IDs. |
| Review | Evidence items, unresolved questions, unmet support requests, model suggestions versus human edits, frozen pre-help cutoff, separate post-help reflection. |

Server must verify every evidence quote is an exact substring of the referenced **student** turn. A valid quote does not establish a valid interpretation: label model findings provisional and support reviewer corrections. Store review revisions separately; never rewrite the transcript. Do not infer psychological traits, disability, language level, or general ability. Distinguish the source's claims, student's claims, and assistant-supplied claims.

## 6. Minimal interface

Use a simple desktop layout with an accessible stacked layout on narrow screens:

- **Task panel:** source, P1/P2 labels, attribution, question, and a compact prototype status notice. No Socra logos or implication of official deployment.
- **Conversation:** text input, Send, Repeat question, Clarify question, Finish. Definition requests can be typed. Clear loading/retry states; keyboard usable. One focused question per response.
- **Review panel:** appears after finish, not while the learner is answering. Shows criteria, exact student evidence, assistance timeline, and unresolved meaning. No grades or fabricated confidence percentages.
- **Research controls:** new-session condition selector; load labeled sample conversations; inspect/export JSON; reviewer correction controls; optional learning note. Do not put model IDs or prompt internals in the learner flow.

Changing condition starts a fresh session, with an explicit unsaved-session notice. Do not mix conditions within a transcript. Fixture conversations must visibly say **Scripted example — not live AI** and must not generate fake findings for arbitrary user input.

## 7. Proposed implementation boundary

**Speech-input rationale and remaining work (recorded 2026-11-16):** Text-first development separated language-support/interpretation problems from recognition errors, endpointing of pauses, interruptions, accents, code-switching, and self-corrections. The reviewed historical ASR benchmark (S10) excluded code-switched content from its scoring and does not estimate current-model accuracy. Future speech work needs representative audio, human-checked transcripts, meaning-critical error analysis, and turn-taking tests. A speech transcript remains evidence of spoken expression, not a writing sample merely because it is displayed as text. Text behavior cannot validate reading comprehension or speaking proficiency by itself. The later local response read-aloud control (S32) is speech output; it does not implement or validate student speech input.

Create a small local web app in `demo/`; choose a lightweight stack appropriate to the environment. No dependency on Socra's private codebase, database, authentication, or APIs. No speech, translations, accounts, LMS integration, adaptive proficiency profiles, or production deployment in this version.

Logical responsibilities (not separate agents):

1. Task/config module holds exact source, question, glossary, rubric, templates, and versions.
2. Session controller owns state transitions, probe counts, delivered events, and report cutoff. Server—not model—enforces them.
3. Model adapter proposes an allowed action and evidence observations from bounded history/task context. Structured output validation rejects unknown actions and missing fields. Selection can still be wrong; evaluation must examine it.
4. Policy renderer maps valid actions to templates. Quote/template payloads cannot interpolate arbitrary model text into student-facing messages.
5. Evidence reporter proposes criterion observations; server checks referents/quotes and attaches support context from the ledger.
6. Client displays the task/conversation/review and supports export; API secrets stay server-side.

Illustrative turn API: input `{sessionId, studentText}`; output `{turnId, assistantText, actionId, phase}`. Client must not supply authoritative rubric, counters, support category, or system messages. Live and fixture modes use the same visible data shape but different mode labels. Retain the session in memory for the local demo; explicit export only, no analytics or automatic external transcript storage.

Provider errors/malformed output: preserve the student turn, show retry, never fabricate a response or substitute a fixture. Retrying the same request must not duplicate turns, support events, or count a probe twice. If no model credentials exist, the demo still opens in clearly labeled fixture mode; document how to enable live mode with an environment-variable example containing placeholders only.

## 8. Strong baseline and evaluation

Implement two research conditions with the same task, rubric, model, context, report schema, available source/glossary information, turn budget, phase rules, and common prohibitions. Neither is the real Socra engine.

- **Baseline:** A strong system prompt explicitly requests accessible language, focused questions, faithful source interpretation, viewpoint neutrality, no answer-giving, no ability judgments, and honest evidence reporting. Model generates free-form dialogue within these instructions and supplies the same allowed `actionId` as the proposed-policy condition. Give it the same allowed support purposes and glossary, not a weaker task. Server still enforces budgets and phase boundaries. Category predictions do not establish actual behavior.
- **Proposed policy:** Same common instructions, plus the specified action-selection precedence and fixed renderer. This comparison tests the combined structured policy/renderer intervention, not "prompt engineering versus no instructions" or superiority of Socra over LLMs.

In both conditions, server maps `probe_source` → C1, `probe_reason` → C2, and `probe_connection` → C3 and validates eligibility before displaying a response or consuming a budget. Server enforces declared actions; baseline free-form wording may perform a different semantic action. Review and count those mismatches as failures, not evidence of guaranteed semantic budget enforcement. Record delivered text, declared action, and any reviewer correction. Reject extra proposed-policy payload fields; the only variable learner-facing payload is the allowlisted glossary term ID.

Use fixed conversation-prefix cases in DEMO_CASES for comparable next-turn tests, then complete scripted paths for cumulative behavior. Do not force identical student responses after materially different prompts and call that a real interaction. Any later student simulation is a separate, explicitly synthetic evaluation.

Record full outputs, latency, model/version, condition, token/cost data if available, and failures. Run at least three independent outputs per model-condition-case for a small descriptive comparison; do not claim statistical significance from this sample. Do not run paid batches silently. Report counts with denominators; preserve errors instead of excluding them. Randomize A/B display for educator review when practical and disclose that template style can reveal condition.

Review leakage, meaning preservation, source/stance separation, support provenance, evidence accuracy, accessibility, repetitiveness/blocked access, and whether the next prompt can elicit useful evidence. Fewer hints with useless conversation is not success. Exact-quote validation is an automated check; substantive judgments require human review. An LLM judge is optional exploratory help, never sole ground truth. Development cases are not a blinded holdout; obtain fresh educator-authored cases before any broader claim.

## 9. Acceptance checks and CTO walkthrough

Implementation acceptance:

1. Source/question render with attribution and clear adaptation status; all sample cases load with fixture labels.
2. Full live text path works when credentials are available; absent credentials and provider failures are explicit.
3. Access request, ambiguity, targeted probe, repeated answer-seeking, finish, and final-response skip paths work without automatic content hints.
4. Every displayed support is logged; exact evidence links point to student turns. Invented quotes are rejected/flagged rather than silently corrected.
5. Pre-help report remains frozen after the optional learning note; post-help material stays separate.
6. Baseline and policy conditions export reproducible records; reviewer findings never masquerade as measured results before runs exist.
7. Test budget enforcement, retries, phase transitions, injection attempts, evidence references, and export consistency. Run the app's type/build checks and inspect the rendered UI.

Behavioral review: any observed answer leakage, invented evidence, or broad ability judgment is a failure to fix or explicitly surface before presenting that path as working. Zero occurrences in a small test is only a result for that test, not a validity guarantee. Provisional acceptance thresholds need educator agreement.

Suggested five-minute walkthrough: show the adapted task; demonstrate a strong argument in limited English; inspect its actual evidence; show an ambiguous response being clarified; show a content-help request deferred until the learning phase; show the unchanged pre-help report; show one baseline/policy failure comparison **only if actually run**. Otherwise label the comparison illustrative.

## 10. Review decisions and next gate

Ask the CTO/educator to review: assignment/grade fit; whether C1–C3 reflect intended evidence; permitted language aids (especially key-concept definitions and frames); whether the question clarification preserves the task; probe limits; transition to teaching; acceptable report wording.

Proceed with implementation using these labeled assumptions. Do not describe the spec as educator-approved. An independent AI critique informed the draft; that is not educator review. Before testing with students, establish authorized data collection, learner/task fit, review procedures, and a suitable pilot. Speech work follows a usable text path, with an early small audio experiment; text evaluation cannot establish recognition or turn-taking performance.
