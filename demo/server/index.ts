import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleAPI } from "./api.js";
import { configured } from "./provider.js";
import { DemoError } from "./controller.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const production = process.argv.includes("--production");
const vite = production
  ? null
  : await (
      await import("vite")
    ).createServer({ root, server: { middlewareMode: true }, appType: "spa" });
const port = Number(process.env.PORT ?? 4317);
const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
  if (url.pathname.startsWith("/api/")) return handleAPI(req, res);
  try {
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
  } catch {
    res.writeHead(404);
    res.end("Not found");
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
