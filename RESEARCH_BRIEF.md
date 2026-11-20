# Socra — English Learner Support

## Purpose

Research and develop English-learner support for Socra's middle/high-school humanities workflows. The current priority is to detect observable language-related patterns in student work, ground their interpretation in the relevant framework and teacher-provided proficiency context, and surface evidence for teachers. Assistance and its effects should remain visible without treating every interaction as a strict summative assessment.

The user's understanding of the internship is: research → technical product specification → standalone prototype → evaluation and development toward a product capability. The supervisor has encouraged exploration unconstrained by Socra's current codebase; access is not required to begin. The November 15 feedback below takes precedence over the original assessment-first interpretation. Integration and acceptance criteria remain to be specified.

## Latest supervisor direction — call notes supplied 2026-11-15, consolidated 2026-11-16

Source: the user's account of the call with Deniz. These are supervisor directions/context, not independently observed product usage or research findings.

- Target middle/high school, not college. Deniz reports teachers are not using Socra for full assessment; useful pedagogical assistance should take priority over perfect isolation of assessment evidence.
- Start with **detecting language-related problems/behaviors and surfacing them for teachers**, before further expansion of automated support. The notes use “common EL misconceptions”; research must distinguish observed language behavior, subject misconception, uncertainty, and established level-specific prevalence.
- Ground the work in published pedagogy, official framework/state guidance, and applicable requirements. Start with WIDA, then investigate another ELD framework such as California's, according to resource availability. California, Texas, and Arizona were discussed as examples, not an instruction to implement every system at once.
- Teachers should supply state, grade, and existing learner proficiency information. Use relevant domain information for the task (for example writing for written expression). Do not invent a level from the transcript or assume scores from different systems are interchangeable.
- Investigate what language use looks like across levels and what difficulties can actually be observed. Standards descriptions are not automatically a catalog of common errors, and a student's level is not evidence that a particular difficulty occurred.
- Surface transcript annotations with concrete examples, then learner-profile observations. A proposed class view groups students showing a pattern and lets teachers open examples. This is a requested product direction, not an existing integration we have inspected.
- Skills are tracked over the semester while assignment objectives change. Preserve assignment context and timing when considering repeated patterns.
- Aim for Medley-style help where useful. If Socra gives substantive assistance that may supply an answer, flag it for the teacher; the teacher may change the goal or interpretation. The exact teacher workflow remains to be designed with low review burden. A literal Medley integration has not been established.
- EL teachers will review the work. Prepare questions for interviews. Deniz can supply examples if official resources are insufficient; first identify what the resources do and do not establish.
- Include voice-related findings and the reason for deferring speech input in the specification. Current text observations cannot establish speech recognition or speaking proficiency.

The call's statement that every learner already has a legally assigned level needs qualification: annual ELP assessment requirements support requesting existing records, but do not guarantee a complete/current record is available to Socra. Standards, assessment reporting labels, and jurisdiction-specific requirements must be checked separately (S33–S36).

## Current next milestone

**User-selected scope, 2026-11-16:** Illinois, both grades 6–8 and 9–12, and all six WIDA proficiency levels. The user requested a deep review across all helpful source types. The resulting broad research proposal is in `ILLINOIS_LANGUAGE_DETECTION.md`: 24 original cases with counterexamples and identification methods, all-level context, source-version limits, support implications, and evaluation design. Evidence and reading coverage are in `SOURCES.md` S51–S63. This expands the earlier provisional one-band research scope; it does not establish all-level product support or a validated detector.

Next, obtain educator review and select a small number of task-relevant annotations for implementation and evaluation before learner-profile/class aggregation. The current fixed Glaucon task remains unchanged; middle-school suitability is unresolved. The next implementation is not another strict assessment-support comparison or an automatic proficiency classifier. `EL_SUPPORT_RESEARCH.md` provides the earlier synthesis and links to the detailed Illinois work.

**User scope refinement, 2026-11-16: identification without AI follow-ups.** The initial detection feature analyzes existing responses/transcripts, the task/source, available proficiency context, and recorded assistance. It produces teacher-facing observations without asking students additional clarification questions or initiating support trials. Unresolved meaning remains unclear/insufficient evidence; existing spontaneous corrections or clarifications can still be read from the transcript. Follow-up/support ideas in the research catalog are future possibilities, not prerequisites for this version. This records a design decision; code behavior has not changed.

