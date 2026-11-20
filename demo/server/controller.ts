import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  categories,
  criteria,
  glossary,
  probeCriteria,
  renderAction,
  states,
  task,
  templates,
  supportControls,
  type Action,
  type Criterion,
} from "../src/task";
import type {
  Dialogue,
  Evidence,
  ModelAdapter,
  Observation,
  Phase,
  Proposal,
  Session,
  Turn,
} from "../src/types";

const id = () => randomUUID();
const now = () => new Date().toISOString();
export class DemoError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
const observationSchema = z
  .object({
    criterionId: z.enum(["C1", "C2", "C3"]),
    state: z.enum(states),
    studentTurnId: z.string().nullable(),
    quote: z.string().max(8000),
    explanation: z.string().max(4000),
    unresolvedIssue: z.string().max(4000),
  })
  .strict();
const commonSchema = {
  actionId: z.enum(Object.keys(templates) as [Action, ...Action[]]),
  termId: z.enum(["reputation", "practical_advantages"]).nullable(),
  observations: z.array(observationSchema).max(60),
  unresolvedQuestions: z.array(z.string().max(4000)).max(30),
};
export function createSession(options: {
  mode: "fixture" | "live";
  condition: "policy" | "baseline";
  fixtureId?: string;
  modelId?: string | null;
  generationSettings?: Record<string, unknown>;
}): Session {
  return {
    id: id(),
    taskId: task.id,
    taskVersion: task.version,
    rubricVersion: task.rubricVersion,
    policyVersion: task.policyVersion,
    condition: options.condition,
    mode: options.mode,
    modelId: options.modelId ?? null,
    generationSettings: options.generationSettings ?? {},
    phase: "eliciting",
    createdAt: now(),
    updatedAt: now(),
    turns: [],
    supportEvents: [],
    observations: [],
    probes: [],
    consecutiveRepairs: 0,
    review: null,
    revisions: [],
    attempts: [],
    fixtureId: options.fixtureId,
    fixtureIndex: 0,
    finalSkipped: false,
    error: null,
    pending: null,
    processedRequests: Object.create(null),
    reflectionIds: [],
    responseFeedback: [],
  };
}
export function effectiveCategory(session: Session, eventId: string) {
  const event = session.supportEvents.find((e) => e.id === eventId)!;
  return (
    [...session.revisions]
      .reverse()
      .find((r) => r.targetType === "support" && r.targetId === eventId)
      ?.category ??
    (event.reviewerCategory !== "unreviewed"
      ? event.reviewerCategory
      : event.plannedCategory)
  );
}
export function supportTags(session: Session, eventIds: string[]) {
  const cats = eventIds.map((e) => effectiveCategory(session, e));
  return [
    cats.includes("access") && "after_access",
    cats.includes("targeted_probe") && "after_probe",
    cats.includes("content_assistance") && "after_content_assistance",
  ].filter(Boolean) as string[];
}
export function addStudent(
  session: Session,
  text: string,
  tags: string[] = [],
): Turn {
  if (!text.trim()) throw new DemoError("Enter a response before sending.");
  if (text.length > 8000)
    throw new DemoError("Keep each response under 8,000 characters.");
  const eventIds = session.supportEvents.map((e) => e.id);
  const turn: Turn = {
    id: id(),
    role: "student",
    text,
    timestamp: now(),
    phase: session.phase,
    precedingSupportEventIds: eventIds,
    adjacentAssistantAction: session.turns
      .filter((t) => t.role === "assistant")
      .at(-1)?.actionId,
    tags: [...new Set([...supportTags(session, eventIds), ...tags])],
  };
  session.turns.push(turn);
  session.updatedAt = now();
  return turn;
}
export function deliver(
  session: Session,
  action: Action | "learning_note",
  requestTurnId: string | null,
  text?: string,
  termId: keyof typeof glossary | null = null,
) {
  const turn: Turn = {
    id: id(),
    role: "assistant",
    text:
      text ??
      (action === "learning_note"
        ? task.learningNote
        : renderAction(action, termId)),
    timestamp: now(),
    phase: session.phase,
    actionId: action,
    precedingSupportEventIds: session.supportEvents.map((e) => e.id),
    tags: [],
  };
  session.turns.push(turn);
  const trigger = session.turns.find((t) => t.id === requestTurnId);
  const requested =
    action === "learning_note" ||
    (!!trigger &&
      ([
        "repeat_question",
        "clarify_question",
        "define_incidental",
        "content_help_deferred",
        "acknowledge_wait",
        "respect_boundary",
      ].includes(action) ||
        (["offer_finish", "invite_attempt"].includes(action) &&
          explicitRequest(trigger.text)?.actionId === action)));
  session.supportEvents.push({
    id: id(),
    requestTurnId: requested ? requestTurnId : null,
    triggerTurnId: requestTurnId,
    actionId: action,
    plannedCategory: categories[action],
    deliveredTurnId: turn.id,
    requested,
    delivered: true,
    status:
      action === "content_help_deferred"
        ? "content_help_deferred"
        : "delivered",
    reviewerCategory: "unreviewed",
    reviewNote: "",
  });
  const criterion =
    action === "learning_note" ? undefined : probeCriteria[action];
  if (criterion) session.probes.push(criterion);
  if (action === "clarify_meaning") session.consecutiveRepairs++;
  else if (categories[action] !== "access" && action !== "acknowledge_wait")
    session.consecutiveRepairs = 0;
  if (action === "offer_finish") session.phase = "final_response";
  session.updatedAt = now();
  return turn;
}
export function validateObservations(
  session: Session,
  observations: Observation[],
  cutoff?: string | null,
) {
  const cutoffIndex = cutoff
    ? session.turns.findIndex((t) => t.id === cutoff)
    : session.turns.length - 1;
  for (const item of observations) {
    if (
      !item.studentTurnId &&
      item.quote === "" &&
      item.state === "not_yet_observed"
    )
      continue;
    const index = session.turns.findIndex((t) => t.id === item.studentTurnId);
    const turn = session.turns[index];
    if (
      !turn ||
      turn.role !== "student" ||
      !item.quote ||
      !turn.text.includes(item.quote) ||
      index > cutoffIndex ||
      turn.phase === "learning"
    ) {
      throw new DemoError(
        "Evidence rejected: quote must be an exact substring of a referenced pre-help student turn.",
        422,
      );
    }
    if (item.state === "contradicted_by_response" && item.criterionId !== "C1")
      throw new DemoError(
        "A textual contradiction must concern the source account, not a moral viewpoint.",
        422,
      );
  }
  if (
    Object.keys(criteria).some(
      (c) => !observations.some((e) => e.criterionId === c),
    )
  )
    throw new DemoError(
      "Evidence must address all three criteria, including unobserved evidence.",
      422,
    );
}
export function validateProposal(
  session: Session,
  raw: unknown,
  purpose: "next" | "review" = "next",
): Proposal {
  const schema =
    session.condition === "policy"
      ? z.object(commonSchema).strict()
      : z
          .object({
            ...commonSchema,
            assistantText: z
              .string()
              .min(purpose === "review" ? 0 : 1)
              .max(4000),
          })
          .strict();
  const parsed = schema.safeParse(raw);
  if (!parsed.success)
    throw new DemoError(
      "Model output rejected: malformed structure, unknown action, or unexpected payload.",
      422,
    );
  const p = parsed.data as Proposal;
  if (
    purpose === "review" &&
    (p.actionId !== "offer_finish" || p.termId !== null)
  )
    throw new DemoError(
      "Review output must not propose a new assessment action.",
      422,
    );
  renderAction(p.actionId, p.termId);
  validateObservations(session, p.observations, session.review?.frozenCutoff);
  // A small explicit guard, not a semantic safety certificate; human review remains essential.
  const visible = [
    p.assistantText ?? "",
    ...p.observations.flatMap((e) => [e.explanation, e.unresolvedIssue]),
  ].join(" ");
  if (
    /\b(?:WIDA\s*(?:level)?\s*[1-6]|(?:low|high)[ -](?:ability|intelligence)|(?:your|student(?:'s)?)\s+(?:IQ|proficiency level)|(?:you are|student is)\s+(?:unintelligent|immoral|gifted))\b/i.test(
      visible,
    )
  )
    throw new DemoError(
      "Output rejected: unsupported learner judgment. Human review required.",
      422,
    );
  return p;
}
export function explicitRequest(
  text: string,
): { actionId: Action; termId: keyof typeof glossary | null } | null {
  const t = text.trim().toLowerCase();
  if (
    /^(?:(?:please|i want to|i would like to)\s+)?(?:finish|stop|skip)(?: now)?[.!]?$|^(?:i(?:'m| am) (?:done|finished)|use what i (?:said|shared))[.!]?$/.test(
      t,
    )
  )
    return { actionId: "offer_finish", termId: null };
  if (/(?:repeat|say again).*(?:question)|^repeat[.!]?$/.test(t))
    return { actionId: "repeat_question", termId: null };
  if (/(?:what does|clarify|explain).*(?:question)(?: mean)?/.test(t))
    return { actionId: "clarify_question", termId: null };
  if (
    /(?:what (?:is|are|does)|define|meaning of).*(?:reputation|practical advantages)/.test(
      t,
    )
  )
    return {
      actionId: "define_incidental",
      termId: t.includes("reputation") ? "reputation" : "practical_advantages",
    };
  if (
    /(?:what (?:is|are|does)|define|meaning of|tell me what).*(?:mean|justice|moral|worth|covenant)/.test(
      t,
    )
  )
    return { actionId: "content_help_deferred", termId: null };
  if (/(?:need|want).*(?:time|think)|^wait[.!]?$/.test(t))
    return { actionId: "acknowledge_wait", termId: null };
  if (/(?:don't|do not|won't).*(?:personal|my own experiences|share)/.test(t))
    return { actionId: "respect_boundary", termId: null };
  if (
    /(?:write.*answer|best answer|full marks|give (?:me )?an example|which part.*quote|^what reason\??$|^i(?:'m| am) not sure (?:where|how) to start[.!]?$)/.test(
      t,
    )
  )
    return { actionId: "invite_attempt", termId: null };
  return null;
}
function lastState(observations: Observation[], c: Criterion) {
  return observations.filter((e) => e.criterionId === c).at(-1)?.state;
}
export function enforceAction(
  session: Session,
  p: Proposal,
  requestText: string,
): {
  actionId: Action;
  termId: keyof typeof glossary | null;
  overridden: boolean;
} {
  const request = explicitRequest(requestText);
  if (request) {
    if (p.actionId !== request.actionId || p.termId !== request.termId)
      throw new DemoError(
        "Selected action does not honor the explicit request. Retry or finish.",
        422,
      );
    return { ...request, overridden: false };
  }
  const a = p.actionId;
  if (a === "clarify_meaning" && session.consecutiveRepairs >= 2)
    return { actionId: "offer_finish", termId: null, overridden: true };
  const c = probeCriteria[a];
  if (c) {
    if (session.probes.length >= 3)
      return { actionId: "offer_finish", termId: null, overridden: true };
    if (session.probes.includes(c))
      throw new DemoError(
        "Selected criterion has already received its one probe.",
        422,
      );
    if (
      !p.observations.some(
        (e) =>
          !!e.quote &&
          ["evidence_present", "partial", "contradicted_by_response"].includes(
            e.state,
          ),
      )
    )
      throw new DemoError(
        "Targeted probing requires a substantive initial response.",
        422,
      );
    const state = lastState(p.observations, c);
    if (state === "evidence_present" || state === "unclear")
      throw new DemoError(
        "Probe is ineligible: criterion is present or meaning remains unresolved.",
        422,
      );
    if (session.condition === "policy") {
      if (p.observations.some((e) => e.state === "unclear"))
        throw new DemoError(
          "Resolve ambiguous meaning before targeted probing.",
          422,
        );
      const first = (["C1", "C2", "C3"] as Criterion[]).find(
        (key) =>
          !session.probes.includes(key) &&
          lastState(p.observations, key) !== "evidence_present",
      );
      if (first !== c)
        throw new DemoError(
          "Selected probe violates the provisional C1 → C2 → C3 order.",
          422,
        );
    }
  }
  if (
    session.probes.length >= 3 &&
    ![
      "clarify_meaning",
      "acknowledge_wait",
      "respect_boundary",
      "repeat_question",
      "clarify_question",
      "define_incidental",
      "content_help_deferred",
    ].includes(a)
  )
    return {
      actionId: "offer_finish",
      termId: null,
      overridden: a !== "offer_finish",
    };
  return { actionId: a, termId: p.termId, overridden: false };
}
function markSubstantive(session: Session, p: Proposal, turnId: string) {
  const t = session.turns.find((t) => t.id === turnId)!;
  if (
    p.observations.some(
      (e) =>
        e.studentTurnId === turnId &&
        !!e.quote &&
        !["not_yet_observed", "unclear"].includes(e.state),
    )
  ) {
    t.substantive = true;
    if (
      !session.turns.some((other) => other.id !== turnId && other.substantive)
    )
      t.tags.push("initial_response");
  }
  if (p.actionId === "clarify_meaning")
    t.tags.push("uncertain_input", "needs_review");
}
function evidenceItems(session: Session, items: Observation[]): Evidence[] {
  return items.map((e) => ({
    ...e,
    id: id(),
    supportEventIds: e.studentTurnId
      ? [
          ...session.turns.find((t) => t.id === e.studentTurnId)!
            .precedingSupportEventIds,
        ]
      : [],
  }));
}
export function freeze(session: Session, finalText = "") {
  if (session.phase !== "final_response")
    throw new DemoError(
      "Finish the conversation before submitting a final response.",
    );
  if (finalText.trim())
    addStudent(session, finalText, [
      "final_response",
      ...(session.mode === "fixture" ? ["needs_review"] : []),
    ]);
  session.finalSkipped = !finalText.trim();
  session.review = {
    status: session.mode === "live" ? "pending" : "ready",
    origin:
      session.mode === "fixture" ? "authored_fixture" : "model_suggestion",
    evidence: evidenceItems(session, session.observations),
    unresolvedQuestions: [],
    unmetSupportRequestIds: session.supportEvents
      .filter((e) => e.status === "content_help_deferred")
      .map((e) => e.id),
    frozenCutoff: session.turns.at(-1)?.id ?? null,
    frozenAt: now(),
    notes: [],
  };
  session.phase = "review";
  session.pending = null;
  session.error = null;
  if (session.mode === "fixture" && finalText.trim())
    session.review.notes.push(
      "This custom final response is preserved but has not been interpreted. Authored observations apply only to the scripted turns.",
    );
  session.updatedAt = now();
}
export function unobserved(): Observation[] {
  return (["C1", "C2", "C3"] as Criterion[]).map((criterionId) => ({
    criterionId,
    state: "not_yet_observed",
    studentTurnId: null,
    quote: "",
    explanation:
      "No substantive evidence has yet been recorded for this criterion.",
    unresolvedIssue: "Unobserved evidence is not a judgment of ability.",
  }));
}
export class Controller {
  sessions = new Map<string, Session>();
  private busy = new Set<string>();
  constructor(
    public adapter: ModelAdapter,
    public dialogues: Dialogue[],
    public config: {
      modelId: string | null;
      generationSettings: Record<string, unknown>;
      configured: boolean;
      configurationMessage?: string | null;
    },
  ) {}
  create(
    mode: "fixture" | "live",
    condition: "policy" | "baseline",
    fixtureId?: string,
  ) {
    if (mode === "live" && !this.config.configured)
      throw new DemoError(
        this.config.configurationMessage ?? "Live mode is unavailable. Configure Gemini credentials and verify the project's free tier and exact model quota on the server.",
        503,
      );
    if (mode === "fixture" && condition === "baseline")
      throw new DemoError(
        "Authored walkthroughs illustrate the proposed policy. Baseline results require a live model run.",
      );
    if (mode === "fixture" && !this.dialogues.some((d) => d.id === fixtureId))
      throw new DemoError("Choose one of the six scripted examples.");
    const s = createSession({
      mode,
      condition,
      fixtureId,
      modelId: mode === "live" ? this.config.modelId : null,
      generationSettings: mode === "live" ? this.config.generationSettings : {},
    });
    s.observations = unobserved();
    this.sessions.set(s.id, s);
    return s;
  }
  get(sessionId: string) {
    const s = this.sessions.get(sessionId);
    if (!s) throw new DemoError("This temporary session is no longer available on the server. Open session settings to start a new one. Exported records remain on your device.", 404);
    return s;
  }
  async mutate(
    sessionId: string,
    operation: string,
    input: Record<string, unknown>,
  ) {
    const s = this.get(sessionId);
    if (this.busy.has(s.id))
      throw new DemoError(
        "A request is already in progress. Please wait.",
        409,
      );
    this.busy.add(s.id);
    try {
      await this.dispatch(s, operation, input);
      return s;
    } finally {
      this.busy.delete(s.id);
    }
  }
  private async dispatch(
    s: Session,
    operation: string,
    input: Record<string, unknown>,
  ) {
    const requestId =
      typeof input.requestId === "string" ? input.requestId : "";
    if (!requestId || requestId.length > 100)
      throw new DemoError("A bounded request ID is required.");
    if (Object.hasOwn(s.processedRequests, requestId)) return;
    const text = typeof input.text === "string" ? input.text : "";
    if (
      s.pending &&
      !["retry", "finish", "keep_unreviewed"].includes(operation)
    )
      throw new DemoError("Retry the pending request or choose Finish.", 409);
    if (operation === "turn") {
      if (s.phase !== "eliciting")
        throw new DemoError(
          "The conversation is no longer accepting assessment turns.",
        );
      if (s.mode === "fixture")
        throw new DemoError(
          "Scripted examples cannot interpret arbitrary input. Use the next scripted turn or configure live mode.",
        );
      const turn = addStudent(s, text);
      if (explicitRequest(text)?.actionId === "offer_finish") {
        deliver(s, "offer_finish", turn.id);
        s.processedRequests[requestId] = "finish";
        return;
      }
      s.pending = { requestId, turnId: turn.id, purpose: "next" };
      await this.run(s);
      return;
    }
    if (operation === "retry") {
      if (!s.pending) throw new DemoError("There is no pending request.");
      const last = s.attempts.at(-1);
      if (last?.retryAfterSeconds && Date.now() < Date.parse(last.timestamp) + last.retryAfterSeconds * 1000)
        throw new DemoError("Gemini asked to wait before retrying. Your response is saved; wait for the quota cooldown shown in the error.", 429);
      await this.run(s);
      if (!s.pending) s.processedRequests[requestId] = "retry";
      return;
    }
    if (operation === "advance") {
      if (s.mode !== "fixture" || s.phase !== "eliciting")
        throw new DemoError("No scripted step is available in this phase.");
      const d = this.dialogues.find((d) => d.id === s.fixtureId)!;
      const step = d.steps[s.fixtureIndex];
      if (!step)
        throw new DemoError(
          "The scripted conversation has ended. Choose Finish.",
        );
      const turn = addStudent(s, step.studentText, [
        `scripted_step_${s.fixtureIndex}`,
      ]);
      const observations = step.observations.map((o) => ({
        criterionId: o.criterionId,
        state: o.state,
        studentTurnId:
          o.studentStep < 0
            ? null
            : s.turns.find((t) =>
                t.tags.includes(`scripted_step_${o.studentStep}`),
              )!.id,
        quote: o.quote,
        explanation: o.explanation,
        unresolvedIssue: o.unresolvedIssue,
      })) as Observation[];
      const p = validateProposal(s, {
        actionId: step.actionId,
        termId: step.termId ?? null,
        observations,
        unresolvedQuestions: [],
      });
      const action = enforceAction(s, p, turn.text);
      markSubstantive(s, p, turn.id);
      s.observations = p.observations;
      deliver(s, action.actionId, turn.id, undefined, action.termId);
      s.fixtureIndex++;
    } else if (operation === "support") {
      if (s.phase !== "eliciting" || s.mode !== "fixture")
        throw new DemoError("Use the conversation controls while eliciting.");
      const control = supportControls.find(c => c.id === input.actionId);
      if (!control) throw new DemoError("Unknown support control.");
      const t = addStudent(s, control.request);
      deliver(s, control.actionId, t.id, undefined, control.termId);
    } else if (operation === "finish") {
      if (!["eliciting", "final_response"].includes(s.phase))
        throw new DemoError("This assessment record is already frozen.");
      if (s.pending) {
        s.processedRequests[s.pending.requestId] = "cancelled_by_finish";
        s.pending = null;
        s.error = null;
      }
      if (s.phase === "eliciting") {
        deliver(s, "offer_finish", null);
        s.supportEvents.at(-1)!.requested = true;
      }
    } else if (operation === "continue") {
      if (s.phase !== "final_response" || s.probes.length >= 3)
        throw new DemoError(
          "Continuation is unavailable after the probe budget is exhausted.",
        );
      s.phase = "eliciting";
      s.consecutiveRepairs = 0;
    } else if (operation === "finalize") {
      freeze(s, text);
      if (s.mode === "fixture")
        s.review!.notes.push(
          ...this.dialogues.find((d) => d.id === s.fixtureId)!.reviewNotes,
        );
      else {
        s.pending = {
          requestId,
          turnId: s.review!.frozenCutoff ?? "",
          purpose: "review",
        };
        await this.run(s);
        return;
      }
    } else if (operation === "keep_unreviewed") {
      if (
        s.phase !== "review" ||
        s.review?.status !== "error" ||
        s.pending?.purpose !== "review"
      )
        throw new DemoError(
          "Only a failed final review can be kept unreviewed.",
        );
      s.processedRequests[s.pending.requestId] = "review_cancelled";
      s.pending = null;
      s.error = null;
      s.review.status = "ready";
      s.review.origin = "no_model_review";
      s.review.notes.push(
        "Final model review was unavailable. This record is explicitly unreviewed; any earlier suggestions remain provisional and may not cover the final response.",
      );
    } else if (operation === "learning") {
      if (s.phase !== "review" || s.review?.status !== "ready")
        throw new DemoError("Complete the pre-help review first.");
      s.phase = "learning";
      deliver(s, "learning_note", null);
    } else if (operation === "reflection") {
      if (s.phase !== "learning")
        throw new DemoError("Open the learning note before reflecting.");
      const t = addStudent(s, text, [
        "after_content_assistance",
        "post_help_reflection",
      ]);
      s.reflectionIds.push(t.id);
    } else if (operation === "feedback") {
      const feedback = z.object({
        turnId: z.string(),
        rating: z.enum(["helpful", "not_helpful"]).nullable(),
      }).strict().parse(input.feedback);
      if (!s.turns.some(t => t.id === feedback.turnId && t.role === "assistant"))
        throw new DemoError("Feedback must refer to a guide response in this session.");
      s.responseFeedback = s.responseFeedback.filter(f => f.turnId !== feedback.turnId);
      if (feedback.rating) s.responseFeedback.push({ ...feedback, rating: feedback.rating, timestamp: now() });
      // UI feedback is exported separately; it never changes evidence or model input.
    } else if (operation === "revision") {
      if (!s.review || !["review", "learning"].includes(s.phase))
        throw new DemoError(
          "Reviewer corrections are available after finishing.",
        );
      const parsed = z
        .object({
          targetType: z.enum(["evidence", "support"]),
          targetId: z.string(),
          category: z.string(),
          note: z.string().min(1).max(4000),
          reviewer: z.string().min(1).max(120),
        })
        .strict()
        .parse(input.revision);
      const target =
        parsed.targetType === "evidence"
          ? s.review.evidence.find((e) => e.id === parsed.targetId)
          : s.supportEvents.find((e) => e.id === parsed.targetId);
      const allowed =
        parsed.targetType === "evidence"
          ? [...states]
          : [
              "unreviewed",
              "access",
              "administrative",
              "meaning_repair",
              "targeted_probe",
              "general_elicitation",
              "content_assistance",
              "uncertain",
            ];
      if (!target || !allowed.includes(parsed.category as never))
        throw new DemoError("Invalid review target or category.");
      s.revisions.push({ ...parsed, id: id(), timestamp: now() });
    } else throw new DemoError("Unknown operation.");
    s.processedRequests[requestId] = operation;
    s.updatedAt = now();
  }
  private async run(s: Session) {
    const pending = s.pending!;
    const started = Date.now();
    let raw: unknown = null;
    let usage: unknown = null;
    let returnedModel: string | null = s.modelId;
    try {
      const result = await this.adapter(structuredClone(s), pending.purpose);
      raw = result.rawOutput;
      usage = result.usage;
      returnedModel = result.model;
      const p = validateProposal(s, result.proposal, pending.purpose);
      if (pending.purpose === "next") {
        const t = s.turns.find((t) => t.id === pending.turnId)!;
        const action = enforceAction(s, p, t.text);
        markSubstantive(s, p, t.id);
        s.observations = p.observations;
        deliver(
          s,
          action.actionId,
          t.id,
          s.condition === "baseline" && !action.overridden
            ? p.assistantText
            : undefined,
          action.termId,
        );
      } else {
        s.review!.evidence = evidenceItems(s, p.observations);
        s.review!.unresolvedQuestions = p.unresolvedQuestions;
        s.review!.status = "ready";
      }
      s.attempts.push({
        id: id(),
        purpose: pending.purpose,
        timestamp: now(),
        latencyMs: Date.now() - started,
        model: returnedModel,
        usage,
        cost: null,
        rawOutput: raw,
        error: null,
      });
      s.processedRequests[pending.requestId] = pending.purpose;
      s.pending = null;
      s.error = null;
    } catch (error) {
      if (error && typeof error === "object" && "rawOutput" in error)
        raw = error.rawOutput;
      if (error && typeof error === "object" && "usage" in error)
        usage = error.usage;
      if (
        error &&
        typeof error === "object" &&
        "model" in error &&
        typeof error.model === "string"
      )
        returnedModel = error.model;
      const message =
        error instanceof DemoError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Provider failed.";
      s.attempts.push({
        id: id(),
        purpose: pending.purpose,
        timestamp: now(),
        latencyMs: Date.now() - started,
        model: returnedModel,
        usage,
        cost: null,
        rawOutput: raw,
        error: message,
        httpStatus: !(error instanceof DemoError) && error && typeof error === "object" && "status" in error && typeof error.status === "number" ? error.status : null,
        errorCode: error && typeof error === "object" && "code" in error && typeof error.code === "string" ? error.code : null,
        retryAfterSeconds: error && typeof error === "object" && "retryAfterSeconds" in error && typeof error.retryAfterSeconds === "number" ? error.retryAfterSeconds : null,
      });
      s.error = message;
      if (pending.purpose === "review") s.review!.status = "error";
      // The student turn and pending ID survive; retry cannot append or charge a probe twice.
    }
    s.updatedAt = now();
  }
}
export function exportSession(s: Session) {
  return {
    schemaVersion: "0.1",
    exportedAt: now(),
    evidenceStatus:
      s.mode === "fixture"
        ? "Scripted example — not live AI"
        : "Provisional model suggestions; human review required",
    session: s,
    effectiveSupportContext: s.turns
      .filter((t) => t.role === "student")
      .map((t) => ({
        turnId: t.id,
        supportEventIds: t.precedingSupportEventIds,
        tags: [
          ...new Set([
            ...t.tags,
            ...supportTags(s, t.precedingSupportEventIds),
          ]),
        ],
      })),
    limitations: [
      "Not a validated assessment or English-proficiency test.",
      "Category labels do not establish absence of leakage.",
      "Text behavior cannot establish speech reliability.",
      "Human corrections are separate from the frozen original review.",
    ],
  };
}
