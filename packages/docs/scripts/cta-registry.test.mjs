import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { compileFunction } from "node:vm";
import { expect, test } from "vite-plus/test";

const require = createRequire(new URL("../../ui/package.json", import.meta.url));
const cli = readFileSync(require.resolve("shadcn-vue"), "utf8");
const chunk = cli.match(/from "\.\/(registry-[^"]+\.js)"/)[1];
const source = readFileSync(path.join(path.dirname(require.resolve("shadcn-vue")), chunk), "utf8");
// Exercise the installed CLI's resolver without running its interactive installer.
const resolverSource = source.slice(
  source.indexOf("function resolveFilePath("),
  source.indexOf("function resolvePageTarget("),
);
const resolveFilePath = compileFunction(`${resolverSource}\nreturn resolveFilePath;`, ["path"])(
  path,
);
const registry = JSON.parse(
  readFileSync(new URL("../../ui/registry.json", import.meta.url), "utf8"),
);

for (const componentsDirectory of ["components", "src/components", "src/shared/components"]) {
  test(`CTA installs respect the configured ${componentsDirectory} directory`, () => {
    const cwd = "/consumer";
    const components = path.join(cwd, componentsDirectory);
    const config = {
      aliases: { components: "@/components", ui: "@/components/ui", utils: "@/lib/utils" },
      resolvedPaths: { cwd, components },
    };
    const items = registry.items.filter((item) => item.name.startsWith("cta-"));
    expect(items).toHaveLength(5);
    for (const item of items) {
      for (const file of item.files) {
        const commonRoot = path.posix.dirname(file.path);
        expect(resolveFilePath(file, config, { commonRoot })).toBe(
          path.join(components, "cta", path.basename(file.path)),
        );
      }
    }
  });
}
