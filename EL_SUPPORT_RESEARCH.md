# English-learner support for conversational assessment

Research synthesis, 2026-11-04; scope clarified 2026-11-05. This extends [the Medley review](MEDLEY_RESEARCH.md). Source IDs, inspected sections, and limitations are maintained in [SOURCES.md](SOURCES.md). This is a research working document, not evidence that a prototype is valid or fair. The new, explicitly provisional build specification is [DEMO_SPEC.md](DEMO_SPEC.md).

**Priority update, 2026-11-16:** Deniz's November 15 feedback prioritizes framework-informed detection and teacher-facing transcript/profile observations, followed by pedagogical support. Earlier restrictions below describe the assessment-focused experiment. They do not override the updated brief. See the new next-step section at the end; no detection feature has yet been implemented or evaluated.

## Working conclusion

Build around the skill being assessed and the evidence needed to assess it. Then select language supports that help students communicate without supplying that evidence. Medley is a useful product reference; it cannot by itself determine Socra's assessment policy.

The user confirms humanities as the focus. Socra's public demo describes both an assessable dialogue and an instructional close-reading workflow (S26). Teaching may be appropriate in a chosen workflow; assistance must remain visible in the interpretation of subsequent responses. Text input is observed in the public ethics demo (S27), so the supervisor's voice-only note is not an established product-wide constraint. The accepted development direction is text-first evaluation, followed by speech testing.

The reviewed material supplies complementary foundations, not a single validated gold standard for English-learner voice assessment. We have enough direction to narrow a first experiment; further research should answer specific design uncertainties.

## Foundations and their different jobs

| Foundation | What it contributes | Boundary for Socra |
| --- | --- | --- |
| **WIDA 2020** — S14 | Grade- and discipline-specific language expectations; narrate, inform, explain, argue; proficiency descriptors. | Descriptors must not become ceilings on cognitive ability or access to rigor. They are not automatic student classifications or scoring rules. |
| **Evidence-centered design** — S18 | Connect the intended claim, observable evidence, and task conditions, including scaffolds. | Support permissions depend on what the task measures. This framework does not establish efficacy or fairness. |
| **CAST assessment guidance** — S16 | Identify barriers unrelated to the assessed skill. | Its higher-education guidance is not a K–12 spoken-assessment trial. Voice-only input needs examination when speaking itself is not the target. |
| **WestEd/QTEL oral-language guidance** — S17 | Sustained, purposeful talk; attention to meaning; selective feedback. | Classroom learning recommendations need adaptation before use in assessment. Filling a sentence frame can conceal who supplied the reasoning. |
| **EL Education Conversation Cues** — S19 | A repertoire for eliciting and extending talk. | Collaborative classroom discussion is different from independent assessment. This organization remains an unconfirmed reference in the supervisor's notes. |
| **IES and accommodation studies** — S09, S11–S13 | Instructional support rationale and examples of reviewing/testing language modifications. | Evidence is mixed, and instruction or fixed written items do not validate generated spoken supports. See the Medley review for study critiques. |

Edition control matters: WIDA's older Can Do descriptors have not been updated to the 2020 framework and use different Key Uses. Record the source edition in future requirements rather than merging the categories silently. [S15](https://wida.wisc.edu/teach/can-do/descriptors)

## What the AI implementation research adds

**Microsoft's documented architecture:** Study and Learn is a Copilot declarative agent, using the service's models. Speaker Progress generates feedback from speech transcripts. Microsoft's intended-use boundaries explicitly exclude Study and Learn from educator assessment of understanding. These are vendor technical statements, not outcome evidence. [S08](https://learn.microsoft.com/en-us/microsoft-365/education/guide/1-reference/microsoft-365-education-ai-application-card)

Declarative agents configure instructions, knowledge, and capabilities on a managed runtime; this platform description does not disclose Study and Learn's exact implementation. [S20](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-architecture)

Microsoft's June 2026 whitepaper describes expert evaluation and prompt revisions, including focused questions and avoiding answering its own questions. It does not establish weight fine-tuning or controlled learning gains. [S21](https://aka.ms/learningsciencepaper)

