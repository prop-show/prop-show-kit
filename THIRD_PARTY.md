# Third-party notices

PropShow Kit's own code is under the MIT License, Copyright (c) 2026 prop-show.
See `LICENSE`. This file records components that came from other projects, the
copyright lines those projects publish, and the MIT license text that has to
travel with them. `NOTICE` is the short form of the same attribution.

Design references below are Vue adaptations. Their files are PropShow Kit code
and are not stamped with the upstream copyright, because that would claim the
whole file is the upstream work.

## Inventory

| Work                    | What is in this repo                    | Source                                                                    | Copyright                           | License |
| ----------------------- | --------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------- | ------- |
| Kumo                    | Design reference for five components    | https://github.com/cloudflare/kumo                                        | Copyright (c) 2026 Cloudflare, Inc. | MIT     |
| ReUI free components    | Design reference for frame and filters  | https://github.com/keenthemes/reui                                        | Copyright (c) 2025 Keenthemes Inc   | MIT     |
| Nuxt UI                 | Design reference for pricing components | https://github.com/nuxt/ui                                                | Copyright (c) 2023 Nuxt             | MIT     |
| Medusa design-system UI | Design reference for inline tip         | https://github.com/medusajs/medusa/tree/develop/packages/design-system/ui | Copyright (c) 2023 Medusajs         | MIT     |
| Sortable List           | Original reorder logic                  | —                                                                         | Copyright (c) 2026 prop-show        | MIT     |
| shadcn-vue              | Docs-site primitive copies              | https://github.com/unovue/shadcn-vue                                      | Copyright (c) 2023 unovue           | MIT     |

## Kumo

