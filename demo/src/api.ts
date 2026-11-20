/** Shared transport: never show a hosting platform's HTML/text as model output. */
export async function api<T>(url: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, body === undefined ? undefined : {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
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
  if (!response.ok) {
    const error = data && typeof data === "object" && "error" in data ? data.error : null;
    throw Object.assign(new Error(typeof error === "string" ? error : `Request failed (HTTP ${response.status}).`), { httpStatus: response.status });
  }
  if (!data || typeof data !== "object") throw Object.assign(new Error("The demo server returned an unexpected response. Check the API deployment."), { httpStatus: response.status, transportFailure: true });
  return data as T;
}
