import { existsSync, readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const previewComponentsDir = fileURLToPath(new URL("./components", import.meta.url));
const registryDir = fileURLToPath(new URL("../../ui/registry", import.meta.url));

export function configurePreviewComponents(_options, nuxt) {
  nuxt.hook("components:dirs", (dirs) => {
    for (const dir of dirs) {
      if (dir.path.replace(/\/$/, "") === previewComponentsDir) {
        dir.pattern = "*.vue";
      }
    }
  });

  nuxt.hook("modules:done", () => {
    const template = nuxt.options.build.templates.find(({ filename }) => filename === "undocs.css");
    if (!template?.getContents) throw new Error("Undocs Tailwind template not found");

    template.write = true;
    const getContents = template.getContents;
    template.getContents = async (context) => `${await getContents(context)}
@source "${previewComponentsDir.replaceAll("\\", "/")}/**/*.vue";
@source "${registryDir.replaceAll("\\", "/")}/**/*.{ts,vue}";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}`;
  });
}

export const vueFs = {
  fileExists: existsSync,
  readFile: (file) => readFileSync(file, "utf8"),
  realpath: realpathSync,
};
