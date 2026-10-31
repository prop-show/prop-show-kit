import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "c12";
import { expect, it } from "vite-plus/test";
import { renderCloudflareRedirects, writeCloudflareRedirects } from "./cloudflare-redirects.mjs";

it("publishes docs.yaml redirects as Cloudflare static-asset rules", async () => {
  const { config } = await loadConfig({
    name: "docs",
    cwd: fileURLToPath(new URL("..", import.meta.url)),
  });
  const rendered = renderCloudflareRedirects(config.redirects);
  expect(rendered).toContain("/guide/installation /guide 301\n");
  expect(rendered).toContain("/guide/installation/ /guide 301\n");
  expect(rendered).toContain("/guide/components /components 301\n");
  expect(rendered).toContain("/guide/components/ /components 301\n");
  expect(rendered).toContain("/guide/components/* /components/:splat 301\n");
  expect(rendered.indexOf("/guide/components /components 301")).toBeLessThan(
    rendered.indexOf("/guide/components/* /components/:splat 301"),
  );
  expect(rendered).not.toContain("/guide /guide");
  const directory = await mkdtemp(resolve(tmpdir(), "docs-redirects-"));
  try {
    const file = await writeCloudflareRedirects(directory, config.redirects);
    expect(await readFile(file, "utf8")).toBe(rendered);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

it("keeps a fixed subtree target and preserves a wildcard tail", () => {
  const rendered = renderCloudflareRedirects({
    "/old/**": "/new",
    "/guide/components/**": "/components/**",
  });
  expect(rendered).toContain("/old /new 301\n");
  expect(rendered).toContain("/old/ /new 301\n");
  expect(rendered).toContain("/old/* /new 301\n");
  expect(rendered).toContain("/guide/components/* /components/:splat 301\n");
  const dynamicAt = rendered.indexOf("/guide/components/*");
  expect(rendered.indexOf("/old /new 301")).toBeLessThan(dynamicAt);
  expect(rendered.indexOf("/guide/components /components 301")).toBeLessThan(dynamicAt);
});
