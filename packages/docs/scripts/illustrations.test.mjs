import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, it } from "vite-plus/test";

it("matches empty-state illustrations to registry components", () => {
  const script = fileURLToPath(
    new URL("../../../artifacts/illustrations/check.mjs", import.meta.url),
  );
  const result = spawnSync(process.execPath, [script], { encoding: "utf8" });
  expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
  expect(result.stdout).toMatch(/ok: \d+ illustrations, \d+ registry components covered/);
});
