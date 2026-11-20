import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";
import dialogues from "../data/dialogues.json" with { type: "json" };
import type { Dialogue } from "../src/types.js";
import { Controller, DemoError, exportSession } from "./controller.js";
import {
  configured,
  credentialsConfigured,
  configurationMessage,
  freeTierVerified,
  modelId,
  generationSettings,
  modelAdapter,
  languageModelAdapter,
} from "./provider.js";
import { cases, evaluationPlan, runEvaluation, createScenario, runScenario } from "./evaluation.js";
import { LanguageService, targetSchema, contextSchema } from "./language-analysis.js";
export function createRuntime() {
  return {
    language: new LanguageService(languageModelAdapter, modelId),
    controller: new Controller(modelAdapter, dialogues as Dialogue[], {configured,modelId,generationSettings,configurationMessage}),
    evaluations: new Map<string, unknown>(),
    evaluationRunning: false,
  };
}
const localRuntime = createRuntime();
// Vercel supplies a parsed body; the local HTTP server supplies a stream.
export async function readBody(req: IncomingMessage & { body?: unknown }, limit = 50000) {
  if (req.body !== undefined) {
    if (Buffer.byteLength(JSON.stringify(req.body)) > limit) throw new DemoError("Request too large.", 413);
    return req.body;
  }
  const chunks: Buffer[] = [];
  let length = 0;
  for await (const chunk of req) {
    const bytes = Buffer.from(chunk);
    length += bytes.length;
    if (length > limit) throw new DemoError("Request too large.", 413);
    chunks.push(bytes);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new DemoError("Invalid JSON."); }
}
export function sameOrigin(req: IncomingMessage) {
  if (!req.headers.origin) return true;
  try {
    const origin = new URL(req.headers.origin);
    return ["http:", "https:"].includes(origin.protocol) && origin.origin === req.headers.origin && origin.host === req.headers.host;
  } catch { return false; }
}

