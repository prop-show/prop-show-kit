/// <reference types="node" />

import { fileURLToPath } from "node:url";

import { configurePreviewComponents, vueFs } from "./nuxt-runtime.mjs";

const groupComponentSources = fileURLToPath(
  new URL("./group-component-sources.mjs", import.meta.url),
);

export default {
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  components: [{ path: "~/components", pattern: "*.vue" }],
  content: {
    build: {
      markdown: {
        rehypePlugins: {
          [groupComponentSources]: {},
        },
      },
    },
  },
  css: ["~/assets/css/registry-theme.css"],
  fonts: {
    families: [{ name: "Inter", provider: "none" }],
    provider: "local",
  },
  icon: {
    clientBundle: {
      icons: [
        "lucide:book-open",
        "lucide:component",
        "vscode-icons:file-type-npm",
        "vscode-icons:file-type-yarn",
        "vscode-icons:file-type-pnpm",
        "vscode-icons:file-type-bun",
        "vscode-icons:file-type-deno",
        "vscode-icons:file-type-vue",
        "vscode-icons:file-type-typescript",
        "lucide:cloud-download",
        "lucide:info",
      ],
      scan: true,
    },
    provider: "none",
  },
  modules: [configurePreviewComponents],
  vite: {
    vue: {
      script: {
        fs: vueFs,
      },
    },
  },
};
