// Execute emitted code using plain Node, matching the hosted ESM runtime.
// No .env loading or AI requests; all created sessions are explicitly scripted.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import handler from "../.runtime-check/api/index.js";
const server = createServer(handler).listen(0, "127.0.0.1");
await once(server, "listening");
const base = `http://127.0.0.1:${server.address().port}`;
try {
  const response = await fetch(`${base}/api?route=config`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).hosted, true);
  const created = await fetch(`${base}/api?route=transport`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: base },
    body: JSON.stringify({path:"/api/sessions",body:{ mode: "fixture", condition: "policy", fixtureId: "D1" }}),
  });
  assert.equal(created.status, 201);
  const session = await created.json();
  const next = await fetch(`${base}/api/transport`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: base },
    body: JSON.stringify({path:"/api/action",state:session.state,body:{ sessionId: session.data.id, operation: "advance", requestId: "native-check" }}),
  });
  assert.equal(next.status, 200);
  assert.equal((await next.json()).data.fixtureIndex, 1);
  console.log("Native Node runtime: config, scripted session and response passed. No AI calls.");
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
