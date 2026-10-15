import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { expect, it } from "vite-plus/test";
import { loadConfig } from "c12";
import { updateRegistryURLs } from "./registry-urls.mjs";

it("changes only this registry's explicit URLs across development and production", async () => {
  const directory = await mkdtemp(resolve(tmpdir(), "registry-urls-test-"));
  const source = JSON.parse(
    await readFile(new URL("../../ui/registry.json", import.meta.url), "utf8"),
  );
  const { config } = await loadConfig({
    name: "docs",
    cwd: new URL("..", import.meta.url).pathname,
  });
  const dependencies = [
    "slider",
    `${source.homepage}r/slider.json`,
    "https://other.example/r/slider.json",
    "https://kit.prop.show.evil.example/r/slider.json",
  ];
  const registry = {
    homepage: source.homepage,
    items: [
      { name: "slider", registryDependencies: [] },
      { name: "example", registryDependencies: dependencies },
    ],
  };
  try {
    await writeFile(resolve(directory, "registry.json"), JSON.stringify(registry));
    for (const item of registry.items) {
      await writeFile(resolve(directory, `${item.name}.json`), JSON.stringify(item));
    }
    for (const homepage of [
      "http://localhost:4321/",
      config.url,
      "https://example.com/docs",
      "http://localhost:5678/",
    ]) {
      await updateRegistryURLs(directory, homepage);
      const base = homepage.endsWith("/") ? homepage : `${homepage}/`;
      const index = JSON.parse(await readFile(resolve(directory, "registry.json"), "utf8"));
      const item = JSON.parse(await readFile(resolve(directory, "example.json"), "utf8"));
      expect(index.homepage).toBe(base);
      expect(item.registryDependencies).toEqual([
        "slider",
        `${base}r/slider.json`,
        dependencies[2],
        dependencies[3],
      ]);
      expect(index.items[1].registryDependencies).toEqual(item.registryDependencies);
    }
    expect(
      source.items.find((item) => item.name === "delete-resource").registryDependencies,
    ).toEqual(["button", `${source.homepage}r/inline-copy-text.json`, "input"]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}, 15_000);
