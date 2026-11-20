import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import dialogues from "../data/dialogues.json";
import type { Dialogue } from "../src/types";
import { Controller, DemoError, exportSession } from "./controller";
import {
  configured,
  credentialsConfigured,
  configurationMessage,
  freeTierVerified,
  modelId,
  generationSettings,
  modelAdapter,
  languageModelAdapter,
} from "./provider";
import { cases, evaluationPlan, runEvaluation, createScenario, runScenario } from "./evaluation";
import { LanguageService, targetSchema, contextSchema } from "./language-analysis";
const language = new LanguageService(languageModelAdapter, modelId);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const production = process.argv.includes("--production");
const vite = production
  ? null
  : await (
      await import("vite")
    ).createServer({ root, server: { middlewareMode: true }, appType: "spa" });
const controller = new Controller(modelAdapter, dialogues as Dialogue[], {
  configured,
  modelId,
  generationSettings,
  configurationMessage,
});
const port = Number(process.env.PORT ?? 4317);
const evaluations = new Map<string, unknown>();
let evaluationRunning = false;
const server = createServer(async (req, res) => {
  const send = (data: unknown, status = 200) => {
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify(data));
  };
  try {
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
    if (url.pathname.startsWith("/api/")) {
      if (
        req.headers.origin &&
        !new Set([`http://localhost:${port}`, `http://127.0.0.1:${port}`]).has(
          req.headers.origin,
        )
      )
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
      let raw = "";
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 50000) throw new DemoError("Request too large.", 413);
      }
      let body: Record<string, unknown>;
      try {
        body = JSON.parse(raw);
      } catch {
        throw new DemoError("Invalid JSON.");
      }
      if (url.pathname === "/api/language/context") {
        const input=z.object({sessionId:z.string(),context:contextSchema,revision:z.number().int().nonnegative()}).strict().parse(body);
        controller.get(input.sessionId);
        return send(language.setContext(input.sessionId,input.context,input.revision));
      }
      if (url.pathname === "/api/language/analyze") {
        const input=z.object({sessionId:z.string(),target:targetSchema,requestId:z.string(),context:contextSchema}).strict().parse(body);
        return send(language.start(controller.get(input.sessionId),input.target,input.requestId,input.context),202);
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
        const input = z
          .object({ caseId: z.string(), confirmLive: z.literal(true) })
          .strict()
          .parse(body);
        if (!configured)
          throw new DemoError(configurationMessage ?? "Live model not configured.", 503);
        if (evaluationRunning)
          throw new DemoError("Another comparison is running.", 409);
        evaluationRunning = true;
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
            evaluationRunning = false;
          });
        return send(record, 202);
      }
      throw new DemoError("Not found.", 404);
    }
    if (vite) {
      vite.middlewares(req, res, () => {
        res.writeHead(404);
        res.end();
      });
      return;
    }
    const requestPath =
      url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    const filename = path.resolve(root, "dist", requestPath);
    if (!filename.startsWith(path.join(root, "dist") + path.sep))
      throw new DemoError("Not found.", 404);
    const mime: Record<string, string> = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".svg": "image/svg+xml",
      ".png": "image/png",
    };
    try {
      const content = await readFile(filename);
      res.writeHead(200, {
        "Content-Type":
          mime[path.extname(filename)] ?? "application/octet-stream",
      });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
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
});
server.listen(port, "127.0.0.1", () =>
  console.log(
    `Humanities Lab: http://127.0.0.1:${port} · ${configured ? "Live configured" : "Scripted examples; live not configured"}`,
  ),
);
const close = () => {
  server.close();
  void vite?.close();
};
process.on("SIGTERM", close);
process.on("SIGINT", () => {
  close();
  process.exit(0);
});