export async function handleAPI(req: IncomingMessage & { body?: unknown }, res: ServerResponse, hosted = false, runtime = localRuntime) {
  const {controller, language, evaluations} = runtime;
  const send = (data: unknown, status = 200) => {
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify(data));
  };
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      if (!sameOrigin(req))
        throw new DemoError("Cross-origin requests are not allowed.", 403);
      if (req.method === "GET" && url.pathname === "/api/config")
        return send({
          configured,
          credentialsConfigured,
          configurationMessage,
          freeTierVerified,
          modelId,
          generationSettings,
          dialogues,
          cases,
          hosted,
          sessionNotice: hosted ? "Temporary demo: encrypted session state stays in this browser tab. Export before closing; sessions expire after 12 hours or a redeployment." : null,
        });
      if (req.method === "GET" && url.pathname === "/api/export") {
        const session = controller.get(url.searchParams.get("sessionId") ?? "");
        return send({...exportSession(session), language:language.export(session)});
      }
      if (req.method === "GET" && url.pathname === "/api/language") {
        const session = controller.get(url.searchParams.get("sessionId") ?? "");
        return send(language.export(session));
      }
      if (req.method === "GET" && url.pathname === "/api/session")
        return send(controller.get(url.searchParams.get("sessionId") ?? ""));
      if (req.method === "GET" && url.pathname === "/api/evaluations")
        return send([...evaluations.values()]);
      if (req.method !== "POST") throw new DemoError("Not found.", 404);
      if (!req.headers["content-type"]?.startsWith("application/json"))
        throw new DemoError("JSON content is required.", 415);
      const body = await readBody(req);
      if (url.pathname === "/api/language/context") {
        const input=z.object({sessionId:z.string(),context:contextSchema,revision:z.number().int().nonnegative()}).strict().parse(body);
        controller.get(input.sessionId);
        return send(language.setContext(input.sessionId,input.context,input.revision));
      }
      if (url.pathname === "/api/language/analyze") {
        const input=z.object({sessionId:z.string(),target:targetSchema,requestId:z.string(),context:contextSchema}).strict().parse(body);
        const record = language.start(controller.get(input.sessionId),input.target,input.requestId,input.context);
        // A serverless invocation must stay alive until its model request settles.
        if (hosted) await language.waitFor(record.id);
        return send(record, record.state === "analyzing" ? 202 : 200);
      }
      if (url.pathname === "/api/language/review") {
        const input=z.object({sessionId:z.string(),analysisId:z.string(),decision:z.unknown()}).strict().parse(body);
        controller.get(input.sessionId);
        return send(language.review(input.sessionId,input.analysisId,input.decision));
      }
      if (url.pathname === "/api/sessions") {
        const input = z
          .object({
            mode: z.enum(["fixture", "live"]),
            condition: z.enum(["policy", "baseline"]),
            fixtureId: z.string().optional(),
          })
          .strict()
          .parse(body);
        return send(
          controller.create(input.mode, input.condition, input.fixtureId),
          201,
        );
      }
      if (url.pathname === "/api/scenarios") {
        const input = z.object({ caseId: z.string(), condition: z.enum(["policy", "baseline"]) }).strict().parse(body);
        return send(createScenario(controller, input.caseId, input.condition), 201);
      }
      if (url.pathname === "/api/scenario-run") {
        if (hosted) throw new DemoError("Multi-request scenario runs require the local server. Use npm run dev locally; hosted chat and individual analyses remain available.", 501);
        const input = z.object({ sessionId: z.string(), requestId: z.string() }).strict().parse(body);
        return send(await runScenario(controller, input.sessionId, input.requestId));
      }
      if (url.pathname === "/api/action") {
        const input = z
          .object({
            sessionId: z.string(),
            operation: z.string(),
            requestId: z.string(),
            text: z.string().optional(),
            actionId: z.string().optional(),
            revision: z.unknown().optional(),
            feedback: z.unknown().optional(),
          })
          .strict()
          .parse(body);
        return send(
          await controller.mutate(input.sessionId, input.operation, input),
        );
      }
      if (url.pathname === "/api/evaluation-plan") {
        const input = z
          .object({
            caseIds: z.array(z.string()),
            repeats: z.number().optional(),
          })
          .strict()
          .parse(body);
        return send(evaluationPlan(input.caseIds, input.repeats));
      }
      if (url.pathname === "/api/evaluate") {
        if (hosted) throw new DemoError("Batch comparisons require the local server or npm run evaluate. They cannot run as background jobs on this hosted demo.", 501);
        const input = z
          .object({ caseId: z.string(), confirmLive: z.literal(true) })
          .strict()
          .parse(body);
        if (!configured)
          throw new DemoError(configurationMessage ?? "Live model not configured.", 503);
        if (runtime.evaluationRunning)
          throw new DemoError("Another comparison is running.", 409);
        runtime.evaluationRunning = true;
        const runId = crypto.randomUUID();
        const record = {
          id: runId,
          status: "running",
          caseId: input.caseId,
          runs: [] as unknown[],
          result: null as unknown,
          error: null as string | null,
        };
        evaluations.set(runId, record);
        void runEvaluation(controller, [input.caseId], 3, (run) =>
          record.runs.push(run),
        )
          .then((result) => {
            record.result = result;
            record.error = result.stoppedReason;
            record.status = result.stoppedReason ? "stopped" : "complete";
          })
          .catch(() => {
            record.error =
              "Comparison could not complete. Partial outputs are preserved; check configuration.";
            record.status = "error";
          })
          .finally(() => {
            runtime.evaluationRunning = false;
          });
        return send(record, 202);
      }
      throw new DemoError("Not found.", 404);
    }
    throw new DemoError("Not found.", 404);
  } catch (error) {
    send(
      {
        error:
          error instanceof DemoError
            ? error.message
            : error instanceof z.ZodError
              ? "Invalid request fields."
              : "The request could not be completed.",
      },
      error instanceof DemoError ? error.status : 400,
    );
  }
}
