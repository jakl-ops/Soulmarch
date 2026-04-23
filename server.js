const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const {
  createSession,
  createUser,
  deleteAdventure,
  deleteSession,
  getAdventure,
  getUserBySessionToken,
  listActiveAdventures,
  listGraveyardEntries,
  recordDeath,
  saveAdventure,
  authenticateUser,
} = require("./storage");

const PORT = Number(process.env.PORT || 3000);
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    ...headers,
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8", ...headers });
  res.end(body);
}

function parseCookies(req) {
  const header = req.headers.cookie ?? "";
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...rest] = part.split("=");
        return [key, decodeURIComponent(rest.join("="))];
      })
  );
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Request body too large."));
      }
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });
}

function sessionCookie(token) {
  return `session=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
}

function clearSessionCookie() {
  return "session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0";
}

function getUser(req) {
  const cookies = parseCookies(req);
  return getUserBySessionToken(cookies.session);
}

function requireUser(req, res) {
  const user = getUser(req);
  if (!user) {
    sendJson(res, 401, { error: "Not authenticated." });
    return null;
  }
  return user;
}

function serveStatic(req, res) {
  const requested = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(__dirname, safePath);
  if (!filePath.startsWith(__dirname)) {
    sendText(res, 403, "Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream" });
    res.end(data);
  });
}

function adventureSummary(entry) {
  return {
    id: entry.id,
    name: entry.name,
    description: entry.description,
    classId: entry.classId,
    level: entry.level,
    updatedAt: entry.updatedAt,
  };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/api/signup") {
      const body = await readBody(req);
      const username = String(body.username ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      if (!username || password.length < 8) {
        sendJson(res, 400, { error: "Username is required and password must be at least 8 characters." });
        return;
      }
      const result = createUser(username, password);
      if (result.error) {
        sendJson(res, 409, { error: result.error });
        return;
      }
      const token = createSession(result.user.id);
      sendJson(res, 201, { user: result.user }, { "Set-Cookie": sessionCookie(token) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/login") {
      const body = await readBody(req);
      const username = String(body.username ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      const user = authenticateUser(username, password);
      if (!user) {
        sendJson(res, 401, { error: "Invalid username or password." });
        return;
      }
      const token = createSession(user.id);
      sendJson(res, 200, { user }, { "Set-Cookie": sessionCookie(token) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/logout") {
      const cookies = parseCookies(req);
      deleteSession(cookies.session);
      sendJson(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/session") {
      const user = getUser(req);
      sendJson(res, 200, { user });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/hub") {
      const user = requireUser(req, res);
      if (!user) return;
      sendJson(res, 200, {
        user,
        adventures: listActiveAdventures(user.id).map(adventureSummary),
        graveyard: listGraveyardEntries(user.id),
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/graveyard") {
      const user = requireUser(req, res);
      if (!user) return;
      sendJson(res, 200, { entries: listGraveyardEntries(user.id) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/adventures") {
      const user = requireUser(req, res);
      if (!user) return;
      const body = await readBody(req);
      const snapshot = body.snapshot;
      if (!snapshot?.player) {
        sendJson(res, 400, { error: "Adventure snapshot is required." });
        return;
      }
      const result = saveAdventure(user.id, snapshot);
      if (result.error) {
        sendJson(res, 400, { error: result.error });
        return;
      }
      sendJson(res, 201, { adventure: adventureSummary(result.adventure) });
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/adventures/")) {
      const user = requireUser(req, res);
      if (!user) return;
      const adventureId = url.pathname.split("/").pop();
      const adventure = getAdventure(user.id, adventureId);
      if (!adventure) {
        sendJson(res, 404, { error: "Adventure not found." });
        return;
      }
      sendJson(res, 200, { adventure });
      return;
    }

    if (req.method === "PUT" && url.pathname.startsWith("/api/adventures/")) {
      const user = requireUser(req, res);
      if (!user) return;
      const adventureId = url.pathname.split("/").pop();
      const body = await readBody(req);
      const snapshot = body.snapshot;
      if (!snapshot?.player) {
        sendJson(res, 400, { error: "Adventure snapshot is required." });
        return;
      }
      const result = saveAdventure(user.id, snapshot, adventureId);
      sendJson(res, 200, { adventure: adventureSummary(result.adventure) });
      return;
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/api/adventures/")) {
      const user = requireUser(req, res);
      if (!user) return;
      const adventureId = url.pathname.split("/").pop();
      deleteAdventure(user.id, adventureId);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/death/")) {
      const user = requireUser(req, res);
      if (!user) return;
      const adventureId = url.pathname.split("/").pop();
      const body = await readBody(req);
      const snapshot = body.snapshot;
      if (!snapshot?.player) {
        sendJson(res, 400, { error: "Adventure snapshot is required." });
        return;
      }
      recordDeath(user.id, adventureId, snapshot);
      sendJson(res, 200, { ok: true });
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error." });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Soulmarch server listening on port ${PORT}`);
});
