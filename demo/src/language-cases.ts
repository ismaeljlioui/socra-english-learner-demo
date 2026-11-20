import { task } from "./task";

export type CaseStatus = "difficulty" | "unclear" | "strength" | "insufficient" | "limitation";
export const caseStatusLabels: Record<CaseStatus, string> = {
  difficulty: "Specific mismatch",
  unclear: "Meaning unclear",
  strength: "Meaning communicated",
  insufficient: "Insufficient evidence",
  limitation: "Evidence limitation",
};
export interface CaseTurn {
  role: "student" | "assistant";
  text: string;
  assistance?: "clarification" | "substantive";
}
export interface CaseExample {
  prior: CaseTurn[];
  studentText: string;
  status: CaseStatus;
  observation: string;
}
export interface LanguageCase {
  id: string;
  title: string;
  group: string;
  focus: string;
  scope: "in_task" | "not_elicited" | "input_boundary";
  context: string;
  sourceIds: (typeof task.passages)[number]["id"][];
  example: CaseExample;
  comparison: CaseExample;
  watchFor: string;
  basis: string;
}
const example = (studentText: string, status: CaseStatus, observation: string, prior: CaseTurn[] = []): CaseExample => ({ studentText, status, observation, prior });
const student = (text: string): CaseTurn => ({ role: "student", text });
const guide = (text: string, assistance: CaseTurn["assistance"] = "clarification"): CaseTurn => ({ role: "assistant", text, assistance });

