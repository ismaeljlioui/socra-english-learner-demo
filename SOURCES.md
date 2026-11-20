# Research source and evidence log

Initial leads were collected on 2026-10-29. First substantive review: 2026-11-04. Review coverage and limitations are recorded below; this is not a completed literature review or independent verification of product behavior. Current synthesis: `EL_SUPPORT_RESEARCH.md`; product-specific detail: `MEDLEY_RESEARCH.md`.

| ID | Source | Type and relevance | Evidence boundary / next check |
| --- | --- | --- | --- |
| S01 | [Socra](https://www.socraeducation.com/) | Company description of conversational assessment and visible reasoning. | Public positioning does not establish internal implementation or validated assessment performance. |
| S02 | [Medley product overview](https://www.medleylearning.com/) | Vendor descriptions of language scaffolds and teacher controls. | Verify behavior through available demonstrations; distinguish available features from roadmap claims. |
| S03 | [Medley FAQ](https://www.medleylearning.com/faqs) | Vendor explanation of proficiency alignment, AI use, and controls. | High-level functional description; does not establish model, prompts, training, or orchestration. |
| S04 | [Medley research](https://www.medleylearning.com/research) | Bibliography and pedagogical rationale. | Retrieve and critique underlying sources. Citations do not validate the product. |
| S05 | [Medley impact](https://www.medleylearning.com/impact) | Vendor-reported school implementation outcomes. | Examine sample, comparison, baseline differences, and co-interventions. Page acknowledges usage associations do not establish causation. |
| S06 | [WIDA: Proficiency Level Descriptors and scaffolding](https://wida.wisc.edu/resources/resource-snapshot/wida-proficiency-level-descriptors-informing-expectations-and) | Framework guidance relevant to differentiated language support. | Instructional guidance is not validation of automated spoken assessment; inspect task and domain applicability. |
| S07 | [IES: Teaching Academic Content and Literacy to English Learners](https://ies.ed.gov/ncee/WWC/PracticeGuide/19/Published) | Evidence-rated practice guide for elementary and middle school instruction. | Read underlying recommendations and studies; do not generalize to all ages, voice interfaces, or assessment conditions. |
| S08 | [Microsoft education AI application card](https://learn.microsoft.com/en-us/microsoft-365/education/guide/1-reference/microsoft-365-education-ai-application-card) | Official descriptions of education capabilities, intended uses, and models. | Confirm which capability the supervisor intended. Separate tutoring from assessment and documented architecture from inference. |
| S09 | [Baker et al., IES full practice guide (2014)](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/english_learners_pg_040114.pdf) | Full report behind S07; selected sections reviewed. | Instructional interventions do not directly validate assessment supports. |
| S10 | [Knill et al. (2020), non-native children's ASR](https://www.isca-archive.org/interspeech_2020/knill20_interspeech.pdf) | Original technical study; abstract and §§1–2 reviewed. | Historical systems and restricted population; benchmark exclusions matter. |
| S11 | [Young et al. (2014), linguistic modification](https://doi.org/10.1002/ets2.12023) | Original assessment research; abstract, Study 1 methods/results and Study 2 participant criteria reviewed. | Mixed effects; written fixed items, not generated dialogue. |
| S12 | [Sato et al. (2010), math item modification](https://files.eric.ed.gov/fulltext/ED510556.pdf) | Original randomized study; methods/results reviewed with independent critique. | Outcome interpretation varies with scoring method. |
| S13 | [Wolf et al., accommodation study](https://doi.org/10.1080/10627197.2021.1982693) | Original study; indexed abstract reviewed by critique agent. [ETS metadata](https://www.ets.org/research/policy_research_reports/publications/article/2021/kdol.html). | Publisher full text returned 403; detailed methods remain unreviewed. |

## Evidence notes — 2026-11-04

### S02–S04: Product documentation

Reviewed product feature sections, FAQ questions on AI/proficiency/teacher use, and research bibliography. Classify feature descriptions as vendor claims. No authenticated use or successful video inspection: the linked [May 2025 overview](https://www.youtube.com/watch?v=W4NCBQyobd8) could not be retrieved. Internal selection logic and implementation remain unknown. S04 is a route to sources, not a product-efficacy study.

### S05: Vendor implementation case

Locators: “The Results,” “The Taunton Context,” “Success in Implementation.” Martin Middle School, 2025–26. Reports 163% and 139% of expected annual reading and math growth; these are not test-score percentage increases. The body specifies that 76% improved ACCESS reading proficiency. Usage groups are observational; the page explicitly disclaims causation. Analytic sample counts, baseline equivalence, attrition, uncertainty intervals, and adjustment methods are not reported on the page. Staffing and curriculum investments accompanied implementation. Motivation and exposure are possible confounders, not established explanations. Does not establish comparison against competing products or conversational assessment validity.

### S06: Framework guidance

Locators: “What are Proficiency Level Descriptors?” and “Inform Differentiated Scaffolding.” Snapshot released November 2023, despite Medley's 2020 citation for this title; verify edition before formal citation. Guidance suggests using assessment scores alongside language samples and other artifacts. Implication: consider domain-specific evidence and teacher input. It provides no validated automatic proficiency inference or scaffold-fading rule.

### S09: Instructional evidence synthesis

Printed pp. 5, 7, 50–51, 92–94; PDF pages 12, 14, 57–58, 99–101. Vocabulary and integrated content/language instruction receive strong ratings; structured writing receives minimal evidence. Appendix D describes two writing studies with differing results. Sentence starters are components of broader instruction, not isolated treatment effects. The guide's general scope is K–8; one contributing writing study includes grades 6–12. Implication: use the practices as design candidates; their independent effects and transfer to speech assessment remain unestablished. This pass did not independently read all underlying study reports.

### S10: Speech recognition benchmark

Locators: abstract and §§1–2, printed pp. 255–256. Italian schoolchildren aged 9–16, English examination speech; 49 hours training and 2.3 hours held-out evaluation. Compared ASR configurations; best combined system reports 15.7% word error rate. Scoring removes disfluencies, non-speech events, and code-switched words. This is neither a current-model error estimate nor a measure of subject-assessment accuracy. Proposed implication: evaluate meaning-critical errors and permitted multilingual content explicitly, and separate recognition failures from scoring failures.

### S11: Mixed assessment outcomes

Locators: Study 1 “Research Methods,” “Analyses and Results,” “Discussion”; Study 2 “Participants.” 2,060 fourth/sixth graders, including 932 ELs; 120 math/science items with original and modified versions distributed through counterbalanced forms. Content experts reviewed modifications. ELs did better on modified versions of 48 items and original versions of 41; these counts are descriptive, not counts of statistically significant effects. Multiple edits per item complicate attributing effects. The cognitive-interview follow-up targeted Spanish-speaking intermediate-proficiency learners and excluded some unable to participate in English. Proposed implication: review and test variants individually; do not generalize to beginners, all languages, or spoken interaction.

### S12: Randomized accommodation precedent

Locators: study design printed pp. 13–14; results pp. 40–44; limitations pp. 54–55. Grade 7–8 students received original or modified 25-item multiple-choice math tests. Development included expert review, cognitive interviews, and piloting. The item-set-by-subgroup interaction was significant under the one-parameter IRT scoring model but not raw scores or two-/three-parameter models. This qualifies the favorable result. Sample figures differ by recruitment/analysis stage and are not summarized here. Proposed implication: borrow the review-and-test process; do not transfer fixed written-item results directly to generative oral assessment or interpret score changes as learning gains.

### S13: Later study, limited access

Locator: indexed publisher abstract; ETS publication record confirms identity. Reports a randomized computer-based math study of 513 ninth-graders (189 ELs, 324 non-ELs) and no statistically significant accommodation effects for linguistic modification/glossary conditions. Abstract-only finding: do not infer zero effect, adequate statistical power, or specific mechanisms. Retrieve full text before detailed appraisal. Publication appeared online in 2021; journal volume 27 issue 1 is associated with 2022, while ETS metadata labels 2021.

## Access and next-source gaps

- S01 was subsequently reviewed on 2026-11-05; see product clarification below. S08 Microsoft was reviewed in the broader follow-up below.
- WestEd's [De-Mystifying Complex Texts landing page](https://www.wested.org/resource/demystifying-complex-texts/) identifies copyright 2017; Medley's bibliography lists 2021. The linked NYSED PDF failed retrieval. No full-text conclusions are attributed to it here.
- Obtain actual Medley scaffold examples and clarify whether its claimed fading is teacher-driven, score-driven, or interaction-driven.
- Follow up on current speech-model evaluations, relevant WIDA grade bands, home-language support, and conversational assessment frameworks after selecting the initial learner/task context.

## Format for substantive evidence notes

### Support provenance clarification — 2026-11-15

Reopened S02 feature sections (on-demand definitions and response supports), S16 “Assessing Variable Learners” / construct discussion, S17 “A Framework for Oral Language” / “Productive Talk,” S06 scaffolding guidance, and S12 full report. These support a rationale, not efficacy claims for the demo. S11 publisher access failed again; S18 direct PDF fetch timed out, so neither was newly reverified.

- Glossary requests have a direct product precedent in S02; the two selected terms, definitions, allowlist, and assistance logging are our design choices.
- Repeat-question is our access-design adaptation of S16, not a prescribed button or tested intervention in that source. Predefined question clarification is informed by the reviewed linguistic-modification work (S11–S12); our wording has not received educator validation.
- Thinking time is informed by S16's discussion of response-time pressure and S17's guidance against interrupting formulation. The exact no-countdown/request behavior is our implementation.
- Hypothetical participation is our task-specific boundary on personal disclosure; no direct empirical source for this particular feature was identified in the reviewed material.
- Inviting an initial thought is our elicitation design, informed by S17's emphasis on student-controlled meaning. It is not equivalent to Medley's sentence frames.
- Deferring concept help and freezing pre-help evidence are proposed assessment-policy choices informed by the project aim and S18/S23, not an established requirement to withhold definitions of justice. Unmet access needs remain a limitation.
- WIDA informs analysis of language demands, while Microsoft informs behavior configuration and multi-turn evaluation; neither supplies the exact eight-option menu.

Add a short entry when a source materially informs a decision:

- **Source ID, accessed date, and page/section:**
- **Claim examined:**
- **What the source actually establishes:**
- **Evidence type:** vendor statement / framework guidance / empirical study / other.
- **For studies:** population, sample, setting, intervention, comparator, outcomes, and methods.
- **Limitations and alternative explanations:**
- **Relevance to Socra and transfer limitations:**
- **Implication:** supported finding / tentative proposal / unresolved question.

Use paraphrases and short necessary quotations. Record conflicting evidence as well as supportive findings. Research conclusions and product choices should cite these source IDs and direct sources.

## Broader review — 2026-11-04

The following sources extend the Medley starting point. Conceptual guidance, vendor documentation, and empirical findings have different evidentiary roles. Current cross-source synthesis: [EL_SUPPORT_RESEARCH.md](EL_SUPPORT_RESEARCH.md).

### S08: Microsoft application card — substantive follow-up

URL in table above. Inspected §§3–9. Official vendor documentation: Study and Learn is a Copilot declarative agent using service-selected models; Speaker Progress uses speech → transcript → generated feedback, with educator review. Practice/coaching intended uses explicitly exclude definitive assessment and Study and Learn assessment of learner understanding. Exact model versions, internal prompts, and evaluation scores are undisclosed. Do not attribute Learning Zone's cloud/Phi Silica architecture to Study and Learn. Supervisor's intended Microsoft reference remains unknown.

### S14: WIDA ELD Standards Framework, 2020

[Full framework](https://wida.wisc.edu/sites/default/files/resource/WIDA-ELD-Standards-Framework-2020.pdf). Inspected components in §2, printed p.34 (PDF p.36) applicable/inapplicable PLD uses, and grade-band organization. Official framework, not causal research. Descriptors support planning alongside other evidence; must not limit rigor or act as sole evidence for cognitive ability, grading, or placement. Grade/discipline expectations connect language use to content. Proposed use: characterize task language demands while keeping subject evidence separate; not an automatic level detector.

### S15: WIDA Can Do descriptors

[Official page](https://wida.wisc.edu/teach/can-do/descriptors), introduction and Key Uses section. Explicitly states these descriptors are not updated to the 2020 framework. Older Key Uses: Recount, Explain, Argue, Discuss. Edition mismatch is a documentation risk, not evidence that either resource is ineffective.

### S16: CAST, UDL and Assessment

[Official guidance](https://udloncampus.cast.org/page/assessment_udl), “Construct Relevance” and “UDL Principles and Assessment.” Higher-education practitioner resource, not a controlled study. Distinguishes the intended skill from extraneous demands introduced by assessment format. Alternative representations/responses require considering whether the changed modality is itself assessed. Proposed use: audit language and voice requirements; does not establish equivalence between spoken and written responses or justify overriding Socra's stated constraint.

### S17: Walqui & Heritage / WestEd (2018), Meaningful Classroom Talk

[Original practitioner article](https://www.wested.org/blog/insights-impact/supporting-english-learners-oral-language-development/), “A Framework for Oral Language,” “Productive Talk,” “Six Guidelines,” and “Common Misconceptions.” Classroom examples and research-informed guidance, not an isolated intervention trial. Prioritizes communicative purpose and meaning; cautions against interruptions and narrow fill-in frames, while discussing reusable expressions. Recasts may be interpreted as confirmation. Proposed transfer: elicit student meaning without completing their thought; distinguish language correction from assessment feedback. Cited underlying studies were not independently reviewed here; no effect-size or causal claim.

### S18: Mislevy & Riconscente (2005), Evidence-Centered Assessment Design

[Original technical report](https://www.sri.com/wp-content/uploads/2021/12/tr9_ecd.pdf), §§2.3.1–2.3.4, printed pp.18–20. Bounded research agent inspected full PDF; lead verified identity and framework. Conceptual framework links targeted claims, evidence, tasks, and assembly; resources/scaffolds are task conditions. A single observation generally leaves uncertainty. Proposed transfer: define permitted assistance with the claim and scoring interpretation. Targeted proficiency inference does not require broad ability labels. No intervention effect, EL-specific validation, or fairness guarantee is established.

### S19: EL Education Conversation Cues

[Official curriculum support article](https://eleducation.happyfox.com/kb/article/7-how-can-i-ensure-that-my-english-language-learners-have-the-opportunity-to-engage-in-rigorous-academic-discourse/), updated May 26, 2023; four goals and attribution paragraph. Text inspected; embedded cue-table images and video not reviewed. Goals concern being understood, understanding others, deepening thinking, and thinking together; credits Michaels/O'Connor's Talk Science Primer. Classroom practitioner guidance and testimonial, not an individual assessment trial. Proposed use: candidate elicitation moves, with peer assistance and new idea generation treated cautiously. Does not resolve whether supervisor meant this organization.

### S20: Microsoft declarative-agent architecture

[Official architecture](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-architecture), “Architecture components” and “Declarative agent data flow.” Managed Copilot orchestration/model runtime; developer-configured instructions, knowledge, and capabilities. Flow is conceptual, not fixed sequential execution; further calls/delegation may occur. This documents platform boundaries, not Study and Learn's exact configuration or educational effectiveness. Opened page supersedes contradictory cached search snippets.

### S21: Microsoft, Learning by Design (June 2026)

[Whitepaper redirect](https://aka.ms/learningsciencepaper). Research agent inspected pp.10–19 and 26–29; lead's redirect fetch failed. Vendor reports nine expert evaluation rounds, multi-turn scenarios with confusion/mistakes/bypass requests, and prompt revisions: focused questions, concise explanations, avoiding self-answering, response-specific feedback. Behavioral evaluation/user ratings do not demonstrate controlled learning gains or valid assessment. “Tuning” here must not be represented as weight fine-tuning. Exact prompts and reproducible evaluation datasets remain unavailable in inspected sections.

### S22: LearnLM Team / Google (2024)

[Original report, version 1](https://arxiv.org/html/2412.16429v1), §§2–4. Pedagogical data enters supervised fine-tuning, reward modeling, and reinforcement learning; desired behavior is conditioned on pedagogical instructions. Role-played learning scenarios and expert comparisons use matched materials/instructions and randomized order. Historical model comparisons concern pedagogical preference, not demonstrated student learning, EL equity, or assessment validity. Participant totals differ across report sections; not reproduced here. This is Google research, not evidence about Microsoft's training.

### S23: Burleigh, Han & DiCerbo (2025), Beyond the Hint

[Full paper](https://aclanthology.org/2025.aimecon-sessions.9.pdf), §§2.1–2.2 and §3, printed pp.81–84. Original CBA engineering study. Synthetic experiment selected 179 hint-prone states; pilot follow-up selected 400 states from high-school algebra/geometry conversations, oversampling likely hints, then excluded one ambiguous problem (350 retained). Compared original responses with self-critique revisions using automated judging. Reports reductions in criterion-revealing hints; sample rates are not population prevalence. Judge agreement with human labels was moderate; initial human agreement required adjudication. Pilot comparisons across models against original outputs do not isolate self-critique from all model differences. Educational value/overall response quality was not systematically measured. No EL subgroup or voice validation. Proposed use: test a leakage checker and explicitly assess its false approvals, false rejections, and conversational trade-offs.

### S24: Additional conversational-assessment critique

[Forsyth et al. (2024), Complex Conversations](https://www.educationaldatamining.org/edm2024/proceedings/2024.EDM-posters.100/). Research agent inspected full HTML, “Data Sources,” “Analyses and Results,” and “TextEvaluator Results.” Ten knowledge-engineered conversations sampled from 105 middle-school learners versus ten simulated student-role LLM conversations. Agent-discourse linguistic complexity differed. Small samples, real versus simulated learners, and different resources/context confound interpretation. Complexity is not an assessment-validity or learning outcome. Does not establish superiority of either approach; this limits future comparator claims.

### S25: Dynamic assessment — abstract-only lead

[Poehner & Lantolf (2013)](https://doi.org/10.1177/1362168813482935), abstract inspected by research agent; full text restricted. Computerized L2 reading/listening assessment distinguishes unmediated, mediated, and learning-potential scores, with transfer tasks. Useful conceptual reminder that assisted performance has a different interpretation. Sample, methods, and results unreviewed; no efficacy conclusion and no recommendation to implement its score. Spoken subject assessment transfer remains untested here.


## Product clarification — 2026-11-05

### S26: Socra public demo overview

[Demo overview](https://app.socraeducation.com/demo). Browser-inspected descriptions: an assessable dialogue ends with a student-written synthesis; a separate close-reading workflow is explicitly instructional. These are vendor workflow descriptions, not validated outcomes. No student response was submitted. This broadens the earlier assessment-only interpretation and leaves the intended internship workflow to confirm.

### S27: Socra Introduction to Ethics demo

[Assignment](https://app.socraeducation.com/demo/socra-assignment). Browser-inspected initial screen: two questions; first concerns Glaucon, Republic II, and whether justice retains moral importance without practical benefits. Source excerpt and typed-response field visible. Second question references Kant but full prompt not inspected. Grade band, rubric, subsequent behavior, and voice availability unknown. Candidate research task, not an endorsed prototype scope. Text input is observed in this demo; voice-only cannot be assumed product-wide.

### S01: Homepage sample follow-up

[Homepage](https://www.socraeducation.com/), opening preview. Shows a Dickinson question about indirect truth-telling, RL.9-10.4, and figurative-language/textual-evidence objectives. Also displays Bishop's One Art nearby: do not combine these into one assignment. Public demo S27 provides a more concrete task context.

### S28: Plato, Republic II — task source verification, 2026-11-05

[Jowett translation, Project Gutenberg edition 55201](https://www.gutenberg.org/files/55201/55201-h/55201-h.htm), Book II, 358b–359b; paragraph beginning “They say that to do injustice” and preceding dialogue. Primary philosophical text, not an educational intervention study. Glaucon presents a challenge rather than simply asserting his settled belief. The demo spec uses a short attributed excerpt from 358e–359a, with stable P1/P2 references and a newly worded question. This differs from Socra's observed translation/prompt; equivalence and grade fit are untested. No outcome or validity claim follows from the source.

### S29: OpenAI Responses implementation documentation — 2026-11-05 (historical; replaced by S30)

[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), “How to use Structured Outputs with text.format” and refusal/error handling; [Responses migration](https://developers.openai.com/api/docs/guides/migrate-to-responses), “Additional differences” and “Decide when to store state.” Official provider documentation inspected for the local demo adapter. Used for the Responses request shape, strict JSON schema configuration, output parsing, and `store: false`. The app independently validates actions, references, and exact student quotes. Vendor schema guarantees do not establish semantic fidelity, assessment validity, leakage prevention, or educational effectiveness; `store: false` is not a blanket provider-retention guarantee. No API key/model was configured during implementation, and no live provider outputs or paid comparisons were produced. See `demo/README.md` for tested software behavior and remaining limits.


### S30: Google Gemini implementation and free-tier verification — 2026-11-05

Official documentation inspected: [Gemini 3.8 Flash](https://aistudio.google.com/docs/models/gemini-3.8-flash), model ID and supported features; [pricing](https://aistudio.google.com/docs/pricing#gemini-3.8-flash), Gemini 3.8 Flash → Standard → Free Tier, input/output and product-improvement rows; [billing](https://aistudio.google.com/docs/billing), Free/Paid tiers and project/key relationship; [rate limits](https://aistudio.google.com/docs/rate-limits), project-level quotas and active limits; [API keys](https://aistudio.google.com/docs/api-key), server credential handling; [structured output](https://aistudio.google.com/docs/structured-output), JSON Schema support; [generateContent reference](https://ai.google.dev/api/generate-content), generationConfig/responseMimeType/responseJsonSchema and response candidates; [Models reference](https://ai.google.dev/api/models), get and supportedGenerationMethods. Primary vendor engineering documentation, not educational evidence.

Google lists standard text input/output for `gemini-3.8-flash` as free of charge on Free tier and says keys inherit the project's billing tier. Free-tier content may be used to improve Google products. Published eligibility is not proof of remaining quota or of a particular project's tier. No documented request-level “free only” switch was found. The demo therefore requires a recent operator confirmation bound to the key/model, expires it after 24 hours, uses one exact configured model for both conditions, and never changes billing, retries automatically, or selects a fallback model. This is a local guard, not an immutable external billing guarantee.

**Actual project evidence:** user stated “Default gemini project on free tier.” This is user-confirmed tier information; the agent's accessible AI Studio browser session stopped at onboarding terms and did not independently reveal billing/project quota. The supplied key successfully retrieved metadata for the exact requested model (HTTP 200, generateContent supported). Two subsequent synthetic policy generation attempts returned HTTP 503 UNAVAILABLE, with Google reporting high demand. Zero generated answers/reviews, no baseline generation or paired comparison, and no billing changes. At that stage, current usable quota remained unverified; see S31 for subsequent alternate-model calls. Actual sanitized failure records and verified UI screenshots are in `demo/`; see its README. Software tests with mocked responses do not establish live availability, fairness, leakage prevention, or educational validity.


### S31: User-authorized alternate model and actual live integration — 2026-11-05

The user subsequently authorized trying an alternate model. The key's Models.list response included the tested IDs. Read official [Gemini 3.6 Flash](https://aistudio.google.com/docs/models/gemini-3.6-flash), [3.5 Flash-Lite](https://aistudio.google.com/docs/models/gemini-3.5-flash-lite), [2.5 Flash](https://aistudio.google.com/docs/models/gemini-2.5-flash), and [3.1 Flash-Lite](https://aistudio.google.com/docs/models/gemini-3.1-flash-lite) pages, Versions and Structured outputs; read their respective Standard/Free-tier input and output rows in [pricing](https://aistudio.google.com/docs/pricing#gemini-3.1-flash-lite). Models 3.5 Flash and 3.7 Flash were excluded because their documentation says they route to other models. Model 2.5 Flash is deprecated, with a future routing change, and the actual request returned 404 unavailable to new users. Model-list presence alone does not prove usable generation access.

Actual synthetic calls: 3.6 Flash and 3.5 Flash-Lite each returned 503 high demand. **3.1 Flash-Lite returned structured outputs and its exact identity**; it is now the explicit default/configured model in both conditions. No automatic fallback was installed, and billing was unchanged. Published Free-tier eligibility plus the user's project-tier confirmation remain the billing evidence; successful requests show current generation availability, not an independent billing audit or a future quota guarantee.

Two substantive D1 development outputs from 3.1 Flash-Lite were rejected: a stitched non-verbatim quotation, then an ineligible source probe after marking C1 present. The first prompted a shared contiguous-quote instruction clarification; failures are preserved and validation was not weakened. These are genuine model-behavior failures, not educational success. A separate, narrow glossary/early-finish/review integration path was exercised with both conditions; its evidence states are unobserved because no substantive answer was supplied. No three-repeat paired evaluation, educator review, fairness finding, or student outcome is claimed. See the current README and retained actual JSON records for exact test scope.

### S32: Live default and response controls — verification, 2026-11-15

Re-read Google's [pricing](https://aistudio.google.com/docs/pricing#gemini-3.1-flash-lite), Gemini 3.1 Flash-Lite → Standard → Free Tier input/output and data-use rows. The published free-tier eligibility remains a vendor statement, separate from the user's earlier confirmation that the key belongs to Default Gemini Project on Free tier. The demo now retains that saved confirmation and its original 2026-11-05 observation date without its previously self-imposed 24-hour expiry; exact key/model binding remains enforced. This is not an independent fresh billing check. No billing was enabled, model changed, or automatic fallback installed.

Read-only metadata returned HTTP 200 for the configured exact model. A substantive synthetic UI request returned 503 high demand; an explicit manual retry succeeded with structured output and model identity, followed by a successful live clarification request. The preserved failure/retry record is `demo/evaluations/live-ui-smoke-2026-11-15.json`. These observations establish narrow integration behavior and availability at those moments, not reliability, future quota, educational effectiveness, or evidence of a current billing tier.

For response narration, read [MDN: SpeechSynthesisVoice.localService](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService), Value and description. It distinguishes local from remote synthesis; the UI selects only a local English voice and provides no remote fallback. Browser checks observed playback control transitions and completion; audio quality and educational effects were not evaluated. Response feedback is synthetic UI-test data kept separate from assessment evidence and excluded from model context. See the demo README for the 70 offline checks and browser scope.

## Detection-direction research — 2026-11-16

Supervisor notes dated November 15 are recorded separately in `RESEARCH_BRIEF.md`; they are not empirical evidence about product outcomes. Candidate annotation designs in `EL_SUPPORT_RESEARCH.md` are our synthesis, not validated framework diagnoses.

### S33: WIDA ACCESS scores and reports

[Official page](https://wida.wisc.edu/assess/access/scores-reports), “What ACCESS Measures,” “Understanding the Individual Student Report,” and “Top Things to Keep in Mind.” Inspected 2026-11-16. Reports distinguish four domains and composites; proficiency levels span 1–6 and depend on domain and grade. The page notes a 2025–2026 scale-score reset, so older scores cannot simply form one continuous trend with the reset scores. Official score-interpretation guidance, not evidence for a chat-based proficiency detector. Proposed implication: retain instrument, domain, grade, date/version, and original record; separate teacher-supplied scores from Socra observations and allow missing information. No score conversion or current student-data access is established.

### S34: California ELD stages versus Summative ELPAC reporting

[CDE general performance-level descriptors](https://www.cde.ca.gov/TA/TG/ep/elpacgpld.asp), introduction and four-row table; inspected 2026-11-16. The three CA ELD stages are Emerging, Expanding, and Bridging; the Summative ELPAC has four performance levels whose correspondence spans portions of those stages. This is not a one-to-one set of interchangeable labels. This pass does not establish detailed per-domain report structure or an automated conversion to WIDA. Proposed implication: keep instructional framework and assessment reporting scale distinct; retrieve the actual grade-specific CA standards next if selected.

### S35: Texas TELPAS/ELPS transition context

[TEA TELPAS resources](https://tea.texas.gov/assessment-and-accountability/telpas-resources), opening overview and “TELPAS Transition-Year Assessments (2026–2027 and 2027–2028)”; inspected 2026-11-16. TEA describes new ELPS effective in classrooms in 2026–2027 and a transition before the new assessment in 2028–2029; current four proficiency levels remain during the transition. Standards and tested curricula therefore require explicit version/year tracking. Detailed Texas pattern extraction, level conversion, and Arizona guidance remain outside this first WIDA pass.

### S36: Federal annual ELP assessment requirement — bounded scope check

[20 U.S.C. §6311, official House text](https://uscode.house.gov/us/usc/119-118/t20/s6311/), (b)(1)(F) and (b)(2)(G)(i)–(ii); inspected 2026-11-16. State plans under this provision address ELP standards across four domains and annual ELP assessment of English learners in schools served by the state educational agency, aligned to state standards. This statutory requirement does not prove that every Socra user already has a complete/current accessible profile or establish one national reporting scale. State implementation, exceptions, and data access are not resolved by this bounded check. Product proposal: request teacher-provided records and support unknown/stale data rather than inventing levels. No claim that Socra replaces the mandated assessment or complies with all applicable law.

### S14 follow-up: WIDA language-pattern research

Same [2020 framework](https://wida.wisc.edu/sites/default/files/resource/WIDA-ELD-Standards-Framework-2020.pdf), inspected 2026-11-16 by bounded research agent; lead rechecked the use limitations and Argue expectation text. Locators: printed p.34 / PDF p.36 (PLD uses/limits); grades 6–8 expressive PLDs printed pp.174–175 / PDF pp.176–177; `ELD-LA.6-8.Argue.Interpretive` / `Expressive`, printed pp.150–151 / PDF pp.152–153. PLDs describe scaffolded language performance toward level endpoints and are not finite ability lists. These anchors motivate proposed observations about reference, relationships between ideas, and source attribution, but establish neither level-specific error prevalence nor a validated detector. Use edition, grade band, mode, named criterion and page locator; do not fabricate individual PLD identifiers. Reading versus expression, insufficient task opportunity, and prior assistance remain confounders.

## Explicit difficulty descriptions and annotated examples — 2026-11-16

### S06 follow-up: How proficiency context can inform the prototype

[WIDA PLD scaffolding snapshot](https://wida.wisc.edu/resources/resource-snapshot/wida-proficiency-level-descriptors-informing-expectations-and), “Examine Language Expectations Across Proficiency Levels” and “Inform Differentiated Scaffolding,” rechecked 2026-11-16. Guidance keeps unit language/content goals shared while varying scaffolds and considers assessment scores alongside writing, oral production, portfolios, and other artifacts. Its worked example is grade 5 poetry, not validation for the Socra humanities task or a level-specific error taxonomy. Proposed application: use existing domain levels to contextualize support and language-development targets; require transcript evidence for observations and test whether adding the profile improves teacher-rated usefulness. This source does not establish that providing a level improves an LLM detector.

### S37: WIDA Language Charts

[Official resource page](https://wida.wisc.edu/resources/wida-language-charts-pdf) and [PDF](https://wida.wisc.edu/sites/default/files/resource/WIDA-Language-Charts.pdf). Inspected tips, p.6; grades 6–8 charts, pp.17–18; glossary, p.23. Resource page reports August 2026 release; PDF carries 2025 copyright. Describes language performance by grade, mode, level, and language dimension, with multiple evidence sources and scaffolding considered. Useful framework context, not an error taxonomy or prevalence study. The [classroom-planning snapshot](https://wida.wisc.edu/resources/resource-snapshot/plan-curriculum-instruction-and-classroom-assessment-wida-language), “Collaborative Conversation #2,” recommends reviewing samples across time. Do not equate its classroom judgments with a new official ACCESS score.

### S38: California ELPAC practice scoring guide, grades 6–8

[Current portal-linked PDF](https://www.caaspp-elpac.org/s/docs/ELPACPT.G6-8.LSRW.SG.pdf). Inspected Speaking, Support an Opinion, Q8 (PDF p.15); Writing, Academic Information, Q5 (PDF p.37); Justify an Opinion, Q6 (PDF pp.39–41). Provides responses, rubric scores, and specific annotations, including grammatical errors that leave meaning clear. Reading pages chiefly provide keys/standards rather than error explanations. Item scores are not overall proficiency levels. Useful examples for annotation design; neither frequency evidence nor validation of conversational detection.

### S39: Texas TELPAS annotated writing collections

[Annotated Examples of Student Writing](https://tea.texas.gov/data-reports/telpas/telpas-annotated-examples-of-student-writing.pdf), Student 4, Grade 8, Intermediate, “ANNOTATION.” Bounded agent read indexed PDF text; lead independently checked the full indexed Student 4 annotation. Direct retrieval returned 403, so page numbering and edition date remain unverified. Commentary identifies tense inconsistency, preposition problems, and limited linking language across a writing collection. These are official interpretations of selected examples, not prevalence estimates or automatic mappings to WIDA. Do not copy source-attributed first-language explanations into automated diagnoses without evidence.

### S40: Texas TELPAS writing scoring guide, grades 6–7, Spring 2025

[Official PDF](https://tea.texas.gov/data-reports/telpas/2025-telpas-6-7-writing-scoring-guide.pdf). Lead inspected p.2 (scope), pp.5–7 (Q14 rewrite, unacceptable/acceptable examples), and p.10 (rubric). Annotations distinguish rewrites that retain ambiguous reference/word order from those resolving it. Actual de-identified responses are scored at item level; p.2 explicitly distinguishes this from overall proficiency. The writing rubric covers vocabulary, usage, and completeness. These tasks support candidate examples and counterexamples, not a validated diagnostic of reading or conversation. This is the 2025 edition; later Texas standards transitions require version tracking (S35).

### S41: Coyne et al. (2025), written-error annotation framework

[Paper](https://arxiv.org/html/2508.06810v1), §§3.1–3.3 and 4.1; [authors' repository](https://github.com/coynestevencharles/annotating-errors-wcf), Feedback Data and example. Defines 81 terminal error categories plus evidence spans and feedback annotations. Pilot: 456 instances from EXPECT across CEFR A1–C2, two co-author annotators, guidelines revised between batches. Repository filters examples to a single contiguous error. Feedback experiments supply correct upstream detections, so they do not validate automatic detection. Useful annotation-method reference; no WIDA/ELPAC mapping, U.S. middle-school representativeness, spoken transfer, or learning-gain conclusion established. Appendix PDFs were located but not fully inspected; paper and repository methods/example were read.

## State-group source map — checked 2026-11-16

Scope: a core source inventory covering all 50 states and DC for middle/high-school language-pattern research. It is not an exhaustive bibliography, a legal-compliance audit, or a claim that every state edition and linked document has been fully extracted. General assessments and instructional frameworks are separate; alternate-assessment materials require a separate population-specific branch. State/current-year guidance takes precedence over shared or historical resources.

### S42: State coverage and current grouping

| Source group | States | Qualification |
| --- | --- | --- |
| WIDA common library, 35 states | Alabama, Alaska, Colorado, Delaware, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Kentucky, Maine, Maryland, Massachusetts, Michigan, Minnesota, Missouri, Montana, Nevada, New Hampshire, New Jersey, New Mexico, North Carolina, North Dakota, Oklahoma, Pennsylvania, Rhode Island, South Carolina, South Dakota, Utah, Vermont, Virginia, Washington, Wisconsin, Wyoming | DC also uses this library. Verify each state's adopted instructional edition through its member page; common library does not mean identical policies. |
| ELPA21 shared assessment library, 9 states | Arkansas, Iowa, Louisiana, Mississippi, Nebraska, Ohio, Oregon, Tennessee, West Virginia | State standards adaptations and reporting rules still apply. |
| Arizona | Arizona | State ELPS plus current ELPA21-AZELLA descriptor resources; retain older AZELLA versions separately. |
| California | California | CA ELD standards plus ELPAC. |
| Connecticut | Connecticut | CELP standards share ELPA21 origins; general assessment remains LAS Links. |
| Kansas | Kansas | Kansas standards plus KELPA. WIDA partnership concerns alternate assessment. |
| New York | New York | ACCESS begins spring 2027, but New York retains its own instructional ALDs. |
| Texas | Texas | New instructional ELPS and transitional TELPAS reporting need separate versions. |

Coverage check: 35 + 9 + 6 = 50 unique states; DC separate. Evidence: [WIDA member directory](https://wida.wisc.edu/about/wida-consortium-benefits-educators), current HTML dropdown independently extracted by agent and lead; [Ohio OELPA FAQ](https://education.ohio.gov/Topics/Testing/Ohio-English-Language-Proficiency-Assessment-OELPA/Ohio-English-Language-Proficiency-Assessment-OELPA), “How was the OELPA developed?”, explicitly lists nine states. WIDA's 42 jurisdictions include non-state members and must not be described as 42 states. Kansas's presence in the dropdown does not establish general ACCESS use. The dated state exceptions below were separately checked. No automated score crosswalk is established.

### S43: WIDA common package and state overlays

Use S14 (2020 framework), S37 (Language Charts), and S33 (ACCESS scores/reports), plus:

- [Grades 6–8 framework booklet](https://wida.wisc.edu/resources/wida-eld-standards-framework-2020-edition-grades-6-8-materials) and [grades 9–12 booklet](https://wida.wisc.edu/sites/default/files/resource/WIDA-ELD-Standards-Framework-2020-Edition-Grades-9-12.pdf): select language arts/social studies expectations, annotated texts, and descriptors. These excerpts share the full framework's evidence limits; not all annotated texts are learner-error samples.
- [Writing rubric](https://wida.wisc.edu/sites/default/files/resource/ACCESS-Writing-Scoring-Rubric-Grades-1-12.pdf) and [speaking rubric](https://wida.wisc.edu/sites/default/files/resource/ACCESS-Speaking-Scoring-Rubric-Grades-1-12.pdf): scoring-language references, not Socra scoring rules. Agent inspected writing rubric's ACCESS-only and score-point/proficiency distinction.
- [ACCESS interpretive guide](https://wida.wisc.edu/sites/default/files/resource/Interpretive-Guide.pdf): read alongside the current scores hub; retain the edition/year when interpreting old records.
- [Member directory](https://wida.wisc.edu/about/wida-consortium-benefits-educators): select the state and inspect Assessments / Standards and Instructional Support before claiming local alignment. This pass did not audit every state's detailed adoption policy.
- **Illinois starting-scope check, 2026-11-16:** [WIDA Illinois](https://wida.wisc.edu/about/consortium/il), “Assessments” and “Standards and Instructional Support,” explicitly confirms ACCESS use and adoption of the 2020 WIDA ELD Standards Framework. This supports proposing Illinois as the first state preset while researching the shared WIDA framework. It does not establish an Illinois pilot, teacher-review population, or automatic alignment with every other member state's requirements. Grades 6–8 remain a provisional research scope; task suitability needs educator review.

**Specific use restriction:** [ACCESS practice/sample page](https://wida.wisc.edu/assess/access/practice), introductory bullets, prohibits providing ACCESS/Screener/MODEL sample items and test-practice materials to AI systems. Human-reference listing only; do not ingest these into prompts, retrieval, or evaluation datasets. Lead verified the restriction; sample items were not downloaded in this pass. Separate publications require their own reuse review rather than assuming the same restriction or blanket permission.

### S44: Shared ELP/ELPA21 package

Bounded agent inspected the following; lead rechecked Ohio membership, the Oregon hub, and grades 6–8 handscoring guide. Some direct ELPA21 endpoints intermittently return errors; use the official state hub to locate mirrors.

- [ELP standards, Oregon-hosted full document](https://www.oregon.gov/ode/students-and-family/equity/EngLearners/Documents/ELPStandardsFinal.pdf) and [standards index](https://www.oregon.gov/ode/students-and-family/equity/EngLearners/Pages/EnglishLanguageProficiencyStandards.aspx): ten standards, grade-band progression and ELA/literacy correspondences. Index and document organization inspected; full extraction pending.
- [Proficiency Level Descriptors by Domain](https://elpa21.org/wp-content/uploads/2023/02/ELPA21_PLDs_All_Grade-Bands.pdf): December 2020 edition; grades 6–8 pp.30–36, 9–12 pp.37–42. Instructional language descriptions, not observed error frequencies.
- [Achievement Level Descriptors by Domain](https://elpa21.org/wp-content/uploads/2023/02/ELPA21_ALDs_All_Grade-Bands.pdf): December 2020 edition; grades 6–8 pp.17–19, 9–12 pp.20–22. Assessment performance context, separate from a Socra annotation.
- [Grades 6–8 screener handscoring guide](https://www.oregon.gov/ode/educator-resources/assessment/Documents/Screener_Hand_Scoring_G6-8_No_Date.pdf) and [grades 9–12 guide](https://www.oregon.gov/ode/educator-resources/assessment/Documents/Screener_Hand_Scoring_G9-12_No_Date.pdf): public 2020 speaking/writing rubrics and scoring notes. Grades 6–8 PDF pp.2–5 explicitly distinguish partial responses, unclear connections and errors affecting meaning. These are item-level rubrics, not a verified bank of annotated learner transcripts or a proficiency-to-error mapping.
- [Quick Guide to Student Reports for Educators](https://www.elpa21.org/wp-content/uploads/2023/02/20240830_ELPA21-Quick-Guide-to-Understanding-Reports-for-Educators_24-25.pdf): retrieved cover says 2025–26 despite older filename. Domain profiles pp.4–5; report fields/interpretation later. Retain domain levels separately from overall categories.
- [Oregon assessment resource hub](https://www.oregon.gov/ode/educator-resources/assessment/Pages/English-Language-Proficiency.aspx): current guidance, grade-band specifications, practice resources, and a clearly marked archive. [ELPA21 resources](https://elpa21.org/resources/) is an additional index for instructional resources; enrichment materials not fully evaluated here.

State overlays: [Tennessee ELD standards](https://www.tn.gov/education/districts/academic-standards/english-language-development.html) documents 2024 adoption and ELA crosswalks; [Mississippi's February 2025 amendment](https://www.mdek12.org/wp-content/uploads/sites/29/2025/02/Tab-01-ESSA-Plan-Amendment-2025_v1.pdf), p.17, records its move from LAS Links. [Oregon proficiency descriptors](https://www.oregon.gov/ode/educator-resources/assessment/Documents/elpa21_proficiency_descriptors.pdf) include an Oregon-specific Early Proficient category. Its [Standards Report Guide](https://www.oregon.gov/ode/educator-resources/assessment/Documents/ELPA_Standards_Report_Guide.pdf), pp.3,8, restricts aggregate-report interpretation to building/district decisions; do not use it for individual student flags.

### S45: California package

- [CA ELD standards publication](https://www.cde.ca.gov/sp/ml/documents/eldstndspublication14.pdf), adopted 2012, publication 2014: Chapter 3 grades 6, 7, 8, 9–10, 11–12; Part I language use and Part II language organization/features. Lead inspected grade-6 overview and cohesion/connecting-ideas locations (printed pp.86–95). Definitions and grade-stage expectations, not prevalence evidence.
- [ELA/ELD Framework adopted-text index](https://www.cde.ca.gov/ci/rl/cf/elaeldfrmwrksbeadopted.asp): Chapters 6 (middle school), 7 (high school), 8 (assessment), 9 (access/equity). [Official language-development navigation guide](https://www.cde.ca.gov/ci/cl/documents/langdevguidance.pdf) provides relevant page locators. Publisher index/navigation inspected; detailed vignette analysis remains to do.
- S38 and the [practice/scoring resource portal](https://www.caaspp-elpac.org/resources/preparation/practice-and-training-tests/practice-and-training-resources/): select 6–8, 9–10, 11–12 scoring guides for annotated responses; only selected 6–8 examples have been analyzed so far.
- S34 plus [student score-report resources](https://www.caaspp-elpac.org/resources/reporting/ssr-and-reporting-resources/): preserve ELD stage, Initial/Summative instrument, domain reporting, and overall performance level as distinct concepts.
- [Integrated ELD instructional strategies](https://www.cde.ca.gov/sp/ml/eldstrategies.asp): support-design reference; page inspected, not evidence of effects from a specific Socra implementation.

### S46: Texas package and transition

Use S39–S40 for annotated examples, together with:

- [TEA ELPS adoption/standards hub](https://tea.texas.gov/curriculum-and-instruction/english-language-proficiency-standards), “ELPS, Adopted 2024”: authoritative links to Chapter 120, especially §120.21 and its grades 4–12 PLD figure. Do not substitute draft work-group documents for adopted text.
- [2026–2027 TELPAS Educator Guide](https://tea.texas.gov/data-reports/test-administration/telpas-educator-guide.pdf), transition discussion pp.22–24: lead inspected. Instruction uses the new ELPS; transitional assessment retains four reported levels and tests overlapping content. Full five-level assessment implementation is planned for 2028–29. This corrects any inference that one timeless Texas level scale is sufficient.
- [TELPAS resource hub](https://tea.texas.gov/assessment-and-accountability/telpas-resources): current eligible PLDs, rubrics, and grade 6–7 / 8–9 / 10–12 scoring guides. Previously inspected 2025 examples remain historical examples, not automatically current standards.
- [TXEL ELPS Support Center](https://www.txel.org/ELPS): separates 2024-aligned resources from retained 2007 resources, including Linguistic Instructional Alignment Guides and teacher-support materials. Index inspected; individual guides/course effectiveness not evaluated.

### S47: Arizona package, sharing ELPA21 descriptors

Lead inspected ADE hubs; bounded agent inspected selected grade-6–8 pages and Appendix A. Arizona's [current AZELLA instructional portal](https://www.azed.gov/oelas/connecting-el-programs-azella) explicitly links ELPA21 domain descriptors and 2026–27 ELPA21-AZELLA resources. Treat this as current shared-resource overlap, not proof that every historical AZELLA scale is interchangeable.

- [Arizona ELPS hub](https://www.azed.gov/oelas/elps): 2019 standards, clarified resources in 2024, with grades 6–8 and 9–12 documents, glossary, vertical articulation and reading-foundational guidance.
- [Grades 6–8 clarified standards](https://www.azed.gov/sites/default/files/2024/07/6.7.8_2019%20ELPS_Clarified_2024.pdf), selected pp.4–5,13–15: task expectations and suggested supports; corresponding high-school document is on the hub.
- [Appendix A: Text Types and English Language Considerations](https://www.azed.gov/sites/default/files/2024/07/Appendix%20A_TextTypesAndEnglishLanguageConsiderations_2024.pdf), pp.3–4: text purpose/structure and language-feature reference.
- [AZELLA–ELPS instructional planning crosswalk](https://www.azed.gov/sites/default/files/2026-10/AZELLA-ELPS_CrosswalkResource.pdf): teacher workflow connecting assessment context to instructional planning.
- Shared S44 descriptors via [ELPA21 Arizona resources](https://elpa21.org/resources/?state=Arizona); [September 2026 PLD presentation](https://www.azed.gov/sites/default/files/2026-09/Friday_Focus_Using_AZELLA_PLDs.pdf) distinguishes language assessment from subject mastery.

No comparable Arizona-specific public annotated-error collection was verified. Keep historical Spring 2026 score guidance available for those records; do not silently apply the newer configuration retrospectively.

### S48: New York instructional/assessment split

Lead independently read [WIDA New York](https://wida.wisc.edu/about/consortium/ny) via live HTML because web extraction omitted relevant text. “Standards and Instructional Support” says NY does not adopt the WIDA 2020 framework and retains its Academic and Linguistic Demands. “Assessments” lists ACCESS in spring 2027. Agent checked [NYSED transition guidance](https://www.nysed.gov/bilingual-ed/english-language-learner-and-multilingual-learner-assessment-testing-accommodations); lead fetch failed. It identifies spring 2026 as the final NYSESLAT administration, spring 2027 as first ACCESS, and continued NYSITELL screening in 2026–27.

- [NY Academic and Linguistic Demands](https://www.nysed.gov/bilingual-ed/academic-and-linguistic-demands-creating-access-next-generation-learning-standards): authoritative instructional destination linked by WIDA; detailed contents inaccessible in this pass and await extraction. Do not confuse this expansion of ALD with ELPA21 Achievement Level Descriptors.
- S43 assessment/report resources for ACCESS records, paired with NY-specific guidance rather than substituted instructional standards.
- [Historical NYSESLAT performance-level descriptions](https://www.nysed.gov/state-assessment/performance-level-descriptions) and [2026 administrator manual](https://www.nysed.gov/sites/default/files/programs/state-assessment/nyseslat-sam-2026.pdf): legacy-record interpretation and historical rubrics. Only indexed sections reviewed; no public annotated transcript bank claimed.

### S49: Kansas package

[KSDE assessment page](https://www.ksde.gov/student-success/resources-by-subject-area/english-learners/EL-assessment), independently checked by lead, distinguishes KELPA from WIDA alternate assessments.

- [2018 Kansas Standards for English Learners](https://ksde.gov/docs/default-source/csas/2018-kansas-standards-for-english-learners.pdf?sfvrsn=493ff97f_3): agent inspected introduction pp.5–6 and grade-6 sections around pp.91–96; links to prior ELPA21 standards are historical correspondence, not shared current assessment membership.
- [Standards hub](https://ksde.gov/student-success/resources-by-subject-area/english-learners/el-proficiency-standards) and [KELPA resource hub](https://ksassessments.org/educators-test-administrators/kelpa): authoritative indexes for current editions and guidance.
- [KELPA Educator Guide to Reports](https://ksassessments.org/sites/default/files/documents/KELPA/KELPA_Educator_Guide_to_Reports.pdf): 2025–26 edition located; proficiency/domain descriptions pp.6–9 and individual reports pp.10–11. Detailed extraction pending.

Public-gap record: [2025–26 coordinator manual](https://ksassessments.org/sites/default/files/documents/archive/KELPA_Test_Coordinator_Manual_2025-2026.pdf), Appendix J p.75, identifies rubrics/rater training as secure. Do not list those as open corpora. This research did not access secure materials.

### S50: Connecticut package

Lead inspected [CELP hub](https://portal.ct.gov/sde/english-learners/english-learner-multilingual-learner/celp-standards) and [LAS Links documents](https://portal.ct.gov/sde/student-assessment/elp-assessment/english-language-proficiency-assessment---las-links/documents). Agent checked [2015 adoption memo](https://portal.ct.gov/-/media/sde/board/boardmaterials100715/adoption_of_connecticut_english_language_proficiency_standards.pdf), p.2, documenting adaptation of shared ELP standards, and [September 2026 newsletter](https://portal.ct.gov/-/media/sde/student-assessment/student-assessment-news/san-september-2026.pdf), confirming 2026–27 LAS Links use.

- CELP hub's **Standards with Proficiency Descriptors by Grade Level**, **K–12 Progressions**, **Correspondences to Content Standards**, and **Glossary**: instructional context and labels.
- [CELP Linguistic Supports](https://portal.ct.gov/-/media/sde/english-learners/celp_standards_linguistic_supports.pdf): public support-design reference, 10-page document located/opened; detailed selection pending.
- [LAS Links Performance Level Descriptors](https://portal.ct.gov/-/media/sde/student-assessment/special-populations/las-links-poficiency-level-descriptors.pdf): domain/grade-band reporting context. Introduction and five-level definitions inspected by lead; descriptors do not establish that a particular error occurred.
- LAS Links hub's accessibility chart and score-report resources: interpreting existing records and distinguishing assessment accommodations from instructional support. CAAELP is the alternate-assessment branch, not the general LAS Links system.

### Cross-state use and next extraction

The framework/level source, annotated-example source, and support source can be different publications. Annotated examples from one state can inspire original candidate cases elsewhere, but neither the rating scale nor state alignment transfers automatically. S09 provides a K–8 instructional evidence synthesis; S41 provides annotation-method ideas, not state standards. Medley remains a product-design reference, not an official source of state-defined learner difficulties.

For each candidate record: name the observed behavior; cite definition and example locators; distinguish domain, grade, framework/version and task; retain a successful counterexample and alternative explanations; state whether level-specific prevalence is actually supported; record potential support and review status. Start with WIDA context plus the already-inspected TELPAS/ELPAC examples. Do not treat this 50-state inventory as completed pedagogical validation or a requirement to implement all states before testing one useful annotation.

## Illinois secondary-school deep review — 2026-11-16

User selected Illinois and expanded research to grades 6–8 and 9–12, all six proficiency levels, and all useful source types. Synthesis and original cases: [ILLINOIS_LANGUAGE_DETECTION.md](ILLINOIS_LANGUAGE_DETECTION.md). Three bounded research passes covered grade bands, Illinois guidance, additional instructional evidence, and independent critique; only the lead edited shared documents. This is a broad targeted review, not an exhaustive systematic review or validated all-level detector. Selected-page reading is identified below; source listing does not imply cover-to-cover inspection.

### S51: Illinois record interpretation and administrative status

- [WIDA Illinois](https://wida.wisc.edu/about/consortium/il), Assessments / Standards and Instructional Support: adoption and ACCESS use rechecked by lead.
- [ISBE Entrance and Exit Procedures](https://www.isbe.net/Pages/EnglishLearnerIdentificationAssessment.aspx), Identification / Grade Specific / Determining the Appropriate Grade-Level Cluster: agent inspected. Current grade, assessed grade, instrument, and administered cluster can differ; preserve them rather than overwriting one with another.
- [ISBE exit-criteria review](https://www.isbe.net/elexit), opening and Why Now?: agent and lead checked the review underway after July 2026 standard setting. No future cutoff inferred. The web extractor's archive message is hidden template content (`display:none`), independently checked in live HTML; not evidence that this specific page is archived.
- S33 current scores hub rechecked: retain domain, decimal score, year, and provenance; preserve the 2025–26 scale reset. No reclassification algorithm is proposed.

### S52: Full secondary humanities/PLD extraction and S37 chart correction

[Grades 6–8 booklet](https://wida.wisc.edu/sites/default/files/resource/WIDA-ELD-Standards-Framework-2020-Edition-Grades-6-8.pdf) and [grades 9–12 booklet](https://wida.wisc.edu/sites/default/files/resource/WIDA-ELD-Standards-Framework-2020-Edition-Grades-9-12.pdf): agents read pp.19–22, grade introductions, humanities expectations, and all PLD tables; tables visually inspected. In each booklet: LA Narrate pp.32–33, Inform 34–35, Argue 36–37; SS Explain 46–47, Argue 48–49; interpretive PLDs 58–59, expressive PLDs 60–61. Full framework printed-page offsets are +114 for the middle-school grade section and +152 for high school; full-PDF page numbers add another two. Lead verified the chart tables and selected framework anchors. High-school pp.51–54 contain an authentic eleventh-grade draft after classroom model-text work, with strength annotations, no assigned WIDA level; not an independent-performance/error benchmark.

**Important S37 correction/extension:** [current Language Charts](https://wida.wisc.edu/sites/default/files/resource/WIDA-Language-Charts.pdf), pp.4–6,17–23, read and tables visually checked by agents and lead. Its p.4 limits ACCESS-score interpretation to testing year **2026–27 onward**. The [August 2025 planning snapshot](https://wida.wisc.edu/resources/resource-snapshot/plan-curriculum-instruction-and-classroom-assessment-wida-language), opening under What Are the WIDA Language Charts?, references 2025–26 scores; both texts were checked. Preserve this discrepancy and verify applicability before production score linkage. Charts describe endpoints, with an expanded Level-1 continuum; not all-level error expectations or an official classroom-to-ACCESS scoring procedure.

### S53: WIDA reading evidence-collection tools

Cross-reference, 2026-11-17: for the explanation of Level 1 versus Level 4, the lead rechecked S52's Language Charts pp.4–6,19–21 and [WIDA's scaffolding snapshot](https://wida.wisc.edu/resources/resource-snapshot/wida-proficiency-level-descriptors-informing-expectations-and), “Examine Language Expectations Across Proficiency Levels” / “Inform Differentiated Scaffolding,” plus [ACCESS scores and reports](https://wida.wisc.edu/assess/access/scores-reports), domain-specific reporting. Guidance supports using grade/domain context and multiple work samples to plan scaffolding around shared learning goals. The charts describe level endpoints, not required features of every response; their ACCESS-score linkage begins in 2026–2027. Proposed Socra design: establish the observation from the task/transcript first, then use relevant proficiency context for educator-facing language-development feedback and possible support. No level-specific error prevalence or different truth standard for the same response was established. Examples and support choices remain original proposals; the current version does not initiate follow-ups.

- [Reading Observation Tool](https://wida.wisc.edu/sites/default/files/resource/Reading-Observation-Tool.pdf), 2024, both pages read by agent/lead and visually checked by agent: task, discussion, interpretation, and support conditions. Motivation for evidence plus context, not a validated detector.
- [Reading Conference Planning](https://wida.wisc.edu/sites/default/files/resource/Reading-Conference-Planning.pdf), 2024, both pages read: p.1 planning/text selection; p.2 word knowledge, comprehension monitoring, reading–writing connections. Invites purposeful elicitation, including multilingual paraphrase with appropriate bilingual support. A supported retry does not establish the cause of the original difficulty.
- [Creating a Reader Portrait](https://wida.wisc.edu/sites/default/files/resource/Reading-Creating-Reader-Portrait.pdf), 2024, complete one-page tool inspected by agent: strengths, experiences, supports, and different evidence sources. Proposed profile design should not become an error-only record or request unnecessary personal disclosures.

### S54: TELPAS authored reading rationales across secondary grades

Official 2025 publications read by grade-band agents; selected pages visually checked. Lead retrieved each PDF and checked publication/content structure. Relevant item positions also correspond to PDF pages:

- [Grades 6–7](https://tea.texas.gov/data-reports/telpas/2025-telpas-6-7-reading-and-writing-rationale.pdf): 21,22,26,28,32,35, addressing sequence, humor, evidence of emotion, event/location confusion, main idea, summary.
- [Grades 8–9](https://tea.texas.gov/data-reports/telpas/2025-telpas-8-9-reading-and-writing-rationale.pdf): 21,24,25,30,33, addressing perspective, contextual reference, summary, overgeneralization, organization.
- [Grades 10–12](https://tea.texas.gov/data-reports/telpas/2025-telpas-10-12-reading-and-writing-rationale.pdf): 6,8,29,30,31, addressing concession, cause/time, wrong-character context, sequence, relevant evidence.

These are author explanations of response alternatives, not observed learner-error frequencies. They do not establish a WIDA level, individual cause, or Illinois prevalence. Used to design original candidate cases/counterexamples, not copied into a product test bank.

### S55: TELPAS high-school annotated writing

[2025 grades 10–12 writing scoring guide](https://tea.texas.gov/data-reports/telpas/2025-telpas-10-12-writing-scoring-guide.pdf), pp.2,4–10,22,26,33 read by agent; lead checked p.2. The introduction explicitly identifies actual de-identified administered responses and distinguishes an item's score from a student's proficiency level. Selected annotations distinguish clarity/elaboration from surface form. These provide negative controls for overcorrection. Texas task-specific rubrics and scores are not Socra criteria or WIDA mappings. Earlier middle-school annotated examples remain S39–S40.

### S56: ELPAC secondary response anchors and transfer cautions

Agent retrieved current 2026 guides and read selected anchors; rendered selected high-school tables. These are published anchor samples; the inspected introductions did not establish each anchor's raw collection/editing provenance.

- [Grades 6–8](https://www.caaspp-elpac.org/s/docs/ELPACPT.G6-8.LSRW.SG.pdf): printed/PDF pp.13/15,35/37,37–39/39–41.
- [Grades 9–10](https://www.caaspp-elpac.org/s/docs/ELPACPT.G9-10.LSRW.SG.pdf): printed/PDF pp.12–13/14–15,35/37,37–39/39–41.
- [Grades 11–12](https://www.caaspp-elpac.org/s/docs/ELPACPT.G11-12.LSRW.SG.pdf): printed/PDF pp.13/15,35/37,37–39/39–41.

Useful controls include effective meaning despite form variation, opposing supported positions, and performance with organizers/examiner prompts. Language-task scores do not independently validate every subject inference. Essay-length/no-English scoring provisions must not silently become humanities-chat rules. Item score, targeted performance descriptor, California proficiency classification, and WIDA level remain distinct. Lead's web fetch of the 9–10 guide failed; agent downloaded/inspected the actual PDF successfully.

### S57: WIDA responsive-support implementation guidance

[Implementation Guide](https://wida.wisc.edu/sites/default/files/resource/Implementation-Guide-WIDA-ELD-Standards-Framework.pdf), 2023 v1.0, pp.21–22 and67, read by agent; lead checked publication and relevant structure. Planning cycle and high-school social-studies practice example inform a proposed support–response–later reduced-support sequence. These are practice guidance/vignettes without an experimental comparator. They do not validate autonomous support selection or prove growth from one successful supported response.

### S58: Automated error-analysis feasibility and limits

[Mizumoto (2025), Auto Error Analyzer](https://doi.org/10.1017/S0272263125100934), Evaluation of the tool's performance / Concluding remarks, read by lead. Validation used 100 Japanese university EFL essays, expert annotations, Llama3.3; reported micro precision .96, recall .94, F1 .95. Raters trained with additional model-analyzed examples. Genre/population, category definitions, dialect sensitivity, and context-dependent errors constrain transfer. This is no estimate for Socra or Illinois adolescents. Correlation in error totals is separate from instance-level agreement; no learning-effect claim follows.

### S59: Adolescent vocabulary/form and comprehension

[Reed, Petscher & Foorman (2016)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4905721/), Methods, results and Limitations, read by lead. Archival Florida sample: 2,813 students, grades6–10; 14% classified as EL. Vocabulary/form measures relate to comprehension, but limited construct measurement and unavailable detailed EL language/proficiency data constrain inference. Correlation/mediation models are not causal diagnosis or level-specific error frequencies. Useful rationale for separating meaning, form, and comprehension hypotheses.

### S60: Error-type evaluation methods

- [Bryant, Felice & Briscoe (2017), ERRANT](https://aclanthology.org/P17-1074.pdf), abstract and §§2–4 inspected by lead: extracts/classifies edits from original/corrected pairs. Useful annotation/evaluation machinery, not a detector proving a rewrite is necessary or identifying reading causes.
- [Bryant et al. (2019), BEA shared task](https://aclanthology.org/W19-4406.pdf), dataset/method sections and AppendixA.2 inspected: proficiency/error-type performance varies. CEFR corpus categories cannot be converted to WIDA, and historical correction benchmarks do not establish current chat performance.
- S41 rechecked §§3.3–4.1: human annotation disagreement and oracle upstream labels reinforce separate evaluation of detection, classification, span grounding, and feedback.

### S61: Additional IES instructional evidence

Agent read selected sections and visually checked evidence tables; underlying studies not all individually re-reviewed.

- [2014 EL guide](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/english_learners_pg_040114.pdf), extends S09: printed pp.4–7,59–62 / PDF11–14,66–69. Further assessment distinguishes foundational reading and comprehension needs. Classroom instructional evidence is not a diagnostic sensitivity/specificity estimate.
- [2022 grades4–9 intervention guide](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/WWC-practice-guide-reading-intervention-full-text.pdf), printed pp.1–4,21–25,32–33,44–45,59–61,70–71. Question/source wording and pronoun reference appear on p.45; monitoring/repair pp.59–61. Broad struggling-reader scope, not EL-specific guidance or a WIDA taxonomy. Recommendations evaluate instructional packages.
- [2008 adolescent literacy guide](https://ies.ed.gov/ncee/wwc/docs/practiceguide/adlit_pg_082608.pdf), printed pp.7–8,16–17,21–22,31–33. Strong ratings for vocabulary/explicit comprehension, moderate discussion evidence. Discussion studies include quasi-experimental/correlational limitations. Human-classroom effects do not establish AI conversation effects.

### S62: Original seventh-grade social-studies experiments

[Vaughn et al. (2009)](https://meadowscenter.org/wp-content/uploads/2022/04/JREE-Vaughn-20091.pdf), DOI10.1080/19345740903167018. Agent read methods pp.303–305, measures309–310, discussion/limitations318–320; lead checked paper/abstract. Texas samples381/507 included97/106ELs; section-randomized multicomponent instruction versus usual instruction. Curriculum-linked outcomes favored intervention, but component effects, maintenance, and generalized transfer are limited. Authors note written response demands can obscure content understanding. Close humanities precedent, not a WIDA-level or AI-detection study.

### S63: Reading, learner variation, and diagnostic boundaries

Agent read these official guidance sources:

- [WIDA reading/science-of-reading article](https://wida.wisc.edu/news/answering-your-questions-multilingual-learners-and-science-reading), May12,2025, How Does… sections: background/language/word-recognition considerations; expert synthesis, not an experiment.
- [WIDA long-term EL discussion](https://wida.wisc.edu/news/reframing-how-we-think-about-our-long-term-english-learners-ltels), February2,2026, introduction/Important Considerations: opportunity and strengths; no inference of educational history from response style.
- [ISBE ELs with IEPs](https://www.isbe.net/Pages/EL-IEPs.aspx), Statutory Requirements, and [WIDA disability-identification bulletin](https://wida.wisc.edu/sites/default/files/resource/FocusBulletin-Identifying-Multilingual-Learners-Specific-Learning-Disabilities.pdf), November2023 **updated June2025**, pp.6–8,10–11: multiple evidence sources, access conditions, and team judgment. No automatic disability classification or specialist referral questionnaire is proposed for Socra.

### Synthesis and critique outcome

The new research document contains 24 original case cards, a form-feedback subcatalog, all-level/grade-band planning contexts, a staged identification proposal, and an evaluation design. Independent critique corrected negation logic, domain provenance, multilingual-response interpretation, profile routing, assistance consistency, and comparator confounding. These are document/design reviews; no new model evaluation or student study was run.

**Prototype adaptation, 2026-11-20:** `demo/src/language-cases.ts` adapts the catalog into 24 original Glaucon-task examples and 24 separate comparisons for the existing card UI. Basis text points to the reviewed sources above; none of these examples is a published student response or model finding. Cases C04/C14 explicitly withhold a category inference because the fixed task lacks the necessary opportunity. Independent content critique refined C11 attribution, C17's overlap with C15, and the pattern-specific scope of expectation labels. The library is read-only and generates no AI follow-ups. Software/browser checks establish interface operation only; no detector accuracy, level-specific prevalence, or educational validity was established.


### S64: Geographic map asset provenance — 2026-11-20

Official [TopoJSON us-atlas repository](https://github.com/topojson/us-atlas), README sections “states-albers-10m.json” and “Projections”; [version 3 projected state dataset](https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json). Read the repository documentation and decoded the downloaded TopoJSON arcs into local SVG paths: 50 states plus DC, Illinois FIPS 17, Albers USA 975×610. The distribution derives from 2017 Census cartographic boundaries; simplified geography, not a location service. License retained in `demo/public/images/us-atlas-LICENSE.txt`. This is interface provenance, not educational evidence.

### S65: Structured detector implementation and actual check — 2026-11-20

Official [Gemini structured output documentation](https://aistudio.google.com/docs/structured-output), “Structured output examples” and schema limitations, read for the dedicated JSON-schema integration. The initial detector request used the existing configured model and produced a retained HTTP 400: schema constraint state space too large. One live call, zero accepted observations; remaining two smoke cases not run after the stop condition. The provider grammar was simplified, with stricter Zod limits retained locally; at that stage no live recheck had been performed. See `demo/evaluations/language-live-smoke.json` for the preserved initial failure and README for the separate 93-test/browser evidence. This is an implementation result, not support for detector accuracy, WIDA alignment, fairness, or student outcomes. Repair provenance can be structurally checked; recognizing an omitted or misinterpreted repair still requires semantic/teacher review.

**Readiness recheck later on 2026-11-20:** Three new requests on C06 example/comparison and C10 example returned accepted structured observations using prompt v2 and unchanged `gemini-3.1-flash-lite`, without retries or model substitution. Record: `demo/evaluations/language-live-smoke-2026-11-20T19-03-04.863Z.json`. Lead inspected actual outputs: C06 example correctly identified the changed purpose of the agreement; C06 comparison acknowledged the protective motive but flagged missing connection to the full assignment, not a clean no-flag/strength result; C10 returned difficulty instead of unclear and an additional unsupported C11 attribution difficulty. Exact quotations therefore do not prevent semantic overflagging. This verifies limited live integration, not accuracy, fairness, or pedagogical validity. The 14-case plan is still not a completed evaluation. All 93 offline tests and the build passed again.

### Deployment implementation references — 2026-11-20

- Official platform documentation: [Vercel Node.js runtime](https://vercel.com/docs/functions/runtimes/node-js), sections “Creating a Node.js Function,” “Using TypeScript,” and “Node.js helpers”: shared API entry, TypeScript support, and parsed request bodies. [vercel.json](https://vercel.com/docs/project-configuration/vercel-json), “rewrites”: routing paths to that function. These are deployment mechanics, not educational evidence.
- Verified application observation: the public frontend at `https://socra-el-demo.vercel.app/` loaded while `/api/config` returned HTTP 404 and text “The page could not be found.” The repository then had no Vercel API entry point. Added a shared API adapter and deployment configuration, with explicit in-memory session limits and no hosted background comparison jobs. Offline regression checks are software evidence only.
