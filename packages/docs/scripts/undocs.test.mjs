import { spawn } from "node:child_process";
import { once } from "node:events";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { expect, it } from "vite-plus/test";

it.each([undefined, "https://registry.example.test/"])(
  "starts the docs CLI with registry URL %s",
  async (registryURL) => {
    const directory = new URL("../.docs/public/r/", import.meta.url);
    const originals = await Promise.all(
      (await readdir(directory))
        .filter((name) => name.endsWith(".json"))
        .map(async (name) => {
          const path = new URL(name, directory);
          return [path, await readFile(path)];
        }),
    );
    const server = spawn(
      process.execPath,
      [
        "scripts/undocs.mjs",
        "dev",
        ".",
        "--host",
        "127.0.0.1",
        "--port",
        "0",
        ...(registryURL ? ["--registry-url", registryURL] : []),
      ],
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
      for (const component of [
        "frame",
        "layer-card",
        "layer-dialog",
        "inline-tip",
        "status-badge",
        "copy",
        "inline-copy-text",
        "filters",
        "slider",
        "delete-resource",
      ]) {
        const response = await fetch(new URL(`components/${component}`, url), {
          signal: AbortSignal.timeout(10_000),
        });
        expect(response.status, output).toBe(200);
        const html = await response.text();
        expect(html).toContain("Component Source");
        expect(html).not.toContain('aria-label="Component example"');
        expect(html).not.toContain('aria-label="Resize preview width"');
        expect(html).toContain("prose-code-group");
        expect(html).toContain(`https://kit.prop.show/r/${component}.json`);
        const registry = await fetch(new URL(`r/${component}.json`, url));
        expect(registry.status).toBe(200);
        expect((await registry.json()).name).toBe(component);
      }
      const homepage = registryURL || url;
      for (const block of ["project-overview", "team-members", "workspace-settings"]) {
        const response = await fetch(new URL(`blocks/${block}`, url), {
          signal: AbortSignal.timeout(10_000),
        });
        expect(response.status, output).toBe(200);
        const html = await response.text();
        expect(html).toContain('aria-label="Component example"');
        expect(html).toContain('aria-label="Resize preview width"');
        expect(html).toContain(`https://kit.prop.show/r/${block}.json`);
        const registry = await fetch(new URL(`r/${block}.json`, url)).then((response) => {
          expect(response.status).toBe(200);
          return response.json();
        });
        expect(registry.name).toBe(block);
        expect(registry.type).toBe("registry:block");
        expect(registry.registryDependencies).toContain(`${homepage}r/frame.json`);
        expect(registry.files.some((file) => file.path.endsWith("/index.ts"))).toBe(true);
      }
      for (const missing of ["404", "components/missing-component", "blog/missing-post"]) {
        const response = await fetch(new URL(missing, url));
        expect(response.status, output).toBe(404);
        const html = await response.text();
        expect(html).toContain("This piece is missing.");
        expect(html).toContain('data-slot="not-found-illustration"');
        expect(html).toContain("Back to home");
        expect(html).toContain("Browse components");
        expect(html).toContain('name="robots" content="noindex, follow"');
      }
      const index = await fetch(new URL("r/registry.json", url)).then((response) =>
        response.json(),
      );
      expect(index.homepage).toBe(homepage);
      const deletion = await fetch(new URL("r/delete-resource.json", url)).then((response) =>
        response.json(),
      );
      expect(deletion.registryDependencies).toEqual([
        "button",
        `${homepage}r/inline-copy-text.json`,
        "input",
      ]);
      expect(
        index.items.find((item) => item.name === "delete-resource").registryDependencies,
      ).toEqual(deletion.registryDependencies);
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
      const pages = {
        guide: "packages/docs/1.guide/1.index.md",
        "components/copy": "packages/docs/2.components/6.copy.md",
        "blog/what-ships-today": "packages/docs/3.blog/1.what-ships-today.md",
      };
      for (const [path, file] of Object.entries(pages)) {
        const response = await fetch(new URL(path, url), { signal: AbortSignal.timeout(10_000) });
        expect(response.status, path).toBe(200);
        const html = await response.text();
        expect(html).toContain(`https://github.com/prop-show/prop-show-kit/edit/master/${file}`);
        expect(html).not.toContain("/edit/main/docs/");
        expect(html).not.toContain("/edit/master/docs/");
      }
      for (const [path, pathname] of [
        ["guide/installation", "/guide"],
        ["guide/components", "/components"],
        ["guide/components/copy", "/components/copy"],
        ["guide/components/frame", "/components/frame"],
      ]) {
        const response = await fetch(new URL(path, url), {
          redirect: "manual",
          signal: AbortSignal.timeout(10_000),
        });
        expect(response.status, path).toBe(301);
        expect(new URL(response.headers.get("location"), url).pathname, path).toBe(pathname);
      }
    } finally {
      try {
        if (server.exitCode === null && server.signalCode === null) {
          const stopped = once(server, "exit");
          server.kill();
          await stopped;
        }
      } finally {
        await Promise.all(originals.map(([path, content]) => writeFile(path, content)));
      }
    }
  },
  60_000,
);
