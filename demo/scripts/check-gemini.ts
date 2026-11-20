import { createHash } from "node:crypto";
import { readFile, writeFile, chmod } from "node:fs/promises";
import { configured, credentialsConfigured, configurationMessage, modelId } from "../server/provider";

// Metadata only. This script never generates content or changes Google billing.
// Optional flags record the operator's AI Studio/pricing review, not an API
// assertion about billing: Models.get does not expose project tier or quota.
const args = process.argv.slice(2);
const option = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const project = option("confirm-free-project");
const freeModel = option("confirm-free-model");
if (args.some((a) => !/^--confirm-free-(project|model)=/.test(a)))
  throw new Error("Use no flags for metadata only, or both --confirm-free-project=PROJECT and --confirm-free-model=MODEL after reviewing AI Studio and model pricing.");
if (Boolean(project) !== Boolean(freeModel) || (freeModel && freeModel !== modelId))
  throw new Error("Record both the Free-tier project and the exact configured model's free-tier eligibility. No model substitution is permitted.");
if (project && (!/^[\p{L}\p{N} ._-]{1,150}$/u.test(project)))
  throw new Error("Use the project name or ID only.");
if (!credentialsConfigured || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(modelId))
  throw new Error("Configure GEMINI_API_KEY and a valid exact GEMINI_MODEL on the server first.");
const key = process.env.GEMINI_API_KEY!.trim();
let response: Response;
try {
  response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}`, {
    headers: { "x-goog-api-key": key }, signal: AbortSignal.timeout(20000),
  });
} catch {
  throw new Error("Gemini model metadata could not be reached. No content generation or billing change occurred.");
}
if (!response.ok) throw new Error(`Gemini metadata returned HTTP ${response.status}. No content generation or billing change occurred; no model was substituted.`);
const result = await response.json() as { name?: string; supportedGenerationMethods?: string[] };
if (result.name !== `models/${modelId}` || !result.supportedGenerationMethods?.includes("generateContent"))
  throw new Error("Metadata does not confirm generateContent for the exact configured model.");
if (project && freeModel) {
  const values: Record<string, string> = {
    GEMINI_FREE_TIER_PROJECT: project,
    GEMINI_FREE_TIER_MODEL: modelId,
    GEMINI_FREE_TIER_KEY_SHA256: createHash("sha256").update(key).digest("hex"),
    GEMINI_FREE_TIER_VERIFIED_AT: new Date().toISOString(),
  };
  const existing = await readFile(".env", "utf8").catch((e: NodeJS.ErrnoException) => {
    if (e.code === "ENOENT") return "";
    throw new Error("Cannot read the local .env configuration.");
  });
  const retained = existing.split(/\r?\n/).filter((line) => !Object.keys(values).some((name) => line.startsWith(`${name}=`)));
  const output = retained.join("\n").trimEnd() + "\n" + Object.entries(values).map(([name, value]) => `${name}=${value}`).join("\n") + "\n";
  await writeFile(".env", output, { mode: 0o600 });
  await chmod(".env", 0o600);
}
console.log(JSON.stringify({
  check: "read_only_model_metadata", httpStatus: response.status,
  model: modelId, generateContentSupported: true,
  generationCalls: 0, billingChanges: 0,
  projectTierSource: project ? "operator confirmation from AI Studio; not returned by Models.get" : "not checked by this command",
  operatorConfirmationRecorded: Boolean(project),
  liveConfiguredAtStart: configured, configurationMessage,
  quotaAvailability: "not established by metadata; a subsequent live request can confirm current availability",
  nextStep: project ? "Restart the server. Confirmation is saved; changing project, key, model or billing tier requires a new check. Keep this project on Free tier." : "This metadata check does not refresh the saved project-tier confirmation. See README for verification instructions.",
}, null, 2));
