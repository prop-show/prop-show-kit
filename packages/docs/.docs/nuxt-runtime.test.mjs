import { expect, it } from "vite-plus/test";

import groupComponentSources from "./group-component-sources.mjs";

const source = (path) => ({
  type: "element",
  tagName: "component-source",
  properties: { path },
  children: [],
});

it("groups only adjacent component sources and labels them by filename", () => {
  const single = source("copy/Copy.vue");
  const tree = {
    type: "root",
    children: [
      source("inline-tip/InlineTip.vue"),
      { type: "text", value: "\n" },
      source("inline-tip/index.ts"),
      { type: "text", value: "\n" },
      { type: "element", tagName: "p", properties: {}, children: [] },
      single,
    ],
  };

  groupComponentSources()(tree);
  groupComponentSources()(tree);

  expect(tree.children).toEqual([
    {
      type: "element",
      tagName: "code-group",
      properties: {},
      children: [
        {
          ...source("inline-tip/InlineTip.vue"),
          properties: { path: "inline-tip/InlineTip.vue", filename: "InlineTip.vue" },
        },
        {
          ...source("inline-tip/index.ts"),
          properties: { path: "inline-tip/index.ts", filename: "index.ts" },
        },
      ],
    },
    { type: "text", value: "\n" },
    { type: "element", tagName: "p", properties: {}, children: [] },
    single,
  ]);
});
