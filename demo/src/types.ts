import type { Action, Criterion, EvidenceState } from "./task";
export type Phase = "eliciting" | "final_response" | "review" | "learning";
export type Condition = "policy" | "baseline";
export type Mode = "live" | "fixture";
export interface Turn {
  id: string;
  role: "student" | "assistant";
  text: string;
  timestamp: string;
  phase: Phase;
  actionId?: Action | "learning_note";
  precedingSupportEventIds: string[];
  adjacentAssistantAction?: string;
  tags: string[];
  substantive?: boolean;
}
export interface SupportEvent {
  id: string;
  requestTurnId: string | null;
  triggerTurnId?: string | null;
  actionId: string;
  plannedCategory: string;
  deliveredTurnId: string;
  requested: boolean;
  delivered: boolean;
  status: "delivered" | "content_help_deferred";
  reviewerCategory: string;
  reviewNote: string;
}
export interface Observation {
  criterionId: Criterion;
  state: EvidenceState;
  studentTurnId: string | null;
  quote: string;
  explanation: string;
  unresolvedIssue: string;
}
export interface Evidence extends Observation {
  id: string;
  supportEventIds: string[];
}
export interface Review {
  status: "ready" | "pending" | "error";
  origin: "authored_fixture" | "model_suggestion" | "no_model_review";
  evidence: Evidence[];
  unresolvedQuestions: string[];
  unmetSupportRequestIds: string[];
  frozenCutoff: string | null;
  frozenAt: string;
  notes: string[];
}
export interface Revision {
  id: string;
  timestamp: string;
  reviewer: string;
  targetType: "evidence" | "support";
  targetId: string;
  category: string;
  note: string;
}
export interface Attempt {
  id: string;
  purpose: "next" | "review";
  timestamp: string;
  latencyMs: number;
  model: string | null;
  usage: unknown;
  cost: null;
  rawOutput: unknown;
  error: string | null;
  httpStatus?: number | null;
  errorCode?: string | null;
  retryAfterSeconds?: number | null;
}
export interface Session {
  scenario?: {
    caseId: string;
    title: string;
    studentText: string;
    operation: "turn" | "finish" | "blank_then_wait";
    runRequestId?: string;
    blankInputRejected?: boolean;
  };
  id: string;
  taskId: string;
  taskVersion: string;
  rubricVersion: string;
  policyVersion: string;
  condition: Condition;
  modelId: string | null;
  generationSettings: Record<string, unknown>;
  mode: Mode;
  phase: Phase;
  createdAt: string;
  updatedAt: string;
  turns: Turn[];
  supportEvents: SupportEvent[];
  observations: Observation[];
  probes: Criterion[];
  consecutiveRepairs: number;
  review: Review | null;
  revisions: Revision[];
  attempts: Attempt[];
  fixtureId?: string;
  fixtureIndex: number;
  finalSkipped: boolean;
  error: string | null;
  pending: {
    requestId: string;
    turnId: string;
    purpose: "next" | "review";
  } | null;
  processedRequests: Record<string, string>;
  reflectionIds: string[];
  responseFeedback: { turnId: string; rating: "helpful" | "not_helpful"; timestamp: string }[];
}
export interface Proposal {
  actionId: Action;
  termId: "reputation" | "practical_advantages" | null;
  observations: Observation[];
  unresolvedQuestions: string[];
  assistantText?: string;
}
export interface ModelResult {
  proposal: unknown;
  model: string;
  usage: unknown;
  rawOutput: unknown;
}
export type ModelAdapter = (
  session: Session,
  purpose: "next" | "review",
) => Promise<ModelResult>;
export interface FixtureStep {
  studentText: string;
  actionId: string;
  termId?: string;
  observations: {
    criterionId: string;
    state: string;
    studentStep: number;
    quote: string;
    explanation: string;
    unresolvedIssue: string;
  }[];
}
export interface Dialogue {
  id: string;
  title: string;
  description: string;
  steps: FixtureStep[];
  reviewNotes: string[];
  suggestedReflection?: string;
}
