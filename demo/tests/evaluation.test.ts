import test from "node:test";
import assert from "node:assert/strict";
import { cases, evaluationPlan, runEvaluation, createScenario, runScenario } from "../server/evaluation";
import {
  Controller,
  unobserved,
  type exportSession,
} from "../server/controller";
import { glossary, templates, type Action } from "../src/task";
import { ProviderError } from "../server/provider";
import type {
  ModelAdapter,
  Observation,
  Proposal,
  Session,
} from "../src/types";

const settings = { max_output_tokens: 2000, test: "mock-only" };
function makeController(adapter: ModelAdapter, configured = true) {
  return new Controller(adapter, [], {
    configured,
    modelId: "same-mock-model",
    generationSettings: settings,
  });
}
function response(
  s: Session,
  actionId: Action,
  observations = unobserved(),
  termId: Proposal["termId"] = null,
) {
  const p: Proposal = {
    actionId,
    termId,
    observations,
    unresolvedQuestions: [],
  };
  if (s.condition === "baseline")
    p.assistantText =
      actionId === "define_incidental"
        ? glossary.reputation
        : templates[actionId];
  return {
    proposal: p,
    model: "same-mock-model",
    usage: { input_tokens: 5, output_tokens: 7 },
    rawOutput: JSON.stringify(p),
  };
}
interface Run {
  id: string;
  pairId: string;
  caseId: string;
  repeat: number;
  displaySlot: string;
  condition: string;
  model: string;
  generationSettings: Record<string, unknown>;
  nextAction: string | null;
  actualOutput: string | null;
  provisionalExpectedActionMatch: boolean | null;
  error: string | null;
  reviewer: string;
  findings: Record<string, unknown>;
  outputKind?: string;
  serverTransitionText?: string | null;
  record: ReturnType<typeof exportSession>;
}

test("all 17 authored cases form a zero-call plan with three repeats and both conditions", () => {
  let calls = 0;
  const c = makeController(async () => {
    calls++;
    throw new Error("Plans cannot call a model.");
  });
  const plan = evaluationPlan(cases.map((c) => c.id));
  assert.equal(plan.caseCount, 17);
  assert.equal(plan.plannedModelOutputs, 102);
  assert.deepEqual(plan.conditions, ["baseline", "policy"]);
  assert.equal(plan.repeats, 3);
  assert.equal(plan.liveModelOutputs, 0);
  assert.equal(plan.educatorReviews, 0);
  assert.equal(plan.results, null);
  assert.deepEqual(
    plan.cases.map((c) => c.id),
    Array.from({ length: 17 }, (_, i) => `T${String(i + 1).padStart(2, "0")}`),
  );
  for (const item of cases)
    assert.equal(evaluationPlan([item.id]).plannedModelOutputs, 6);
  assert.equal(calls, 0);
  assert.equal(c.sessions.size, 0);
});

test("invalid case IDs and insufficient or nonintegral repeat counts cannot start evaluation", async () => {
  for (const ids of [[], ["T99"], ["T01", "missing"]])
    assert.throws(() => evaluationPlan(ids), /valid case IDs/);
  for (const repeats of [0, 1, 2, 2.5, 11, NaN])
    assert.throws(() => evaluationPlan(["T01"], repeats), /3–10/);
  let calls = 0;
  const c = makeController(async () => {
    calls++;
    throw new Error("Should not be called.");
  });
  await assert.rejects(runEvaluation(c, ["T99"]), /valid case IDs/);
  await assert.rejects(runEvaluation(c, ["T01"], 2), /3–10/);
  assert.equal(calls, 0);
});

test("actual evaluation requires configured live mode and never substitutes fixtures", async () => {
  let calls = 0;
  const c = makeController(async () => {
    calls++;
    throw new Error("Should not be called.");
  }, false);
  await assert.rejects(runEvaluation(c, ["T06"]), /Live model not configured/);
  assert.equal(calls, 0);
  assert.equal(c.sessions.size, 0);
});

