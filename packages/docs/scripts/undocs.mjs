import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { createBuilder, createServer } from "vite-plus";

const {
  positionals: [command, dir = "."],
  values,
} = parseArgs({
  allowPositionals: true,
  options: { port: { type: "string" }, host: { type: "string" } },
});
if (command !== "dev" && command !== "build") throw new Error("Usage: undocs.mjs dev|build [dir]");

const docsDir = resolve(dir);
const docsLayer = resolve(docsDir, ".docs");
const pkgRoot = dirname(fileURLToPath(import.meta.resolve("undocs/package.json")));

process.env.BRANCH ||= "main";
process.env.UNDOCS_DIR = docsDir;

const config = {
  root: pkgRoot,
  configFile: resolve(pkgRoot, "vite.config.ts"),
  resolve: { alias: { "@/components/ui": resolve(docsLayer, "ui"), "@": docsLayer } },
  optimizeDeps: { include: ["vue"] },
  server: {
    port: Number(values.port || process.env.PORT || 3000),
    host: values.host || process.env.HOST,
    fs: { allow: [pkgRoot, resolve(docsDir, "../..")] },
  },
  plugins: [
    {
      name: "registry-theme",
      enforce: "pre",
      async load(id) {
        const path = id.split("?")[0];
        if (path !== resolve(pkgRoot, "src/app/css.css")) return;
        const themePath = resolve(docsLayer, "assets/css/registry-theme.css");
        this.addWatchFile(themePath);
        const [code, css] = await Promise.all([
          readFile(path, "utf8"),
          readFile(themePath, "utf8"),
        ]);
        return {
          code: `${code}\n${css}\n@source ${JSON.stringify(resolve(docsDir, "../ui/registry/**/*.{ts,vue}"))};`,
          map: null,
        };
      },
    },
  ],
};

if (command === "build") {
  const builder = await createBuilder(config);
  await builder.buildApp();
} else {
  const server = await createServer(config);
  await server.listen();
  server.printUrls();
  const shutdown = () => server.close().finally(() => process.exit(0));
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
