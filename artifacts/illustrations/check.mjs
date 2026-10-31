// Asserts the generated set stays inside the spec: standalone SVG, scoped ids,
// no text/images, the required shadow primitives, >= 14px padding around the
// illustration's objects, and a scene for every registry component.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "svg");
const files = readdirSync(dir).filter((file) => file.endsWith(".svg"));
assert.ok(files.length > 0, "no illustrations generated");

// Coverage matches the empty-state inventory: every registry:component needs a
// scene. registry:block entries are full screens, not empty states, and are
// not required to have one. A scene still has to name a real registry item
// (bookmarks-empty is the set's origin and is the only exception).
const registry = JSON.parse(readFileSync(join(here, "../../packages/ui/registry.json"), "utf8"));
const components = registry.items.filter((item) => item.type === "registry:component");
for (const item of components) {
  assert.ok(
    files.includes(`${item.name}.svg`),
    `no illustration for registry item "${item.name}" — add a scene in generate.mjs`,
  );
}
const names = new Set(registry.items.map((item) => item.name));
for (const file of files) {
  const name = file.replace(/\.svg$/, "");
  assert.ok(
    names.has(name) || name === "bookmarks-empty",
    `illustration "${name}" has no registry item (or remove it from generate.mjs)`,
  );
}

const ids = new Map();
const extents = [];

for (const file of files) {
  const markup = readFileSync(join(dir, file), "utf8");
  const where = (message) => `${file}: ${message}`;

  assert.match(markup, /viewBox="0 0 160 120"/, where("wrong viewBox"));
  assert.match(markup, /data-theme="(light|dark|auto)"/, where("missing data-theme"));
  assert.doesNotMatch(markup, /PREFIX/, where("unreplaced template token"));
  // the SVG namespace is the only allowed URI; nothing may be fetched
  const withoutNamespace = markup.replace('xmlns="http://www.w3.org/2000/svg"', "");
  for (const forbidden of ["<image", "<use", "feDropShadow", "http://", "https://"]) {
    assert.ok(!withoutNamespace.includes(forbidden), where(`forbidden construct ${forbidden}`));
  }
  for (const required of ["feGaussianBlur", "feOffset", "feFlood", "feComposite", "feMerge"]) {
    assert.ok(markup.includes(required), where(`missing ${required}`));
  }
  assert.doesNotMatch(markup, /<text|font-family/, where("illustrations must not set type"));

  const fileIds = [...markup.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  const [root] = fileIds;
  assert.ok(root && !root.includes("-"), where("root id should be the bare prefix"));
  for (const id of fileIds) {
    assert.ok(id.startsWith(root), where(`id ${id} lacks prefix ${root}`));
    assert.equal(ids.get(id), undefined, where(`id ${id} collides with ${ids.get(id)}`));
    ids.set(id, file);
  }

  // Objects (everything except the two full-canvas plate rects) stay in the safe area.
  for (const [, raw] of markup.matchAll(/<rect([^>]*)>/g)) {
    const attr = (name) => Number(raw.match(new RegExp(`\\b${name}="(-?[\\d.]+)"`))?.[1] ?? NaN);
    const [x, y, w, h] = [attr("x") || 0, attr("y") || 0, attr("width") || 0, attr("height") || 0];
    if (x === 0 && w === 160) continue;
    if (x === 0.5 && w === 159) continue;
    extents.push([file, x, y, x + w, y + h]);
  }
}

for (const [file, x1, y1, x2, y2] of extents) {
  assert.ok(x1 >= 14 && x2 <= 146, `${file}: x ${x1}…${x2} breaks the 14px padding`);
  assert.ok(y1 >= 12 && y2 <= 108, `${file}: y ${y1}…${y2} breaks the padding`);
}

console.log(
  `ok: ${files.length} illustrations, ${components.length} registry components covered, ${registry.items.length} registry items, ${ids.size} scoped ids, ${extents.length} rects in bounds`,
);