**A genuine model-training comparison:** Google's LearnLM report explicitly describes pedagogical data in post-training. Its expert-preference evaluation is not evidence of student learning, English-learner fairness, or assessment validity. It is a historical training example, not a current model recommendation. [S22](https://arxiv.org/html/2412.16429v1)

**Assessment-specific engineering evidence:** Burleigh et al. tested a draft–critique–revise mechanism to reduce inappropriate hints. The selected pilot conversation states showed improvement, but the automated judge had only moderate human agreement; an ambiguous task was excluded. This supports testing a leakage checker, not trusting it as a guarantee. [S23](https://aclanthology.org/2025.aimecon-sessions.9.pdf)

**Our design hypothesis:** separate speech interpretation, support permissions, dialogue generation, and evidence/scoring as logical responsibilities. This does not require four agents, fine-tuning, or any particular provider. Log which support changed the interaction. Keep independent responses distinguishable from responses following access support or content assistance.

## Candidate supports to investigate first

These priorities are proposals, not validated feature requirements. Consistency means applying explicit rules to comparable situations, not assuming that identical treatment ensures fairness.

| Candidate | Language-access purpose | Rigor, leakage, fairness, and voice checks | Priority |
| --- | --- | --- | --- |
| Wait time, repeat, or invite continuation | Allow formulation and repair missed audio. | Endpointing must not cut off pauses. Repetition changes exposure; use common eligibility rules and log it. Do not score hesitation as low understanding. | First experiment |
| Student-led clarification | Recover intended meaning when speech is uncertain. | Prefer asking the learner to restate over suggesting a literary/philosophical interpretation. Track recognition uncertainty separately from conceptual errors. | First experiment |
| Neutral elaboration prompt | Invite the student to expose reasoning. | More probes may produce more evidence. Define triggers and limits; do not supply a missing concept or assume fluent answers deserve fewer checks. | First experiment |
| Educator-reviewed prompt variants | Reduce incidental linguistic complexity. | Preserve relationships, quantities, negation, and required reasoning. Spoken chunks must retain necessary context. Test equivalence; do not freely regenerate wording. | Next, once a task is chosen |
| Restricted incidental-word glossary | Remove vocabulary barriers outside the assessed target. | A technical definition may be the answer. Review words per task; ensure spoken definitions are understandable and requests are not penalized. | Task-dependent |
| Sentence starters, translation, visuals | Support expression or access. | Frames can supply reasoning; translation can change meaning; visual output availability is unknown. Home-language recognition requires separate checks. | Further focused research |
| Hints, corrections, examples, adaptive fading | Potential instructional benefit. | Can teach the missing skill and change score meaning. Avoid inferring a broad ability level to decide assistance. | Separate assisted/instructional condition |

Humanities example: a learner interprets an account of justice and argues whether justice has value without practical benefits. Asking for the student's reason can elicit their contribution; supplying an argument about human dignity introduces substantive content. Rewriting incomplete English into that argument would misrepresent the student. These distinctions require task-specific educator review.

## Evaluation questions before a product spec

1. **Assessment target:** What must the learner demonstrate, and which aspects of English are part of that target? Define a narrow claim rather than general ability.
2. **Support policy:** For each support, record purpose, trigger, permitted wording/content, prohibited assistance, stop condition, and scoring interpretation.
3. **Speech failures:** Test pauses, accents, code-switching if permitted, noise, negation, numbers, and uncertain transcripts. Compare machine interpretation with human-checked transcripts; include unresolved meaning rather than forcing a score.
4. **Behavioral failures:** Test repeated help requests, fluent misconceptions, correct ideas in limited English, answer-seeking, and cumulative leakage across several individually harmless prompts.
5. **Evaluation design:** Compare the same model, tasks, and rubric under a strong baseline policy and the proposed support policy. Have EL and subject educators review evidence preservation and leakage; measure disagreement. Synthetic cases support debugging, not population-level fairness claims.
6. **Success interpretation:** Higher student scores or expert preference alone are insufficient. Examine meaning preservation, evidence quality, content assistance, transcription errors, latency, and differences across relevant learner groups, with uncertainty.

## Current next step: detect and surface language-related patterns

Supervisor direction is recorded in `RESEARCH_BRIEF.md`. The following is a proposed research/engineering approach, not an approved taxonomy or implemented detector.

**Expanded Illinois research, 2026-11-16:** The user selected Illinois and requested both secondary grade bands and all six proficiency levels, with a broad source review. [ILLINOIS_LANGUAGE_DETECTION.md](ILLINOIS_LANGUAGE_DETECTION.md) now provides the detailed 24-case catalog, counterexamples, identification methods, support implications, all-level context, and evaluation proposal. Source evidence and review limits are logged in S51–S63. The earlier three-pattern table below is retained as research history. No new detector/UI was implemented or evaluated by this documentation work. Current Language Charts' ACCESS-score interpretation begins in 2026–27; an older WIDA snapshot gives a conflicting date, recorded in S52 for verification before score linkage.

### Separate the inputs

**Initial detection scope, 2026-11-16:** Analyze existing work and surface teacher-facing observations without additional AI follow-up questions. Use the existing conversation for context and repairs; preserve uncertainty when it does not resolve meaning. The research catalog's suggested probes/support trials are future options. This is a documented scope decision, not an implemented code change.

Keep jurisdiction, grade, framework/edition, assessment/instrument, domain-specific level or score, score date/source, input modality, and assignment objectives distinct. Allow unknown/missing records. Preserve teacher-entered proficiency separately from Socra observations; do not silently update official levels from chat.

**User decision, 2026-11-16: fixed demo objective.** The next demo uses one fixed humanities task and assignment objective across its examples. Supply the objective to the AI through task configuration; do not add an objective input or editing control. Teacher setup therefore concerns state, grade, and existing domain-specific proficiency information, with state/grade presets possible for the initial scope. Goal changes discussed below concern the eventual product, not this demo. This records a design constraint; no UI or model behavior has been implemented by this documentation change.

WIDA ACCESS uses domain-specific reporting (S33). California's instructional ELD stages and its four Summative ELPAC performance levels are different reporting structures (S34); Texas is in a standards/assessment transition (S35). ELP means English language proficiency and ELD means English language development; neither label alone identifies one universal interchangeable scale. State, instrument, edition, and date matter. Arizona's specifics remain unreviewed in this pass.

### First WIDA extraction and candidate patterns

Use grades 6–8 as a bounded first extraction because relevant resources are available; it is not the confirmed deployment grade or a claim that the original Glaucon adaptation fits this population. Select age-appropriate examples for educator review. S14 follow-up records exact WIDA locators. None of the following is established as a common error caused by a particular proficiency level.

| Proposed observation | Framework connection | Evidence needed and negative case |
| --- | --- | --- |
| Unresolved reference in the learner's explanation | Expressive cohesion; S14 printed p.174 / PDF p.176; LA Argue expressive p.150 / PDF p.152 | Quote an unclear reference after inspecting preceding turns. “He disagrees with him” after two people were discussed may be ambiguous; clear antecedents in context should produce no flag. |
| Relationship between statements is unclear | LA Argue expressive p.151 / PDF p.153; expressive grammatical complexity p.175 / PDF p.177 | Preserve the propositions and the apparent conflict. A clear relationship without an explicit connector is a negative case. Do not use absence of “because” as an error rule. |
| Possible source/learner-position confusion | LA Argue interpretive p.150 / PDF p.152 | Supply the passage, question, and student's attribution. Explicit disagreement is not a misconception. A source mismatch may involve language, content, or task interpretation; cause remains uncertain. |

A profile level contextualizes support suggestions; it must not manufacture evidence of a difficulty. Extract capabilities and successful examples alongside challenges. Standard descriptors describe language use; published studies, annotated samples, and educator review are still needed before saying a behavior is *common at a level*.

**Concrete source follow-up, 2026-11-16:** Public materials do provide explicitly discussed difficulties and annotated examples. Use WIDA Language Charts (S37) for framework context; TELPAS annotated collections and item-scoring guides (S39–S40), plus ELPAC exemplars (S38), for observable examples and counterexamples. Written-error annotation research (S41) offers more formal label/span conventions. Keep capabilities, observed examples, item scores, and prevalence claims distinct. The inspected examples are strongest for expressive language; they do not yet establish a catalog of level-specific reading misconceptions. Revise the candidate list from these sources before treating it as a taxonomy. Extract definitions and create original test cases; the current three patterns remain proposals.

### Detection experiment before dashboard development

1. Select one observable pattern and one task/grade context. Decide whether the target is interpretation of source text, written expression, or spoken expression. If the priority is reading, include source-based questions that elicit interpretation; do not substitute a grammar checker for reading evidence.
2. Write an annotation rule with included cases, exclusions, minimum context, positive examples of successful language use, and an explicit uncertain/insufficient-evidence outcome. A short answer, omitted feature, or unknown proficiency score is not itself a misconception.
3. Build a small set of original synthetic examples and counterexamples grounded in the reviewed descriptors. Label them synthetic. Get EL teachers to independently review the proposed categories and examples before treating expected labels as ground truth. Ask Deniz for suitable de-identified examples when literature cannot settle a case.
4. Evaluate transcript annotations first: exact evidence span, source/task link, observed pattern, alternative explanations, assistance already supplied, and review status. Compare decisions with teacher labels, inspect false positives/missed cases and abstentions, and test whether changing only a supplied level improperly changes the claimed observation. No accuracy results or acceptance threshold exist yet.
5. Only after useful annotations are demonstrated, aggregate them into learner profiles and class cards. Count unique learners separately from instances; show the time window, eligible opportunities, and whether observations are proposed or teacher-confirmed. A possible card is “Possible source-attribution difficulty: N learners; view examples.” N must come from records, not generated prose.
6. Track strengths, corrections, unresolved observations, and recurrence across assignments. Account for different objectives, text complexity, response opportunities, and support conditions. Do not call changes in flag counts proficiency growth without comparable evidence. Permit teacher confirmation, dismissal, and goal changes while retaining the earlier objective/context.

**Example of the proposed annotation, not a finding:** “In this response, ‘he’ could refer to either speaker. Clarification is needed.” This is an observation about the available text, not “this level-2 student has a reading deficit.” Typed responses provide written-expression evidence and indirect clues about comprehension. A speech transcript is not a writing sample, and ASR uncertainty can invalidate an apparent language error.

### Support and teacher workload

Deniz's feedback permits a more instructional approach. The default design question is which support helps the learner under the assignment's goal. If an explanation supplies an argument or source interpretation, preserve that support context and make its impact inspectable; do not universally defer content help. Any revised support policy remains to be designed and tested. Avoid flooding teachers with minor form errors: prioritize actionable patterns with evidence, group duplicates, and test review burden with teachers. The exact review/aggregation threshold is unresolved.

### Questions for EL-teacher interviews

- Which reading or expressive-language patterns are actionable in your actual humanities assignments? Ask for examples and counterexamples, not only agreement with our labels.
- What domain scores, framework labels, and dates do you actually have available? How should missing or old records be represented?
- What evidence would distinguish a language difficulty from content misunderstanding, task confusion, a brief response, or an input error?
- Which annotations would you confirm, dismiss, or act on? How many examples and what context do you need, and how much review time is reasonable?
- When should an observation enter a semester profile? How should revisions, successful responses, different objectives, and assistance affect that profile?
- Which supports would you offer, and what should the interface show when assistance contributes substantive content? How would changing a goal work in practice?

### Speech record and next handoff

The speech-input rationale and evidence limitations are now explicit in `DEMO_SPEC.md` §7. Existing read-aloud output does not resolve input recognition or turn-taking. Keep input modality and transcript correction provenance in the detection proposal.

Next deliverable: a compact framework-to-observation map plus reviewed candidate examples and an annotation contract, using these existing documents. Do not build a multi-state classifier or class dashboard before establishing what a reliable, useful flag looks like. No requirement to complete the earlier 17-case support-policy comparison before pursuing Deniz's updated priority.