These PropShow Kit components are Vue adaptations inspired by [Kumo](https://kumo-ui.com/) (MIT). They are not line-for-line copies, so the Cloudflare copyright is not placed on the whole file. Docs pages link the upstream source. `inline-copy-text` comments the two helpers that mirror Kumo behavior.

| PropShow Kit path                        | Kumo source                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `packages/ui/registry/delete-resource/`  | https://github.com/cloudflare/kumo/tree/main/packages/kumo/src/blocks/delete-resource      |
| `packages/ui/registry/inline-copy-text/` | https://github.com/cloudflare/kumo/tree/main/packages/kumo/src/components/inline-copy-text |
| `packages/ui/registry/layer-card/`       | https://github.com/cloudflare/kumo/tree/main/packages/kumo/src/components/layer-card       |
| `packages/ui/registry/layer-dialog/`     | https://github.com/cloudflare/kumo/tree/main/packages/kumo/src/components/layer-dialog     |
| `packages/ui/registry/slider/`           | https://github.com/cloudflare/kumo/tree/main/packages/kumo/src/components/slider           |

### MIT license — Copyright (c) 2026 Cloudflare, Inc.

From https://github.com/cloudflare/kumo/blob/main/LICENSE

The condition line includes the phrase "including the next paragraph", which is part of Kumo's MIT text.

```
MIT License

Copyright (c) 2026 Cloudflare, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice (including the next
paragraph) shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## ReUI

`frame` and `filters` are Vue adaptations of ReUI's public components. ReUI's free shadcn components, primitives, and hooks are MIT. ReUI Pro blocks, icons, and paid templates use a separate license that forbids repackaging them as a UI kit. Those paid materials were not found in this repository.

| PropShow Kit path               | ReUI source                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `packages/ui/registry/frame/`   | https://github.com/keenthemes/reui/tree/main/packages/registry/bases/radix/components/frame  |
| `packages/ui/registry/filters/` | https://github.com/keenthemes/reui/tree/main/packages/registry/bases/base/components/filters |

### MIT license — Copyright (c) 2025 Keenthemes Inc

From https://github.com/keenthemes/reui/blob/main/LICENSE.md

```
MIT License

Copyright (c) 2025 Keenthemes Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Nuxt UI

`pricing-plan`, `pricing-plans`, and `pricing-table` are Vue adaptations inspired by [Nuxt UI](https://ui.nuxt.com/). They are not line-for-line copies. Nuxt UI is a separate product name and is not PropShow Kit branding.

| PropShow Kit path                     | Nuxt UI source                                                             |
| ------------------------------------- | -------------------------------------------------------------------------- |
| `packages/ui/registry/pricing-plan/`  | https://github.com/nuxt/ui/blob/v4/src/runtime/components/PricingPlan.vue  |
| `packages/ui/registry/pricing-plans/` | https://github.com/nuxt/ui/blob/v4/src/runtime/components/PricingPlans.vue |
| `packages/ui/registry/pricing-table/` | https://github.com/nuxt/ui/blob/v4/src/runtime/components/PricingTable.vue |

### MIT license — Copyright (c) 2023 Nuxt

From https://github.com/nuxt/ui/blob/v4/LICENSE.md

```
MIT License

Copyright (c) 2023 Nuxt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Medusa design-system UI

`inline-tip` is a Vue adaptation inspired by Medusa UI. The component source lives in the design-system UI package, which carries its own MIT license. The Medusa repository also contains Enterprise Edition materials under `ENTERPRISE-LICENSE.md`. Those materials are not MIT and are not in this repository. Medusa is not PropShow Kit branding.

| PropShow Kit path                  | Medusa source                                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| `packages/ui/registry/inline-tip/` | https://github.com/medusajs/medusa/tree/develop/packages/design-system/ui/src/components/inline-tip |

### MIT license — Copyright (c) 2023 Medusajs

From https://github.com/medusajs/medusa/blob/develop/packages/design-system/ui/LICENSE

```
The MIT License (MIT)

Copyright (c) 2023 Medusajs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Sortable List

`packages/ui/registry/sortable-list/` is original PropShow Kit code under the same MIT license as the rest of the repository. Reordering uses pointer events and keyboard handlers written here. `@dnd-kit`, `sortablejs`, `vuedraggable`, and other drag-and-drop libraries are not dependencies, and their source is not in this repository. `@lucide/vue` supplies the grip icon the same way it does for other components.

## shadcn-vue primitives in the docs site

`packages/docs/.docs/ui/` (avatar, badge, button, button-group, dropdown-menu, input, input-group, kbd, scroll-area, separator, textarea, tooltip) and `packages/docs/.docs/lib/utils.ts` are local copies used to render the documentation site. They follow shadcn-vue's own practice: the MIT notice lives in the upstream `LICENSE`, not in each component file. Registry items depend on the user's shadcn-vue primitives instead of redistributing these files.

### MIT license — Copyright (c) 2023 unovue

From https://github.com/unovue/shadcn-vue/blob/dev/LICENSE

```
MIT License

Copyright (c) 2023 unovue

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Trademarks

shadcn, shadcn-vue, Kumo, ReUI, Cloudflare, Nuxt UI, and Medusa are trademarks or names of their owners. PropShow Kit does not adopt them as its own branding.

`packages/docs/.docs/public/icon.svg` uses `#F0DB4F`, the yellow associated with the JavaScript logo, in a pixel glyph. It was not changed here. Favicon and brand-mark work is outside this license change.

## Audit

Checked on 2026-10-31 against the source tree (no `node_modules` license crawl).

No GPL, AGPL, LGPL, Commons Clause, or non-commercial-only license text was found in this repository. No ReUI Pro or Ultimate license headers were found. Medusa Enterprise Edition materials were not found. Nuxt UI and the Medusa design-system UI package are MIT, and the components that cite them are adaptations rather than verbatim copies. `sortable-list` is original code: dnd-kit, sortablejs, and vuedraggable are not vendored. The `patches/undocs-nightly.patch` file only adds a Vue icon mapping to the docs tool; it does not relicense undocs.

Marketing blocks ported from SikandarJODD/sv-efferd were removed from this repository on 2026-10-31. That set was call to action, testimonials, integrations, logo cloud, header, hero, and features (33 blocks). They are not in the registry, and this file no longer carries their MIT notices. The reason is in [CHANGELOG.md](CHANGELOG.md) and on the docs blog, [Removing the Efferd marketing blocks](https://kit.prop.show/blog/removing-efferd-marketing-blocks).
