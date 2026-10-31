# Changelog

Dated notes for the PropShow Kit registry and the docs site. There are no package versions. An install copies the current registry entry into your project.

Longer write-ups are on the [blog](https://kit.prop.show/blog). The docs site links here from [What changed](https://kit.prop.show/guide/changelog).

## 2026-10-31

- Password Input and Phone Input. Password Input is a show/hide field with a strength meter, built on the shadcn-vue input group. Phone Input is an international number field. Its parsing and calling codes come from [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js) (MIT). That package's metadata is generated from Google's libphonenumber (Apache License 2.0) and is not copied into this repository.
- Removed 33 marketing blocks ported from [SikandarJODD/sv-efferd](https://github.com/SikandarJODD/sv-efferd): call to action (5), testimonials (5), integrations (5), logo cloud (5), header (5), hero (3), and features (5). Pricing components, the three workspace blocks, and Kumo, ReUI, and Medusa adaptations stay. [Removing the Efferd marketing blocks](https://kit.prop.show/blog/removing-efferd-marketing-blocks) explains why. `NOTICE` and `THIRD_PARTY.md` no longer carry those entries.
- Collaboration docs on the repository: install-first README, contributing guide, issue and pull request templates, security policy, and this changelog.
- The registry is MIT licensed. Attribution for adapted components is in `NOTICE` and `THIRD_PARTY.md`.
- The guide covers the `@propshow` registry, components versus blocks, boundaries with shadcn-vue, and common pitfalls. The blocks index lists 3 blocks. [What PropShow Kit ships today](https://kit.prop.show/blog/what-ships-today) is the tour.
- Docs "Edit this page" links point at this repository on `master`. `/guide/installation` redirects to `/guide`. `/guide/components/**` redirects to `/components/**`.

## 2026-10-30

- Five header blocks, five logo-cloud blocks, five integration blocks, five testimonial blocks, and five call-to-action blocks.
- Pricing plan, pricing plans, and pricing table components.

## 2026-10-27

- Empty-state SVG thumbnails on the components index, with a generator and a coverage check.
- Blog: [Empty states as a skill](https://kit.prop.show/blog/empty-states-as-a-skill).

## 2026-10-20

- Resizable block previews, and the workspace screens: project overview, team members, and workspace settings.
- Blog: [From components to working screens](https://kit.prop.show/blog/from-components-to-working-screens).

## 2026-10-16

- Development and production registry builds rewrite this registry's dependency URLs. Production uses `https://kit.prop.show/`.

## 2026-10-13

- Documented as an add-on registry for shadcn-vue: not a fork, and not an npm package.
- Frame, layer card, layer dialog, inline copy text, slider, and delete resource joined inline tip, status badge, copy, and filters.

## Earlier

The docs site moved from Docus to undocs. Older history is in the [commit log](https://github.com/prop-show/prop-show-kit/commits/master).
