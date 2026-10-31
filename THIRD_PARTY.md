# Third-party notices

PropShow Kit's own code is under the MIT License, Copyright (c) 2026 prop-show.
See `LICENSE`. This file records components that came from other projects, the
copyright lines those projects publish, and the MIT license text that has to
travel with them. `NOTICE` is the short form of the same attribution.

Migrated source files repeat the SikandarJODD MIT notice in a file header.
That header is what a `shadcn-vue` install copies into a downstream project.
Design references below are Vue adaptations. Their files are PropShow Kit code
and are not stamped with the upstream copyright, because that would claim the
whole file is the upstream work.

## Inventory

| Work                    | What is in this repo                                          | Source                                                                    | Copyright                           | License            |
| ----------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------- | ------------------ |
| Svelte Efferd           | Vue ports of marketing blocks                                 | https://github.com/SikandarJODD/sv-efferd                                 | Copyright (c) 2026 SikandarJODD     | MIT                |
| efferd-ui               | Upstream credit for those blocks, recorded by the Svelte port | https://github.com/shabanhr/efferd-ui                                     | Copyright (c) 2025 sshahaider       | MIT (`LICENCE.md`) |
| Kumo                    | Design reference for five components                          | https://github.com/cloudflare/kumo                                        | Copyright (c) 2026 Cloudflare, Inc. | MIT                |
| ReUI free components    | Design reference for frame and filters                        | https://github.com/keenthemes/reui                                        | Copyright (c) 2025 Keenthemes Inc   | MIT                |
| Nuxt UI                 | Design reference for pricing components                       | https://github.com/nuxt/ui                                                | Copyright (c) 2023 Nuxt             | MIT                |
| Medusa design-system UI | Design reference for inline tip                               | https://github.com/medusajs/medusa/tree/develop/packages/design-system/ui | Copyright (c) 2023 Medusajs         | MIT                |
| shadcn-vue              | Docs-site primitive copies                                    | https://github.com/unovue/shadcn-vue                                      | Copyright (c) 2023 unovue           | MIT                |

## Svelte Efferd ports

Direct source: [SikandarJODD/sv-efferd](https://github.com/SikandarJODD/sv-efferd) (default branch `master`, MIT).

The Svelte repository's README credits the original blocks to [Shaban](https://github.com/shabanhr/efferd-ui) and the Svelte port to SikandarJODD. Both copyright lines are kept here.

| PropShow Kit path                    | Svelte block                                                    |
| ------------------------------------ | --------------------------------------------------------------- |
| `packages/ui/registry/cta/`          | CTA One–Five                                                    |
| `packages/ui/registry/testimonials/` | Testimonial One–Five                                            |
| `packages/ui/registry/integrations/` | Integration One–Five                                            |
| `packages/ui/registry/logo-cloud/`   | Logo Cloud One–Five                                             |
| `packages/ui/registry/header/`       | Header One–Five, including shared navigation and scroll helpers |
| `packages/ui/registry/hero/`         | Hero One–Three                                                  |
| `packages/ui/registry/features/`     | Feature One–Five                                                |

CTA and testimonial sources were missing the notice the other ports already carried. That MIT header is restored on:

- `packages/ui/registry/cta/CtaCentered.vue`
- `packages/ui/registry/cta/CtaCornerAccent.vue`
- `packages/ui/registry/cta/CtaNewsletter.vue`
- `packages/ui/registry/cta/CtaSplit.vue`
- `packages/ui/registry/cta/CtaTrialCard.vue`
- `packages/ui/registry/testimonials/TestimonialCentered.vue`
- `packages/ui/registry/testimonials/TestimonialSplit.vue`
- `packages/ui/registry/testimonials/TestimonialSplitGrid.vue`
- `packages/ui/registry/testimonials/TestimonialStaggered.vue`
- `packages/ui/registry/testimonials/TestimonialWall.vue`

`packages/ui/registry/header/navigation.ts` keeps its existing one-line pointer to the full notice in `HeaderSimple.vue`.

Docs pages under `packages/docs/4.blocks/` link the Svelte source repository. Collection indexes also name the sshahaider copyright.

### MIT license — Copyright (c) 2026 SikandarJODD

From https://github.com/SikandarJODD/sv-efferd/blob/master/LICENSE

```
MIT License

Copyright (c) 2026 SikandarJODD

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

### MIT license — Copyright (c) 2025 sshahaider

From https://github.com/shabanhr/efferd-ui/blob/main/LICENCE.md

The checked-out file begins with the concatenated first line `LICENCEMIT License` and then the standard MIT terms. The copyright line and the terms are:

```
MIT License

Copyright (c) 2025 sshahaider

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

GitHub's license API reports `NOASSERTION` for that repository. The file above is still the MIT license. See Audit before treating the current Efferd website as the same grant.

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

Efferd, shadcn, shadcn-vue, Kumo, ReUI, Cloudflare, Nuxt UI, Medusa, and the product logos used as demonstration content are trademarks or names of their owners. PropShow Kit does not adopt them as its own branding.

Default marketing blocks still hotlink images and logos from `storage.efferd.com`, and some testimonials use real people's names with GitHub avatars. That sample content is not a PropShow Kit endorsement and is not PropShow Kit branding. The block docs already say to replace it before publishing.

`packages/docs/.docs/public/icon.svg` uses `#F0DB4F`, the yellow associated with the JavaScript logo, in a pixel glyph. It was not changed here. Favicon and brand-mark work is outside this license change.

## Audit

Checked on 2026-10-31 against the source tree (no `node_modules` license crawl).

No GPL, AGPL, LGPL, Commons Clause, or non-commercial-only license text was found in this repository. No ReUI Pro or Ultimate license headers were found. Medusa Enterprise Edition materials were not found. Nuxt UI and the Medusa design-system UI package are MIT, and the components that cite them are adaptations rather than verbatim copies. The `patches/undocs-nightly.patch` file only adds a Vue icon mapping to the docs tool; it does not relicense undocs.

Provenance risk, kept and documented rather than deleted:

The marketing blocks in this repo were ported from SikandarJODD/sv-efferd, which is MIT, Copyright (c) 2026 SikandarJODD. That README says the original blocks were created by Shaban. The public repository shabanhr/efferd-ui contains `LICENCE.md`, MIT, Copyright (c) 2025 sshahaider.

The current product terms at https://efferd.com/license (page last updated October 31, 2026) are a different license. They allow commercial use inside products someone ships, and they forbid passing the blocks on as blocks: selling, sharing, or publishing them on their own or as a UI kit, component library, template, theme, starter, or registry. They also say the name "Efferd" may not be used to present another product as Efferd. That license is not GPL or AGPL, and it is not non-commercial-only. It does restrict redistribution as a registry.

These Vue ports are attributed to the MIT Svelte repository, not to a copy taken from the current efferd.com registry during this change. If the Svelte port itself derives from blocks that Efferd LLC now licenses only under the website terms, MIT redistribution through PropShow Kit may not match those terms. The ports were not removed. Review that chain before relying on MIT for the marketing blocks.

Sample content, also kept:

Testimonial defaults attribute fictional quotes to real people and load their GitHub avatars. Integration and logo-cloud defaults load third-party marks from `storage.efferd.com`. The docs already tell readers to replace that content. It was not stripped in this change.
