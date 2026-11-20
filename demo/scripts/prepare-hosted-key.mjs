import { randomBytes } from "node:crypto";
import { writeFileSync, existsSync } from "node:fs";
const target = new URL("../server/hosted-key.json", import.meta.url);
// Private build artifact, traced only by the server function. Never a VITE_ value.
if (!existsSync(target)) writeFileSync(target, JSON.stringify({key:randomBytes(32).toString("hex")}), {mode:0o600});
