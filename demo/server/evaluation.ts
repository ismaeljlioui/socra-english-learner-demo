import { randomUUID, randomInt } from "node:crypto";
import cases from "../data/cases.json" with { type: "json" };
import {
  Controller,
  DemoError,
  addStudent,
  deliver,
  exportSession,
  unobserved,
} from "./controller.js";
import type { Action } from "../src/task.js";
import type { Condition, Session } from "../src/types.js";

export { cases };
export function evaluationPlan(caseIds: string[], repeats = 3) {
  const selected = cases.filter((c) => caseIds.includes(c.id));
  if (!selected.length || selected.length !== new Set(caseIds).size)
    throw new Error("Select valid case IDs.");
  if (!Number.isInteger(repeats) || repeats < 3 || repeats > 10)
    throw new Error("Use 3–10 independent repeats per condition and case.");
  return {
    schemaVersion: "0.1",
    kind: "evaluation_plan",
    createdAt: new Date().toISOString(),
    repeats,
    conditions: ["baseline", "policy"],
    caseCount: selected.length,
    plannedModelOutputs: selected.length * repeats * 2,
    liveModelOutputs: 0,
    educatorReviews: 0,
    results: null,
    cases: selected,
    notice:
      "Authored development cases; not a blinded holdout. Expected actions are provisional, not sole ground truth. No model calls in a plan.",
  };
}
function seed(s: Session, testCase: (typeof cases)[number]) {
  for (const prior of testCase.prior) {
    if (prior.role === "student")
      addStudent(s, prior.text, ["authored_evaluation_prefix"]);
    else {
      const p = prior as {
        actionId?: string;
        plannedCategory?: string;
        reviewerCategory?: string;
      };
      deliver(s, (p.actionId ?? "invite_attempt") as Action, null, prior.text);
      s.turns.at(-1)!.tags.push("authored_evaluation_prefix");
      const e = s.supportEvents.at(-1)!;
      if (p.plannedCategory) e.plannedCategory = p.plannedCategory;
      if (p.reviewerCategory) {
        e.reviewerCategory = p.reviewerCategory;
        e.reviewNote =
          "Authored failure setup for development case; not an actual educator rating.";
      }
    }
  }
  s.observations = unobserved();
}

/** Selecting a card only prepares an isolated session; it never calls Gemini. */
export function createScenario(controller: Controller, caseId: string, condition: Condition) {
  const c = cases.find(item => item.id === caseId);
  if (!c) throw new DemoError("Choose one of the 17 test scenarios.");
  const s = controller.create("live", condition);
  seed(s, c);
  s.scenario = { caseId: c.id, title: c.title, studentText: c.studentText,
    operation: (c.operation ?? "turn") as NonNullable<Session["scenario"]>["operation"] };
  return s;
}

