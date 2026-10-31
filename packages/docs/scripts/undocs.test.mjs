import { spawn } from "node:child_process";
import { once } from "node:events";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { expect, it } from "vite-plus/test";

const STATIC_IMPORT =
  /(?:import|export)\s+(?:type\s+)?(?:[^'"\n]*?\s+from\s+)?["']([^"']+)["']|export\s+\*\s+from\s+["']([^"']+)["']/g;

/** Specifiers the browser loads with the entry, ignoring `import()`. */
function staticSpecifiers(code) {
  const specs = [];
  for (const match of code.matchAll(STATIC_IMPORT)) specs.push(match[1] || match[2]);
  return specs;
}

/**
 * Walk the dev module graph from the homepage document. User component SFCs must
 * stay behind dynamic `import()` so the first paint does not download them.
 */
async function homepageStaticModules(pageUrl) {
  const html = await fetch(pageUrl, { signal: AbortSignal.timeout(10_000) }).then((response) =>
    response.text(),
  );
  const entrypoints = [
    ...html.matchAll(/(?:src|href)="([^"]+\.(?:js|mjs|ts|vue)(?:\?[^"]*)?)"/g),
  ].map((match) => new URL(match[1], pageUrl));
  const seen = new Set();
  const queue = entrypoints;
  const modules = [];
  while (queue.length && modules.length < 800) {
    const url = queue.pop();
    const key = url.pathname + url.search;
    if (seen.has(key)) continue;
    seen.add(key);
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) continue;
    const type = response.headers.get("content-type") || "";
    if (!/javascript|typescript|text\/plain|vue/.test(type) && !url.pathname.includes("."))
      continue;
    const code = await response.text();
    modules.push({ url: key, code });
    for (const spec of staticSpecifiers(code)) {
      if (spec.startsWith("data:") || spec.startsWith("http:") || spec.startsWith("https:"))
        continue;
      queue.push(new URL(spec, url));
    }
  }
  return modules;
}

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
        "notification-center",
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
      for (const path of [
        "blocks",
        "blocks/workspace",
        "guide/registry",
        "guide/components-and-blocks",
        "guide/boundaries",
        "guide/pitfalls",
        "guide/changelog",
      ]) {
        const response = await fetch(new URL(path, url), {
          signal: AbortSignal.timeout(10_000),
        });
        expect(response.status, `${path}\n${output}`).toBe(200);
      }
      const homeHtml = await fetch(url, { signal: AbortSignal.timeout(10_000) }).then(
        (response) => {
          expect(response.status).toBe(200);
          return response.text();
        },
      );
      expect(homeHtml).toContain("PropShow Kit");
      expect(homeHtml).toContain("Add-on registry for shadcn-vue");
      expect(homeHtml).toContain("Add-ons for shadcn-vue.");
      expect(homeHtml).toContain("Copied, not installed");
      expect(homeHtml).not.toContain("13 components · 36 blocks");
      expect(homeHtml).not.toContain("Fill the gaps in shadcn-vue");
      expect(homeHtml).not.toContain("Browse blocks");
      expect(homeHtml).not.toContain("Three entries, running");
      expect(homeHtml).not.toContain("Install in 30 seconds");
      const staticModules = await homepageStaticModules(url);
      const userComponentModules = staticModules.filter((mod) =>
        /\/\.docs\/components\/.+\.vue/.test(mod.url),
      );
      expect(
        userComponentModules.map((mod) => mod.url),
        staticModules.map((mod) => mod.url).join("\n"),
      ).toEqual(
        userComponentModules
          .map((mod) => mod.url)
          .filter((mod) => mod.includes("NotFoundIllustration.vue")),
      );
      expect(staticModules.some((mod) => mod.code.includes("defineAsyncComponent"))).toBe(true);
      expect(homeHtml).not.toContain("user-components-");
      const changelogHtml = await fetch(new URL("guide/changelog", url)).then((response) => {
        expect(response.status).toBe(200);
        return response.text();
      });
      expect(changelogHtml).toContain("CHANGELOG.md");
      expect(changelogHtml).toContain("/blog/removing-efferd-marketing-blocks");
      expect(changelogHtml).toContain("/blog/what-ships-today");
      const removalHtml = await fetch(new URL("blog/removing-efferd-marketing-blocks", url)).then(
        (response) => {
          expect(response.status).toBe(200);
          return response.text();
        },
      );
      expect(removalHtml).toContain("efferd.com/license");
      expect(removalHtml).toContain("/blog/what-ships-today");
      expect(removalHtml).toContain("/components/pricing-plan");
      expect(removalHtml).toContain("/blocks/project-overview");
      expect(changelogHtml).toContain(
        `https://github.com/prop-show/prop-show-kit/edit/master/packages/docs/1.guide/7.changelog.md`,
      );
      expect(changelogHtml).toContain("/blog/from-components-to-working-screens");
      expect(changelogHtml).toContain("/blog/empty-states-as-a-skill");
      const guideHtml = await fetch(new URL("guide", url)).then((response) => response.text());
      expect(guideHtml).toContain('href="/blocks"');
      expect(guideHtml).toContain("Blocks");
      const blocksHtml = await fetch(new URL("blocks", url)).then((response) => response.text());
      expect(blocksHtml).toContain("工作台");
      expect(blocksHtml).toContain("/blocks/project-overview");
      expect(blocksHtml).toContain("/blocks/workspace");
      expect(blocksHtml).not.toContain("/blocks/hero");
      expect(blocksHtml).not.toContain("/blocks/header");
      expect(blocksHtml).not.toContain("/blocks/cta");
      expect(blocksHtml).not.toContain("/blocks/features");
      expect(blocksHtml).not.toContain("/blocks/testimonials");
      expect(blocksHtml).not.toContain("/blocks/integrations");
      expect(blocksHtml).not.toContain("/blocks/logo-cloud");
      const workspaceHtml = await fetch(new URL("blocks/workspace", url)).then((response) =>
        response.text(),
      );
      expect(workspaceHtml).toContain("/blocks/project-overview");
      expect(workspaceHtml).toContain("/blocks/team-members");
      expect(workspaceHtml).toContain("/blocks/workspace-settings");
      const shippedHtml = await fetch(new URL("blog/what-ships-today", url)).then((response) =>
        response.text(),
      );
      expect(shippedHtml).toContain("14 components");
      expect(shippedHtml).toContain("3 blocks");
      expect(shippedHtml).not.toContain("36 blocks");
      expect(shippedHtml).toContain("/blog/removing-efferd-marketing-blocks");
      expect(shippedHtml).not.toContain("four components");
      const introHtml = await fetch(new URL("guide/introduction", url)).then((response) =>
        response.text(),
      );
      expect(introHtml).toContain("Frame");
      expect(introHtml).toContain("Pricing");
      expect(introHtml).toContain("/blocks/workspace");
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
      const names = index.items.map((item) => item.name);
      for (const kept of [
        "pricing-plan",
        "pricing-plans",
        "pricing-table",
        "project-overview",
        "team-members",
        "workspace-settings",
      ]) {
        expect(names, kept).toContain(kept);
      }
      for (const removed of [
        "cta-split",
        "testimonial-centered",
        "integrations-strip",
        "logo-cloud-grid",
        "header-simple",
        "hero-spotlight",
        "feature-strip",
      ]) {
        expect(names, removed).not.toContain(removed);
      }
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
