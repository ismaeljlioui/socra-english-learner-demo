/** Shared transport: never show a hosting platform's HTML/text as model output. */
let hosted = false;
const tokens = new Map<string, string>();
let queue: Promise<unknown> = Promise.resolve();
export function api<T>(url: string, body?: unknown): Promise<T> {
  // Context saves, polling and mutations must use the latest acknowledged state.
  const work = queue.then(() => request<T>(url, body));
  queue = work.catch(() => {});
  return work;
}
async function request<T>(url: string, body?: unknown): Promise<T> {
  const wrapped = hosted && url !== "/api/config";
  let sessionId = body && typeof body === "object" && "sessionId" in body ? String(body.sessionId) : new URL(url, "http://demo.local").searchParams.get("sessionId");
  let state = sessionId ? tokens.get(sessionId) : undefined;
  if (!state && sessionId) { try { state = sessionStorage.getItem(`humanities-session:${sessionId}`) ?? undefined; } catch {} }
  const payload = wrapped ? {path:url,body,state} : body;
  let response: Response;
  try {
    response = await fetch(wrapped ? "/api/transport" : url, payload === undefined ? undefined : {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("The demo server could not be reached. Check your connection and retry the same request.");
  }
  let data: unknown;
  try { data = await response.json(); }
  catch {
    throw Object.assign(new Error(
      response.status === 404
        ? "The demo API is missing from this deployment (HTTP 404). Deploy the backend from the demo folder, then reload."
        : `The demo server returned an unreadable response (HTTP ${response.status}). Check the deployment and retry the same request.`,
    ), { httpStatus: response.status, transportFailure: true });
  }
  if (wrapped && data && typeof data === "object" && "data" in data) {
    const envelope = data as {data:unknown;state?:string;sessionId?:string};
    if(envelope.state && envelope.sessionId) {
      tokens.set(envelope.sessionId,envelope.state);
      try { sessionStorage.setItem(`humanities-session:${envelope.sessionId}`,envelope.state); } catch {}
    }
    data = envelope.data;
  }
  if (!response.ok) {
    const error = data && typeof data === "object" && "error" in data ? data.error : null;
    throw Object.assign(new Error(typeof error === "string" ? error : `Request failed (HTTP ${response.status}).`), { httpStatus: response.status });
  }
  if (!data || typeof data !== "object") throw Object.assign(new Error("The demo server returned an unexpected response. Check the API deployment."), { httpStatus: response.status, transportFailure: true });
  if (url === "/api/config") hosted = "hosted" in data && data.hosted === true;
  return data as T;
}