const scenarioRuns = new Map<string, Promise<Session>>();
export async function runScenario(controller: Controller, sessionId: string, requestId: string) {
  const s = controller.get(sessionId);
  if (!s.scenario || s.mode !== "live") throw new DemoError("This is not a live test scenario.");
  if (!requestId || requestId.length > 80) throw new DemoError("A bounded request ID is required.");
  const scenario = s.scenario;
  if (scenario.runRequestId && scenario.runRequestId !== requestId)
    throw new DemoError("This scenario has already been submitted. Retry a pending request or open a new scenario.", 409);
  const pending = scenarioRuns.get(s.id);
  if (pending) return pending;
  if (scenario.runRequestId) return s;
  scenario.runRequestId = requestId;
  const promise = (async () => {
    if (scenario.operation === "finish") {
      await controller.mutate(s.id, "finish", { requestId: `${requestId}:finish` });
      await controller.mutate(s.id, "finalize", { requestId: `${requestId}:final`, text: "" });
    } else {
      if (scenario.operation === "blank_then_wait") {
        const before = s.attempts.length;
        try { await controller.mutate(s.id, "turn", { requestId: `${requestId}:blank`, text: "" }); }
        catch (error) {
          if (!(error instanceof DemoError) || error.status !== 400) throw error;
          scenario.blankInputRejected = s.attempts.length === before;
        }
        if (!scenario.blankInputRejected) throw new DemoError("The empty-input check did not pass; scenario stopped.");
      }
      await controller.mutate(s.id, "turn", { requestId: `${requestId}:turn`, text: scenario.studentText });
      const input = s.turns.filter(t => t.role === "student").at(-1);
      if (input) input.tags.push("authored_evaluation_input");
    }
    return s;
  })();
  scenarioRuns.set(s.id, promise);
  try { return await promise; } finally { scenarioRuns.delete(s.id); }
}
export async function runEvaluation(
  controller: Controller,
  caseIds: string[],
  repeats = 3,
  onRun?: (run: unknown) => void,
) {
  const plan = evaluationPlan(caseIds, repeats);
  if (!controller.config.configured)
    throw new Error(
      "Live model not configured. Export a plan or configure credentials and verify free-tier quota.",
    );
  const runs: unknown[] = [];
  let stoppedReason: string | null = null;
  evaluation: for (const c of plan.cases)
    for (let repeat = 1; repeat <= repeats; repeat++) {
      const order: Condition[] = randomInt(2)
        ? ["baseline", "policy"]
        : ["policy", "baseline"];
      const pairId = randomUUID();
      for (let index = 0; index < order.length; index++) {
        const condition = order[index];
        const s = controller.create("live", condition);
        seed(s, c);
        if (c.operation === "finish") {
          await controller.mutate(s.id, "finish", { requestId: randomUUID() });
          await controller.mutate(s.id, "finalize", {
            requestId: randomUUID(),
            text: "",
          });
        } else {
          if (c.operation === "blank_then_wait") {
            try {
              await controller.mutate(s.id, "turn", {
                requestId: randomUUID(),
                text: "",
              });
            } catch {
              /* Blank is an intentional no-call check. */
            }
          }
          await controller.mutate(s.id, "turn", {
            requestId: randomUUID(),
            text: c.studentText,
          });
        }
        const assistant = s.turns.filter((t) => t.role === "assistant").at(-1);
        const run = {
          id: randomUUID(),
          pairId,
          caseId: c.id,
          repeat,
          displaySlot: index === 0 ? "A" : "B",
          condition,
          model: controller.config.modelId,
          generationSettings: controller.config.generationSettings,
          outputKind:
            c.operation === "finish"
              ? "model_evidence_review"
              : "model_next_turn",
          serverTransitionText:
            c.operation === "finish" ? (assistant?.text ?? null) : null,
          nextAction:
            s.error || c.operation === "finish"
              ? null
              : (assistant?.actionId ?? null),
          actualOutput: s.error
            ? null
            : c.operation === "finish"
              ? JSON.stringify(
                  {
                    evidence: s.review?.evidence,
                    unresolvedQuestions: s.review?.unresolvedQuestions,
                  },
                  null,
                  2,
                )
              : (assistant?.text ?? null),
          provisionalExpectedActionMatch:
            s.error || c.operation === "finish"
              ? null
              : c.expectedActions.includes(assistant?.actionId ?? ""),
          latencyMs: s.attempts.reduce((sum, a) => sum + a.latencyMs, 0),
          error: s.error,
          reviewer: "not_reviewed",
          findings: {
            substantiveLeakage: null,
            meaningPreservation: null,
            evidenceAccuracy: null,
            assistanceProvenance: null,
            appropriateNextMove: null,
            accessibilityUsefulness: null,
            unsupportedJudgments: null,
          },
          notes:
            "Action matching and exact quotation checks do not establish semantic or educational success. Template style can reveal condition.",
          record: exportSession(s),
        };
        runs.push(run);
        onRun?.(run);
        if (s.attempts.at(-1)?.httpStatus === 429) {
          stoppedReason = "Gemini quota was exhausted. The batch stopped without retries or model fallback; remaining planned runs were not attempted.";
          break evaluation;
        }
      }
    }
  const records = runs as {
    record: ReturnType<typeof exportSession>;
    error: string | null;
  }[];
  return {
    ...plan,
    kind: "actual_model_runs",
    liveModelOutputs: records.reduce(
      (sum, r) =>
        sum +
        r.record.session.attempts.filter((a) => a.rawOutput !== null && !(a.httpStatus && a.httpStatus >= 400)).length,
      0,
    ),
    attemptedRuns: runs.length,
    unattemptedRuns: plan.plannedModelOutputs - runs.length,
    stoppedReason,
    failedRuns: records.filter((r) => r.error).length,
    educatorReviews: 0,
    results: runs,
    notice:
      "Actual model outputs on authored development prefixes. No student interaction or educational validity claim. Errors remain in the denominator; no human findings are prefilled.",
  };
}
