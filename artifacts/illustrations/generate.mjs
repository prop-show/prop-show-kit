// Generates the 160x120 "miniature real product UI" empty-state illustrations
// for every component in packages/ui/registry.json.
// Colours are scoped CSS variables; every id carries the file's own prefix.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "svg");
const icons = JSON.parse(readFileSync(join(here, "icons.json"), "utf8"));

// Remix `*-line` icons are drawn on a 24 grid; this samples one at `size`.
const icon = (name, x, y, size, variant = "icon") => {
  const d = icons[name];
  if (!d) throw new Error(`unknown icon: ${name}`);
  return `<g transform="translate(${x} ${y}) scale(${+(size / 24).toFixed(4)})" style="fill: var(--${variant})"><path d="${d}" /></g>`;
};

// Text is never typeset: titles are 5 tall, body copy 4, both fully rounded.
const title = (x, y, w, h = 5, variant = "bar-strong") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" style="fill: var(--${variant})" />`;
const line = (x, y, w, h = 4, variant = "bar") => title(x, y, w, h, variant);

const rect = (x, y, w, h, r, fill, { stroke = false } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" style="fill: var(--${fill})${stroke ? "; stroke: var(--surface-border); stroke-width: 1" : ""}" />`;

const toggle = (x, y, on) =>
  `<rect x="${x}" y="${y}" width="20" height="9" rx="4.5" style="fill: var(${on ? "--icon-2" : "--surface"}); stroke: var(--surface-border); stroke-width: 1" /><circle cx="${x + (on ? 15 : 5)}" cy="${y + 4.5}" r="3.4" style="fill: var(${on ? "--on-accent" : "--icon"})" />`;

// Slate gradient chip: keycap-like confirmations, never the accent.
const slate = (x, y, w, h, r) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" style="fill: url(#PREFIX-slate)" />`;

// Main surfaces. Both keep the bounding box centred near (80, 60) with >= 14 padding.
const BACK = (x = 40, y = 16, w = 94, h = 52) => rect(x, y, w, h, 12, "back");
const PAGE = (x = 26, y = 30, w = 108, h = 72) => rect(x, y, w, h, 12, "surface", { stroke: true });

// Browser chrome: 18 tall tab strip, one active tab, window dots.
const chrome = (x, y, w, tabW = 38) => `
    ${rect(x, y, w, 18, 10, "tabstrip")}
    ${rect(x + 5, y + 3.5, tabW, 13.5, 5, "surface")}
    ${line(x + 11, y + 7.75, tabW - 20, 5)}
    ${line(x + tabW + 12, y + 7.75, 14, 5)}
    <g style="fill: var(--icon)"><circle cx="${x + w - 13}" cy="${y + 9}" r="1.1" /><circle cx="${x + w - 8}" cy="${y + 9}" r="1.1" /><circle cx="${x + w - 3}" cy="${y + 9}" r="1.1" /></g>`;

const WINDOW = (x = 24, y = 32, w = 112, h = 66, tabW = 38) => `
    ${rect(x, y, w, h, 11, "tabstrip", { stroke: true })}
    ${chrome(x, y, w, tabW)}
    <path d="M${x + 0.5} ${y + 18}H${x + w - 0.5}V${y + h - 10}A10 10 0 0 1 ${x + w - 10.5} ${y + h - 0.5}H${x + 10.5}A10 10 0 0 1 ${x + 0.5} ${y + h - 10}Z" style="fill: var(--surface)" />`;

// Each scene returns the *contents* of the shadowed group; the card itself comes from PAGE/WINDOW.
// Rules: 2-3 objects, bounding box centred on (80, 60), >= 14 padding, no text, exactly one accent.
const scenes = {
  frame: {
    aria: "An empty framed container with a header, stacked panels and a footer",
    back: () => BACK(38, 14, 98, 54),
    surface: () => PAGE(26, 30, 108, 72),
    content: () => `
    ${rect(32, 36, 96, 22, 7, "cell")}
    ${title(37, 41, 26)}
    ${line(37, 50, 46, 3.5)}
    <g class="PREFIX-cta">${rect(100, 41.5, 22, 12, 6, "accent")}${icon("add", 107, 44.5, 6, "on-accent")}</g>
    ${rect(32, 61, 96, 14, 6, "surface", { stroke: true })}
    ${line(37, 66, 32)}
    ${rect(32, 77, 96, 14, 6, "surface", { stroke: true })}
    ${line(37, 82, 46)}`,
  },

  "layer-card": {
    aria: "An empty layered card with a secondary layer peeking out behind it",
    back: () => BACK(42, 14, 90, 50),
    surface: () => PAGE(26, 30, 108, 72),
    content: () => `
    ${rect(32, 36, 96, 28, 8, "cell")}
    ${icon("layers", 74, 43, 14)}
    ${title(32, 70, 30)}
    ${line(32, 78, 66)}
    ${line(32, 86, 50)}
    ${icon("arrow-right", 118, 76, 8, "icon-2")}`,
  },

  "layer-dialog": {
    aria: "An empty dialog with a fixed title and an action footer over a dimmed panel",
    back: () => BACK(26, 30, 108, 72),
    surface: () => rect(38, 30, 84, 64, 11, "surface", { stroke: true }),
    content: () => `
    ${title(44, 37, 30)}
    ${line(44, 50, 64)}
    ${line(44, 57, 46)}
    ${rect(44, 66, 72, 0.8, 0, "surface-border")}
    ${rect(44, 72, 22, 12, 6, "surface", { stroke: true })}
    ${line(49, 76, 12)}
    <g class="PREFIX-cta">${rect(96, 72, 20, 12, 6, "accent")}${icon("check", 101.5, 74.5, 7, "on-accent")}</g>`,
  },

  "inline-tip": {
    aria: "A page with an informational tip and no content below it",
    back: () => BACK(40, 16, 94, 52),
    surface: () => PAGE(26, 30, 108, 72),
    content: () => `
    ${title(32, 36, 26)}
    ${rect(32, 46, 96, 22, 8, "cell", { stroke: true })}
    ${icon("info", 37, 51, 11, "accent")}
    ${line(52, 50.5, 60)}
    ${line(52, 58.5, 40, 3.5)}
    ${line(32, 78, 74)}
    ${line(32, 86.5, 52)}`,
  },

  "status-badge": {
    aria: "A resource list where every status badge is idle",
    back: () => BACK(40, 16, 94, 52),
    surface: () => PAGE(26, 30, 108, 72),
    content: () => `
    ${title(32, 36, 28)}
    ${[0, 1, 2]
      .map(
        (i) => `
      ${rect(32, 46 + i * 17, 96, 13, 6.5, "surface", { stroke: true })}
      ${line(37, 50.5 + i * 17, 26)}
      ${i === 0 ? `<g class="PREFIX-pulse"><circle cx="105" cy="${52.5 + i * 17}" r="2.2" style="fill: var(--accent)" /></g>` : ""}
      <circle cx="105" cy="${52.5 + i * 17}" r="2.2" style="fill: var(${i === 0 ? "--accent" : "--icon"})" />
      ${rect(111, 48 + i * 17, 13, 8, 4, "cell")}`,
      )
      .join("")}`,
  },

  copy: {
    aria: "A value with a copy button and a confirmation tooltip",
    back: () => BACK(40, 16, 94, 52),
    surface: () => PAGE(26, 30, 108, 72),
    content: () => `
    ${title(32, 36, 22)}
    ${rect(32, 46, 96, 20, 8, "cell", { stroke: true })}
    ${icon("folder", 37, 51, 10)}
    ${line(51, 54, 34, 5)}
    <g class="PREFIX-cta">${rect(105, 49, 18, 14, 7, "accent")}${icon("copy", 109.5, 52.5, 7, "on-accent")}</g>
    <g>${slate(96, 72, 32, 13, 6.5)}${icon("check", 101, 75, 7, "on-slate")}${line(111, 76.5, 11, 4, "on-slate")}</g>
    ${rect(127, 78.5, 0.8, 0, 0, "surface-border")}
    ${line(32, 84, 60)}`,
  },

  "inline-copy-text": {
    aria: "A list of short identifiers with inline copy controls",
    back: () => BACK(40, 16, 94, 52),
    surface: () => PAGE(26, 30, 108, 72),
    content: () => `
    ${title(32, 36, 24)}
    ${["lock", "useradd", "mail"]
      .map(
        (name, i) => `
      ${icon(name, 32, 48 + i * 17, 10, i === 0 ? "icon-2" : "icon")}
      ${line(46, 50.5 + i * 17, 34)}
      ${i === 0 ? `<g class="PREFIX-cta">${rect(108, 46 + i * 17, 14, 10, 5, "accent")}${icon("copy", 111, 48, 7, "on-accent")}</g>` : rect(108, 46 + i * 17, 14, 10, 5, "cell")}
      ${i === 0 ? "" : icon("copy", 111, 48 + i * 17, 7, "icon-2")}
      ${i < 2 ? rect(32, 62 + i * 17, 90, 0.8, 0, "surface-border") : ""}`,
      )
      .join("")}`,
  },

  filters: {
    aria: "A filter bar with applied chips and no matching results",
    back: () => BACK(40, 16, 94, 52),
    surface: () => PAGE(26, 30, 108, 72),
    content: () => `
    ${rect(32, 36, 96, 16, 8, "cell", { stroke: true })}
    ${icon("filter", 36, 39.5, 9, "icon-2")}
    ${rect(48, 38, 30, 12, 6, "surface")}
    ${line(52, 42, 16)}
    ${icon("down", 66, 44, 6, "icon-2")}
    ${icon("search", 84, 39.5, 9)}
    ${line(96, 42, 18)}
    ${rect(32, 56, 30, 11, 5.5, "cell", { stroke: true })}
    ${line(36, 59.5, 16, 4)}
    ${icon("close", 55, 59.5, 5, "icon-2")}
    ${rect(66, 56, 26, 11, 5.5, "cell", { stroke: true })}
    ${line(70, 59.5, 12, 4)}
    ${icon("close", 85, 59.5, 5, "icon-2")}
    <g class="PREFIX-cta">${rect(96, 56, 16, 11, 5.5, "accent")}${icon("add", 100.5, 58.5, 6, "on-accent")}</g>
    ${icon("search", 74, 71, 13)}
    ${title(64, 89, 32)}`,
  },

  slider: {
    aria: "A slider with value badges and nothing selected yet",
    back: () => BACK(40, 16, 94, 52),
    surface: () => PAGE(26, 30, 108, 72),
    content: () => `
    ${title(32, 36, 30)}
    ${rect(46, 46, 20, 13, 6.5, "surface", { stroke: true })}
    ${line(51, 50, 10)}
    ${rect(82, 46, 20, 13, 6.5, "surface", { stroke: true })}
    ${line(87, 50, 10)}
    <g class="PREFIX-cta">
      ${rect(50, 65, 45, 4, 2, "accent")}
      <circle cx="50" cy="67" r="4.5" style="fill: var(--surface); stroke: var(--accent); stroke-width: 1" />
    </g>
    ${rect(32, 65, 18, 4, 2, "cell")}
    ${rect(95, 65, 33, 4, 2, "cell")}
    <circle cx="95" cy="67" r="4.5" style="fill: var(--surface); stroke: var(--icon); stroke-width: 1" />
    ${rect(32, 78, 96, 0.8, 0, "surface-border")}
    ${line(32, 84, 66)}
    ${line(32, 92, 48)}`,
  },

  "delete-resource": {
    aria: "A deletion dialog waiting for a typed confirmation",
    back: () => BACK(26, 30, 108, 72),
    surface: () => rect(38, 28, 84, 68, 11, "surface", { stroke: true }),
    content: () => `
    ${icon("trash", 44, 34, 10, "icon-2")}
    ${title(58, 36.5, 30)}
    ${line(44, 50, 66, 3.5)}
    ${line(44, 57, 44, 3.5)}
    ${rect(44, 64, 72, 13, 6.5, "cell", { stroke: true })}
    ${line(48, 68.5, 28)}
    ${rect(44, 82, 20, 11, 5.5, "surface", { stroke: true })}
    ${line(49, 85.5, 10, 4)}
    <g class="PREFIX-cta">${rect(96, 82, 20, 11, 5.5, "accent")}${icon("check", 101.5, 84, 7, "on-accent")}</g>`,
  },

  "project-overview": {
    aria: "A workspace overview with empty metric cards and a deployment row",
    back: () => BACK(40, 14, 94, 52),
    surface: () => PAGE(22, 28, 116, 74),
    content: () => `
    ${title(28, 34, 30)}
    ${rect(96, 31, 36, 12, 6, "cell", { stroke: true })}
    ${line(101, 35, 18)}
    ${icon("down", 124, 36, 6, "icon-2")}
    ${[0, 1, 2]
      .map(
        (i) => `
      ${rect(28 + i * 36, 49, 32, 24, 6, "cell")}
      ${line(32 + i * 36, 53, 12, 3.5)}
      ${title(32 + i * 36, 60, 18)}`,
      )
      .join("")}
    ${rect(28, 79, 104, 16, 6, "surface", { stroke: true })}
    ${icon("server", 33, 82, 10)}
    ${line(47, 85, 26)}
    <g class="PREFIX-pulse"><circle cx="115" cy="87" r="2.2" style="fill: var(--accent)" /></g>
    <circle cx="115" cy="87" r="2.2" style="fill: var(--accent)" />
    ${rect(121, 83, 7, 8, 4, "cell")}`,
  },

  "team-members": {
    aria: "A team directory with nobody added yet",
    back: () => BACK(40, 14, 94, 52),
    surface: () => PAGE(22, 28, 116, 74),
    content: () => `
    ${title(28, 34, 26)}
    ${rect(90, 29, 14, 13, 6.5, "cell", { stroke: true })}
    ${icon("search", 93, 32, 8, "icon-2")}
    <g class="PREFIX-cta">${rect(108, 29, 24, 13, 6.5, "accent")}${icon("useradd", 112, 32.5, 7, "on-accent")}</g>
    ${[0, 1, 2]
      .map(
        (i) => `
      ${rect(28, 48 + i * 17, 104, 14, 7, "surface", { stroke: true })}
      <circle cx="37" cy="${55 + i * 17}" r="4.5" style="fill: var(--cell)" />
      ${line(46, 52.5 + i * 17, 30)}
      ${rect(102, 50.5 + i * 17, 26, 9, 4.5, "cell")}`,
      )
      .join("")}`,
  },

  "workspace-settings": {
    aria: "A settings form with notification toggles and a save action",
    back: () => BACK(40, 14, 94, 52),
    surface: () => PAGE(22, 28, 116, 74),
    content: () => `
    ${icon("settings", 28, 32, 9, "icon-2")}
    ${title(41, 34, 26)}
    ${rect(28, 44, 104, 0.8, 0, "surface-border")}
    ${rect(28, 50, 104, 14, 7, "cell", { stroke: true })}
    ${line(33, 54, 34)}
    ${toggle(106, 52.5, true)}
    ${rect(28, 68, 104, 14, 7, "cell", { stroke: true })}
    ${line(33, 72, 26)}
    ${toggle(106, 70.5, false)}
    <g class="PREFIX-cta">${rect(92, 87, 40, 12, 6, "accent")}${icon("check", 97, 89.5, 7, "on-accent")}${line(107, 91, 16, 4, "on-accent")}</g>`,
  },

  "pricing-plan": {
    aria: "A pricing card with a price, included features and a choose-plan action",
    back: () => BACK(45, 16, 76, 65),
    surface: () => PAGE(38, 26, 84, 78),
    content: () => `
    ${title(46, 34, 28)}
    ${line(46, 44, 58)}
    ${title(46, 55, 30, 8)}
    ${line(80, 59, 20)}
    ${icon("check", 46, 70, 8)}${line(58, 72, 44)}
    ${icon("check", 46, 80, 8)}${line(58, 82, 34)}
    <g class="PREFIX-cta">${rect(46, 92, 68, 8, 4, "accent")}${line(66, 94, 28, 4, "on-accent")}</g>`,
  },

  "pricing-plans": {
    aria: "Two pricing plans side by side with one recommended plan action",
    back: () => BACK(28, 18, 104, 65),
    surface: () => `${PAGE(20, 28, 57, 74)}${PAGE(83, 28, 57, 74)}`,
    content: () =>
      [26, 89]
        .map(
          (x, index) => `
    ${title(x, 36, 27)}
    ${line(x, 46, 37)}
    ${title(x, 57, 23, 7)}
    ${icon("check", x, 71, 7)}${line(x + 11, 73, 27)}
    ${icon("check", x, 80, 7)}${line(x + 11, 82, 21)}
    <g class="${index ? "PREFIX-cta" : ""}">${rect(x, 92, 45, 6, 3, index ? "accent" : "cell")}${line(x + 12, 93, 21, 4, index ? "on-accent" : "bar-strong")}</g>`,
        )
        .join(""),
  },

  "pricing-table": {
    aria: "A pricing comparison table with two tiers and included feature checkmarks",
    back: () => BACK(34, 16, 100, 60),
    surface: () => PAGE(22, 28, 116, 74),
    content: () => `
    ${rect(98, 34, 34, 62, 6, "cell")}
    ${title(68, 36, 21)}${title(104, 36, 21)}
    ${title(68, 47, 17, 7)}${title(104, 47, 17, 7)}
    ${rect(68, 59, 23, 7, 3.5, "back")}
    <g class="PREFIX-cta">${rect(104, 59, 23, 7, 3.5, "accent")}</g>
    ${[0, 1, 2].map((i) => `${line(28, 73 + i * 9, 28)}${icon("check", 75, 71 + i * 9, 8)}${icon("check", 111, 71 + i * 9, 8)}`).join("")}`,
  },

  "metric-card": {
    aria: "Three metric cards with empty values and one chart marked as the next reading",
    back: () => BACK(34, 16, 100, 54),
    surface: () => PAGE(22, 28, 116, 74),
    content: () => `
    ${title(28, 34, 28)}
    ${[0, 1, 2]
      .map((i) => {
        const x = 28 + i * 36;
        const glyph =
          i === 0
            ? `<g class="PREFIX-cta">${icon("chart", x + 4, 76, 10, "accent")}</g>`
            : icon("chart", x + 4, 76, 10);
        return `
      ${rect(x, 46, 32, 48, 6, "cell")}
      ${line(x + 4, 52, 14, 3.5)}
      ${title(x + 4, 60, 18, 7)}
      ${glyph}`;
      })
      .join("")}`,
  },

  "bookmarks-empty": {
    aria: "A browser window showing an empty bookmarks folder",
    back: () => BACK(40, 20, 100, 54),
    surface: () => WINDOW(24, 32, 112, 66, 38),
    content: () => `
    ${title(30, 56.5, 30)}
    <g class="PREFIX-cta">${rect(110, 53, 22, 12, 6, "accent")}${icon("add", 117, 56, 6, "on-accent")}</g>
    ${icon("folder", 73, 64.5, 14)}
    ${title(63, 81, 34)}
    ${line(54, 89, 52)}`,
  },
};

const theme = (
  name,
  prefix,
  { aria, back, surface, content },
) => `<!-- Generated by generate.mjs — edit templates there, not this file. -->
<svg
  id="${prefix}"
  data-theme="${name}"
  viewBox="0 0 160 120"
  width="160"
  height="120"
  role="img"
  aria-label="${aria}"
  xmlns="http://www.w3.org/2000/svg"
>
  <style>
    #${prefix} {
      --plate: #fafafa;
      --stripes: rgba(15, 23, 42, 0.05);
      --inner-border: rgba(15, 23, 42, 0.07);
      --tabstrip: #eef1f5;
      --surface: #ffffff;
      --surface-border: rgba(47, 42, 34, 0.08);
      --back: #f3f3f4;
      --cell: #f1f3f6;
      --bar: #e5e9ef;
      --bar-strong: #cdd4de;
      --icon: #a3abb7;
      --icon-2: #6b7280;
      --accent: #3462ad;
      --on-accent: #ffffff;
      --slate-1: #404859;
      --slate-2: #273042;
      --on-slate: #ffffff;
      --shadow: rgb(47, 42, 34);
      --shadow-alpha: 0.13;
    }
    #${prefix}[data-theme="dark"] {
      --plate: #26262b;
      --stripes: rgba(255, 255, 255, 0.035);
      --inner-border: rgba(255, 255, 255, 0.06);
      --tabstrip: #2a2a2f;
      --surface: #323238;
      --surface-border: rgba(255, 255, 255, 0.08);
      --back: #2e2e34;
      --cell: #3a3a41;
      --bar: #3f3f47;
      --bar-strong: #52525b;
      --icon: #7d828c;
      --icon-2: #9a9ea8;
      --accent: #7ea6ea;
      --on-accent: #1c1c21;
      --slate-1: #454e60;
      --slate-2: #2b3444;
      --on-slate: #ffffff;
      --shadow: #000000;
      --shadow-alpha: 0.36;
    }
    @media (prefers-color-scheme: dark) {
      #${prefix}[data-theme="auto"] {
        --plate: #26262b;
        --stripes: rgba(255, 255, 255, 0.035);
        --inner-border: rgba(255, 255, 255, 0.06);
        --tabstrip: #2a2a2f;
        --surface: #323238;
        --surface-border: rgba(255, 255, 255, 0.08);
        --back: #2e2e34;
        --cell: #3a3a41;
        --bar: #3f3f47;
        --bar-strong: #52525b;
        --icon: #7d828c;
        --icon-2: #9a9ea8;
        --accent: #7ea6ea;
        --on-accent: #1c1c21;
        --slate-1: #454e60;
        --slate-2: #2b3444;
        --shadow: #000000;
        --shadow-alpha: 0.36;
      }
    }
    #${prefix} .${prefix}-flood {
      flood-color: var(--shadow);
      flood-opacity: var(--shadow-alpha);
    }
    #${prefix} .${prefix}-cta {
      transform-box: fill-box;
      transform-origin: center;
    }
    #${prefix} .${prefix}-pulse {
      transform-box: fill-box;
      transform-origin: center;
    }
    @keyframes ${prefix}-pop {
      0% { transform: scale(0.8); }
      65% { transform: scale(1.06); }
      100% { transform: scale(1); }
    }
    @keyframes ${prefix}-ping {
      0% { transform: scale(1); opacity: 0.45; }
      70%, 100% { transform: scale(2.4); opacity: 0; }
    }
    @media (prefers-reduced-motion: no-preference) {
      #${prefix} .${prefix}-cta {
        animation: ${prefix}-pop 0.4s cubic-bezier(0.34, 1.4, 0.64, 1) 0.2s both;
      }
      #${prefix} .${prefix}-pulse {
        animation: ${prefix}-ping 2s ease-out 0.6s infinite;
      }
    }
  </style>

  <defs>
    <pattern
      id="${prefix}-stripes"
      width="7"
      height="7"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <line x1="3.5" y1="0" x2="3.5" y2="7" style="stroke: var(--stripes); stroke-width: 1" />
    </pattern>
    <linearGradient id="${prefix}-slate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style="stop-color: var(--slate-1)" />
      <stop offset="1" style="stop-color: var(--slate-2)" />
    </linearGradient>
    <filter
      id="${prefix}-shadow"
      x="-25%"
      y="-25%"
      width="150%"
      height="170%"
      color-interpolation-filters="sRGB"
    >
      <feFlood class="${prefix}-flood" result="flood" />
      <feComposite in="flood" in2="SourceAlpha" operator="in" result="tint" />
      <feGaussianBlur in="tint" stdDeviation="4.5" result="blur" />
      <feOffset in="blur" dx="0" dy="5" result="drop" />
      <feMerge>
        <feMergeNode in="drop" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="160" height="120" rx="18" style="fill: var(--plate)" />
  <rect x="0.5" y="0.5" width="159" height="119" rx="17.5" fill="url(#${prefix}-stripes)" />
  <rect
    x="0.5"
    y="0.5"
    width="159"
    height="119"
    rx="17.5"
    style="fill: none; stroke: var(--inner-border); stroke-width: 1"
  />

  ${back()}
  <g filter="url(#${prefix}-shadow)">
    ${surface()}
    ${content().replaceAll("PREFIX", prefix)}
  </g>
</svg>
`;

const names = Object.keys(scenes);
mkdirSync(outDir, { recursive: true });

// `node generate.mjs copy inline-tip` rewrites only those files (prefixes stay stable because
// the index comes from the full scene order).
const only = process.argv.slice(2);
for (const [index, name] of names.entries()) {
  if (only.length && !only.includes(name)) continue;
  // one shared prefix per file, so several illustrations can share a page
  const prefix = `es${String(index + 1).padStart(2, "0")}${name.replace(/[^a-z]/g, "").slice(0, 3)}`;
  const markup = theme("auto", prefix, scenes[name]).replaceAll("PREFIX", prefix);
  writeFileSync(join(outDir, `${name}.svg`), markup);
}
for (const name of only) {
  if (!scenes[name]) throw new Error(`unknown scene: ${name}`);
}

// Gallery markup and the illustration list live in index.html (kept as a normal file).
writeFileSync(join(here, "names.json"), `${JSON.stringify(names, null, 2)}\n`);

// Coverage: every registry item needs a scene; a new component fails loudly here instead of
// shipping without a preview. `bookmarks-empty` is the illustration set's origin, not a component.
const registry = JSON.parse(readFileSync(join(here, "../../packages/ui/registry.json"), "utf8"));
const components = registry.items.map((item) => item.name);
const missing = components.filter((name) => !scenes[name]);
const extra = Object.keys(scenes).filter(
  (name) => name !== "bookmarks-empty" && !components.includes(name),
);
if (missing.length) console.warn(`missing scenes for: ${missing.join(", ")}`);
if (extra.length) console.warn(`scenes without a component: ${extra.join(", ")}`);
console.log(`wrote ${only.length || names.length} illustrations to ${outDir}`);
