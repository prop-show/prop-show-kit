# Empty-state illustrations for the registry

One 160×120 inline SVG per component in `packages/ui/registry.json`, drawn as a
reduced real product screen rather than an abstract symbol.

The art direction lives in `prompt.md`, the workflow in `SKILL.md` (an agent skill that
ships with the repo), and the per-component summary in the table below.

```sh
node generate.mjs                       # rewrite every svg/*.svg + names.json
node generate.mjs filters inline-tip    # rewrite only these scenes
node check.mjs                          # spec + coverage assertions
```

`index.html` is a local gallery (light / dark / auto side by side); open it through
a static server, e.g. `python3 -m http.server`.

**Adding a component?** Add its scene here in the same change, then run both scripts.
`check.mjs` fails with `no illustration for registry item "<name>"` if a
`packages/ui/registry.json` item has no scene, and with
`illustration "<name>" has no registry item` for a stale scene.

## Component summaries and the scene each one gets

| Component            | What it is                                                                                                   | Scene                                                                       |
| :------------------- | :----------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `frame`              | Composable framed container: header, stacked panels, footer. Used for panels, notifications, framed dialogs. | Header panel with a `+` action above two stacked empty panels.              |
| `layer-card`         | Card with a primary surface and a secondary visual layer behind it, for navigation and grouped content.      | Card over a receding layer, layers icon, title bars, trailing chevron.      |
| `layer-dialog`       | Responsive dialog with a persistent title, scrollable body and fixed action footer.                          | Dialog sheet over a dimmed panel: title, two body bars, Cancel + confirm.   |
| `inline-tip`         | Compact inline callout with semantic variants (`default`, `info`, `destructive`).                            | Page with an info tip panel (accent rail + info icon) and no content below. |
| `status-badge`       | Badge with an animated status dot, for row-level state.                                                      | Resource rows, first dot pulsing in accent, the rest idle grey.             |
| `copy`               | Accessible copy button with clipboard feedback and a tooltip.                                                | Value field with an accent copy button plus the slate confirmation chip.    |
| `inline-copy-text`   | Borderless inline copy control for IDs and short values.                                                     | Three key/value rows, first copy affordance in accent, dividers between.    |
| `filters`            | Controlled, typed filter list with keyboard navigation, validation and async options.                        | Filter bar, two applied chips, and an empty search result area.             |
| `slider`             | Slider with value badges, range selection and formatted min/max values.                                      | Two value badges above a single-thumb track with an accent fill.            |
| `delete-resource`    | Deletion dialog requiring the resource name, with async error feedback.                                      | Dialog with trash icon, warning bars, typed-confirmation field, confirm.    |
| `project-overview`   | Block: reporting-period switcher, metric cards, deployment status.                                           | Period picker, three empty metric cards, one deployment row with status.    |
| `team-members`       | Block: searchable team directory plus an invite dialog.                                                      | Search + accent invite button above three empty member rows.                |
| `workspace-settings` | Block: settings form with toggles, save feedback, discard action.                                            | Two toggle rows (one on, one off) and a slate save bar.                     |
| `pricing-plan`       | A pricing card with price, billing details, features and an action.                                          | Single card with price bars, feature checks and an accent CTA.              |
| `pricing-plans`      | Responsive collection of pricing cards.                                                                      | Two side-by-side cards with one accent plan action.                         |
| `pricing-table`      | Tiered pricing with grouped feature comparisons.                                                             | Two plan columns above feature rows with checkmarks.                        |
| `signature-pad`      | Handwritten signature capture with clear and image export.                                                   | Empty pad, baseline, and an accent save action.                             |
| `bookmarks-empty`    | Not a component — the browser-extension bookmark empty state this set started from.                          | Browser window with a tab strip, empty folder and an accent add button.     |

## Shared rules the generator enforces

- Plate 18 radius, `#fafafa` + 45° 1px stripes every 7, 1px inner border.
- Surfaces 10–13 radius, 1px `rgba(47,42,34,0.08)` border, shadow built from
  `feFlood` → `feComposite` → `feGaussianBlur(4.5)` → `feOffset(0 5)` → `feMerge`.
- No text: 5-bar titles (`#cdd4de`), 4-bar body (`#e5e9ef`), all fully rounded.
- Remix `*-line` icons only (`icons.json` holds the path data); one accent element
  per scene, optional slate gradient chip for key/confirm actions.
- Colours are CSS variables scoped by the file's own id prefix (`esNNxxx`), so
  several illustrations can share a page; root `data-theme="light|dark|auto"`.
- Optional motion: accent element pops once, status dot pings, both only under
  `prefers-reduced-motion: no-preference` and with `transform-box: fill-box`.

## Adding a scene

1. Add an entry to `scenes` in `generate.mjs`, in the same order as `registry.json`:
   `aria` (what the empty screen shows), `back()`, `surface()`, `content()`.
   The plate, variables, filter and animations are generated for you.
2. Compose with `BACK()` / `PAGE()` / `WINDOW()` for objects and `title()` /
   `line()` / `rect()` / `icon()` / `toggle()` / `slate()` for content, so the
   whole set stays visually consistent. Keep 2–3 objects inside x 14–146 and
   y 12–108, one accent element, no `<text>`.
3. Add a row to the table above, then run `node generate.mjs <name> && node check.mjs`.
4. Render it (`index.html` plus a static server) and look at light + dark before
   calling it done.
