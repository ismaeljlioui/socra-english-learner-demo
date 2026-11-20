export const task = {
  id: "glaucon-justice-v1",
  version: "0.1",
  rubricVersion: "0.1",
  policyVersion: "0.1",
  title: "Justice & its reasons",
  source: "Plato, Republic · Book II, 358e–359a · Benjamin Jowett translation",
  sourceUrl: "https://www.gutenberg.org/files/55201/55201-h/55201-h.htm",
  passages: [
    {
      id: "P1",
      text: "They say that to do injustice is, by nature, good; to suffer injustice, evil; but that the evil is greater than the good.",
    },
    {
      id: "P2",
      text: "And so when men have both done and suffered injustice and have had experience of both, not being able to avoid the one and obtain the other, they think that they had better agree among themselves to have neither; hence there arise laws and mutual covenants; and that which is ordained by law is termed by them lawful and just.",
    },
  ],
  context:
    "Glaucon presents an account of justice for Socrates to examine. Distinguish that account from your own position. You do not need knowledge of the rest of the book.",
  question:
    "Would justice still matter morally if it brought no practical advantages, such as safety or a good reputation? Explain your position and relate it to the account in the passage.",
  instruction:
    "Give your first response in your own words. You may disagree with the passage. Exact quotations and technical philosophy terms are not required. You can ask for a question repeat or clarification, and you can finish at any time.",
  learningNote:
    "The passage describes an agreement people make to avoid suffering injustice. The assignment asks you to consider whether justice could matter for a reason other than practical benefits. You may agree or disagree with the account; explain your reasoning.",
} as const;
export const glossary = {
  reputation: "What other people think about a person.",
  practical_advantages: "Useful results or benefits.",
} as const;
export const templates = {
  repeat_question: task.question,
  clarify_question:
    "Imagine that justice gave people none of the practical advantages named in the question. Would it still matter morally? Explain your view and connect it to the passage.",
  define_incidental: "",
  content_help_deferred:
    "Explaining that concept would add subject help. You can continue with your current understanding, or finish this part and open the learning note.",
  clarify_meaning: "Could you explain what you mean in your last response?",
  acknowledge_wait:
    "Take your time. Send your response when you're ready, or choose Finish.",
  respect_boundary:
    "You can discuss the passage or a hypothetical position without sharing personal experiences. You can also choose Finish.",
  probe_source:
    "In your own words, what account of justice does the passage present?",
  probe_reason: "What reason supports your position on the question?",
  probe_connection: "How does your position relate to an idea in the passage?",
  invite_attempt:
    "You can take either position or explain your uncertainty. What is your first thought?",
  offer_finish:
    "You can give a final response in your own words, or finish with what you have already shared.",
} as const;
export type Action = keyof typeof templates;
// Shared, bounded request shortcuts. Live mode sends their exact request text
// through the same model/controller path as a typed request.
export const supportControls: {
  id: string; label: string; description: string; group: string;
  request: string; actionId: Action; termId: keyof typeof glossary | null;
}[] = [
  { id: "repeat_question", label: "Repeat the question", description: "Read the original wording again.", group: "Understand the question", request: "Please repeat the question.", actionId: "repeat_question", termId: null },
  { id: "clarify_question", label: "Clarify the question", description: "Ask what the question is asking you to do.", group: "Understand the question", request: "What does the question mean?", actionId: "clarify_question", termId: null },
  { id: "define_reputation", label: "What is reputation?", description: "Ask for this word’s meaning.", group: "Word meanings", request: "What is reputation?", actionId: "define_incidental", termId: "reputation" },
  { id: "define_practical_advantages", label: "Practical advantages", description: "Ask what this phrase means.", group: "Word meanings", request: "What are practical advantages?", actionId: "define_incidental", termId: "practical_advantages" },
  { id: "thinking_time", label: "I need thinking time", description: "There is no timer or deadline.", group: "Make room for your thinking", request: "I need more time to think.", actionId: "acknowledge_wait", termId: null },
  { id: "keep_hypothetical", label: "Keep it hypothetical", description: "You don’t have to share personal experiences.", group: "Make room for your thinking", request: "I do not want to share personal experiences.", actionId: "respect_boundary", termId: null },
  { id: "getting_started", label: "Help me get started", description: "An invitation to share a first thought, without supplying an answer.", group: "Find a starting point", request: "I'm not sure where to start.", actionId: "invite_attempt", termId: null },
  { id: "concept_help", label: "Help with the idea of justice", description: "Ask about a concept. Subject help is deferred during this part.", group: "Find a starting point", request: "What does justice mean?", actionId: "content_help_deferred", termId: null },
];
export const supportLabels: Record<Action | "learning_note", string> = {
  repeat_question: "Question repeated", clarify_question: "Question clarified", define_incidental: "Word meaning",
  acknowledge_wait: "Thinking time", respect_boundary: "Personal boundary respected", invite_attempt: "Invitation to start",
  content_help_deferred: "Concept help deferred", clarify_meaning: "Meaning clarification",
  probe_source: "Follow-up about the passage", probe_reason: "Follow-up about your reason", probe_connection: "Follow-up about the connection",
  offer_finish: "Invitation to finish", learning_note: "Learning note · substantive help",
};
export type Criterion = "C1" | "C2" | "C3";
export const criteria: Record<
  Criterion,
  { title: string; description: string }
> = {
  C1: {
    title: "Interpret the presented account",
    description:
      "Explains the connection between doing/suffering injustice and the agreement in P2. Mentioning laws alone is insufficient; do not assume Glaucon endorses every claim.",
  },
  C2: {
    title: "State and support a position",
    description:
      "A position on the hypothetical with a reason, including qualified or uncertain positions. No preferred moral position or grammar standard.",
  },
  C3: {
    title: "Relate position to the passage",
    description:
      "An accurate relevant source idea and an explained agreement, disagreement, or limitation. A quotation alone is insufficient.",
  },
};
export const states = [
  "evidence_present",
  "partial",
  "unclear",
  "not_yet_observed",
  "contradicted_by_response",
] as const;
export type EvidenceState = (typeof states)[number];
export const probeCriteria: Partial<Record<Action, Criterion>> = {
  probe_source: "C1",
  probe_reason: "C2",
  probe_connection: "C3",
};
export const categories: Record<Action | "learning_note", string> = {
  repeat_question: "access",
  clarify_question: "access",
  define_incidental: "access",
  content_help_deferred: "administrative",
  clarify_meaning: "meaning_repair",
  acknowledge_wait: "administrative",
  respect_boundary: "administrative",
  probe_source: "targeted_probe",
  probe_reason: "targeted_probe",
  probe_connection: "targeted_probe",
  invite_attempt: "general_elicitation",
  offer_finish: "administrative",
  learning_note: "content_assistance",
};
export function renderAction(
  action: Action,
  termId: keyof typeof glossary | null = null,
) {
  if (action === "define_incidental") {
    if (!termId || !(termId in glossary))
      throw new Error("Unknown glossary term.");
    return glossary[termId];
  }
  if (termId !== null) throw new Error("Unexpected glossary payload.");
  return templates[action];
}