Reuse the existing demo's transcripts, evidence links, support history, export, and review mechanisms where useful. Its glossary restrictions, fixed probe budget, and separation of teaching were experiments and are not binding requirements for this new direction. Preserve their test history rather than presenting them as validated educational policies.

**Case-library implementation, 2026-11-20:** At the user's request, the demo's visible 17 test cards were replaced by 24 original language-observation cases using the same card browser. Each contains an example, separate comparison, context, and authored review guidance, with the Glaucon task fixed. C04/C14 explicitly mark unavailable task opportunities; process cases include strengths and evidence limitations. Case viewing preserves the main chat and draft and makes no AI call or new follow-up. The original 17 evaluation fixtures remain available for regression work. This implements the research case library, not the automatic detector or proposed teacher-summary tab. Build, 80 offline regression tests, and focused browser checks passed; educator validation and model detection testing remain outstanding.

**Teacher-observation implementation, 2026-11-20 (second update):** Added Illinois/WIDA simulated context settings and explicit existing-transcript analysis for C02/C06/C10/C11/C15, exact span/source validation, review decisions, stale/error states, and export. Proficiency levels and case expectations are withheld from model input; analysis generates no follow-ups. All 24 authored cards remain, with only five patterns implemented for live analysis. 93 offline tests and the production build pass; browser checks used both the actual failure and a separately labeled mock review harness. The bounded live plan stopped after **one C06 example request returned HTTP 400 for schema complexity**; no observations were accepted and the other two cases were not run. The smaller provider grammar is tested offline but not live-verified. Actual failure, mock evidence, screenshots, and a three-minute walkthrough are linked in `demo/README.md`. Educational assumptions remain provisional; no student study or detection-accuracy claim follows.

**Later readiness recheck, 2026-11-20:** Three new v2 live requests completed, establishing that the simplified schema works for these calls. C06's source mismatch was identified; its meaningful comparison received a C15 missing-assignment-connection observation. C10's ambiguity was overflagged as difficulty plus an unsupported attribution difficulty. This supersedes the earlier unverified-schema status, not the need for semantic/educator evaluation. All 93 offline tests and the build passed again. Actual outputs are in `demo/evaluations/language-live-smoke-2026-11-20T19-03-04.863Z.json`. Suitable for a guided feedback walkthrough with limitations shown; no accuracy or fairness claim is supported.

## Original supervisor call notes, retained for context

- Identify educational frameworks and pedagogical supports that can be adapted to Socra.
- Investigate **Medley Learning** deeply as the principal product reference; the supervisor regards it highly. Comparative superiority has not been established by this project.
- Investigate the reference to “EL education.” English-learner support is the confirmed project focus; whether the notes additionally reference the EL Education organization remains unresolved.
- Investigate Microsoft education support, including the suggestion that it operates directly at the LLM level. Identify the intended product or research and verify its architecture rather than assuming model training is involved.
- Determine which supports could apply to Socra. Preserve rigor and avoid unsupported judgments that students are generally better or worse than one another.
- Examine the stated voice-only student-input constraint. Confirm its exact scope; output modalities are unspecified.
- Seek strong pedagogical foundations for conversation, beyond the current engine. Conversational assessment is new territory for the team.
- Critically examine papers and their pitfalls. Use AI and bounded subagents to find, challenge, organize, and synthesize evidence.
- Eventually produce a technical product spec understandable to engineers and AI tools. Claude was mentioned as a possible tool, not a required platform.
- Socra has a longer-term ambition to publish evidence of improvement over a general-purpose LLM. Treat this as background motivation, not a requirement for the intern to write a paper or obtain a favorable result.
- Prefer weekly progress updates, potentially by email. Timing and recipients are unconfirmed.
- An advisor associated with Illinois was mentioned; identity and role are unconfirmed. Seek supervisor/advisor help and meetings where their expertise is useful.

## Research question

