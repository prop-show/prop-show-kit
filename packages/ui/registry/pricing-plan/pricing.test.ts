import { readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compileFunction } from "node:vm";
import { describe, expect, test } from "vite-plus/test";
import type { Component, VNode } from "vue";
import type { PricingTableSection, PricingTableTier } from "../pricing-table";

const require = createRequire(import.meta.url);
const { createSSRApp, createRenderer, createCommentVNode, createTextVNode, Fragment, h } =
  require("vue") as typeof import("vue");
const { renderToString } = require("vue/server-renderer") as typeof import("vue/server-renderer");
const { parse, compileScript, registerTS } =
  require("vue/compiler-sfc") as typeof import("vue/compiler-sfc");
const ts = createRequire(require.resolve("vue"))("typescript");
registerTS(() => ts);
const root = fileURLToPath(new URL("../../../..", import.meta.url));
const modules = new Map<string, { exports: Record<string, unknown> }>();

function isFile(path: string) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

// Compile the real SFC dependency graph without adding a Vue plugin to the repo's test config.
function loadModule(path: string): Record<string, unknown> {
  const filename = [path, `${path}.ts`, resolve(path, "index.ts")].find(isFile);
  if (!filename) throw new Error(`Cannot resolve test module: ${path}`);
  const cached = modules.get(filename);
  if (cached) return cached.exports;
  const module = { exports: {} };
  modules.set(filename, module);
  let source = readFileSync(filename, "utf8");
  if (filename.endsWith(".vue")) {
    const { descriptor, errors } = parse(source, { filename });
    if (errors.length) throw new Error(errors.join("\n"));
    source = compileScript(descriptor, {
      id: filename,
      inlineTemplate: true,
      fs: { fileExists: isFile, readFile: (file) => readFileSync(file, "utf8") },
    }).content;
  }
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  const localRequire = createRequire(filename);
  const directory = dirname(filename);
  function dependency(id: string) {
    if (id.startsWith("@/components/ui/")) {
      return loadModule(
        resolve(root, "packages/docs/.docs/ui", id.slice("@/components/ui/".length)),
      );
    }
    if (id.startsWith("@/components/")) {
      return loadModule(resolve(root, "packages/ui/registry", id.slice("@/components/".length)));
    }
    if (id.startsWith("@/")) {
      return loadModule(resolve(root, "packages/docs/.docs", id.slice(2)));
    }
    return id.startsWith(".") ? loadModule(resolve(directory, id)) : localRequire(id);
  }
  compileFunction(outputText, ["require", "module", "exports"], { filename })(
    dependency,
    module,
    module.exports,
  );
  return module.exports;
}

function loadComponent(path: string) {
  return loadModule(resolve(root, "packages/ui/registry", path)).default as Component;
}

const PricingPlan = loadComponent("pricing-plan/PricingPlan.vue");
const PricingPlans = loadComponent("pricing-plans/PricingPlans.vue");
const PricingTable = loadComponent("pricing-table/PricingTable.vue");

