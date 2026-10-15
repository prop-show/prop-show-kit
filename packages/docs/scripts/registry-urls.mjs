import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

export async function updateRegistryURLs(directory, homepage) {
  const base = new URL(homepage);
  if (!/^https?:$/.test(base.protocol)) throw new Error("Registry URL must use HTTP or HTTPS");
  if (!base.pathname.endsWith("/")) base.pathname += "/";
  const registryPath = resolve(directory, "registry.json");
  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  const previousBase = registry.homepage.replace(/\/?$/, "/");
  registry.homepage = base.href;
  for (const item of registry.items) {
    item.registryDependencies = item.registryDependencies?.map((dependency) =>
      dependency.startsWith(`${previousBase}r/`)
        ? new URL(dependency.slice(previousBase.length), base).href
        : dependency,
    );
    const path = resolve(directory, `${item.name}.json`);
    const component = JSON.parse(await readFile(path, "utf8"));
    component.registryDependencies = item.registryDependencies;
    await writeFile(path, JSON.stringify(component, null, 2) + "\n");
  }
  await writeFile(registryPath, JSON.stringify(registry, null, 2) + "\n");
  await promisify(execFile)("vp", ["fmt", directory]);
}
