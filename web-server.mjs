import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { getExerciseCatalog } from "./catalog.mjs";

const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = fileURLToPath(new URL("./web/", import.meta.url));
const TESTER_DIR = fileURLToPath(new URL("./tester/", import.meta.url));
const TEST_RUNNER = join(TESTER_DIR, "test.mjs");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
};

const sendText = (response, statusCode, text) => {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(text);
};

const readRequestBody = (request) =>
  new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk.toString();
      if (raw.length > 1_000_000) {
        reject(Error("Request body too large"));
      }
    });

    request.on("end", () => resolve(raw));
    request.on("error", reject);
  });

const resolvePublicPath = (urlPathname) => {
  const normalizedPath = urlPathname === "/" ? "/index.html" : urlPathname;
  return fileURLToPath(new URL(`.${normalizedPath}`, new URL("./web/", import.meta.url)));
};

const parseRunRequest = async (request) => {
  const rawBody = await readRequestBody(request);

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    throw Error("Invalid JSON body");
  }

  if (body.language !== "javascript") {
    throw Error("Only JavaScript is supported right now");
  }

  if (typeof body.exerciseId !== "string" || body.exerciseId.trim() === "") {
    throw Error("Missing exerciseId");
  }

  if (typeof body.code !== "string" || body.code.trim() === "") {
    throw Error("Code cannot be empty");
  }

  return {
    exerciseId: body.exerciseId.trim(),
    code: body.code,
    language: body.language,
  };
};

const runJavaScriptExercise = async ({ exerciseId, code }) => {
  const tempDir = await mkdtemp(join(tmpdir(), "checkpoint-web-"));
  const solutionFilename = `${exerciseId}.js`;
  const solutionPath = join(tempDir, solutionFilename);

  try {
    await writeFile(solutionPath, code, "utf8");

    const result = await new Promise((resolve) => {
      const child = spawn(
        process.execPath,
        [TEST_RUNNER, tempDir, exerciseId, solutionFilename],
        {
          cwd: ROOT_DIR,
          env: process.env,
          stdio: ["ignore", "pipe", "pipe"],
        },
      );

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("close", (exitCode) => {
        resolve({
          ok: exitCode === 0,
          exitCode,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        });
      });
    });

    const output = [result.stdout, result.stderr].filter(Boolean).join("\n\n").trim();

    return {
      ...result,
      output,
      error: result.ok ? null : output || `Test run failed for ${exerciseId}`,
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};

const serveStaticFile = async (request, response) => {
  const filePath = resolvePublicPath(new URL(request.url, "http://localhost").pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  try {
    const content = await readFile(filePath);
    const extension = filePath.slice(filePath.lastIndexOf("."));
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(content);
  } catch {
    sendText(response, 404, "Not found");
  }
};

const server = http.createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url, "http://localhost");

    if (request.method === "GET" && pathname === "/api/catalog") {
      sendJson(response, 200, await getExerciseCatalog());
      return;
    }

    if (request.method === "POST" && pathname === "/api/run") {
      const payload = await parseRunRequest(request);
      const result = await runJavaScriptExercise(payload);
      sendJson(response, 200, result);
      return;
    }

    if (request.method === "GET") {
      await serveStaticFile(request, response);
      return;
    }

    sendText(response, 405, "Method not allowed");
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

server.listen(PORT, () => {
  console.log(`Web tester available at http://localhost:${PORT}`);
});
