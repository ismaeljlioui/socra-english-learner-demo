# Medley → Socra: first research synthesis

Date: 2026-11-04. Status: initial evidence review and proposed research direction, not an approved specification.

## Main finding

The useful design hypothesis is to vary language access while preserving the academic task. Whether a particular support achieves that must be checked at the task level. Instructional usefulness does not establish assessment validity.

This pass reviewed Medley's public documentation and selected foundations, plus assessment-accommodation and speech-recognition evidence. No authenticated product testing was performed. The linked public video could not be retrieved; feature descriptions below remain vendor-documented, not independently observed. Source details and access limitations are in `SOURCES.md`.

## What Medley documents

| Support | Documented behavior | Proposed Socra translation | Risk to investigate |
| --- | --- | --- | --- |
| Vocabulary access | Contextual definitions, pictures, audio, examples | Approved explanations of incidental wording | An explanation can reveal assessed knowledge. |
| Text amplification | Chunking, headings, embedded definitions | Segment spoken instructions | Segmenting reasoning can supply a solution strategy. |
| Translation and read-aloud | Additional ways to access text | Replay and approved multilingual access | Translation may change meaning; audio cues may emphasize an answer. |
| Response scaffolds | Frames and word banks, fading toward stems | Optional response starters | A starter may supply a claim or argument structure. |
| Teacher controls | Support levels and site restrictions | Per-assessment support policy | Different assistance can change what scores mean. |
| Print support | Scaffolded versions of uploaded material | Secondary priority for this voice project | Not a direct implementation precedent. |

Source: [S02, feature sections](https://www.medleylearning.com/). Vocabulary-building is labeled forthcoming and should not be treated as a verified available feature.

Medley describes AI analysis of text demands, selection based on language proficiency, teacher overrides, and usage visibility. It does not offer open-ended student chat. Its descriptions do not establish the model provider, fine-tuning, prompts, proficiency-mapping algorithm, or fading schedule. Alignment with named proficiency systems is not evidence that those scales are interchangeable. [S03, AI use / teacher use / proficiency questions](https://www.medleylearning.com/faqs)

## Evidence and its boundaries

- **WIDA offers a framework for support selection.** Interpretive and expressive language, and discourse/sentence/word dimensions, are more informative than a single generic level. It recommends multiple sources of evidence while keeping learning goals consistent. This is guidance for instruction, not an automated assessment algorithm. [S06](https://wida.wisc.edu/resources/resource-snapshot/wida-proficiency-level-descriptors-informing-expectations-and)
- **IES supports instructional practices with unequal evidence strength.** Its rationale explicitly warns that interventions contain multiple components. The writing recommendation has limited, mixed evidence; sentence starters appearing within a successful intervention do not prove their independent effectiveness in oral assessment. [S09, pp. 5, 50–51, 92–94](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/english_learners_pg_040114.pdf)
- **Medley's reported outcomes are observational.** They are promising implementation evidence, but cannot isolate the product's contribution or establish superiority. Methodological gaps are recorded in S05. [Impact report](https://www.medleylearning.com/impact)
- **Assessment accommodation results vary.** Sato et al. provide a precedent for reviewed modifications; Young et al. found mixed item outcomes despite expert development. We should test each approved variant, not assume simpler wording is always better. [S12](https://files.eric.ed.gov/fulltext/ED510556.pdf), [S11](https://doi.org/10.1002/ets2.12023)
- **Speech benchmark design matters.** The historical benchmark examined in S10 excluded code-switched words during scoring. Such a metric cannot alone establish accurate capture of multilingual reasoning. Its results do not estimate today's model performance. [S10, §2](https://www.isca-archive.org/interspeech_2020/knill20_interspeech.pdf)

## Proposed first experiments

These are engineering hypotheses, not established best practices. Choose one grade/subject and define precisely what the assessment measures before testing them.

### 1. Communication repair and replay

Allow requests to repeat a prompt or clarify an unclear recording. Start with the original wording. Ask the student to restate uncertain speech without suggesting a content answer.

Example: “I didn't catch the last part. Please say it again.”

Failure case: “Did you say the plant cannot make food?” when the audio did not establish that claim. A confirmation question can manufacture apparent evidence.

Test interruptions, long pauses, partial responses, negation, numbers, background noise, and permitted mixed-language speech. Repetition is not automatically neutral where listening or memory is the assessed skill.

### 2. Reviewed prompt alternatives

Prepare variants in advance and have an educator check meaning, required reasoning, and answer clues. Compare these with original prompts before considering unrestricted generation.

Example candidate: “What evidence supports your conclusion?” → “What evidence supports your answer?” The substitution itself requires review if drawing a conclusion is part of the target.

Failure case: “Does the higher temperature explain the result?” introduces a causal candidate the student should identify.

Test preservation of conditions, quantities, negation, technical terms, and required reasoning. Do not remove difficulty that belongs to the assessed skill.

### 3. Restricted language clarification

Use an educator-approved list of explainable terms for each task. Treat content vocabulary and ordinary vocabulary according to their role in that task, not a universal word category.

Example: explaining “container” may be permissible in a science task; explaining “evaporation” is inappropriate if its meaning is what the student must demonstrate.

Test whether explanations, examples, or translations expose an answer. A short definition can still invalidate an item.

**Hold for further investigation:** sentence frames, word banks, content examples, automatic proficiency inference, and adaptive fading during an assessment. These remain candidates, but their effect on evidence needs more scrutiny. Translation requires language-specific review and clarity about whether English itself is being assessed.

## Evaluation principles for the experiments

Proposed process:

1. Create contrasting cases: sound reasoning with limited English; fluent misconceptions; ambiguous meaning; audio errors; requests for help; and responses after assistance. Synthetic examples are development tests only.
2. Have subject and EL educators label what evidence each response contains and whether the assistance changes the task.
3. Compare scoring from a human-checked transcript with scoring from machine transcription to isolate recognition errors. For direct-audio systems, use matched audio/transcript reviews as a diagnostic rather than assuming the system transcribes internally.
4. Record support offered, requested, delivered, and student uptake where observable. Preserve responses before and after assistance.
5. Check answer leakage, meaning preservation, expert agreement, semantic transcription errors, and differences across relevant language backgrounds and proficiency profiles. Report uncertainty and small sample limitations.
6. Use a baseline with the same model, content, rubric, and comparable settings; vary the support policy. Higher scores alone cannot establish better assessment.

Proposed reporting distinction: independent evidence, evidence following permitted access support, evidence following content assistance, and insufficient evidence. Do not decide scoring penalties or equivalence until the assessment purpose is defined.

## Questions for the supervisor or advisor

- Which grade, subject, and assessment purpose should anchor the first prototype?
- Which assistance is permitted, and what must students demonstrate independently?
- Is voice-only limited to student input? Can students see a prompt or glossary? Can they answer in another language?
- Are teacher-approved language profiles available, and who can approve support policies?
- Can we obtain a Medley demonstration or example scaffold outputs, particularly its level selection and fading behavior?

## Next research step

Inspect actual scaffold examples, examine WIDA's relevant grade-band descriptors, and review task-specific accommodation evidence before selecting the prototype scope. The subsequent Microsoft and conversational pedagogy review is recorded in [EL_SUPPORT_RESEARCH.md](EL_SUPPORT_RESEARCH.md). No paper, product superiority, fairness, or production-readiness claim is established by this pass.
