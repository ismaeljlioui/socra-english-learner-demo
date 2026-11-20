import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import handler from "../api/index";
import { api } from "../src/api";
import { defaultStudentContext } from "../src/language-analysis";

test("hosted entry serves config, scripted conversation, context, missing-input analysis and export", async () => {
  const server = createServer(handler).listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address() as {port:number};
  const base = `http://127.0.0.1:${address.port}`;
  async function request(route: string, body?: unknown) {
    const r = await fetch(base + route, body === undefined ? undefined : {method:"POST",headers:{"Content-Type":"application/json",Origin:base},body:JSON.stringify(body)});
    assert.match(r.headers.get("content-type")!, /application\/json/);
    assert.equal(r.headers.get("cache-control"), "no-store");
    return {status:r.status, data:await r.json()};
  }
  try {
    const config = await request("/api?route=config");
    assert.equal(config.status, 200);
    assert.equal(config.data.hosted, true);
    assert.match(config.data.sessionNotice, /Temporary/);
    assert.ok(!("apiKey" in config.data));
    const created = await request("/api/sessions", {mode:"fixture",condition:"policy",fixtureId:"D1"});
    assert.equal(created.status, 201);
    const sessionId = created.data.id;
    const context = await request("/api/language/context", {sessionId,context:defaultStudentContext,revision:1});
    assert.equal(context.status, 200);
    const analyzed = await request("/api/language/analyze", {sessionId,target:{kind:"conversation"},requestId:"blank",context:defaultStudentContext});
    assert.equal(analyzed.status, 200);
    assert.equal(analyzed.data.state, "insufficient");
    const advance = {sessionId,operation:"advance",requestId:"first"};
    const next = await request("/api/action", advance);
    assert.equal(next.status, 200);
    assert.equal(next.data.fixtureIndex, 1);
    const replay = await request("/api/action", advance);
    assert.equal(replay.data.turns.length, next.data.turns.length);
    const exported = await request(`/api?route=export&sessionId=${sessionId}`);
    assert.equal(exported.status, 200);
    assert.equal(exported.data.language.analyses.length, 1);
    const unknown = await request("/api/session?sessionId=expired");
    assert.equal(unknown.status, 404);
    assert.match(unknown.data.error, /temporary session/);
    for (const route of ["evaluate", "scenario-run"]) {
      const batch = await request(`/api/${route}`, {});
      assert.equal(batch.status, 501);
      assert.match(batch.data.error, /local server/);
    }
    const cross = await fetch(base + "/api/sessions", {method:"POST",headers:{Origin:"https://unrelated.example","Content-Type":"application/json"},body:JSON.stringify(advance)});
    assert.equal(cross.status, 403);
    const malformed = await fetch(base + "/api/sessions", {method:"POST",headers:{"Content-Type":"application/json"},body:"{"});
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error, "Invalid JSON.");
    const oversize = await request("/api/sessions", {text:"é".repeat(26000)});
    assert.equal(oversize.status, 413);
  } finally { server.closeAllConnections(); await new Promise<void>(resolve=>server.close(()=>resolve())); }
});

test("Vercel parsed bodies and HTTPS same-origin requests are supported", async () => {
  const server = createServer(async (req, res) => {
    // Emulate the documented Node runtime request.body helper.
    for await (const _ of req) { /* consume input as the runtime does */ }
    Object.assign(req, {body:{mode:"fixture",condition:"policy",fixtureId:"D1"}});
    req.headers.host = "demo.example";
    req.headers.origin = "https://demo.example";
    await handler(req, res);
  }).listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const r = await fetch(`http://127.0.0.1:${(server.address() as {port:number}).port}/api?route=sessions`, {method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});
    assert.equal(r.status, 201);
    assert.equal((await r.json()).mode, "fixture");
  } finally { server.closeAllConnections(); await new Promise<void>(resolve=>server.close(()=>resolve())); }
});

test("API transport handles platform text/HTML failures and preserves JSON quota details", async t => {
  const mocked = t.mock.method(globalThis, "fetch");
  for (const [body,status] of [["The page could not be found",404],["<html>Timeout</html>",504]] as const) {
    mocked.mock.mockImplementation(async()=>new Response(body,{status}));
    await assert.rejects(api("/api/config"), (e: unknown)=>{
      const error=e as Error & {httpStatus:number;transportFailure:boolean};
      assert.equal(error.httpStatus,status);assert.equal(error.transportFailure,true);
      assert.doesNotMatch(error.message,/Unexpected token|<html>/);return true;
    });
  }
  mocked.mock.mockImplementation(async()=>Response.json({error:"Quota exhausted; retry after 60 seconds."},{status:429}));
  await assert.rejects(api("/api/action",{}), {message:"Quota exhausted; retry after 60 seconds.",httpStatus:429});
  mocked.mock.mockImplementation(async()=>Response.json({configured:false}));
  assert.deepEqual(await api("/api/config"),{configured:false});
});