async function render(component: Component, props = {}, slots = {}) {
  const html = await renderToString(createSSRApp({ render: () => h(component, props, slots) }));
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

function text(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function plans(html: string) {
  return html.match(/data-slot="pricing-plan"/g) ?? [];
}

const tiers: PricingTableTier[] = [
  { id: "solo", title: "Solo", price: "$0" },
  { id: "team", title: "Team", price: "$20", highlight: true },
];
const sections: PricingTableSection[] = [
  {
    id: "core",
    title: "Core features",
    features: [
      { id: "seats", title: "Seats", tiers: { solo: 0, team: 10 } },
      { title: "Single Sign-On!", tiers: { solo: false, team: true } },
      { title: "Support", tiers: { team: "Priority" } },
    ],
  },
  { title: "Premium Features!", features: [] },
];

test.each([
  ["PricingPlan", PricingPlan, {}],
  ["PricingTable", PricingTable, { tiers }],
] as const)("%s forwards root attributes and native listeners", async (_, component, props) => {
  const html = await render(component, {
    ...props,
    as: "section",
    id: "pricing-anchor",
    "aria-label": "Choose a plan",
    style: { maxWidth: "900px" },
  });
  expect(html).toMatch(/<section\b[^>]*id="pricing-anchor"/);
  expect(html).toContain('aria-label="Choose a plan"');
  expect(html).toContain("max-width:900px");

  type HostNode = {
    props: Record<string, unknown>;
    children: HostNode[];
    parent?: HostNode;
  };
  const createNode = (): HostNode => ({ props: {}, children: [] });
  const renderer = createRenderer<HostNode, HostNode>({
    createElement: createNode,
    createText: createNode,
    createComment: createNode,
    insert(child, parent, anchor) {
      const index = anchor ? parent.children.indexOf(anchor) : -1;
      if (index < 0) parent.children.push(child);
      else parent.children.splice(index, 0, child);
      child.parent = parent;
    },
    remove(node) {
      const siblings = node.parent?.children;
      if (siblings) siblings.splice(siblings.indexOf(node), 1);
    },
    setText() {},
    setElementText() {},
    parentNode: (node) => node.parent ?? null,
    nextSibling: (node) => node.parent?.children[node.parent.children.indexOf(node) + 1] ?? null,
    patchProp: (node, key, _previous, value) => (node.props[key] = value),
  });
  let clicks = 0;
  const container = createNode();
  const app = renderer.createApp(component, {
    ...props,
    id: "pricing-anchor",
    onClick: () => clicks++,
  });
  const warnings: string[] = [];
  app.config.warnHandler = (message) => warnings.push(message);
  app.mount(container);
  const rootNode = container.children.find((node) => node.props.id === "pricing-anchor");
  expect(rootNode).toBeDefined();
  (rootNode!.props.onClick as () => void)();
  expect(clicks).toBe(1);
  expect(warnings).toEqual([]);
  app.unmount();
});

describe("PricingPlan", () => {
  test.each(["vertical", "horizontal"] as const)(
    "shows the original and current discount prices once in %s layout",
    async (orientation) => {
      const html = await render(PricingPlan, {
        title: "Pro",
        price: "$40",
        discount: "$25",
        billingCycle: "/month",
        orientation,
      });
      expect(html).toMatch(/<del\b[^>]*>\$40<\/del>/);
      expect(html).toMatch(/<span\b[^>]*>\$25<\/span>/);
      expect(html.match(/\$40/g)).toHaveLength(1);
      expect(html.match(/\$25/g)).toHaveLength(1);
      expect(html.match(/\/month/g)).toHaveLength(1);
      expect(html.includes("lg:grid-cols-3")).toBe(orientation === "horizontal");
    },
  );

  test("shows an undiscounted price without a struck-through original", async () => {
    const html = await render(PricingPlan, { price: "$40" });
    expect(text(html)).toBe("$40");
    expect(html).not.toContain("<del");
  });

  test.each(["vertical", "horizontal"] as const)(
    "forwards price slots without requiring price props in %s layout",
    async (orientation) => {
      const html = await render(
        PricingPlan,
        { orientation },
        { price: () => "Custom price", billing: () => "Custom billing" },
      );
      expect(text(html).match(/Custom price/g)).toHaveLength(1);
      expect(text(html).match(/Custom billing/g)).toHaveLength(1);
    },
  );

  test.each([false, true])("renders an href CTA with disabled=%s", async (disabled) => {
    const html = await render(PricingPlan, {
      button: { label: "Buy now", href: "/checkout", disabled },
    });
    const cta = html.match(
      /<(a|button)\b[^>]*data-slot="button"[^>]*>Buy now<\/(?:a|button)>/,
    )?.[0];
    expect(cta).toBeDefined();
    if (disabled) {
      expect(cta).toMatch(/^<button\b/);
      expect(cta).toMatch(/\sdisabled(?:[\s=>])/);
      expect(cta).toContain('type="button"');
      expect(cta).not.toContain("href=");
    } else {
      expect(cta).toMatch(/^<a\b/);
      expect(cta).toContain('href="/checkout"');
      expect(cta).not.toMatch(/\sdisabled(?:[\s=>])/);
    }
  });

  test("uses a native button for a CTA without an href and renders the real badge", async () => {
    const html = await render(PricingPlan, { badge: "Popular", button: { label: "Choose" } });
    expect(html).toMatch(/<button\b[^>]*type="button"[^>]*>Choose<\/button>/);
    expect(html).toMatch(/data-slot="badge"[^>]*>Popular<\//);
  });
});

describe("PricingPlans", () => {
  test.each(["horizontal", "vertical"] as const)(
    "renders all prop plans with %s collection orientation",
    async (orientation) => {
      const html = await render(PricingPlans, { plans: tiers, orientation });
      expect(plans(html)).toHaveLength(2);
      expect(html).toContain("--count:2");
      expect(html.includes("lg:grid-cols-3")).toBe(orientation === "vertical");
      expect(text(html)).toContain("Solo");
      expect(text(html)).toContain("Team");
    },
  );

  test.each([false, true])(
    "counts plans from actual v-for and conditional slot fragments (visible=%s)",
    async (visible) => {
      const filename = resolve(root, "packages/ui/registry/pricing-plan/SlotFixture.vue");
      const { descriptor } = parse(
        `<script setup>import { PricingPlan } from '@/components/pricing-plan'; import { PricingPlans } from '@/components/pricing-plans'; defineProps(['visible']); const titles = ['Solo', 'Team'];</script><template><PricingPlans><PricingPlan v-for="title in titles" :key="title" :title="title" /><PricingPlan v-if="visible" title="Enterprise" /><!-- ignored --></PricingPlans></template>`,
        { filename },
      );
      const source = compileScript(descriptor, {
        id: "slot-fixture",
        inlineTemplate: true,
      }).content;
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      });
      const fixture = { exports: {} as Record<string, unknown> };
      compileFunction(outputText, ["require", "exports"], { filename })((id: string) => {
        if (id === "@/components/pricing-plan") return { PricingPlan };
        if (id === "@/components/pricing-plans") return { PricingPlans };
        return require(id);
      }, fixture.exports);
      const html = await render(fixture.exports.default as Component, { visible });
      expect(plans(html)).toHaveLength(visible ? 3 : 2);
      expect(html).toContain(`--count:${visible ? 3 : 2}`);
      expect(text(html).includes("Enterprise")).toBe(visible);
    },
  );

  test.each([
    ["empty", () => []],
    ["conditional comment", () => [createCommentVNode("v-if")]],
    ["empty fragment", () => [h(Fragment, [])]],
    ["nested empty fragments", () => [h(Fragment, [h(Fragment, [createCommentVNode("v-if")])])]],
  ] satisfies [string, () => VNode[]][])(
    "counts fallback plans when the default slot is %s",
    async (_, slot) => {
      const html = await render(PricingPlans, { plans: tiers }, { default: slot });
      expect(plans(html)).toHaveLength(2);
      expect(html).toContain("--count:2");
    },
  );

  test("keeps valid text slot content instead of counting fallback plans", async () => {
    const html = await render(
      PricingPlans,
      { plans: tiers },
      { default: () => [createTextVNode("No plans available")] },
    );
    expect(text(html)).toBe("No plans available");
    expect(plans(html)).toHaveLength(0);
    expect(html).toContain("--count:1");
  });

  test("counts nonempty slotted plans instead of fallback plans", async () => {
    const html = await render(
      PricingPlans,
      { plans: tiers },
      { default: () => [h(PricingPlan, { title: "Enterprise" })] },
    );
    expect(plans(html)).toHaveLength(1);
    expect(text(html)).toBe("Enterprise");
    expect(html).toContain("--count:1");
  });

  test("keeps an empty collection at one grid column", async () => {
    expect(await render(PricingPlans, { plans: [] })).toContain("--count:1");
  });
});

describe("PricingTable", () => {
  test("types whole-tier slots and preserves named slot payloads for literal and string IDs", () => {
    const filename = resolve(root, "packages/ui/registry/pricing-plan/SlotTypes.ts");
    const source = `
      import type { PricingTableSlots, PricingTableTier } from '../pricing-table';
      type Tier = PricingTableTier & { id: 'solo' | 'team'; seats: number };
      const specific: PricingTableSlots<Tier> = {
        team: ({ tier }) => {
          const seats: number = tier.seats;
          // @ts-expect-error Whole-tier slot props retain the custom tier's field types.
          const invalidSeats: string = tier.seats;
          return [];
        },
        'team-title': ({ tier }) => { const id: 'solo' | 'team' = tier.id; return []; },
        'section-title': ({ section }) => { const title: string = section.title; return []; },
        'feature-title': ({ feature }) => { const title: string = feature.title; return []; },
        'feature-seats-value': ({ value }) => {
          const result: string | number | boolean | undefined = value;
          return [];
        },
      };
      // @ts-expect-error Only declared tier IDs can name a whole-tier slot.
      const invalid: PricingTableSlots<Tier> = { other: () => [] };
      const general: PricingTableSlots = {
        team: ({ tier }: { tier: PricingTableTier }) => [],
        'section-title': ({ section }) => { const title: string = section.title; return []; },
        'feature-title': ({ feature }) => { const title: string = feature.title; return []; },
      };
    `;
    const config = ts.readConfigFile(resolve(root, "tsconfig.json"), ts.sys.readFile);
    const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
    const host = ts.createCompilerHost({ ...options, strict: true, skipLibCheck: true });
    const readFile = host.readFile.bind(host);
    const fileExists = host.fileExists.bind(host);
    host.readFile = (path: string) => (path === filename ? source : readFile(path));
    host.fileExists = (path: string) => path === filename || fileExists(path);
    const program = ts.createProgram(
      [filename],
      { ...options, strict: true, skipLibCheck: true },
      host,
    );
    const diagnostics = program
      .getSemanticDiagnostics(program.getSourceFile(filename))
      .filter(
        (diagnostic: { file?: { fileName: string } }) => diagnostic.file?.fileName === filename,
      )
      .map((diagnostic: { messageText: unknown }) =>
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
      );
    expect(diagnostics).toEqual([]);
  });

  test("preserves zero, labels boolean icons, and distinguishes missing values on desktop and mobile", async () => {
    const html = await render(PricingTable, { tiers, sections });
    expect(html).toContain('scope="col"');
    expect(html).toContain('scope="row"');
    const desktop = html.match(/<table\b[\s\S]*?<\/table>/)?.[0];
    const mobile = html.match(/<article\b[\s\S]*$/)?.[0];
    expect(desktop).toBeDefined();
    expect(mobile).toBeDefined();
    for (const layout of [desktop!, mobile!]) {
      expect(layout).toMatch(/>0</);
      expect(layout).toMatch(/>10</);
      expect(layout).toContain("Priority");
      expect(layout.match(/—/g)).toHaveLength(1);
      expect(layout).toMatch(/<svg\b[^>]*aria-hidden="true"/);
      expect(layout).toContain('<span class="sr-only">Included</span>');
      expect(layout).toContain('<span class="sr-only">Not included</span>');
      expect(layout.match(/data-slot="pricing-table-tier"/g)).toHaveLength(2);
    }
  });

  test("specific tier element slots override generic slots in dedicated tier headers", async () => {
    const html = await render(
      PricingTable,
      { tiers },
      {
        "tier-title": ({ tier }: { tier: PricingTableTier }) => `generic-${tier.id}`,
        "team-title": ({ tier }: { tier: PricingTableTier }) => `specific-${tier.id}`,
      },
    );
    expect(html.match(/data-slot="pricing-table-tier"/g)).toHaveLength(4);
    expect(text(html).match(/generic-solo/g)).toHaveLength(2);
    expect(text(html).match(/specific-team/g)).toHaveLength(2);
    expect(text(html)).not.toContain("generic-team");
  });

  test("specific whole-tier slots override the generic tier slot in both layouts", async () => {
    const html = await render(
      PricingTable,
      { tiers },
      {
        tier: ({ tier }: { tier: PricingTableTier }) => `generic-${tier.id}`,
        team: ({ tier }: { tier: PricingTableTier }) => `specific-${tier.id}`,
      },
    );
    expect(text(html).match(/generic-solo/g)).toHaveLength(2);
    expect(text(html).match(/specific-team/g)).toHaveLength(2);
    expect(text(html)).not.toContain("generic-team");
  });

  test("resolves section and feature slots by explicit ID or title slug before generic fallbacks", async () => {
    const html = await render(
      PricingTable,
      { tiers, sections },
      {
        "section-title": () => "wrong-section",
        "section-core-title": () => "id-section",
        "section-premium-features-title": () => "slug-section",
        "feature-title": () => "generic-title",
        "feature-seats-title": () => "id-title",
        "feature-single-sign-on-title": () => "slug-title",
        "feature-value": ({ value }: { value: unknown }) => `generic-value:${String(value)}`,
        "feature-seats-value": ({ value }: { value: unknown }) => `id-value:${String(value)}`,
        "feature-single-sign-on-value": ({ value }: { value: unknown }) =>
          `slug-value:${String(value)}`,
      },
    );
    const output = text(html);
    for (const expected of [
      "id-section",
      "slug-section",
      "id-title",
      "slug-title",
      "generic-title",
      "id-value:0",
      "slug-value:false",
      "generic-value:undefined",
      "generic-value:Priority",
    ]) {
      expect(output).toContain(expected);
    }
    for (const absent of ["wrong-section", "generic-value:0", "generic-value:false"])
      expect(output).not.toContain(absent);
  });
});