Which observable language patterns can Socra reliably surface in humanities conversations to help teachers choose appropriate support, using task context and existing proficiency information? How should those observations and assistance be represented across assignments without confusing English proficiency, subject understanding, or an isolated ambiguous response?

The earlier research asked how to support access without supplying assessed reasoning. That remains relevant when interpreting supported responses, but is no longer the sole product objective. Medley remains a product reference alongside official language-development frameworks and education research.

For each support, investigate:

1. Observable student experience and teacher controls.
2. Trigger, proficiency alignment, and how support is reduced over time.
3. Pedagogical rationale and strength of evidence.
4. Documented implementation versus unknown internal details.
5. Possible adaptation to Socra, with concrete dialogue examples.
6. Risks: answer leakage, changed task difficulty, misleading scores, language-related bias, and speech-recognition failures.
7. Questions requiring educator judgment or testing.

## Research boundaries

- Distinguish support for accessing subject assessments from assessing English language proficiency; the same assistance may be appropriate in one and invalidate the other.
- Proposed interpretation to confirm: assess demonstrated evidence against explicit criteria without inferring general intelligence or equating English fluency with subject knowledge.
- No single conversational “gold standard” is assumed. Examine the evidence and its applicability.
- The initial setup phase excluded specifications and code. On 2026-11-05 the user authorized a narrowly scoped demo specification, example conversations, evaluation plan, and implementation handoff; that demo has since been built. The transcript-level detection workflow was implemented on November 20; its first live schema request failed, and a later three-request recheck completed after a schema change while exposing semantic overflagging. Existing prototype checks do not imply educational approval or authorization for production deployment.

## Completed research and prototype milestones

A cited Medley-to-Socra synthesis: verified supports, evidence limitations, candidate adaptations, illustrative interactions, and a justified shortlist for experiments. Research may change that shortlist. The initial synthesis is recorded in `MEDLEY_RESEARCH.md`. The broader review is recorded in `EL_SUPPORT_RESEARCH.md`, with evidence in `SOURCES.md`.

Historical prototype milestone (2026-11-05): the provisional Glaucon-task package in `DEMO_SPEC.md` and `DEMO_CASES.md` was implemented as a local text demo in `demo/`. Six authored walkthroughs, 17 runnable evaluation cases, software checks, and browser verification are documented in `demo/README.md`. The live adapter uses Google Gemini at the user’s request. Two early D1 outputs were rejected by evidence/action guards, and a narrow access/finish/review integration path was checked in both conditions. Later live UI checks on November 15 included a successful substantive synthetic response after a 503/manual retry and a successful clarification request (S32). These are limited integration/development results, not a completed repeated comparison, educator review, or student-outcome evaluation. See S30–S32 and the demo README for exact scope. The rubric, supports, grade assumption, and task adaptation remain provisional.

## Clarifications and current direction — 2026-11-05

- User confirms humanities as the product focus; earlier science examples were illustrative and should not anchor the prototype.
- Proposed development sequence agreed in conversation: evaluate conversation/support behavior through text first, then integrate speech. Text cases should reflect spoken English; speech reliability still requires separate testing.
- Public demo offers distinct assessment-dialogue and instructional close-reading descriptions (S26). The Introduction to Ethics task provides a concrete provisional example (S27), with a source passage and visible typed-response field.
- Voice-only remains a supervisor-note interpretation to clarify for the intended workflow, not an established product-wide limitation. The later November feedback favors pedagogical help; assignment-specific goals and the interpretation of supported responses still need teacher review.

## Questions to resolve as research progresses

- Research now covers both middle/high-school bands. Which grade and suitable fixed humanities task should anchor the first educator-reviewed implementation? The existing Glaucon task was a provisional high-school desk-testing choice, not a validated middle-school task.
- Which observable patterns would EL teachers find actionable, and what examples distinguish them from content misunderstanding or insufficient evidence?
- What framework, assessment, domain-level information, dates, and teacher settings are actually available?
- How should teachers review annotations, change assignment goals, and see support history without excessive workload?
- What evidence warrants adding a recurring observation to a semester profile, and what successful examples or revisions should update it?
- Does voice-only refer solely to student input? Are visual/text supports or home-language responses possible?
- Which Microsoft work and Illinois-associated advisor did the supervisor mean?

