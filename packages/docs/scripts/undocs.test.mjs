import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { expect, it } from "vite-plus/test";

it("starts the docs CLI and renders registry documentation with the installed UnDocs", async () => {
  const server = spawn(
    process.execPath,
    ["scripts/undocs.mjs", "dev", ".", "--host", "127.0.0.1", "--port", "0"],
    {
      cwd: fileURLToPath(new URL("..", import.meta.url)),
      env: { ...process.env, NO_COLOR: "1", CHOKIDAR_USEPOLLING: "1" },
      signal: AbortSignal.timeout(45_000),
    },
  );
  let output = "";
  try {
    const url = await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("exit", () => reject(new Error(output)));
      server.stderr.on("data", (chunk) => {
        output += chunk;
      });
      server.stdout.on("data", (chunk) => {
        output += chunk;
        const match = output.match(/Local:\s+(http:\/\/127\.0\.0\.1:\d+\/)/);
        if (match) resolve(match[1]);
      });
    });
    for (const component of ["copy", "filters", "inline-tip", "status-badge"]) {
      const response = await fetch(new URL(`components/${component}`, url), {
        signal: AbortSignal.timeout(10_000),
      });
      expect(response.status, output).toBe(200);
      const html = await response.text();
      expect(html).toContain("Component Source");
      expect(html).toContain("prose-code-group");
      expect(html).toContain(`https://kit.prop.show/r/${component}.json`);
      const registry = await fetch(new URL(`r/${component}.json`, url));
      expect(registry.status).toBe(200);
      expect((await registry.json()).name).toBe(component);
    }
    const cssResponse = await fetch(new URL("src/app/css.css?direct", url));
    expect(cssResponse.status).toBe(200);
    const css = await cssResponse.text();
    expect(css).not.toMatch(/@(?:theme|source)\b/);
    for (const selector of [
      ".bg-popover",
      ".bg-secondary",
      ".bg-destructive",
      ".bg-green-500",
      ".bg-orange-500",
      ".bg-stone-400",
    ]) {
      expect(css).toContain(selector);
    }
  } finally {
    if (server.exitCode === null && server.signalCode === null) {
      const stopped = once(server, "exit");
      server.kill();
      await stopped;
    }
  }
}, 60_000);
