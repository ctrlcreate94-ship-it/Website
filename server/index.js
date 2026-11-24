import "dotenv/config";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import express from "express";
import { createClient } from "webdav";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publishedDirectory = path.resolve(projectRoot, process.env.PUBLISHED_DIR || "data/published");
const catalogPath = path.resolve(projectRoot, process.env.PORTFOLIO_FILE || "data/portfolio.json");
const sourceRoot = path.posix.normalize(`/${(process.env.NEXTCLOUD_SOURCE_PATH || "Photos").replace(/^\/+/, "")}`);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const contentTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};
const maxImageBytes = 30 * 1024 * 1024;
const cookieName = "parivaar_admin";
const sessionDurationMs = 8 * 60 * 60 * 1000;
const loginFailures = new Map();
const app = express();

const nextcloudConfigured = Boolean(
  process.env.NEXTCLOUD_URL && process.env.NEXTCLOUD_USERNAME && process.env.NEXTCLOUD_APP_PASSWORD,
);
const webdav = nextcloudConfigured
  ? createClient(process.env.NEXTCLOUD_URL, {
      username: process.env.NEXTCLOUD_USERNAME,
      password: process.env.NEXTCLOUD_APP_PASSWORD,
    })
  : null;

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "32kb" }));
app.use(
  "/media",
  express.static(publishedDirectory, {
    fallthrough: false,
    maxAge: "1h",
    immutable: false,
    dotfiles: "deny",
    index: false,
  }),
);

function safeEqual(first, second) {
  const firstHash = crypto.createHash("sha256").update(String(first)).digest();
  const secondHash = crypto.createHash("sha256").update(String(second)).digest();
  return crypto.timingSafeEqual(firstHash, secondHash);
}

function signExpiry(expiry) {
  return crypto.createHmac("sha256", process.env.SESSION_SECRET).update(String(expiry)).digest("hex");
}

function readCookie(request, name) {
  const prefix = `${name}=`;
  const cookie = (request.headers.cookie || "").split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : "";
}

