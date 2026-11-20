import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { deflateSync, inflateSync } from "node:zlib";
import secret from "./hosted-key.json" with { type: "json" };
import { DemoError } from "./controller.js";
import type { createRuntime } from "./api.js";
const key = Buffer.from(secret.key, "hex");
const maxState = 1_000_000;
type Runtime = ReturnType<typeof createRuntime>;
export function sealState(runtime: Runtime) {
  const state = JSON.stringify({version:1,expires:Date.now()+12*60*60*1000,
    sessions:[...runtime.controller.sessions],records:[...runtime.language.records],
    requests:[...runtime.language.requestRecords],contexts:[...runtime.language.contexts]});
  if (Buffer.byteLength(state)>maxState) throw new DemoError("This session reached the hosted size limit. Save the visible conversation and start a new session.",413);
  const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",key,iv);
  const payload=Buffer.concat([cipher.update(deflateSync(state)),cipher.final()]);
  return Buffer.concat([iv,cipher.getAuthTag(),payload]).toString("base64url");
}
export function restoreState(runtime: Runtime, token: string) {
  try {
    if(token.length>maxState) throw new Error("size");
    const bytes=Buffer.from(token,"base64url"),decipher=createDecipheriv("aes-256-gcm",key,bytes.subarray(0,12));
    decipher.setAuthTag(bytes.subarray(12,28));
    const data=JSON.parse(inflateSync(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]),{maxOutputLength:maxState}).toString());
    if(data.version!==1||data.expires<Date.now()||data.sessions.length!==1) throw new Error("expired");
    runtime.controller.sessions=new Map(data.sessions);
    for(const s of runtime.controller.sessions.values()) {
      if(s.mode==="live" && s.modelId!==runtime.controller.config.modelId) throw new Error("model changed");
    }
    runtime.language.records=new Map(data.records);
    runtime.language.requestRecords=new Map(data.requests);
    runtime.language.contexts=new Map(data.contexts);
  } catch { throw new DemoError("This hosted session has expired or is no longer valid. Save the visible conversation, then open session settings to start a new one.",410); }
}