test("T06 creates six independent same-model calls, three per condition, with unset human findings", async () => {
  const snapshots: Session[] = [];
  const c = makeController(async (s) => {
    snapshots.push(s);
    return response(s, "define_incidental", unobserved(), "reputation");
  });
  const completed: unknown[] = [];
  const output = await runEvaluation(c, ["T06"], 3, (run) =>
    completed.push(run),
  );
  const runs = output.results as Run[];
  assert.equal(snapshots.length, 6);
  assert.equal(output.attemptedRuns, 6);
  assert.equal(output.failedRuns, 0);
  assert.equal(output.liveModelOutputs, 6);
  assert.equal(completed.length, 6);
  assert.equal(new Set(snapshots.map((s) => s.id)).size, 6);
  for (const condition of ["baseline", "policy"])
    assert.equal(runs.filter((r) => r.condition === condition).length, 3);
  assert.equal(new Set(runs.map((r) => r.pairId)).size, 3);
  for (const r of runs) {
    assert.equal(r.model, "same-mock-model");
    assert.deepEqual(r.generationSettings, settings);
    assert.equal(r.actualOutput, glossary.reputation);
    assert.equal(r.nextAction, "define_incidental");
    assert.equal(r.reviewer, "not_reviewed");
    assert.ok(Object.values(r.findings).every((v) => v === null));
    assert.equal(r.record.session.attempts[0].cost, null);
    assert.deepEqual(r.record.session.attempts[0].usage, {
      input_tokens: 5,
      output_tokens: 7,
    });
  }
  for (const s of snapshots) {
    assert.equal(s.modelId, "same-mock-model");
    assert.deepEqual(s.generationSettings, settings);
    assert.equal(s.turns.length, 1);
    assert.equal(s.turns[0].text, "What is reputation?");
  }
});

test("failed runs remain in the denominator with errors and no fabricated success output", async () => {
  let calls = 0;
  const c = makeController(async (s) => {
    if (++calls % 2) throw new Error("Mock provider failure");
    return response(s, "define_incidental", unobserved(), "reputation");
  });
  const output = await runEvaluation(c, ["T06"]);
  const runs = output.results as Run[];
  assert.equal(calls, 6);
  assert.equal(output.attemptedRuns, 6);
  assert.equal(runs.length, 6);
  assert.equal(output.failedRuns, 3);
  assert.equal(output.liveModelOutputs, 3);
  const failed = runs.filter((r) => r.error);
  assert.equal(failed.length, 3);
  for (const r of failed) {
    assert.equal(r.error, "Mock provider failure");
    assert.equal(r.actualOutput, null);
    assert.equal(r.nextAction, null);
    assert.equal(r.provisionalExpectedActionMatch, null);
    assert.equal(
      r.record.session.turns.filter((t) => t.role === "student").length,
      1,
    );
    assert.equal(r.record.session.supportEvents.length, 0);
    assert.equal(r.record.session.attempts.length, 1);
  }
});

test("a Gemini quota failure stops the batch and preserves attempted versus unattempted counts", async () => {
  let calls = 0;
  const c = makeController(async () => {
    calls++;
    throw new ProviderError("Quota exhausted; wait 30 seconds.", { error: "synthetic quota" }, null, "same-mock-model", { status: 429, code: "RESOURCE_EXHAUSTED", retryAfterSeconds: 30 });
  });
  const output = await runEvaluation(c, ["T06"]);
  assert.equal(calls, 1);
  assert.equal(output.attemptedRuns, 1);
  assert.equal(output.unattemptedRuns, 5);
  assert.equal(output.failedRuns, 1);
  assert.equal(output.liveModelOutputs, 0);
  assert.match(output.stoppedReason!, /quota/);
  const session = (output.results as Run[])[0].record.session;
  assert.equal(session.attempts[0].httpStatus, 429);
  assert.equal(session.attempts[0].errorCode, "RESOURCE_EXHAUSTED");
  assert.equal(session.turns.filter(t => t.role === "student").length, 1);
  await assert.rejects(c.mutate(session.id, "retry", { requestId: "early-retry" }), /wait before retrying/);
  assert.equal(calls, 1);
  assert.equal(session.attempts.length, 1);
  assert.equal(session.supportEvents.length, 0);
});

test("generated but rejected evidence counts as a model output, never a delivered answer or provider HTTP error", async () => {
  const c = makeController(async (s) => response(s, "offer_finish", unobserved().map(o => o.criterionId === "C1" ? {
    ...o, state: "evidence_present", studentTurnId: s.turns[0].id,
    quote: "Invented ... quotation", explanation: "Synthetic invalid quote for a rejection check.",
  } : o)));
  const output = await runEvaluation(c, ["T01"]);
  assert.equal(output.liveModelOutputs, 6);
  assert.equal(output.failedRuns, 6);
  for (const run of output.results as Run[]) {
    assert.equal(run.actualOutput, null);
    assert.match(run.error!, /exact substring/);
    assert.equal(run.record.session.attempts[0].httpStatus, null);
    assert.equal(run.record.session.supportEvents.length, 0);
  }
});

