import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vite-plus/test";
import { repositoryDocsPath, rewriteGithubEditPaths } from "./edit-links.mjs";

const docsDir = fileURLToPath(new URL("..", import.meta.url));

it("resolves the docs directory relative to the repository root", () => {
  expect(repositoryDocsPath(docsDir)).toBe("packages/docs");
});

it("rewrites installed undocs edit links onto packages/docs", () => {
  const require = createRequire(new URL("../package.json", import.meta.url));
  const root = dirname(require.resolve("undocs/package.json"));
  for (const file of [
    "src/app/pages/[...slug].vue",
    "src/app/pages/blog/[...slug].vue",
    "src/app/webmcp/links.ts",
  ]) {
    const source = readFileSync(resolve(root, file), "utf8");
    const rewritten = rewriteGithubEditPaths(source, "packages/docs");
    expect(rewritten, file).not.toBe(source);
    expect(rewritten, file).toContain("/packages/docs/");
    expect(rewritten, file).not.toContain("/edit/${appConfig.docs.branch || 'main'}/docs/");
    expect(rewritten, file).not.toContain('/edit/${branch || "main"}/docs/');
    expect(rewriteGithubEditPaths(rewritten, "packages/docs"), file).toBe(rewritten);
  }
});
