import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";

const registry = JSON.parse(
  readFileSync(new URL("../../ui/registry.json", import.meta.url), "utf8"),
);

test("all five feature installers ship their complete Vue source without unresolved helpers", () => {
  const features = registry.items.filter((item) => item.name.startsWith("feature-"));
  expect(features).toHaveLength(5);
  for (const item of features) {
    const payload = JSON.parse(
      readFileSync(new URL(`../.docs/public/r/${item.name}.json`, import.meta.url), "utf8"),
    );
    expect(item.dependencies).toContain("@lucide/vue");
    expect(payload.files).toHaveLength(item.files.length);
    for (const file of item.files) {
      const source = readFileSync(new URL(`../../ui/${file.path}`, import.meta.url), "utf8");
      expect(file.target).toBe(`components/features/${file.path.split("/").at(-1)}`);
      expect(payload.files.find((entry) => entry.path === file.path)?.content).toBe(source);
      expect(source).toContain("MIT License");
      expect(source).not.toMatch(/from ["'](?:#lib|\.\/|@\/)/);
    }
  }
});