test("T13 rejects blank input without an extra model call before the wait request", async () => {
  const snapshots: Session[] = [];
  const c = makeController(async (s) => {
    snapshots.push(s);
    return response(s, "acknowledge_wait");
  });
  const output = await runEvaluation(c, ["T13"]);
  const runs = output.results as Run[];
  assert.equal(snapshots.length, 6);
  assert.equal(output.attemptedRuns, 6);
  assert.equal(output.failedRuns, 0);
  for (const s of snapshots) {
    assert.equal(s.turns.length, 1);
    assert.equal(s.turns[0].text, "I need time to think.");
  }
  for (const r of runs) {
    assert.equal(r.nextAction, "acknowledge_wait");
    assert.equal(r.record.session.attempts.length, 1);
  }
});

test("T15 carries deliberately injected content assistance through a later neutral prompt", async () => {
  const snapshots: Session[] = [];
  const c = makeController(async (s) => {
    snapshots.push(s);
    const t = s.turns.filter((t) => t.role === "student").at(-1)!;
    const observations: Observation[] = unobserved().map((o) =>
      o.criterionId === "C2"
        ? {
            ...o,
            state: "evidence_present",
            studentTurnId: t.id,
            quote: t.text,
            explanation:
              "Mock observation; provenance must retain the inserted assistance.",
            unresolvedIssue:
              "This argument was supplied in the authored failure prefix.",
          }
        : o,
    );
    return response(s, "probe_source", observations);
  });
  const output = await runEvaluation(c, ["T15"]);
  assert.equal(output.failedRuns, 0);
  assert.equal(snapshots.length, 6);
  for (const s of snapshots) {
    const leaking = s.supportEvents.find(
      (e) => e.reviewerCategory === "content_assistance",
    )!;
    assert.ok(leaking);
    assert.equal(leaking.plannedCategory, "targeted_probe");
    assert.match(leaking.reviewNote, /Authored failure setup/);
    const t = s.turns.filter((t) => t.role === "student").at(-1)!;
    assert.ok(t.precedingSupportEventIds.includes(leaking.id));
    assert.ok(t.tags.includes("after_content_assistance"));
    assert.equal(t.adjacentAssistantAction, "invite_attempt");
    assert.equal(
      s.turns.find((t) => t.id === leaking.deliveredTurnId)?.text,
      t.text,
    );
  }
});

test("T14 exports actual model evidence review separately from the fixed server finish transition", async () => {
  const purposes: string[] = [];
  const c = makeController(async (s, purpose) => {
    purposes.push(purpose);
    assert.equal(s.phase, "review");
    assert.ok(s.review?.frozenCutoff);
    const t = s.turns.find((t) => t.role === "student")!;
    const observations: Observation[] = unobserved().map((o) =>
      o.criterionId === "C2"
        ? {
            ...o,
            state: "partial",
            studentTurnId: t.id,
            quote: t.text,
            explanation:
              "The student states a position without a reason in this mock review.",
            unresolvedIssue: "A reason has not been observed.",
          }
        : o,
    );
    const r = response(s, "offer_finish", observations);
    if (s.condition === "baseline") (r.proposal as Proposal).assistantText = "";
    return r;
  });
  const output = await runEvaluation(c, ["T14"]);
  const runs = output.results as Run[];
  assert.equal(output.failedRuns, 0);
  assert.deepEqual(purposes, Array(6).fill("review"));
  for (const r of runs) {
    assert.equal(r.outputKind, "model_evidence_review");
    assert.equal(r.nextAction, null);
    assert.equal(r.provisionalExpectedActionMatch, null);
    assert.equal(r.serverTransitionText, templates.offer_finish);
    assert.ok(r.actualOutput);
    const actual = JSON.parse(r.actualOutput!);
    assert.ok(actual);
    assert.notEqual(r.actualOutput, templates.offer_finish);
    assert.match(r.actualOutput!, /I think justice matters\./);
    assert.equal(r.record.session.attempts[0].purpose, "review");
    assert.equal(r.record.session.review?.status, "ready");
    assert.equal(r.record.session.finalSkipped, true);
  }
});

