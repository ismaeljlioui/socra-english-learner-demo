# Illinois: identifying language patterns in Socra conversations

Research and proposed detection design · 2026-11-16 · Grades 6–8 and 9–12 · WIDA levels 1–6

**What this delivers:** a source-grounded starting catalog, coverage across both secondary grade bands and all six levels, original cases and counterexamples, methods for collecting and checking evidence, and an evaluation plan. This is research for the next prototype. No detector described here has been implemented or validated by this document.

**Current user decision, 2026-11-16: identification without AI follow-ups.** The first version observes existing responses and produces teacher-facing annotations. It does not ask additional student questions or initiate support trials. Case-card “next moves” and interactive support research are retained as future options, not required steps. Where the available transcript cannot establish meaning, return an unclear/insufficient-evidence status. Existing student repairs or assistance in the transcript remain relevant evidence.

**Main conclusion:** Socra can investigate specific language patterns by combining the passage, assignment, conversation, and assistance history. Existing proficiency information can contextualize support. Neither a level nor a framework descriptor establishes that a particular student made a particular mistake. A fixed list of “errors that level-2 students make” is not supported by the sources reviewed.

**Scope boundary:** this is a broad working catalog for humanities conversations, not every possible English-language difficulty. Reading and written expression are actionable research targets now. Listening, speaking, decoding, pronunciation, disability identification, official proficiency classification, and claims about improvement require different evidence. Cases below explicitly identify those limits.

## Reading this document

1. Sections 1–3: Illinois configuration, source roles, and all-level coverage.
2. Sections 4–5: what Socra can observe and 24 detailed cases.
3. Sections 6–8: detection procedure, teacher presentation, and evaluation.
4. Sections 9–11: evidence critique, implementation order, and remaining educator decisions.
5. Section 12: additional sources and the concrete changes they make to the design.

Evidence labels used throughout:

- **Verified guidance:** statements checked in official publications. Guidance is not a validation study.
- **Published example:** an actual annotated response or an authored item rationale. These have different evidential status.
- **Proposed design:** our annotation rules, synthetic examples, prompts, support choices, and evaluation procedures.
- **Unknown:** something the sources or current demo cannot establish.

The shared evidence log is [SOURCES.md](SOURCES.md). Prior scope and supervisor direction remain in [RESEARCH_BRIEF.md](RESEARCH_BRIEF.md). This document supersedes the earlier three-pattern shortlist as a research catalog, not as an approved implementation backlog.

## 1. Illinois configuration and what a proficiency level means

Illinois uses ACCESS and has adopted WIDA's 2020 ELD framework. These are distinct components: the framework informs instruction; ACCESS provides assessment records. Source: [WIDA Illinois](https://wida.wisc.edu/about/consortium/il), “Assessments” and “Standards and Instructional Support.”

For the next prototype, keep the following separate:

| Information | Proposed representation | Why it matters |
| --- | --- | --- |
| State | Illinois | Selects the applicable state configuration. |
| Actual grade | 6, 7, 8, 9, 10, 11, or 12 | The framework's two grade bands do not make every assignment suitable for every grade. |
| Instructional framework | WIDA ELD Standards Framework, 2020 | Identifies the source of language expectations. |
| Assessment record | Instrument, administration year, grade at testing, source, and domain scores | A score without its provenance can select inappropriate guidance. |
| Domain | Reading, writing, listening, speaking stored independently | A writing score cannot stand in for reading or speaking. |
| Missing information | Unknown, with no invented default level | Detection should still work from available evidence. |
| Current work | Raw response, task, passage, modality, turns, support events | Establishes what was actually observed. |
| Official EL status | Separate school-supplied field if needed | It is not inferred from a single domain level or Socra annotation. |