function isAuthenticated(request) {
  if (!process.env.SESSION_SECRET) return false;
  const [expiry, signature] = readCookie(request, cookieName).split(".");
  if (!expiry || !signature || !/^\d+$/.test(expiry) || Number(expiry) <= Date.now()) return false;

  const expected = Buffer.from(signExpiry(expiry), "hex");
  const actual = Buffer.from(signature, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function requireAdmin(request, response, next) {
  if (!isAuthenticated(request)) return response.status(401).json({ error: "Admin sign-in required." });
  next();
}

function requireWebdav(response) {
  if (webdav) return true;
  response.status(503).json({ error: "Nextcloud is not configured on the server." });
  return false;
}

function sourcePath(relativePath = "") {
  const relative = String(relativePath).replace(/^\/+/, "");
  const normalized = path.posix.normalize(relative);
  if (normalized === ".." || normalized.startsWith("../")) {
    const error = new Error("Invalid Nextcloud path.");
    error.status = 400;
    throw error;
  }
  return path.posix.join(sourceRoot, normalized === "." ? "" : normalized);
}

function relativeSourcePath(remotePath) {
  return `/${path.posix.relative(sourceRoot, remotePath)}`.replace(/\/$/, "") || "/";
}

async function readCatalog() {
  try {
    const data = JSON.parse(await readFile(catalogPath, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeCatalog(items) {
  const temporaryPath = `${catalogPath}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
  await rename(temporaryPath, catalogPath);
}

function imageExtension(fileName) {
  const extension = path.posix.extname(fileName).toLowerCase();
  return allowedExtensions.has(extension) ? extension : "";
}

function checkLoginLimit(request, response) {
  const key = request.ip;
  const current = loginFailures.get(key);
  if (current && current.expiresAt > Date.now() && current.count >= 5) {
    response.status(429).json({ error: "Too many sign-in attempts. Try again in 15 minutes." });
    return false;
  }
  if (current && current.expiresAt <= Date.now()) loginFailures.delete(key);
  return true;
}

app.get("/api/portfolio", async (_request, response, next) => {
  try {
    response.set("Cache-Control", "no-store");
    const items = await readCatalog();
    response.json(items.map(({ id, label, alt, image, galleryUrl }) => ({ id, label, alt, image, galleryUrl })));
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/login", (request, response) => {
  const { ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !SESSION_SECRET) {
    return response.status(503).json({ error: "Admin credentials are not configured on the server." });
  }
  if (!checkLoginLimit(request, response)) return;

  const valid = safeEqual(request.body?.username || "", ADMIN_USERNAME)
    && safeEqual(request.body?.password || "", ADMIN_PASSWORD);
  if (!valid) {
    const existing = loginFailures.get(request.ip);
    loginFailures.set(request.ip, {
      count: existing?.expiresAt > Date.now() ? existing.count + 1 : 1,
      expiresAt: existing?.expiresAt > Date.now() ? existing.expiresAt : Date.now() + 15 * 60 * 1000,
    });
    return response.status(401).json({ error: "Username or password is incorrect." });
  }

  loginFailures.delete(request.ip);
  const expiry = Date.now() + sessionDurationMs;
  response.cookie(cookieName, `${expiry}.${signExpiry(expiry)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionDurationMs,
    path: "/",
  });
  response.json({ authenticated: true });
});

app.get("/api/admin/session", requireAdmin, (_request, response) => {
  response.json({ authenticated: true });
});

app.post("/api/admin/logout", requireAdmin, (_request, response) => {
  response.clearCookie(cookieName, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/" });
  response.status(204).end();
});

app.get("/api/admin/files", requireAdmin, async (request, response, next) => {
  if (!requireWebdav(response)) return;
  try {
    const currentPath = String(request.query.path || "/");
    const remotePath = sourcePath(currentPath);
    const contents = await webdav.getDirectoryContents(remotePath);
    const entries = contents
      .filter((entry) => entry.type === "directory" || (entry.type === "file" && imageExtension(entry.basename) && Number(entry.size) <= maxImageBytes))
      .map((entry) => ({
        name: entry.basename,
        type: entry.type,
        path: relativeSourcePath(entry.filename),
        size: Number(entry.size) || 0,
        previewUrl: entry.type === "file" ? `/api/admin/preview?path=${encodeURIComponent(relativeSourcePath(entry.filename))}` : undefined,
      }))
      .sort((first, second) => Number(second.type === "directory") - Number(first.type === "directory") || first.name.localeCompare(second.name));

    response.json({ currentPath, entries });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/preview", requireAdmin, async (request, response, next) => {
  if (!requireWebdav(response)) return;
  try {
    const remotePath = sourcePath(request.query.path);
    const extension = imageExtension(path.posix.basename(remotePath));
    if (!extension) return response.status(415).json({ error: "This file type cannot be previewed." });

    const fileInfo = await webdav.stat(remotePath);
    if (fileInfo.type !== "file" || Number(fileInfo.size) > maxImageBytes) {
      return response.status(413).json({ error: "This file is too large to preview." });
    }

    const contents = await webdav.getFileContents(remotePath, { format: "binary" });
    response.set({
      "Cache-Control": "private, max-age=60",
      "Content-Type": contentTypes[extension],
      "X-Content-Type-Options": "nosniff",
    });
    response.send(Buffer.from(contents));
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/publish", requireAdmin, async (request, response, next) => {
  if (!requireWebdav(response)) return;
  let destinationPath;
  try {
    const relativePath = String(request.body?.path || "");
    const label = String(request.body?.label || "").trim();
    const alt = String(request.body?.alt || "").trim();
    const remotePath = sourcePath(relativePath);
    const extension = imageExtension(path.posix.basename(remotePath));
    if (!extension || !label || label.length > 100 || !alt || alt.length > 240) {
      return response.status(400).json({ error: "Choose an image and provide a title and description within the limits." });
    }

    const existingItems = await readCatalog();
    if (existingItems.some((item) => item.sourcePath === relativeSourcePath(remotePath))) {
      return response.status(409).json({ error: "This image is already in the portfolio." });
    }

    const fileInfo = await webdav.stat(remotePath);
    if (fileInfo.type !== "file" || Number(fileInfo.size) > maxImageBytes) {
      return response.status(413).json({ error: "This image exceeds the 30 MB publishing limit." });
    }

    const contents = await webdav.getFileContents(remotePath, { format: "binary" });
    const id = crypto.randomUUID();
    const fileName = `${id}${extension}`;
    destinationPath = path.join(publishedDirectory, fileName);
    await writeFile(destinationPath, Buffer.from(contents), { flag: "wx" });

    const item = {
      id,
      label,
      alt,
      image: `/media/${fileName}`,
      galleryUrl: `/media/${fileName}`,
      sourcePath: relativeSourcePath(remotePath),
      publishedAt: new Date().toISOString(),
    };

    try {
      await writeCatalog([item, ...existingItems]);
    } catch (error) {
      await rm(destinationPath, { force: true });
      throw error;
    }

    response.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  if (response.headersSent) return;
  response.status(error.status || 500).json({ error: error.status ? error.message : "The server could not complete the request." });
});

const port = Number(process.env.PORT) || 3001;

await mkdir(publishedDirectory, { recursive: true });
await mkdir(path.dirname(catalogPath), { recursive: true });
try {
  await stat(catalogPath);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  await writeFile(catalogPath, "[]\n", "utf8");
}

app.listen(port, "127.0.0.1", () => {
  console.log(`Parivaar publishing API listening on 127.0.0.1:${port}`);
});