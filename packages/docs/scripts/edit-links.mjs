import { execFileSync } from "node:child_process";
import { relative } from "node:path";

// undocs hardcodes "Edit this page" to `<branch>/docs/<file>` and defaults the
// branch to main. The pages in this repo are `packages/docs/**` on master.
const EDIT_PREFIXES = [
  ["/edit/${appConfig.docs.branch || 'main'}/docs/", "/edit/${appConfig.docs.branch || 'main'}/"],
  ['/edit/${branch || "main"}/docs/', '/edit/${branch || "main"}/'],
];

export function repositoryDocsPath(docsDir) {
  const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: docsDir,
    encoding: "utf8",
  }).trim();
  return normalizeRepositoryDocsPath(relative(root, docsDir));
}

export function normalizeRepositoryDocsPath(repoPath) {
  const root = String(repoPath)
    .replaceAll("\\", "/")
    .replace(/^\/+|\/+$/g, "");
  if (!root || root.split("/").some((part) => part === "" || part === "." || part === "..")) {
    throw new Error(`Invalid repository docs path: ${repoPath}`);
  }
  return root;
}

export function rewriteGithubEditPaths(code, repoPath) {
  const root = normalizeRepositoryDocsPath(repoPath);
  let next = code;
  for (const [from, prefix] of EDIT_PREFIXES) {
    next = next.replaceAll(from, `${prefix}${root}/`);
  }
  return next;
}

export function githubEditPathPlugin(repoPath) {
  const root = normalizeRepositoryDocsPath(repoPath);
  return {
    name: "github-edit-path",
    enforce: "pre",
    transform(code) {
      const rewritten = rewriteGithubEditPaths(code, root);
      if (rewritten === code) return;
      return { code: rewritten, map: null };
    },
  };
}
