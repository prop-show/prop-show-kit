---
name: generate-empty-state-svg-illustrations
description: Add or update the 160×120 empty-state SVG preview for a show.prop.kit registry component in artifacts/illustrations, then regenerate, check coverage and eyeball light/dark. Use when adding a new component or block, when check.mjs reports "no illustration for registry item ...", or when asked for empty-state or preview artwork for this kit.
---

# Empty-state illustrations

The illustration set lives in `artifacts/illustrations`. One scene per component in
`packages/ui/registry.json`, drawn as a reduced real product screen rather than an
abstract symbol. The full art direction is in `prompt.md`; this file is the workflow.

| File           | Role                                                                   |
| :------------- | :--------------------------------------------------------------------- |
| `prompt.md`    | The art direction the set is built to (plate, surfaces, shadow, rules) |
| `generate.mjs` | Scene templates plus the shared plate / shadow / theme contract        |
| `icons.json`   | Remix `*-line` path data, so no SVG ever loads an external resource    |
| `check.mjs`    | Spec + registry-coverage assertions                                    |
| `index.html`   | Light / dark / auto gallery (needs a static server)                    |
| `svg/*.svg`    | Generated output — never edit by hand                                  |
| `README.md`    | Per-component summary and scene table                                  |

## When to use

After adding any item to `packages/ui/registry.json`, or whenever the illustration set
must gain or change a preview. This is the illustration half of adding a component;
docs and preview wiring are covered by the `add-ui-registry-component` skill.

## Procedure

1. Read the component: its `registry.json` item (title, description, type) and its page
   in `packages/docs/2.components` or `4.blocks`. Write one sentence saying what the
   component is and which state is empty.
2. Append a scene to `scenes` in `artifacts/illustrations/generate.mjs`, in
   `registry.json` order, with `{ aria, back(), surface(), content() }`. Compose a
   reduced real screen: 2–3 objects, one accent "next step" element, placeholder bars
   instead of text.
3. Use only the existing helpers — `BACK` / `PAGE` / `WINDOW` for objects,
   `title` / `line` / `rect` / `icon` / `toggle` / `slate` for content. If the scene
   needs a glyph that is missing from `icons.json`, fetch its `d` attributes from
   `https://unpkg.com/remixicon@4.6.0/icons/<Category>/<name>-line.svg` and add it.
4. Run `node artifacts/illustrations/generate.mjs <name>` for the new scene (no
   arguments regenerates everything), then `node artifacts/illustrations/check.mjs`.
5. Add the component's row to the table in `artifacts/illustrations/README.md`.
6. Serve `artifacts/illustrations` (`python3 -m http.server`) and screenshot
   `index.html` in headless Chrome at 2–4×. Check the new row in light and dark: no
   clipped or overlapping shapes, accent appears exactly once.
7. Run `vp check` at the repo root and confirm it stays clean.
8. Commit the new `svg/<name>.svg`, the updated `names.json`, `generate.mjs` and the
   README row together with the component.

## Pitfalls

- Never hand-edit `svg/*.svg`; `generate.mjs` rewrites them.
- `check.mjs` fails with `no illustration for registry item "<name>"` until the scene
  exists, and with `illustration "<name>" has no registry item` for a stale scene. Fix
  the scene list, never the check.
- Do not judge the render with `rsvg-convert` or `qlmanage`: they ignore the SVG
  `<style>` CSS variables and paint the plate black. Use headless Chrome with
  `--force-device-scale-factor`.
- `vp check` reformats HTML, so keep `index.html` a checked-in file. `generate.mjs`
  writes only SVG and `names.json`.
- Exactly one accent element per scene. Toggles, status dots and key/confirm chips use
  grey or the slate gradient (`--slate-1` / `--slate-2` with `--on-slate`), never
  `--accent`.
- Placeholder text is rects only (5 tall titles, 4 tall body, fully rounded). No
  `<text>`, no `font-family`, no external URLs, no `<image>` / `<use>`, no
  `feDropShadow`.
- Keep scene order identical to `registry.json` order. The id prefix is derived from the
  scene index, so inserting in the middle renames ids in every later file.

## Verification

- `node artifacts/illustrations/check.mjs` prints
  `ok: <N> illustrations for <M> registry items` with no assertion error (coverage,
  unique scoped ids, no forbidden constructs, all objects inside the 14px safe area).
- A headless Chrome screenshot of `index.html` shows the new row correct in light and
  dark: 18px rounded plate, stripes, shadow, exactly one accent element.
- `vp check` passes at the repo root.
- Each new SVG is standalone: `xmllint --noout` passes, and the file contains no
  `PREFIX` token or external reference.
