import type { IncomingMessage, ServerResponse } from "node:http";
import { handleAPI } from "../server/api.js";

// All /api/* routes share one function and its temporary in-memory demo state.
export default function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/api", `http://${req.headers.host ?? "localhost"}`);
  const route = url.searchParams.get("route");
  if (url.pathname === "/api" || url.pathname === "/api/index") {
    url.pathname = `/api/${route ?? ""}`;
    url.searchParams.delete("route");
    req.url = url.pathname + url.search;
  }
  return handleAPI(req, res, true);
}