// Original, provisional examples for the fixed Glaucon task. These are not model
// results, WIDA test items, level assignments, or evidence of error prevalence.
// The comparison is an alternative transcript, never a continuation of the example.
export const languageCases: LanguageCase[] = [
  {
    id: "C01", title: "Answering a different task", group: "Task & word access",
    focus: "Check whether the response addresses the requested position and connection to the passage.", scope: "in_task",
    context: "The student has finished this response. No additional position or explanation appears in the transcript.", sourceIds: [],
    example: example("Plato wrote the Republic. Glaucon is talking to Socrates in Book II.", "insufficient", "The response gives background information, but does not address whether justice matters without practical advantages. Task misunderstanding is only one possible explanation."),
    comparison: example("I think justice would still matter without a reward because harming someone is wrong. The passage explains an agreement through its benefits, but benefits are not my only reason.", "strength", "The response addresses the hypothetical and connects the student's own reason to the account."),
    watchFor: "Do not turn an off-task or incomplete response into a claim about reading ability. Check what was actually asked and whether the turn is complete.",
    basis: "WIDA Reading Conference Planning, p.1. Task-opportunity rule and these examples are our proposed adaptation; research catalog C01.",
  },
  {
    id: "C02", title: "A word means something else here", group: "Task & word access",
    focus: "Compare an explicitly stated word meaning with its use in the question or passage.", scope: "in_task",
    context: "The question gives safety and a good reputation as examples of practical advantages.", sourceIds: [],
    example: example("Practical advantages means being skilled at practical jobs, so the question asks whether justice helps people build things.", "difficulty", "The response interprets practical advantages as practical job skills, which does not fit the benefits named in this question."),
    comparison: example("I understand practical advantages as useful benefits, like safety. I am not sure whether justice needs those benefits to matter.", "strength", "The phrase is understood in context. Uncertainty about the philosophical answer is not a vocabulary error."),
    watchFor: "Asking for a definition is not itself a misconception. Do not reject another meaning when the context genuinely permits it.",
    basis: "WIDA Reading Conference Planning, p.2, word knowledge; WIDA word/phrase descriptors. Original task-specific cases; research catalog C02.",
  },
  {
    id: "C03", title: "A word part changes the meaning", group: "Task & word access",
    focus: "Look for an explicit interpretation of a word part, rather than diagnosing from spelling alone.", scope: "in_task",
    context: "The learner explicitly explains how they interpreted injustice.", sourceIds: ["P1"],
    example: example("I read the in- in injustice as inside, so injustice means acting inside justice and treating people fairly.", "difficulty", "The stated interpretation of injustice as fair treatment conflicts with its meaning in the passage. Here the learner explicitly attributes that reading to the prefix."),
    comparison: example("Injustice means unfair treatment here. Many person agree to avoid it.", "strength", "The meaning of injustice is communicated. The missing plural form in person does not erase the expressed plurality."),
    watchFor: "A word-meaning mismatch alone does not prove that a prefix caused it. Do not confuse a surface ending error with failure to understand quantity.",
    basis: "Reed et al. (2016) offers indirect vocabulary/form evidence; ERRANT supplies form-annotation conventions. The detection rule is proposed; research catalog C03.",
  },
  {
    id: "C04", title: "Figurative language: no clear opportunity", group: "Task & word access",
    focus: "Recognize when the fixed task does not provide enough evidence for a category.", scope: "not_elicited",
    context: "This short excerpt does not provide a clear figurative-language interpretation task. The examples below do not establish a literal misreading.", sourceIds: ["P1"],
    example: example("The evil is greater than the good means that the harm from suffering injustice outweighs the benefit of doing it.", "insufficient", "This is an interpretation of the stated comparison. It does not reveal a figurative-language difficulty."),
    comparison: example("I think justice matters even when there is no reward.", "insufficient", "The response gives no evidence about figurative language. Do not invent a difficulty to fill this category."),
    watchFor: "Testing literal versus figurative interpretation would require suitable text and a relevant response. Keep this case as a no-flag boundary for the current task.",
    basis: "WIDA language arts expectations and reading word-knowledge guidance motivate the broader category. Its absence here is a task-fit decision; research catalog C04.",
  },
  {
    id: "C05", title: "Who does what is reversed", group: "Sentence meaning",
    focus: "Compare the actors and actions in the response with the source.", scope: "in_task",
    context: "P2 describes people agreeing among themselves, followed by the emergence of laws.", sourceIds: ["P2"],
    example: example("The laws are the ones who agree with each other. The people do not make the agreement.", "difficulty", "The response explicitly assigns the agreement to laws rather than to the people described in P2."),
    comparison: example("People agree with each other. Laws come from that agreement.", "strength", "The actors and relationship are clear, even in two short sentences."),
    watchFor: "Distinguish an explicit actor reversal from figurative shorthand or an omitted actor that is clear in context.",
    basis: "WIDA language arts Inform and social studies Explain. Actor/action comparison is our operational rule; research catalog C05.",
  },
  {
    id: "C06", title: "A reason or relationship changes", group: "Sentence meaning",
    focus: "Check whether the student's interpretation preserves the stated purpose or causal relationship.", scope: "in_task",
    context: "This example concerns the source account, not the student's independent moral position.", sourceIds: ["P1", "P2"],
    example: example("In the passage, they make the agreement so they can do more injustice to other people.", "difficulty", "The response makes increased injustice the agreement's purpose. P2 describes an agreement to have neither doing nor suffering injustice."),
    comparison: example("They make agreement because they no want get hurt. They agree not hurt each other.", "strength", "The response communicates the protective reason and mutual restraint despite grammatical differences."),
    watchFor: "A missing because does not mean a missing connection. A student's disagreement with the account is not a source-reading error.",
    basis: "WIDA language arts Argue / social studies Explain; TELPAS grades 10–12 rationale item6 provides a relationship example. Original Glaucon adaptation; research catalog C06.",
  },
  {
    id: "C07", title: "Negation or quantity is overstated", group: "Sentence meaning",
    focus: "Compare the scope of claims such as none, every, always, and never.", scope: "in_task",
    context: "The excerpt describes the people in this account; it does not make a universal claim about every individual in every situation.", sourceIds: ["P2"],
    example: example("The passage says no person can ever avoid any injustice, in any situation.", "difficulty", "The response adds universal person, time, and situation claims that the excerpt does not establish."),
    comparison: example("The people in this account cannot secure the benefits they want while avoiding the harm, so they agree with each other.", "strength", "The interpretation remains tied to the account rather than asserting an unlimited universal rule."),
    watchFor: "Distinguish an unsupported strengthening from a logical contradiction. Do not infer scope from one word without reading the full statement.",
    basis: "Proposed precision/scope check aligned with WIDA Inform/Argue; TELPAS grades 8–9 rationale item30 offers an overgeneralization analogue; research catalog C07.",
  },
  {
    id: "C08", title: "Advice becomes a requirement", group: "Sentence meaning",
    focus: "Check whether the response changes a judgment, possibility, permission, or obligation.", scope: "in_task",
    context: "The phrase had better agree appears inside an account of what the people think.", sourceIds: ["P2"],
    example: example("Had better agree means a law already requires them to agree. They are obeying that existing legal requirement.", "difficulty", "The response turns the people's judgment about agreeing into a pre-existing legal obligation. P2 instead presents laws as arising from the agreement."),
    comparison: example("They think agreeing would be better for them. That does not mean an earlier law forced them to agree.", "strength", "The response preserves the difference between a judgment about an agreement and a legal requirement."),
    watchFor: "This overlaps source interpretation and sequence. Record the expressed mismatch without claiming that a modal-language weakness caused it.",
    basis: "WIDA language arts/social studies Argue and qualification/stance language. The particular modal-force check is proposed; research catalog C08.",
  },
  {
    id: "C09", title: "Events are put in a different order", group: "Sentence meaning",
    focus: "Compare the sequence explicitly asserted in the response with the source.", scope: "in_task",
    context: "P2 moves from experience of injustice to agreement and then the emergence of laws.", sourceIds: ["P2"],
    example: example("First the laws arise. Only afterward do the people decide to make the agreement that the passage describes.", "difficulty", "The response places the laws before the agreement, reversing the order expressed by hence there arise laws."),
    comparison: example("They experience injustice, agree to have neither kind of it, and laws arise from the agreement.", "strength", "The response preserves the passage's stated sequence."),
    watchFor: "A present-tense retelling can preserve sequence. Sequence alone does not establish every possible causal claim.",
    basis: "WIDA Narrate/Explain; TELPAS grades 6–7 item21 and grades 10–12 items8/30 rationales; research catalog C09.",
  },
  {
    id: "C10", title: "A reference is unclear", group: "Source & connections",
    focus: "Check whether a pronoun or phrase has more than one plausible meaning in the existing transcript.", scope: "in_task",
    context: "Glaucon and Socrates have both been named. No later turn identifies the two pronouns.", sourceIds: [],
    example: example("He disagrees with him.", "unclear", "The response does not establish which person disagrees or whose position is being described.", [student("Glaucon and Socrates are the two people in the task context.")]),
    comparison: example("He presents the account for Socrates to examine.", "strength", "The preceding sentence supplies Glaucon as the clear referent of he.", [student("Glaucon is the speaker I am discussing.")]),
    watchFor: "Read earlier turns before flagging a pronoun. Do not guess the intended referent or add an AI follow-up.",
    basis: "WIDA cohesion descriptors; IES 2022 reading guide, printed p.45, pronoun references. Original conversation rule; research catalog C10.",
  },
  {
    id: "C11", title: "The source and the student's view mix", group: "Source & connections",
    focus: "Keep the presented account separate from the learner's own position.", scope: "in_task",
    context: "The student explicitly attributes the claim to the supplied passage.", sourceIds: ["P1", "P2"],
    example: example("The passage says people choose justice only because it is morally valuable in itself, even without benefits. That is what its agreement is based on.", "difficulty", "The response attributes the student's intrinsic-value explanation to an account organized around the relative benefits and harms of injustice.", [student("My own view is that justice is morally valuable in itself, even without benefits.")]),
    comparison: example("The passage explains agreement through protection from harm. My own view is different: justice can matter even when it gives no benefits.", "strength", "The student's position is explicitly distinguished from the account."),
    watchFor: "Do not assume Glaucon personally endorses every proposition he presents. Disagreement with the passage is allowed.",
    basis: "WIDA Narrate/Argue and Reading Observation Tool, perspective. Attribution rules are proposed; research catalog C11.",
  },
  {
    id: "C12", title: "A summary changes the main idea", group: "Source & connections",
    focus: "Check an explicitly offered summary against the source's central relationship.", scope: "in_task",
    context: "The learner introduces the response as a summary of the account.", sourceIds: ["P1", "P2"],
    example: example("My summary of the passage is that doing injustice is good, so people agree to encourage everyone to do it.", "difficulty", "The summary retains one part of P1 but changes the agreement in P2 into encouragement to do injustice."),
    comparison: example("My summary is that suffering injustice is worse for them than doing it is beneficial, so they agree to have neither.", "strength", "The summary preserves the comparison and the resulting agreement without copying the passage."),
    watchFor: "A short summary can be sufficient. Do not penalize missing details that the task does not require.",
    basis: "WIDA Inform/Narrate; Reading Observation Tool; TELPAS grades 6–7 items32/35 and grades 8–9 item25; research catalog C12.",
  },
  {
    id: "C13", title: "A quotation is not in the passage", group: "Source & connections",
    focus: "Distinguish an exact quotation claim from a paraphrase or an inference that needs explanation.", scope: "in_task",
    context: "Both supplied paragraphs are available. The student claims the quotation comes from this exact excerpt.", sourceIds: ["P1", "P2"],
    example: example('This excerpt says, "Justice is good even when it helps nobody." That exact quote proves my view.', "difficulty", "The claimed exact quotation cannot be found in the supplied excerpt. This does not establish dishonesty or its cause."),
    comparison: example('My paraphrase is that people agree to avoid harming each other. The exact phrase I am referring to is "agree among themselves to have neither".', "strength", "The response distinguishes a paraphrase from a quotation that is present in P2."),
    watchFor: "Do not require paraphrases to match exact strings. Check source completeness and translation before interpreting a quotation mismatch.",
    basis: "WIDA language arts/social studies Argue motivates source evidence. Exact-quote matching and separate inference labels are our design; research catalog C13.",
  },
  {
    id: "C14", title: "Comparing sources: only one is supplied", group: "Source & connections",
    focus: "Avoid asserting a cross-source difficulty when the assignment has only one source account.", scope: "not_elicited",
    context: "P1 and P2 are two paragraphs from the same excerpt, not two independent sources. The assignment remains unchanged.", sourceIds: ["P1", "P2"],
    example: example("P1 introduces benefits and harms. P2 describes the agreement that follows.", "insufficient", "This relates two paragraphs within one source. It provides no opportunity to assess comparison between independent sources."),
    comparison: example("The passage explains justice through benefits, while I think it can matter without them.", "insufficient", "Comparing the source with the student's own view is relevant here, but is not evidence of comparing two supplied sources."),
    watchFor: "Keep this as a no-flag boundary. Testing cross-source conflation would require a different assignment with multiple sources.",
    basis: "WIDA social studies Explain/Argue and Reading Observation Tool, synthesis. Task eligibility is our safeguard; research catalog C14.",
  },
  {
    id: "C15", title: "The evidence connection is not expressed", group: "Argument & expression",
    focus: "Check whether the relationship between the student's position and the passage is expressed anywhere in the transcript.", scope: "in_task",
    context: "These are the student's complete available responses. The fixed task asks them to relate their position to the passage.", sourceIds: ["P2"],
    example: example("Justice matters. People make agreements.", "insufficient", "A position and a source-related statement are present, but their relationship has not been explained. This does not show that the student cannot reason."),
    comparison: example("The account explains agreement through its protective benefits. I think justice matters beyond those benefits because people deserve fair treatment even without a reward.", "strength", "The response makes the contrast between the account's benefits and the student's independent reason recoverable."),
    watchFor: "Do not demand a particular connector or repeat a connection already expressed in earlier turns. The same missing evidence receives the same label at every WIDA level.",
    basis: "WIDA language arts/social studies Argue; TELPAS grades 10–12 item31 evidence relevance. Proposed observation boundary; research catalog C15.",
  },
  {
    id: "C16", title: "An opposing view is not endorsement", group: "Argument & expression",
    focus: "Track whose claim is being discussed and whether the student endorses or rejects it.", scope: "in_task",
    context: "The example tests whether the detector falsely treats an acknowledged objection as the student's final position.", sourceIds: [],
    example: example("Some people say justice matters only when it brings benefits. However, I disagree: treating others fairly can matter even without a reward.", "strength", "The student presents an opposing view and explicitly rejects it. Do not label the student as endorsing the benefits-only position."),
    comparison: example("Justice matters only when it brings benefits. It matters even when it brings no benefits.", "unclear", "The two statements appear to conflict, with no expressed attribution or qualification to resolve them. Do not silently choose the student's position."),
    watchFor: "The example is deliberately a no-error case. Acknowledging a counterargument, revising a view, or expressing a conditional position is not automatically inconsistency.",
    basis: "WIDA language arts/social studies Argue, competing positions. Proposition attribution is our proposed method; research catalog C16.",
  },
  {
    id: "C17", title: "Connections across messages are unclear", group: "Argument & expression",
    focus: "Read across turns and locate the specific unresolved connection.", scope: "in_task",
    context: "The learner moves between the agreement's benefits and their view about justice without benefits. No later message explains the asserted supporting relationship.", sourceIds: [],
    example: example("My view is that justice matters without benefits. Protection is a benefit. That supports my view.", "unclear", "The relation between the protective benefit and the claim about justice without benefits remains unexplained across these messages. This overlaps C15; it does not diagnose a separate organizational weakness.", [student("The agreement protects people from injustice.")]),
    comparison: example("My own reason is different: fairness matters even without protection or reward.", "strength", "The two turns clearly connect and distinguish the account from the student's view.", [student("The passage explains the agreement as protection from harm.")]),
    watchFor: "Short messages, nonlinear organization, or lack of paragraphs are not themselves problems. Identify the relationship that cannot be recovered.",
    basis: "WIDA discourse organization/cohesion and Reading Observation Tool, discussion. Cross-turn reconstruction is our design; research catalog C17.",
  },
  {
    id: "C18", title: "A word choice leaves meaning unclear", group: "Argument & expression",
    focus: "Identify the exact expression that makes the learner's intended meaning uncertain.", scope: "in_task",
    context: "There is no earlier statement identifying what thing or stuff refers to.", sourceIds: [],
    example: example("Justice matters because the thing does the stuff for people.", "unclear", "The response does not specify the action or benefit offered as the reason."),
    comparison: example("Justice matters because it means treating people fairly even when nobody rewards you.", "strength", "Everyday words express a specific position and reason; technical terms are not required."),
    watchFor: "This concerns expression, not proof of misunderstood source vocabulary. Do not replace a clear everyday word just because a formal one exists.",
    basis: "WIDA word/phrase precision. The expression-versus-source-word distinction is our proposed categorization; research catalog C18.",
  },
  {
    id: "C19", title: "Grammar and meaning are separate", group: "Argument & expression",
    focus: "Check whether a form issue actually obscures the proposition the student is expressing.", scope: "in_task",
    context: "The example is a positive control: the language has grammatical differences, but its meaning is recoverable.", sourceIds: ["P2"],
    example: example("People makes agreement. They no want hurt each other. I think justice matter even no reward because people deserve fair treatment.", "strength", "The response communicates the agreement, a position, and a reason despite agreement and verb-form differences."),
    comparison: example("People justice hurt by agree no them.", "unclear", "The words do not establish a recoverable relationship among people, harm, and agreement. Preserve uncertainty rather than inventing a corrected meaning."),
    watchFor: "Do not equate grammatical accuracy with understanding, or correct dialect and informal chat automatically. Form feedback is separate from a meaning flag.",
    basis: "TELPAS/ELPAC annotated writing; ERRANT and Coyne et al. for annotation methods. Meaning-impact priority is proposed; research catalog C19.",
  },
  {
    id: "C20", title: "A chat fragment can be a full answer", group: "Argument & expression",
    focus: "Interpret a reply together with the question it answers.", scope: "in_task",
    context: "The guide turn is a prewritten part of this example, not a new AI follow-up.", sourceIds: [],
    example: example("Because people deserve fair treatment, even without a reward.", "strength", "The because clause answers the preceding why question. It is not an incomplete explanation merely because it is a sentence fragment.", [student("I think justice would still matter without benefits."), guide("What reason supports your position?")]),
    comparison: example("Because", "insufficient", "The transcript ends before a reason is expressed. An unfinished message does not establish a language weakness.", [student("I think justice would still matter without benefits."), guide("What reason supports your position?")]),
    watchFor: "Do not run essay-style sentence checks on isolated chat turns. Keep incomplete input distinct from an observed misconception.",
    basis: "Original conversational safeguard; written-error methods do not validate transfer to chat. Research catalog C20.",
  },
  {
    id: "C21", title: "A later correction changes the record", group: "Process & safeguards",
    focus: "Recognize an explicit self-correction while preserving the earlier statement.", scope: "in_task",
    context: "The student corrects their own interpretation without receiving a supplied explanation.", sourceIds: ["P2"],
    example: example("I need to correct that. They agree to avoid doing and suffering injustice, not to encourage it.", "strength", "The learner explicitly repairs the earlier interpretation. Keep the history, but do not present the earlier error as their unresolved current view.", [student("They agree so everyone can do more injustice.")]),
    comparison: example("They agree to encourage injustice. They agree to avoid it.", "unclear", "Both interpretations appear without an explicit correction or a clear distinction. The current intended interpretation remains unresolved."),
    watchFor: "An explicit revision is not inconsistency to penalize. Separate self-repair from repetition of an explanation already supplied by the guide.",
    basis: "WIDA Reading Conference Planning, comprehension monitoring; IES 2022 pp.59–61. Updating the conversation record is our design; research catalog C21.",
  },
  {
    id: "C22", title: "Help changes what the answer shows", group: "Process & safeguards",
    focus: "Keep substantive help attached to the response it may have supported.", scope: "in_task",
    context: "The example deliberately supplies subject content before the learner repeats it. This is an authored assistance setup, not an observed model failure.", sourceIds: ["P2"],
    example: example("They agree to avoid doing and suffering injustice.", "limitation", "The response follows the same explanation supplied by the guide. Record the assistance; it cannot alone establish an independent interpretation.", [guide("The account says they agree to avoid doing and suffering injustice.", "substantive")]),
    comparison: example("That was my reading too.", "strength", "The learner's earlier interpretation predates the guide's explanation and remains independent evidence.", [student("They agree to avoid doing and suffering injustice."), guide("The account says they agree to avoid doing and suffering injustice.", "substantive")]),
    watchFor: "Wording overlap alone does not prove copying or lack of understanding. Check timing and preserve independent evidence given before assistance.",
    basis: "WIDA scaffolding context informs interpretation; assistance provenance and timing rules are our product design. Research catalog C22.",
  },
  {
    id: "C23", title: "More than one language is not confusion", group: "Process & safeguards",
    focus: "Separate communicated meaning, language-interpretation limits, and evidence of English expression.", scope: "in_task",
    context: "The comparison's Spanish interpretation is authored review guidance, not a translation generated by the demo.", sourceIds: [],
    example: example("Justice means justicia to me: treating people fairly. It can matter even if nobody rewards you.", "strength", "The learner explains the Spanish word in English and communicates a clear position. The language switch is not a misconception."),
    comparison: example("La justicia importa incluso sin recompensa, porque las personas merecen un trato justo.", "limitation", "A competent Spanish reader can interpret this as justice mattering without reward because people deserve fair treatment. It is not evidence of English written production; the system must not invent an interpretation if it cannot reliably read it."),
    watchFor: "Preserve the original language. A correct translated interpretation must not be graded as if the student wrote that English translation.",
    basis: "WIDA Reading Conference Planning p.2, Reading Observation Tool, and reader-portrait guidance. Interpretation boundaries are proposed; research catalog C23.",
  },
  {
    id: "C24", title: "Input quality limits the conclusion", group: "Process & safeguards",
    focus: "Recognize missing input before interpreting a student's understanding.", scope: "input_boundary",
    context: "Authored missing-input simulation: the turn text is unavailable. The original answer and the cause of its loss are unknown. No audio was collected or tested.", sourceIds: [],
    example: example("", "limitation", "There is no response text to interpret. Do not infer a misconception, refusal, or low proficiency from this missing record."),
    comparison: example("I need more time to think.", "insufficient", "This is an explicit request for thinking time. It provides no substantive answer yet and is not an input failure or evidence of misunderstanding."),
    watchFor: "Speech recognition could later change a word or lose a negation. This text-only case does not test audio accuracy or diagnose an input failure's cause.",
    basis: "Prior speech findings (S10) motivate the future risk; the missing-input gate is our proposed safeguard. Research catalog C24.",
  },
];
