import { mkdir, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { Controller } from "../server/controller";
import { cases, evaluationPlan, runEvaluation } from "../server/evaluation";
import {
  configured,
  configurationMessage,
  modelId,
  generationSettings,
  modelAdapter,
} from "../server/provider";
const args = process.argv.slice(2);
const value = (name: string) =>
  args
    .find((a) => a.startsWith(`--${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
const ids = (value("cases") ?? cases.map((c) => c.id).join(",")).split(",");
const repeats = Number(value("repeats") ?? 3);
const output = path.resolve(value("out") ?? "evaluations/plan.json");
await mkdir(path.dirname(output), { recursive: true });
if (args.includes("--live")) {
  if (args.includes("--confirm-paid"))
    throw new Error("Paid runs are not supported. Use a verified free-tier project and --confirm-live.");
  if (!args.includes("--confirm-live"))
    throw new Error(
      "Live evaluation sends authored assessment text to Google Gemini using the verified free-tier project. Add --confirm-live explicitly. No paid model fallback is supported.",
    );
  if (!configured)
    throw new Error(`${configurationMessage} No model calls made.`);
  evaluationPlan(ids, repeats);
  const journal = `${output}.${Date.now()}.jsonl`;
  const controller = new Controller(modelAdapter, [], {
    configured,
    modelId,
    generationSettings,
    configurationMessage,
  });
  let pending = Promise.resolve();
  const result = await runEvaluation(controller, ids, repeats, (run) => {
    pending = pending.then(() =>
      appendFile(journal, JSON.stringify(run) + "\n"),
    );
  });
  await pending;
  await writeFile(output, JSON.stringify(result, null, 2));
  console.log(
    `Saved ${result.attemptedRuns} runs including ${result.failedRuns} failures to ${output}. Partial-run journal: ${journal}. Human review remains unperformed.`,
  );
} else {
  await writeFile(
    output,
    JSON.stringify(evaluationPlan(ids, repeats), null, 2),
  );
  console.log(
    `Saved evaluation plan to ${output}. Live model outputs = 0; educator reviews = 0. No API calls made.`,
  );
}
