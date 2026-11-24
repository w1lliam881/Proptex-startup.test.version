// Startar sidan med ett kommando: installerar, bygger vid behov, startar och öppnar webbläsaren.
// Används av "Starta Proptex.command" (Mac), "Starta Proptex.bat" (Windows) och `npm run preview`.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { createServer } from "node:net";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const say = (m) => console.log(`\n  ${m}`);

const [major] = process.versions.node.split(".").map(Number);
if (major < 20) {
  say(
    `Du har Node ${process.versions.node}. Sidan behöver Node 20 eller senare: https://nodejs.org`,
  );
  process.exit(1);
}

function run(args) {
  const r = spawnSync(npm, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) {
    say("Något gick snett, se meddelandet ovan.");
    process.exit(r.status ?? 1);
  }
}

function newestMtime(dir) {
  let t = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    t = Math.max(t, e.isDirectory() ? newestMtime(p) : statSync(p).mtimeMs);
  }
  return t;
}

function needsBuild() {
  const id = join(root, ".next", "BUILD_ID");
  if (!existsSync(id)) return true;
  const built = statSync(id).mtimeMs;
  const sources = [join(root, "src"), join(root, "public")].filter(existsSync);
  const files = ["package.json", "next.config.ts", ".env.local"]
    .map((f) => join(root, f))
    .filter(existsSync);
  return Math.max(...sources.map(newestMtime), ...files.map((f) => statSync(f).mtimeMs)) > built;
}

const freePort = (port) =>
  new Promise((resolve) => {
    const s = createServer()
      .once("error", () => resolve(freePort(port + 1)))
      .once("listening", () => s.close(() => resolve(port)))
      .listen(port);
  });

function openBrowser(url) {
  const cmd =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  spawn(cmd, args, { stdio: "ignore", detached: true })
    .on("error", () => {})
    .unref();
}

if (!existsSync(join(root, "node_modules"))) {
  say("Första gången: installerar det som behövs (tar en minut eller två)…");
  run(["install", "--no-audit", "--no-fund"]);
}
if (needsBuild()) {
  say("Bygger sidan…");
  run(["run", "build"]);
}

const port = await freePort(Number(process.env.PORT) || 3000);
const url = `http://localhost:${port}`;
say("Startar Proptex…");
const server = spawn(npm, ["run", "start", "--", "-p", String(port)], {
  cwd: root,
  stdio: ["ignore", "pipe", "inherit"],
  shell: process.platform === "win32",
});
let opened = false;
server.stdout.on("data", (d) => {
  if (!opened && /ready|started|Local:/i.test(String(d))) {
    opened = true;
    say(`Sidan är igång på ${url}`);
    say(
      "Låt det här fönstret vara öppet. Stäng det (eller tryck Ctrl+C) för att stänga av sidan.\n",
    );
    if (!process.env.NO_OPEN) openBrowser(url);
  }
});
server.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => server.kill(sig));
