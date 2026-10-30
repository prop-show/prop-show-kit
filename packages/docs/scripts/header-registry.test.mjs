import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";

const registry = JSON.parse(
  readFileSync(new URL("../../ui/registry.json", import.meta.url), "utf8"),
);
const headers = registry.items.filter((item) => item.name.startsWith("header-"));

test("all five header installers include their local dependencies and current source", () => {
  expect(headers).toHaveLength(5);
  for (const item of headers) {
    const payload = JSON.parse(
      readFileSync(new URL(`../.docs/public/r/${item.name}.json`, import.meta.url), "utf8"),
    );
    const paths = new Set(item.files.map((file) => file.path));
    expect(item.registryDependencies).toContain("button");
    for (const file of item.files) {
      const source = readFileSync(new URL(`../../ui/${file.path}`, import.meta.url), "utf8");
      expect(file.target).toBe(`components/header/${file.path.split("/").at(-1)}`);
      expect(payload.files.find((entry) => entry.path === file.path)?.content).toBe(source);
      for (const match of source.matchAll(/from "\.\/([^"\n]+)"/g)) {
        const name = match[1].endsWith(".vue") ? match[1] : `${match[1]}.ts`;
        expect(paths.has(`registry/header/${name}`), `${item.name} requires ${name}`).toBe(true);
      }
    }
  }
});