ACCESS reports six proficiency levels and separate domains. Preserve reported decimal values; do not round a score into an asserted classroom capability. Record the grade when the test was taken. The score hub warns that 2025–26 scale scores reset, so comparisons with older scale scores are not valid as a continuous trend. [ACCESS scores and reports](https://wida.wisc.edu/assess/access/scores-reports), “Understanding the Individual Student Report” and “Top Things to Keep in Mind.”

**Version issue:** the current [Language Charts PDF](https://wida.wisc.edu/sites/default/files/resource/WIDA-Language-Charts.pdf), p.4, specifies ACCESS-score interpretation beginning in 2026–27. An older [planning snapshot](https://wida.wisc.edu/resources/resource-snapshot/plan-curriculum-instruction-and-classroom-assessment-wida-language) gives an earlier transition date. Preserve this discrepancy. Use the current PDF for this proposed linkage, and confirm with WIDA/ISBE before implementing a production score-to-chart rule. Classroom planning use is separate from interpreting older scores.

**Level 6 is included in the research.** It is not a promise of error-free performance, and it does not mean the student is currently classified as an EL. Do not automate entry, exit, reclassification, or services decisions. Current [Illinois exit guidance](https://www.isbe.net/elexit), opening and “Why Now?”, describes a review after standard setting; no historical numeric cutoff is hard-coded here.

**The demo objective remains fixed.** State, grade, and proficiency context can vary; the teacher does not edit the objective in this demo. The existing Glaucon task was provisionally designed for grades 9–12. Research coverage of grades 6–8 does not establish that its archaic passage is appropriate for middle school. The short original examples below are research fixtures, not changes to the demo assignment.

## 2. Which sources answer which questions

| Question | Source to use | What it does not establish |
| --- | --- | --- |
| What language does the humanities task involve? | [WIDA 2020 framework](https://wida.wisc.edu/sites/default/files/resource/WIDA-ELD-Standards-Framework-2020.pdf): language arts and social studies expectations | A validated automatic detector or a prevalence ranking of errors. |
| How does language use develop across levels? | [Language Charts](https://wida.wisc.edu/sites/default/files/resource/WIDA-Language-Charts.pdf), pp.17–22; historical framework PLDs kept separately | That a learner must use every listed feature in every answer. |
| How should we collect evidence of reading? | [Reading Observation Tool](https://wida.wisc.edu/sites/default/files/resource/Reading-Observation-Tool.pdf), pp.1–2; [Reading Conference Planning](https://wida.wisc.edu/sites/default/files/resource/Reading-Conference-Planning.pdf), pp.1–2 | That a wrong written answer diagnoses its reading cause. |
| What do concrete interpretation difficulties look like? | Official TELPAS reading rationales and annotated writing; ELPAC annotated responses | Texas/California ratings cannot be converted into WIDA levels from these examples. |
| How can we record and evaluate error spans? | [Coyne et al., 2025](https://arxiv.org/html/2508.06810v1); [ERRANT](https://aclanthology.org/P17-1074/) | Neither supplies a WIDA-aligned humanities classifier. |
| Can an LLM detect language errors? | [Mizumoto, 2025](https://doi.org/10.1017/S0272263125100934); [BEA-2019 benchmark](https://aclanthology.org/W19-4406/) | Results do not transfer automatically to Illinois adolescents, short chat, or speech. |
| What supports have an instructional rationale? | WIDA scaffolding and reading tools; [IES English-learner practice guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/19) | An effective classroom package does not prove a particular AI hint improves learning. |

The 2020 framework's relevant humanities anchors include language arts Narrate, Inform, and Argue, and social studies Explain and Argue. They connect communication to disciplinary work. Our cases operationalize selected aspects for review; they are not official WIDA error categories.

| Anchor | Grades 6–8 | Grades 9–12 | Source locator |
| --- | --- | --- | --- |
| Language arts Narrate | `ELD-LA.6-8.Narrate` | `ELD-LA.9-12.Narrate` | 2020 framework; use Interpretive/Expressive variants as applicable. |
| Language arts Inform | `ELD-LA.6-8.Inform` | `ELD-LA.9-12.Inform` | Same. |
| Language arts Argue | `ELD-LA.6-8.Argue` | `ELD-LA.9-12.Argue` | Printed pp.150–151 and 188–189; PDF pp.152–153 and 190–191. |
| Social studies Explain | `ELD-SS.6-8.Explain` | `ELD-SS.9-12.Explain` | Grade-specific explanation and source-context expectations. |
| Social studies Argue | `ELD-SS.6-8.Argue` | `ELD-SS.9-12.Argue` | Grade-specific claim, evidence, and perspective expectations. |

Exact task criteria remain educator-owned. A short turn need not satisfy an entire disciplinary expectation.

**Precise retrieval locators:** the [grades 6–8 booklet](https://wida.wisc.edu/sites/default/files/resource/WIDA-ELD-Standards-Framework-2020-Edition-Grades-6-8.pdf) and [grades 9–12 booklet](https://wida.wisc.edu/sites/default/files/resource/WIDA-ELD-Standards-Framework-2020-Edition-Grades-9-12.pdf) use the same local page positions for these sections: LA Narrate 32–33, Inform 34–35, Argue 36–37; SS Explain 46–47, Argue 48–49; interpretive PLDs 58–59, expressive PLDs 60–61. These are booklet pages, not full-framework pages. In the full framework, the middle-school humanities sections span printed 146–163 and PLDs 172–175; high-school humanities sections span printed 184–201 and PLDs 210–213. Full-PDF page numbers are printed numbers plus two. Do not mix a booklet locator with the full-document URL.

## 3. Coverage of all six levels, in both grade bands

### 3.1 A compact orientation to the current charts

The charts distinguish discourse, sentence, and word/phrase dimensions. Interpretive and expressive modes concern understanding and producing language. The following are selected orientation cues, not complete descriptors or scoring rules. Read the source tables for the full combination: grades 6–8, pp.17–18; grades 9–12, pp.19–20.

| Level endpoint | Middle school: selected language focus | High school: selected language focus |
| --- | --- | --- |
| 1 | Sequencing; simple sentences; contextual word meanings | Basic organization; dependent clauses; disciplinary terms |
| 2 | References; modifiers; disciplinary vocabulary | Logical links; compound sentences; idiomatic phrasing |
| 3 | Connected ideas; varied phrasing | Cohesion across text; complex sentences; abstraction |
| 4 | Complex sentences; contextual detail | Information flow; varied clauses; qualification |
| 5 | Condensed meaning; qualification | Audience awareness; nuance; figurative meaning |
| 6 | Flexible organization; nuanced expression | Strategic organization, syntax, and precision |

Source: [WIDA Language Charts](https://wida.wisc.edu/sites/default/files/resource/WIDA-Language-Charts.pdf). These are endpoints, not a description of every student within the level. The expanded Level-1 continuum is on pp.21–22. A grade-band difference is not a score conversion.

### 3.2 What we would do with each profile in research

**Everything in this table is a proposed elicitation/support experiment, not a WIDA-prescribed intervention.** The same pattern can occur at any level. Use current work to select help, with the supplied profile as context. Never assign a student to one of these rows from the length or grammar of their answer. Reading and writing columns use their respective domain records; a learner may belong to different rows in each column. The task and response select eligible case checks at every level; this table must not enable or disable detectors by proficiency.

| Profile supplied by teacher | Reading evidence to seek | Written-expression evidence to preserve | Candidate next move, if needed |
| --- | --- | --- | --- |
| MS level 1 | Meaning of one relevant clause; who acted; which text detail informed the response | Any communicated proposition, including a phrase that is clear in context | Invite a short response or a student-selected phrase from the source; offer language access without resolving the content for them. |
| MS level 2 | Which nouns references point to; how a detail modifies the main idea | A meaningful connection between statements even if grammatical control varies | Ask for the name behind one ambiguous pronoun or one relation between ideas. |
| MS level 3 | Connections across adjacent sentences; contextual word meaning | Claim, reason, and relation can be distributed across turns | Invite the student to connect two of their own statements. |
| MS level 4 | Clause scope and information across the passage | Preserve qualification and explanation, including clear informal wording | Ask about one unclear condition or contrast, without rewriting the whole answer. |
| MS level 5 | Strength of claims and compressed expressions | Whether qualification matches the intended position | Invite precision where “always,” “might,” or a broad noun obscures meaning. |
| MS level 6 | Nuance, perspective, and source interpretation | Logical clarity rather than impressive vocabulary | Probe an actual ambiguity; do not presume complete understanding from the score. |
| HS level 1 | Relevant meaning in disciplinary text, with access supports recorded | Subject insight can be expressed briefly and with technical terms | Ask one source-based question at a time; keep the intellectual issue intact. |
| HS level 2 | Relationships within a passage, including a contextual or idiomatic phrase | Distinguish clear meaning from merely unconventional phrasing | Clarify the specific phrase that changes interpretation; avoid blanket simplification. |
| HS level 3 | Cross-sentence reference, abstractions, and actor/action relationships | Relationships conveyed through complex or concise expression | Invite unpacking of one dense statement in the student's own words. |
| HS level 4 | Modal strength, conditional scope, and compact arguments | Purposeful qualification and clause relationships | Ask whether a claim is universal, conditional, or a possibility when the response leaves this unclear. |
| HS level 5 | Rhetorical perspective and comparisons across sources when the task elicits them | Nuance, evidence relevance, and audience-sensitive expression | Invite justification of one interpretation; sophisticated fluency is not a correctness check. |
| HS level 6 | Subtle attribution, evidence limits, and strategic ambiguity | A concise answer can be fully adequate | Probe only an evidenced issue; a high score does not remove the need for review. |

No row reserves advanced reasoning for higher levels. Conversely, a teacher-supplied higher level does not make basic clarification inappropriate.

### 3.3 Mixed, missing, and changing profiles

- A student can have stronger reading than writing, or the reverse. Keep these as two records; do not average them into an “ability” value.
- A typed explanation is direct evidence of written expression and indirect evidence of reading comprehension. If the explanation is unclear, reading remains unresolved.
- A student-selected passage span, paraphrase, drawing, home-language explanation, or bilingual conference may provide additional evidence. Each changes the conditions and must be recorded. Some are future product options, not implemented demo controls.
- Allow a student with an older or unknown score to demonstrate any capability. Never suppress a successful observation because it exceeds the profile's expected range.
- Separate original student production from copied passage wording, templates, translation, teacher help, and AI-supplied content. Support is legitimate; it changes what can be claimed about independent performance.

## 4. What identification means

Use five distinct outcomes:

1. **Observed strength:** an identifiable language action succeeded in this context.
2. **Observed difficulty:** a specific mismatch or communication problem is supported by the available evidence. This does not establish its cause.
3. **Clarification needed:** at least two plausible readings remain.
4. **Not elicited / insufficient evidence:** the task or response did not provide an adequate opportunity.
5. **Input or assistance limitation:** transcription, missing context, or supplied content prevents the intended inference.

Separate the location of a problem from its explanation. “The response reverses the actors in this sentence” can be supported. “The student cannot understand passive voice because they are level 2” cannot be concluded from that response.

All cases below require the source text, prompt, preceding relevant turns, and assistance history. A phrase in isolation is usually insufficient. Cases are original research fixtures unless explicitly labeled otherwise. The cases' difficulty examples are not known error frequencies, and none is exclusive to EL students.

### 4.1 Coverage map

| Area | Cases | What a teacher could inspect |
| --- | --- | --- |
| Task and word access | C01–C04 | Task interpretation, word sense, morphology, figurative meaning |
| Sentence meaning | C05–C09 | Actors, conditions, negation, modal force, event order |
| Cohesion and source reading | C10–C14 | Reference, speaker attribution, central ideas, inference, source comparison |
| Argument and expression | C15–C20 | Evidence connection, concession, organization, precision, grammar, response boundaries |
| Process and safeguards | C21–C24 | Revision, assistance attribution, multilingual response, speech/input uncertainty |

Cases C05–C17 can overlap with subject reasoning. Record the observed response and competing explanations; do not assign “language cause” by default.

## 5. Detailed case catalog

For every case, apply it across all six levels when the task elicits the relevant behavior. Grade-band examples change content and linguistic demands, not the required standard of evidence. “Support” below describes an option for educator review; when it supplies an interpretation or argument, record it as substantive help.

### C01. The student appears to be answering a different task

- **Basis:** WIDA Reading Conference Planning, p.1; proposed task-opportunity rule.
- **Case:** Asked to explain a narrator's reason, the learner lists the characters. In high school, asked to compare two sources, the learner summarizes only one.
- **Identify:** Match the response to the actual requested action, inspect earlier answers, and ask the learner what they understood the request to mean. Output `task_interpretation_unresolved` until clarified. This can be a prompt-design failure.
- **Counterexample / uncertainty:** A character list may be the first step of a developing answer. Do not flag an unfinished turn or an answer to a different preceding question.
- **Next move:** “What do you think this question is asking you to explain?” Rephrase or break the instruction into steps if helpful. Record the change; do not invent the student's reasoning.
- **Limit:** Vocabulary, attention, missing context, interface confusion, and content uncertainty remain possible explanations. Silence is not evidence for this label.

### C02. A word is interpreted with an incompatible meaning

- **Basis:** WIDA Reading Conference Planning, p.2, word knowledge; current charts' word/phrase dimension; TELPAS contextual-meaning rationales.
- **Case:** A school passage says “the principal's position”; the response treats “position” as where the principal is standing despite surrounding text discussing an opinion. HS version: “sanction” is read as approval when this source clearly describes a penalty.
- **Identify:** Require an explicit interpretation or paraphrase and disambiguating source context. Compare meanings, not identical word strings. Label the mismatch in this use, not “poor vocabulary.”
- **Counterexample / uncertainty:** A request for a definition is help-seeking, not evidence of an incorrect belief. Both meanings may genuinely fit an incomplete excerpt.
- **Background-knowledge distinction:** An unfamiliar concept or historical event can require subject instruction even when the words are understood. Record an explicit request or response mismatch; do not infer a vocabulary cause from the level. A better answer after explanation shows supported performance, not proof of a single cause.
- **Next move:** Ask what the word means here and what in the passage supports that interpretation. An approved contextual definition can help; log it because it may resolve the target interpretation.

### C03. A word part or grammatical ending changes meaning

- **Basis:** Reed et al. (2016), vocabulary/form relationships, with correlational limits; ERRANT for form annotation. The detection rule is proposed.
- **Case:** The source says a proposal was “reconsidered”; the student explicitly says it was considered for the first time. HS version: “illegitimate” is explained as legitimate. Written “citizen” versus “citizens” matters only if the intended quantity becomes unclear.
- **Identify:** Locate the word and compare the expressed meaning. Ask for a paraphrase before attributing the mismatch to the prefix, suffix, or ending. A tokenizer or spelling checker cannot establish comprehension.
- **Counterexample / uncertainty:** “Many citizen object” communicates plurality despite the omitted ending. Proper names, dialect, keyboard errors, and source typos need different handling.
- **Next move:** Explore the word's parts with the learner, then check a new use. This is explicit instruction, not independent evidence from the original response. Do not infer an entire morphological deficit.

### C04. Figurative or culturally situated language is interpreted literally

- **Basis:** LA Narrate/Argue expectations; WIDA conference word-knowledge prompts; authored TELPAS humor/context rationales.
- **Case:** “Her heart sank” becomes an account of physical injury. HS version: “The reform opened the door to participation” becomes unlocking a building.
- **Identify:** Require context supporting a nonliteral reading and a student commitment to the literal one. Check whether the student is deliberately discussing both readings. For irony, multiple interpretations may remain defensible.
- **Counterexample / uncertainty:** “She became disappointed” conveys the meaning without repeating the idiom. A literal door in the story may make the alleged mismatch invalid.
- **Next move:** Ask what changed for the person or what the phrase communicates here. A phrase explanation may help, but can supply the literary interpretation under discussion.
- **Limit:** Do not infer cultural background, intelligence, or proficiency from unfamiliarity with one expression. Mark contested literary interpretations for teacher review.

### C05. Actor, action, or affected person is reversed

- **Basis:** LA Inform and SS Explain; discourse density and sentence relationships.
- **Case:** “The council rejected the residents' proposal” becomes “The residents rejected the council.” HS version: “The committee's rejection of the amendment surprised the mayor” is paraphrased with the mayor doing the rejecting.
- **Identify:** Extract a tentative actor–action–object representation from both source and response. Check against the full passage; role extraction is itself fallible. A clear mismatch supports `actor_action_mismatch`; an unclear response requires clarification.
- **Counterexample / uncertainty:** “Council said no. Residents upset” can communicate the roles clearly. A passive sentence legitimately omits an unknown actor.
- **Next move:** “Who did what in that sentence?” If needed, help unpack the sentence structure. Supplying the correct actor directly is substantive support.
- **Voice risk:** Misrecognized names and dropped function words can produce a false reversal.

### C06. Cause, contrast, concession, or condition is changed

- **Basis:** LA Argue / SS Explain; TEA grades 10–12 rationale, item 6, p.6.
- **Case:** Source: “She helped although there was no reward.” Response: “She helped because there was no reward.” The stated circumstances stay the same, but the relationship changes. HS version: “even if there is no benefit” becomes “only if there is a benefit.”
- **Identify:** Represent the two propositions and the relationship the student actually asserts. Compare with the source. Do not decide correctness by connector presence alone.
- **Counterexample / uncertainty:** “No reward. She helped anyway” preserves the relation. “Helping and rewards are related” leaves it unresolved. A student's independent counterargument is not a source-reading error.
- **Next move:** Ask the student to explain how the two ideas relate. A blank relation organizer can help. Selecting the correct relationship for the learner can supply the inference; record it.
- **Level use:** The same mismatch matters at every level; the wording and amount of assistance can differ.

### C07. Negation or quantity changes the source claim

- **Basis:** Proposed sentence/precision case aligned to LA Inform/Argue; TEA grades 8–9 rationale item 30 provides an overgeneralization analogue.
- **Case:** “Not all residents agreed” becomes “No residents agreed.” This is an unsupported strengthening, not necessarily a contradiction: “not all” does not itself assert that anyone agreed. A clean contradiction fixture is “Some residents agreed and some disagreed” paraphrased as “No residents agreed.” HS version: “Some witnesses questioned one claim” becomes “Every witness rejected the whole account.”
- **Identify:** Compare who, how many, polarity, and the scope of the statement. Inspect the entire response and source for explicit qualification. Record an overstatement or scope mismatch only when the learner's meaning is clear.
- **Counterexample / uncertainty:** “There was disagreement” is compatible with partial agreement. An accidental missing “not” or an ambiguous double negative needs clarification.
- **Next move:** Ask what the source lets us conclude about agreement, without requiring identities or quantities it does not provide. Teaching the distinction is allowed as assistance.
- **Voice risk:** A lost negative can reverse meaning. Confirm the transcript before surfacing a student-language observation.

### C08. Possibility, certainty, obligation, or permission is confused

- **Basis:** LA/SS Argue language features; current charts' qualification/evaluation cues.
- **Case:** “The rule might help” becomes “The rule definitely helps.” HS version: “Citizens may object” is interpreted as “Citizens must object.”
- **Identify:** Compare the force of the actual statement in context. Distinguish a prediction, obligation, permission, and a personal commitment. Modal meaning is contextual: “may” is not always permission.
- **Counterexample / uncertainty:** “It could help” preserves possibility. A student can legitimately make a stronger personal claim while accurately describing the source's weaker one.
- **Next move:** Ask how certain the source is or what it requires. If the response remains unclear, show the alternatives as a support and record that the options cue the distinction.
- **Limit:** Hedging is not automatically superior language. Do not weaken an appropriately certain claim or infer a recurring difficulty from one modal verb.

### C09. Event order or time is misrepresented

- **Basis:** LA Narrate / SS Explain; TEA grades 6–7 item 21 and grades 10–12 items 8/30 rationales.
- **Case:** A passage says the meeting followed the petition; the student places the meeting first. HS version: a later reform is described as causing an earlier protest without any stated anticipation.
- **Identify:** Extract events, explicit time evidence, and the learner's asserted order. Separate a sequence mismatch from a causal claim. Check flashbacks, predictions, and earlier announcements.
- **Counterexample / uncertainty:** Present-tense retelling can preserve order. Two events occurring in order does not establish that the first caused the second.
- **Next move:** Invite the learner to place the events on a blank timeline and explain any causal connection. A completed timeline supplies information and must be logged.
- **Limit:** Tense morphology alone is inadequate for detecting chronology. Background historical knowledge may support a claim absent from the supplied excerpt.

### C10. A reference is unresolved

- **Basis:** WIDA cohesion descriptors and LA/SS source relationships.
- **Case:** After both Glaucon and Socrates have been discussed, “He disagrees with him” does not identify either person. A longer HS response says “this proves it” after several claims and pieces of evidence.
- **Identify:** Inspect all relevant preceding turns and quoted material. List plausible referents; flag only if multiple materially different readings remain. Identify which expression is unresolved. Do not choose a referent on the learner's behalf.
- **Counterexample / uncertainty:** “Glaucon presents the account. He asks Socrates to respond” can be clear. Missing transcript context is an input limitation, not a student error.
- **Next move:** “Who do you mean by ‘he’?” or “Which idea do you mean by ‘this’?” Replacing a pronoun with the student's chosen name can resolve the issue.
- **Teacher wording:** “Reference unclear in this turn; clarification needed,” not “student struggles with pronouns.”

### C11. Source, character, narrator, and student positions are conflated

- **Basis:** LA Narrate/Argue and SS Argue; WIDA Reading Observation Tool, perspective.
- **Case:** A report supports a rule and Maya rejects it; the student says the report rejects it. In the demo, the student's own moral view is attributed to the account Glaucon presents.
- **Identify:** Maintain separate attributed propositions for each voice and the student. Require explicit evidence before treating an unattributed opinion as a claim about the author. Preserve quoted and embedded speech boundaries.
- **Counterexample / uncertainty:** “The report supports it, but I disagree” is successful differentiation. “This is wrong” may be the learner's position rather than a paraphrase.
- **Next move:** “Is that your view, or the view presented in the passage?” A blank source/my-view organizer can help. Filling the source's column for the learner supplies content.
- **HS caution:** Irony, an unreliable narrator, or authorial intent may remain genuinely contestable; route to teacher review.

### C12. A detail is presented as the main idea, or a summary changes the meaning

- **Basis:** LA Inform/Narrate; Reading Observation Tool; TEA 6–7 items 32/35 and 8–9 item 25 rationales.
- **Case:** Asked for the main claim of a passage advocating public-library access, the student selects the incidental color of its roof. HS version: a summary omits the stated exception and becomes universal.
- **Identify:** Verify that the prompt actually requested a main idea or summary. Compare against educator-reviewed key propositions and acceptable alternatives. Flag explicit misidentification; an incomplete answer should remain incomplete.
- **Counterexample / uncertainty:** A short but accurate central claim can be sufficient. The roof detail is correct if the question requested a descriptive feature. Do not impose one canonical wording.
- **Next move:** Ask what the author wants readers to understand about the topic. Chunking the source can support access. An AI-generated summary supplies the interpretation and changes the evidence conditions.

### C13. An inference or purported quotation lacks source support

- **Basis:** LA/SS Argue; source evidence and inference are separate proposed fields.
- **Case:** The learner says a character is angry because the room is blue; the supplied passage gives no such connection. HS version: an exact quotation is attributed to a source but cannot be located.
- **Identify:** Search the source for the quoted string with permitted formatting normalization; validate the claimed meaning separately. Check whether a symbolic or inferential link is defensible. Label `quotation_not_found` or `inference_support_unexplained`, as appropriate.
- **Counterexample / uncertainty:** Paraphrases do not require exact matches. A different translation, omitted page, or outside source may explain the discrepancy. Do not label fabrication or dishonesty automatically.
- **Next move:** Ask where the source supports the claim or how the detail supports the inference. Do not choose the evidence for the learner unless logging substantive help.
- **Limit:** String matching can verify a quotation's presence, not whether it proves the claim.

### C14. Differences between sources are erased

- **Basis:** SS Explain/Argue and Reading Observation Tool, synthesis.
- **Case:** One account favors a policy and another opposes it; the response says both support it. HS version: an early prediction and a later outcome report are treated as identical evidence of success.
- **Identify:** Require both sources, their relevant context, and a task that elicits comparison. Extract separately attributed claims before comparing them. Preserve source dates/genres when provided. Credibility judgments need reasons, not an automatic preference for institutional sources.
- **Counterexample / uncertainty:** “Both discuss the policy, but disagree about its effects” can be accurate. No comparison difficulty can be inferred from a one-source task.
- **Next move:** Invite one claim from each source, then ask how they relate. Metadata cards can aid access; prefilling the competing conclusions supplies interpretation.
- **Demo applicability:** The current single-passage Glaucon task cannot test cross-document synthesis. Keep this as broader research coverage.

### C15. A claim–evidence connection is not yet expressed

- **Basis:** LA/SS Argue; TEA grades 10–12 item 31 evidence-relevance rationale.
- **Case:** “The narrator is generous. The wall is blue.” The task requests evidence supporting the character interpretation. HS version: a quotation is relevant to the topic but its relationship to the thesis is unstated.
- **Identify:** Locate the claim and proposed evidence, then examine whether their relationship is already recoverable from prior turns. If not, use `connection_not_yet_expressed`. Do not convert a missing explanation into a reasoning deficit.
- **Counterexample / uncertainty:** “She shared her only meal. That shows generosity” succeeds. No “because” is required. A color may be meaningful symbolism in a source the system has incompletely received.
- **Next move:** “How does that detail support your interpretation?” A blank claim/evidence/link scaffold can organize student-owned content.
- **Risk:** Selecting a quotation or explaining its meaning supplies substance; the later answer remains valid supported learning evidence.

### C16. A concession or counterargument is mistaken for the final position

- **Basis:** LA/SS Argue; interpretation and expression of competing positions.
- **Case:** Source: “Some residents praise the rule's efficiency. Nevertheless, I oppose it because it excludes others.” Student: “The author ultimately supports the rule because it is efficient.” This is a source-position mismatch. Conversely, a learner saying “Some people say the rule is fair, but I disagree because it excludes others” must not be labeled as supporting the rule; that is a required detector counterexample.
- **Identify:** Track each proposition's owner and its role in the argument, including any subsequent qualification. A student can acknowledge an objection without endorsing it.
- **Counterexample / uncertainty:** “I used to agree, but now I don't” is revision, not simultaneous contradiction. An unfinished “although…” clause is incomplete evidence.
- **Next move:** Ask which position the learner ultimately supports and what they are acknowledging from the other side. A two-position organizer may help; supplying the rebuttal is content assistance.
- **HS caution:** Rhetorical positioning often requires more context than a sentence-level classifier receives.

### C17. Organization obscures a relationship across turns

- **Basis:** WIDA discourse organization/cohesion; Reading Observation Tool, discussion.
- **Case:** The student alternates between two actors or events without identifying which one a new claim concerns. HS version: a long answer introduces an objection, evidence, and conclusion whose connections remain unclear.
- **Identify:** Reconstruct the response across turns; detect the specific unresolved connection rather than penalizing sequence, paragraph count, or length. Check whether the assistant's questions caused the fragmented structure.
- **Counterexample / uncertainty:** A short answer to a targeted question need not restate the entire argument. Nonlinear organization can be effective when relationships are clear.
- **Next move:** Invite the learner to identify their central point and connect one earlier statement to it. An outline using their own propositions is support; do not reorder them into a new argument silently.
- **Limit:** This is a higher-judgment annotation. Require teacher review before making a recurring profile claim.

### C18. A vague or inappropriate word choice obscures intended meaning

- **Basis:** Word/phrase precision; distinction from C02: this concerns the learner's expression, not demonstrated source-word interpretation.
- **Case:** “The law is good because the thing helps the people” leaves “thing” and the type of help unclear. HS version: the learner uses “legitimate” where their subsequent explanation may mean “legal.”
- **Identify:** Specify the unresolved meaning and plausible alternatives. Ask the learner what they intended. Do not mark an everyday word deficient when it communicates the necessary distinction.
- **Counterexample / uncertainty:** “The rule lets everyone use the park” is precise without specialized vocabulary. A technical term can be wrong, while a plain-language paraphrase is accurate.
- **Next move:** Ask what specific action, group, or meaning they have in mind. Offer vocabulary after the learner identifies the intended concept, or log conceptual help if it must be taught.
- **Limit:** Do not automatically replace the student's voice with formal academic wording.

### C19. Grammatical form does or does not obstruct meaning

- **Basis:** TELPAS annotated writing and scoring commentary; Coyne et al. and ERRANT as annotation-method references.
- **Case:** “Council reject plan. People angry because they wanted buses” is a required successful-meaning example. “Council rejected by people plan” leaves agency uncertain. HS responses can likewise be nuanced despite article, agreement, or verb-form errors.
- **Identify:** First assess whether the relevant proposition can be recovered. Only create a high-priority communication flag if meaning is materially affected. Explicit language-form goals can justify separate, low-priority feedback with a correct/acceptable alternative.
- **Counterexample / uncertainty:** Dialect, quoted language, casual chat, spelling variants, and intentional fragments require context. Model preference for formal style is not proof of error.
- **Next move:** Ask for intended meaning when necessary. An optional recast can teach form after the meaning is established, but it remains AI-produced text.
- **Limit:** Counted grammar errors are not an English-proficiency score or subject-understanding score.

### C20. Fragmentation, punctuation, or turn boundaries mislead the detector

- **Basis:** Proposed conversational safeguard; written-error methods do not automatically transfer to chat or ASR.
- **Case:** “Because it hurts people” is a complete conversational answer to “Why does it matter?” HS version: an argument is delivered in several short messages and wrongly judged incomplete sentence by sentence.
- **Identify:** Reassemble the relevant question–answer sequence, preserving original turn boundaries. Determine whether the communicative purpose is met. Mark unfinished or missing turns as input uncertainty.
- **Counterexample / uncertainty:** A genuine written sentence-boundary issue can obscure which clause modifies which claim, but chat fragments alone do not establish it.
- **Next move:** Wait for completion or ask a brief clarification of the ambiguous relationship. Do not turn response latency into a language rating.
- **Voice risk:** ASR-generated punctuation is a property of the transcription system, not evidence about the learner's writing. Preserve audio provenance if speech is later added.

### C21. The learner revises, repairs, or reports uncertainty

- **Basis:** Reading Conference Planning, comprehension monitoring; proposed conversation-state rule.
- **Case:** “I meant Glaucon, not Socrates.” HS version: “I said all residents, but the source only supports some.”
- **Identify:** Link the correction to the earlier claim; update the current interpretation while retaining history. Record self-repair as an observed strength. Distinguish a self-initiated correction from a response after the assistant supplied the answer.
- **Counterexample / uncertainty:** A revised position is not inconsistency to penalize. “Maybe” can express appropriate uncertainty rather than weak understanding. Do not erase unresolved conflicts without an explicit or clearly supported revision.
- **Next move:** Confirm the intended current statement if needed, then continue. Avoid forcing the learner to defend an abandoned answer.
- **Profile consequence:** An initial issue followed by successful repair should not remain an unqualified, persistent difficulty flag.

### C22. Assistance or copied wording is mistaken for independent evidence

- **Basis:** WIDA scaffolded-performance context; Reading Conference Planning, reading–writing connections; proposed evidence-provenance rule.
- **Case:** The assistant explains why the characters form an agreement, then the student repeats that explanation. HS version: a response uses a model-provided counterargument almost verbatim.
- **Identify:** Track which content was supplied, when, and by whom. Match known assistant/source wording and inspect semantic dependence. Overlap alone does not prove dependence, plagiarism, or lack of understanding.
- **Counterexample / uncertainty:** A student may quote deliberately and add their own analysis. They may have already stated the idea before help; preserve that independent evidence.
- **Next move:** Mark the later response as supported and invite application to a new context when appropriate. A successful transfer attempt is additional evidence, not immediate proof of general mastery.
- **Teacher wording:** “This explanation followed an AI example,” with both turns available. Do not hide useful learning because help occurred.

### C23. Multilingual expression is misread as confusion

- **Basis:** Reading Conference Planning, p.2, and Reading Observation Tool; reader-portrait guidance.
- **Case:** A student uses an English sentence with a home-language word for the relevant concept. HS version: a detailed explanation is given in another language after difficulty expressing it in English.
- **Identify:** Preserve the original. Determine whether competent interpretation is available; distinguish meaning uncertainty from absence of English production evidence. Do not invent an English translation and then grade it as student writing.
- **Counterexample / uncertainty:** Code-switching can communicate a clear idea. If the system cannot reliably interpret the language, use `language_interpretation_unavailable`, not `misconception`.
- **Next move:** Accept an accessible response route where the teacher permits it; obtain bilingual review when needed. Record translation tools and assistance.
- **Limit:** An accurate home-language explanation of an unchanged English source can support comprehension of that source, if interpretation is reliable and assistance is known. It provides no independent English-writing evidence and does not establish general English-reading proficiency. A translated or read-aloud source changes what reading evidence is available.

### C24. Input quality, speech, or access conditions prevent an inference

- **Basis:** Prior speech research in SOURCES S10 and subsequent speech findings; WIDA reader/conference tools; proposed input-quality gate.
- **Case:** A future transcript says “justice matters” when audio contains “justice doesn't matter.” A typed response is blank after a network failure. HS version: a speaker name is replaced by a common word, creating a false attribution.
- **Identify:** Check known system errors, turn completion, speaker identity, and transcript provenance. Where audio exists, offer replay/correction and inspect the disputed segment. An ASR confidence score alone cannot establish correctness.
- **Counterexample / uncertainty:** A long pause can be thinking time; fluent speech can still misinterpret a text. A correct read-aloud transcript does not establish comprehension.
- **Next move:** Repair the input or offer another response route before analyzing the alleged language issue.
- **Scope:** The text prototype cannot identify pronunciation, oral fluency, decoding, or listening proficiency. These need separate tasks, recordings, consent/workflows, and appropriate human evaluation.

### 5.1 Optional form-level detail under C19

This inventory is a proposed way to organize precise written-language feedback when the assignment has a relevant language objective. It must not become a mandatory correction list for humanities dialogue. Error-annotation research supplies useful category conventions; teacher review must determine what is actionable here. An acceptable alternate form is a required negative case for every category.

| Form to inspect | Original candidate / negative case | Identification boundary |
| --- | --- | --- |
| Subject–verb agreement | “The character want…” / a quoted dialect form | Verify subject and verb, variety, quotation, and goal; clear reasoning remains clear. |
| Tense/aspect | A past event is expressed with inconsistent forms / historical present | Compare the intended timeline; do not infer chronology from endings alone. |
| Number | “Several law” / a singular collective noun | Separate recoverable plurality from a consequential quantity ambiguity. |
| Articles/determiners | An omitted determiner / a valid generic or uncountable use | Context determines acceptability; an article count is not a language level. |
| Pronoun form | Unclear case or number / a referent clear from the previous turn | Separate form feedback from C10's meaning ambiguity. |
| Prepositions | A choice reverses a relation / another accepted variety's phrasing | Verify the intended spatial, temporal, or abstract relation. |
| Word order | Roles cannot be recovered / a purposeful rhetorical inversion | Do not rewrite simply to match one preferred style. |
| Verb patterns | An infinitive/gerund construction is ungrammatical / an alternative grammatical construction | Require a clear, meaning-preserving correction and appropriate objective. |
| Word formation | An adjective/noun form obscures meaning / an intelligible creative formation | Do not diagnose morphology from a typo or uncommon vocabulary. |
| Collocation | An expression creates a different meaning / an understandable less-frequent combination | Frequency alone does not establish error. |
| Spelling | An ambiguous word substitution / a harmless typo or named entity | Keep original text; any normalization must be reversible and visible. |
| Punctuation/sentence boundaries | A genuine typed ambiguity / a normal chat fragment or ASR punctuation | Apply only to the student's relevant written production. |

For implementation, a parser, spellchecker, or grammatical-error-correction system may suggest candidates. Require a contextual verifier to consider acceptable alternatives and meaning impact. A generated rewrite is not a gold-standard correction. ERRANT labels edits between an original and a correction; it does not independently establish that the proposed correction is warranted. [ERRANT paper](https://aclanthology.org/P17-1074.pdf), §§2–4.

## 6. Proposed identification procedure

### 6.1 Start with task opportunities

Before analyzing a student, record which cases the assignment can elicit. For the fixed Glaucon task, source attribution, actor/action relationships, the hypothetical condition, a stated position, and connections to the passage are plausible opportunities. Cross-document synthesis, narrative fluency, decoding, and pronunciation are not established opportunities.

Pre-review the source/task package with an educator:

- Immutable source spans and source provenance.
- Requested subject and language actions, with acceptable alternative interpretations.
- Essential distinctions, such as source position versus personal view.
- Known ambiguity, archaic wording, and context a learner has not been given.
- Supports available, and which supply conceptual content.

Do not hard-code a preferred philosophical stance or turn the teacher's example answer into the only acceptable response.

### 6.2 Identify from existing evidence, then add profile context

**Proposed pipeline, not Socra's inspected internal architecture:**

1. **Validate the input.** Detect blank/failed submissions, truncated history, unsupported modality, and known transcript issues. These get an input status, not a learner-difficulty label.
2. **Extract candidate observations.** Give the detector the task, source, relevant conversation, and assistance events. In the first experimental condition, withhold proficiency levels so the model must ground observations in the response. Extract strengths as well as concerns.
3. **Check the candidate.** Verify exact span provenance, source relevance, task opportunity, preceding clarification, and already-provided help. Evaluate the case's counterexample rules. A second model call may help, but it is not independent educational validation.
4. **Preserve unresolved meaning.** Inspect any clarification or repair already present in the transcript. If it does not resolve the issue, retain `clarification_needed` or `insufficient_evidence`; display the former as “Meaning unclear” to the teacher. This is an evidence status, not an instruction to generate a question. The initial detector sends no follow-up to the student.
5. **Consult the learner context.** Retrieve the correct grade-band, framework edition, and domain guidance to contextualize the teacher-facing observation. Unknown scores remain unknown. Support selection and trials are a later extension, not required for initial identification.
6. **Present a reviewable annotation.** Quote exactly, describe the observed pattern in ordinary language, show the relevant source and assistance, and offer confirm/edit/dismiss controls.
7. **Update the observation history.** Record repairs, successful later uses, and teacher decisions. Preserve the previous observation as history, not as a permanent learner identity.

This staged approach is a hypothesis to compare with a profile-aware detector. It is not a claim that proficiency never helps detection. Test both: context may help interpret a response, but it must not manufacture evidence or erase demonstrated understanding.

### 6.3 Evidence requirements by method

| Method | Appropriate use | Failure to test |
| --- | --- | --- |
| Exact span/string checks | Confirm a quotation exists in the supplied turn/source | Exact presence does not establish interpretation or relevance. |
| Coreference candidates | Identify unresolved “he,” “they,” “this” | Missing context, implicit references, and speaker changes. |
| Proposition/role comparison | Compare who did what, polarity, quantity, conditions | The model may parse both source and response incorrectly. |
| Source-grounded semantic comparison | Compare paraphrase and attributed claims | Entailment models can reject valid interpretations or accept fluent errors. |
| Discourse/argument representation | Track claim, evidence, relation, objection, and revision | A relation may be implicit, distributed across turns, or prompted by the assistant. |
| Grammar candidate analysis | Offer specific form feedback when relevant | Standard-variety bias, unnecessary edits, and loss of student meaning. |
| Clarification dialogue, future extension | Obtain intended meaning before interpretation; initially only inspect clarification already in the transcript | The question can cue the answer or pressure a change. |
| Supported retry, future extension | Initially inspect existing supported responses; later investigate offering help | Improvement is not proof of the original cause or independent mastery. |
| Cross-assignment review | Investigate recurrence and successful transfer | Different task demands and supports make raw counts incomparable. |

Do not use the LLM's self-reported confidence as a calibrated probability. If numeric confidence is later shown, calibrate it against an appropriately held-out, educator-reviewed set. For the initial demo, evidence statuses are clearer.

### 6.4 Minimal annotation record

This is a proposed contract for a future spec, not a new implemented database. It preserves the distinction between observation and cause.

```json
{
  "case_id": "C10",
  "task_id": "glaucon-justice-v1",
  "student_turn_id": "turn-7",
  "student_quote": "He disagrees with him.",
  "source_span_ids": [],
  "context_turn_ids": ["turn-5", "turn-6"],
  "status": "clarification_needed",
  "observation": "The two people referred to are not clear from this exchange.",
  "domain_of_evidence": "written_expression",
  "source_presentation": "english_print",
  "response_mode": "typed_english",
  "interpretation_target": "clarity_of_reference_in_student_explanation",
  "reading_inference": "unresolved",
  "cause": "undetermined",
  "alternatives": ["unclear wording", "intended reference not yet expressed"],
  "assistance_event_ids": ["help-2-question-repeat"],
  "framework_reference": {
    "edition": "WIDA-2020",
    "grade_band": "9-12",
    "locator": "Expressive PLDs, cohesion; full framework printed p.212"
  },
  "proficiency_record_id": null,
  "teacher_review": "pending"
}
```

The illustrative event `help-2-question-repeat` records a verbatim question repeat before turn 7. Production code should validate that quotations, assistance events, and referenced turns exist and preserve character spans using a defined indexing convention. Multiple noncontiguous pieces must remain separate spans, not a stitched quotation. Source-derived claims require source spans; learner-expression observations may require only conversation context. Include model/prompt/rule versions in internal provenance. Keep that technical metadata out of the ordinary teacher flow.

### 6.5 Support choices and their evidence consequences

These are future support-design options. In the initial identification-only feature, record assistance already present; do not initiate these actions to complete a diagnosis.

| Support family | When it could help | What must remain visible |
| --- | --- | --- |
| Repeat, pause, finish, privacy boundary | Access, processing time, autonomy | Requests are not misconceptions. |
| Chunked instructions or passage display | Navigating a dense request or source | Preserve wording and ordering; do not call it proof of a memory/reading diagnosis. |
| Contextual glossary | A word blocks access | Definition scope and whether it supplied a conceptual distinction. |
| Student-owned organizer | Separating source/my view, events, claim/evidence | Who filled each field; an empty organizer and a completed one provide different help. |
| Sentence frame or starter | Expressing an already-owned relationship | Whether the frame selected a causal/contrastive relation or stance for the learner. |
| Paraphrase/translation/read-aloud | Access to content | Original, translation/version, mode, and supplied interpretation. Read-aloud changes unaided reading conditions. |
| Worked example or explanation | Teaching the concept or strategy | Subsequent work is supported; teaching is useful and need not be universally deferred. |
| New-context application | Investigating use after help | New task demands, remaining help, and whether the learner produces the relationship themselves. |

The question is not whether support is always permissible or always contaminating. The teacher needs to know what the learner demonstrated under which conditions. This follows Deniz's revised emphasis on useful instruction with visible assistance.

## 7. Teacher transcript, learner profile, and class view

### 7.1 What the teacher should see first

**Proposed transcript card**

> **Reference needs clarification**
>
> Student: “He disagrees with him.”
>
> Glaucon and Socrates were both discussed. This response does not make clear which person the student means. Reading understanding cannot yet be determined from this turn.
>
> Status: meaning unclear from the available conversation. No reading-difficulty conclusion is supported.
>
> Help already given: question repeated. Review: pending.

Actions: confirm the observation, edit its label, dismiss it, or view the surrounding exchange. If the student resolves it, show the repair alongside the original rather than leaving a warning badge without context.

### 7.2 What belongs in a learner profile

Keep the official proficiency record separate from classroom observations. A profile can summarize:

- Demonstrated language strengths, with examples.
- Teacher-confirmed observations that recur across meaningful opportunities.
- Resolved observations and successful self-repair.
- Support requested, support supplied, and work demonstrated afterward.
- Current language goals selected by the teacher.
- Evidence gaps, including tasks that did not elicit a skill.

A single ambiguous answer is a transcript event, not a permanent learner characteristic. The minimum recurrence and comparability rules need teacher review; no research-backed universal count was found. A later correct response is also evidence and must not be lost in a cumulative error total.

This strengths-and-context design is consistent with [WIDA's Reader Portrait](https://wida.wisc.edu/sites/default/files/resource/Reading-Creating-Reader-Portrait.pdf), p.1. Our aggregation rules still require empirical evaluation.

### 7.3 Class cards

Prefer “Source attribution needed clarification in this assignment” over “Students with reading misconceptions.” Count unique students separately from instances. Show the time window, number of students with an eligible response opportunity, review status, and examples. Clarifications resolved during dialogue should be distinguishable from unresolved ones.

Do not compare classrooms or proficiency groups using raw flag counts. More conversation, harder tasks, or more opportunities can produce more flags. Do not describe a decline in flags as language growth without comparable evidence.

## 8. How to test whether this actually works

### 8.1 Build an evidence set before claiming accuracy

The 24 cards are authored research cases, not 24 passed tests. The earlier demo's 17 scenarios tested a different support-policy experiment and cannot validate this detector.

Proposed sequence:

1. **Teacher definition review:** an EL educator and humanities educator examine each candidate's usefulness, exact wording, alternative interpretations, and negative cases. Remove labels they cannot apply reliably.
2. **Development cases:** create complete original transcripts from the cards. Include genuine ambiguity, explicit mismatch, successful use, self-repair, and missing-opportunity cases. Synthetic examples test logic, not prevalence or educational validity.
3. **Authentic pilot cases:** obtain appropriately de-identified student work through Deniz and participating teachers, retaining necessary task and support context. Do not guess a student's official level from the writing.
4. **Independent annotation:** educators first label observations without seeing the model output or supplied proficiency level, while retaining task, grade, source, and support context. Then reveal the proficiency record for separate support-planning judgments. Discuss disagreements to improve the guide, while retaining a held-out set that was not used to tune it. Allow multiple defensible interpretations.
5. **Held-out evaluation:** separate by student and, where possible, assignment/source. Variants of one synthetic example must not appear on both sides as supposedly independent evidence.
6. **Teacher workflow test:** measure whether annotations are accurate, useful, understandable, and quick enough to review. Accuracy alone does not establish product value.

### 8.2 Cover every grade band and level honestly

Use a coverage matrix: grades 6–8 / 9–12 × recorded levels 1–6 × relevant domain × case family × outcome type × support condition. Keep unknown records and mixed-domain profiles as explicit additional conditions. Record actual grade within each band.

Not every combination is immediately available or pedagogically meaningful. Do not manufacture authentic level-6 EL records, assign synthetic utterances real proficiency labels, or claim coverage from changing a dropdown alone. A synthetic counterfactual profile test and a real sample from a student with that record are different evidence.

For each of the first three implemented patterns, start with both grade-band variants and these conditions: clear difficulty, clear success, ambiguity, missing context, repaired response, and assistant-supplied content. That is a proposed design matrix, not a completed dataset or a sufficient sample-size claim. Expand authentic coverage before asserting all-level performance.

### 8.3 Comparators

For offline annotation, keep the model, complete transcripts, source/task, grade, and domain definitions fixed when comparing:

- **A:** a generic “identify language problems” prompt.
- **B:** explicit case definitions, source grounding, negative rules, and evidence validation, without proficiency context in initial detection.
- **C:** method B with the existing domain proficiency record additionally available during detection. Keep other inputs unchanged.
- **D:** method B followed by profile-informed support selection, compared with the same support selector without that proficiency record.

Compare observation quality and support usefulness separately. A versus B evaluates the full proposed package, not the isolated effect of WIDA: it changes definitions, grounding, and validation together. B versus C isolates supplied proficiency context. The paired D conditions test its value for support selection. Isolating framework references themselves would require another controlled ablation. A model-generated judge can assist triage but is not the sole reference for educational correctness.

Interactive follow-up evaluation is a future phase, outside the initial identification-only scope. Different questions change students' opportunities and assistance. Do not attach one prerecorded continuation to incompatible prompts and call that a controlled dialogue comparison. Scripted branches can test software logic; authentic interactive comparisons need appropriate task assignment and educator-reviewed outcomes.

### 8.4 Required counterfactual and adversarial checks

- Same meaning in limited and polished English: subject evidence should remain consistent.
- Same response with only supplied level changed: no invented quotation, nonexistent issue, or disappearance of demonstrated meaning.
- Same response with unknown proficiency: observation should remain possible; support rationale should acknowledge missing context.
- Fluent source misconception versus grammatically imperfect accurate reading.
- Valid disagreement with the passage versus inaccurate source attribution.
- Clear reference in prior turns versus identical isolated ambiguous sentence.
- Correction after a neutral clarification versus repetition after a supplied answer.
- Home-language or mixed-language content versus inability of the model to interpret it.
- Missing task opportunity versus an actual expressed mismatch.
- Student text attempting to change detector instructions: preserve the evidence contract.
- Unsupported model output, provider failure, and invalid JSON: report a technical failure, never a student difficulty.
- For future speech, matched audio/manual transcript/ASR transcript: attribute disagreements to the right stage.

### 8.5 Metrics and acceptance decisions

| Measure | What to report |
| --- | --- |
| Flag precision | Of surfaced observations, how many educators judge supported? Include counts and uncertainty. |
| Recall | Of educator-labeled observable cases, how many were found? Count abstentions as missed detection where an actual positive was observable. |
| Abstention | How often the system declines, and whether those cases genuinely lack evidence. |
| Evidence grounding | Exact quotations, correct source links, and no invented assistance history. |
| Category agreement | Per-case-family performance, not only a pooled average dominated by easy grammar. |
| Alternative interpretations | False rejection of defensible readings; incorrect causal labels. |
| Profile sensitivity | Whether adding/changing proficiency context improves or distorts observations and support. |
| Repair handling | Whether resolved issues update correctly and support-dependent responses retain provenance. |
| Teacher usefulness | Confirmation/dismissal rate, review time, duplicate burden, and whether a next action is clear. |
| Group coverage | Grade band, actual grade, domain level, support condition, modality; disclose sparse cells. |

Set release thresholds with Deniz and educators after the pilot exposes the cost of errors. A zero-invalid-quotation development check can be enforced in code; it is not evidence that every interpretation is right. No numerical accuracy, fairness, or learning-effect claim is established here.

Report educator agreement before adjudication and disclose genuinely unresolved cases. A deliberately balanced challenge set does not estimate classroom prevalence or deployment precision. Add a representative stream of eligible conversations before making those claims. Multiple turns from one student and variants of one case are correlated; report unique students/tasks and use uncertainty estimates that account for that grouping.

To test whether a support improves learning, a separate study needs an appropriate comparator, learning outcomes beyond the assisted answer, and attention to exposure, prior knowledge, teacher instruction, and selection effects. Teacher preference and a successful demo are insufficient.

## 9. What the evidence supports, and where it stops

| Source | Evidence inspected | Useful conclusion and important limitation |
| --- | --- | --- |
| WIDA 2020 framework and Language Charts | Secondary-grade tables, humanities expectations, uses/limits; tables visually checked | Pedagogical reference for task language and development. No validated Socra classifier or level-specific error prevalence. |
| WIDA reading tools | Complete observation and conference tools; reader-portrait prompts | Practical evidence-collection structure. Classroom guidance, not a diagnostic validation study. |
| TELPAS writing guides | Actual de-identified responses and official scoring annotations | Concrete examples of meaning and form diverging. Selected responses, item scores, and Texas conditions do not establish WIDA levels or prevalence. |
| TELPAS reading rationales | Authored explanations of correct and incorrect alternatives across secondary grades | Concrete candidate distinctions for reading cases. They do not show which students selected an option or why. |
| Coyne et al., 2025 | §§3.2–4.1; 456 EXPECT instances across CEFR A1–C2, two coauthor annotators, iterative guidelines | Annotation design and span disagreement matter. Feedback experiments received correct upstream labels; they do not validate automatic detection or learning gains. |
| Mizumoto, 2025 | “Evaluation of the tool's performance” and limitations; 100 Japanese university EFL essays, expert comparison | Reported micro-F1 .95 supports feasibility in that setting. Different age, genre, language backgrounds, model, and categories; raters trained with model-analyzed examples. No transfer guarantee or learning outcome. |
| Reed et al., 2016 | Methods, regression results, limitations; 2,813 Florida students in grades 6–10, 14% classified as EL | Vocabulary/form measures relate to comprehension. Archival correlations, incomplete language-background/proficiency information, and proxy measures cannot diagnose an individual's cause from chat. |
| ERRANT, 2017 | §§2–4, edit extraction/classification and evaluation | Useful editing taxonomy/evaluation machinery. Requires original/corrected text pairs; edit agreement is not comprehension detection. |
| BEA-2019 | Dataset/method descriptions and Appendix A.2 | Performance varies by error type and learner proficiency. CEFR/corpus results cannot be relabeled as WIDA or contemporary conversational performance. |
| IES English-learner guide, 2014 | Recommendations and evidence ratings, previously reviewed S09 | Supports vocabulary and integrated language/content instruction in K–8. Package-level evidence does not establish each scaffold's isolated effect or direct high-school/chat transfer. |

Primary empirical links: [Coyne et al.](https://arxiv.org/html/2508.06810v1), [Mizumoto](https://doi.org/10.1017/S0272263125100934), [Reed et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4905721/), [ERRANT](https://aclanthology.org/P17-1074.pdf), [BEA-2019](https://aclanthology.org/W19-4406.pdf). Detailed source locators and reading coverage are recorded in SOURCES.md.

**No source reviewed supplies the complete missing link:** a validated Illinois middle/high-school conversational system that detects all these patterns across all six WIDA levels. The contribution of this research is a traceable proposal for testing that link.

## 10. What to build first from the broad research

The broad catalog should prevent blind spots. It should not force implementation of every category at once.

1. **C10, unresolved reference:** a narrow, observable issue with strong negative cases. Read existing repairs; otherwise show uncertainty without generating a follow-up.
2. **C11, attribution:** directly relevant to distinguishing Glaucon's presented account from the student's position. Use tentative statuses when attribution is missing.
3. **C06/C07, relation and scope:** useful for the task's hypothetical; requires careful source review and resistance to leading questions.
4. **C19/C20/C21/C22 as mandatory safeguards:** preserve reasoning in imperfect English, interpret whole exchanges, track repairs, and retain assistance history.
5. Add C15, evidence connections, after teacher review of what the task actually demands. Keep literary intent, credibility, and broad organization labels in research until their annotation rules prove usable.

Before a class dashboard, demonstrate that a teacher can inspect one annotation, understand its evidence, and correct it. Before an all-level claim, show authentic coverage and error analysis across those levels. No new production integration is assumed.

## 11. Decisions and examples to request from Deniz and EL teachers

1. Does the distinction between observation, possible explanation, and support match how teachers would use these annotations?
2. Which three cases would change a teacher's next action in an actual humanities lesson?
3. Which annotations should appear immediately, and which should wait for a clarification or teacher review?
4. What grade-appropriate fixed passage/task should anchor middle-school review? Keep the current demo objective unchanged until an explicit revision is agreed.
5. Which current and historical domain-score records can teachers actually supply? Who confirms score/chart applicability?
6. What examples show clear understanding in imperfect English, and fluent expression with a source misconception?
7. What amount of recurrence warrants a profile note, and how should later success or repair update it?
8. Which supports are useful for each case, and how should supplied reasoning appear in the report?
9. Can Deniz supply de-identified task-plus-transcript examples with grade, available domain records, and assistance context? Start with cases the published sources cannot resolve.
10. What review time and false-positive burden would make the feature useful or unusable?

**Research status:** Illinois chosen by the user; middle/high school and all six levels covered as a research scope. The case rules, level-context experiments, and teacher workflow are proposals. Educator agreement, empirical detector performance, and student outcomes remain to be established.

## 12. Broader source coverage and what it changes

This review deliberately combines standards, educator observation tools, published examples, instructional studies, and NLP research. No one source supplies all of these. “All helpful sources” is treated as a broad search across those evidence types, not a claim that every publication has been located or read cover to cover. Selected sections and limitations are recorded in the shared source log.

### 12.1 Concrete reading distinctions from official assessment rationales

| Source | Inspected locators | Contribution to our cases |
| --- | --- | --- |
| [TELPAS 2025 grades 6–7 rationales](https://tea.texas.gov/data-reports/telpas/2025-telpas-6-7-reading-and-writing-rationale.pdf) | Items/pages 21, 22, 26, 28, 32, 35 | Event order, humor, evidence for emotion, confused event locations, main idea, summary. |
| [TELPAS 2025 grades 8–9 rationales](https://tea.texas.gov/data-reports/telpas/2025-telpas-8-9-reading-and-writing-rationale.pdf) | Items/pages 21, 24, 25, 30, 33 | Perspective, contextual reference, summary, overgeneralization, organization. |
| [TELPAS 2025 grades 10–12 rationales](https://tea.texas.gov/data-reports/telpas/2025-telpas-10-12-reading-and-writing-rationale.pdf) | Items/pages 6, 8, 29, 30, 31 | Concession, cause/time, wrong-character context, sequence, evidence relevance. |

These are authored explanations of alternatives. They are particularly useful for designing a wrong reading and a close counterexample. They contain no population denominator or WIDA-level frequency estimate. The examples in this document were written independently; the released test bank is not proposed as our product's training corpus.

### 12.2 Writing and speaking examples that prevent overcorrection

The [TELPAS 2025 grades 10–12 writing guide](https://tea.texas.gov/data-reports/telpas/2025-telpas-10-12-writing-scoring-guide.pdf), p.2, explicitly identifies actual de-identified administered responses. Selected annotations on pp.22, 26, and 33 distinguish elaboration and comprehensibility from surface form. They strengthen C15/C19 counterexamples. The guide's item scores do not assign an individual WIDA level.

The [ELPAC grades 6–8](https://www.caaspp-elpac.org/s/docs/ELPACPT.G6-8.LSRW.SG.pdf), [grades 9–10](https://www.caaspp-elpac.org/s/docs/ELPACPT.G9-10.LSRW.SG.pdf), and [grades 11–12](https://www.caaspp-elpac.org/s/docs/ELPACPT.G11-12.LSRW.SG.pdf) guides add published response anchors. Relevant printed/PDF locators are 6–8: 13/15, 35/37, 37–39/39–41; 9–10: 12–13/14–15, 35/37, 37–39/39–41; 11–12: 13/15, 35/37, 37–39/39–41. Their introductions did not establish every anchor's collection/editing provenance, so we do not describe them as a raw learner corpus.

Design consequences from these anchors:

- Preserve meaningful explanations despite spelling errors, fillers, or short clauses.
- Accept supported competing positions; a preferred opinion is not a language criterion.
- Keep supplied organizers and examiner prompts with the response. Do not strip away assistance context when creating an evaluation example.
- A language-task score does not validate every content assumption in an argument.
- Do not import an essay-length requirement or a no-English scoring rule into a humanities conversation with different goals.

### 12.3 Instructional guidance and an original humanities experiment

| Source | Reading coverage | Implication and transfer limit |
| --- | --- | --- |
| [IES English-learner guide, 2014](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/english_learners_pg_040114.pdf) | Printed pp.4–7 and 59–62; PDF pp.11–14 and 66–69, plus earlier S09 sections | Distinguishes foundational reading and comprehension needs; supports further educator assessment. K–8 guidance is not an automated diagnostic rule or direct high-school evidence. |
| [IES reading interventions grades 4–9, 2022](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/WWC-practice-guide-reading-intervention-full-text.pdf) | Printed pp.21–25, 44–45, 59–61; PDF pp.28–32, 51–52, 66–68 | Explicitly addresses word/background knowledge, question wording, pronoun reference, and monitoring/repair. General struggling-reader intervention evidence, not an EL-specific six-level detector. |
| [IES adolescent literacy guide, 2008](https://ies.ed.gov/ncee/wwc/docs/practiceguide/adlit_pg_082608.pdf) | Printed pp.7–8, 16–17, 21–22, 31–33; PDF pp.13–14, 22–23, 27–28, 37–39 | Vocabulary/comprehension instruction and text discussion inform support design. Discussion studies include design and outcome limitations; human classroom effects do not prove AI-dialogue effects. |
| [Vaughn et al., 2009](https://meadowscenter.org/wp-content/uploads/2022/04/JREE-Vaughn-20091.pdf) | Methods printed pp.303–305, measures 309–310, discussion/limitations 318–320 | Two seventh-grade Texas social-studies experiments, 381/507 students including 97/106 ELs, randomized sections. A 12-week multicomponent package improved curriculum-linked outcomes. Components cannot be isolated; generalized vocabulary transfer and maintenance were not established. Written responses may underrepresent content comprehension. |

These sources strengthen a key design choice: keep vocabulary, background knowledge, source interpretation, and expression as competing explanations until adequate evidence distinguishes them. The report can show which support helped on a task without claiming to have diagnosed the learner.

### 12.4 Responsive support and learner variation

The [WIDA Implementation Guide](https://wida.wisc.edu/sites/default/files/resource/Implementation-Guide-WIDA-ELD-Standards-Framework.pdf), pp.21–22 and 67, provides a planning model and high-school social-studies vignette involving responsive scaffolding. It motivates a proposed sequence: clarify the observed issue, provide appropriate support, inspect the response, then seek a later opportunity with less help. It is practice guidance, not evidence that this exact AI sequence works.

Additional context comes from [WIDA's reading guidance](https://wida.wisc.edu/news/answering-your-questions-multilingual-learners-and-science-reading), [its long-term EL discussion](https://wida.wisc.edu/news/reframing-how-we-think-about-our-long-term-english-learners-ltels), [ISBE guidance for ELs with IEPs](https://www.isbe.net/Pages/EL-IEPs.aspx), and the [WIDA disability-identification bulletin](https://wida.wisc.edu/sites/default/files/resource/FocusBulletin-Identifying-Multilingual-Learners-Specific-Learning-Disabilities.pdf), updated June 2025, selected pp.6–8 and 10–11. They reinforce attention to access, multiple evidence sources, and learner strengths. Socra should neither infer disability from language use nor assume all difficulties are explained by EL status. No diagnostic or sensitive-background questionnaire is proposed.

### 12.5 What we deliberately do not import

- WIDA ACCESS/Screener/MODEL sample and practice items: the [official practice page](https://wida.wisc.edu/assess/access/practice) prohibits providing them to AI systems. These were not used as an AI corpus in this review. Instructional standards publications are distinct resources.
- TELPAS/ELPAC scoring scales as WIDA conversions, or CEFR corpus levels as Illinois records.
- Vendor efficacy claims as proof of educational validity. Medley remains a support-design reference; Microsoft remains an engineering-behavior reference. Neither supplies the official Illinois observation taxonomy.
- A generic grammatical-error count as a reading or humanities score.
- A bibliography as proof of product implementation or validation.

**What remains unavailable:** a representative Illinois corpus spanning both grade bands and six recorded domain levels, validated level-specific error prevalence, agreed teacher labels for the new categories, and evidence of Socra's performance or learning effects. The research makes those gaps explicit so the next prototype can test them.