test("all 17 selectable scenarios prepare isolated, labeled prefixes without model calls", () => {
  let calls = 0;
  const controller = makeController(async () => { calls++; throw new Error("No call while selecting"); });
  const main = controller.create("live", "policy");
  const before = JSON.stringify(main);
  for (const c of cases) {
    const s = createScenario(controller, c.id, "policy");
    assert.notEqual(s.id, main.id);
    assert.equal(s.scenario?.caseId, c.id);
    assert.equal(s.attempts.length, 0);
    assert.equal(s.turns.length, c.prior.length);
    assert.ok(s.turns.every(t => t.tags.includes("authored_evaluation_prefix")));
  }
  assert.equal(calls, 0);
  assert.equal(JSON.stringify(main), before);
  assert.throws(() => createScenario(controller, "T99", "policy"), /17 test scenarios/);
  assert.throws(() => createScenario(makeController(async () => { throw new Error(); }, false), "T06", "policy"), /Live mode/);
});

test("a single scenario runs once and replayed network requests do not duplicate calls or turns", async () => {
  let calls = 0;
  const c = makeController(async s => { calls++; return response(s, "define_incidental", unobserved(), "reputation"); });
  const s = createScenario(c, "T06", "policy");
  await Promise.all([runScenario(c, s.id, "one"), runScenario(c, s.id, "one")]);
  await runScenario(c, s.id, "one");
  assert.equal(calls, 1);
  assert.equal(s.attempts.length, 1);
  assert.ok(s.turns[0].tags.includes("authored_evaluation_input"));
  assert.equal(s.turns[1].text, glossary.reputation);
  await assert.rejects(runScenario(c, s.id, "different"), /already been submitted/);
  assert.equal(calls, 1);
});

test("single scenario runs preserve identical model settings for both conditions", async () => {
  const c = makeController(async s => response(s, "define_incidental", unobserved(), "reputation"));
  for (const condition of ["baseline", "policy"] as const) {
    const s = createScenario(c, "T06", condition);
    await runScenario(c, s.id, condition);
    assert.equal(s.modelId, "same-mock-model");
    assert.deepEqual(s.generationSettings, settings);
    assert.equal(s.attempts.length, 1);
    assert.equal(s.error, null);
  }
});

test("single T13 rejects blank before one wait request; T14 makes only a review call", async () => {
  const purposes: string[] = [];
  const c = makeController(async (s,purpose) => {
    purposes.push(purpose);
    return response(s, purpose === "review" ? "offer_finish" : "acknowledge_wait");
  });
  const wait = createScenario(c, "T13", "policy");
  await runScenario(c, wait.id, "wait");
  assert.equal(wait.scenario?.blankInputRejected, true);
  assert.equal(wait.turns.filter(t => t.role === "student").length, 1);
  const finish = createScenario(c, "T14", "policy");
  await runScenario(c, finish.id, "finish");
  assert.deepEqual(purposes, ["next", "review"]);
  assert.equal(finish.finalSkipped, true);
  assert.equal(finish.review?.status, "ready");
});

test("single T15 preserves the authored failure and cumulative support; no fabricated rating", async () => {
  const c = makeController(async s => response(s, "probe_source"));
  const s = createScenario(c, "T15", "policy");
  await runScenario(c, s.id, "leak");
  const leak = s.supportEvents.find(e => e.reviewerCategory === "content_assistance")!;
  assert.ok(leak);
  assert.match(leak.reviewNote, /Authored failure setup/);
  const input = s.turns.find(t => t.tags.includes("authored_evaluation_input"))!;
  assert.ok(input.precedingSupportEventIds.includes(leak.id));
  assert.ok(input.tags.includes("after_content_assistance"));
  assert.ok(s.turns.find(t => t.id === leak.deliveredTurnId)?.tags.includes("authored_evaluation_prefix"));
  assert.equal(s.revisions.length, 0);
});

test("scenario quota failure stays visible and replay does not retry or fall back", async () => {
  let calls = 0;
  const c = makeController(async () => {
    calls++;
    throw new ProviderError("Quota exhausted", {}, null, "same-mock-model", {status:429,code:"RESOURCE_EXHAUSTED",retryAfterSeconds:30});
  });
  const s = createScenario(c, "T06", "policy");
  await runScenario(c, s.id, "quota");
  await runScenario(c, s.id, "quota");
  assert.equal(calls, 1);
  assert.equal(s.error, "Quota exhausted");
  assert.ok(s.pending);
  assert.equal(s.turns.filter(t => t.role === "assistant").length, 0);
  assert.ok(s.turns[0].tags.includes("authored_evaluation_input"));
});
