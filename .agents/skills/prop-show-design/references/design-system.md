# Prop.show Design System

## Contents

1. Design identity
2. Sources of truth
3. Mandatory rules
4. Recommended component patterns
5. Prohibited patterns
6. Review checklist

## Design Identity

Build a technical broadcast and editorial archive for frontend developers. The interface should feel direct, current, and programmatic rather than nostalgic, cyberpunk, or theatrical.

Use broadcast language to organize real programs, reports, creators, platforms, and publication states. Do not invent fictional signals, transmission events, availability, versions, or statistics merely to decorate a surface.

The visual signature consists of:

- one yellow brand accent over neutral semantic surfaces;
- heavy Chinese display type paired with compact mono metadata;
- sharp, border-led geometry with shallow depth;
- asymmetric content and status layouts;
- archive-like numbered rows and concise labels;
- restrained motion that communicates interaction or state.

## Sources Of Truth

Read the current implementation before applying this document. Prefer current code when the system evolves.

- `app/app.config.ts`: colors, navigation, platforms, creators, and shared data.
- `app/assets/css/main.css`: radius, page background, texture, and color mode foundation.
- `TheHeader.vue` and `TheFooter.vue`: shell, navigation, focus, logo, and terminal patterns.
- `PodcastHero.vue`, `NewsHero.vue`, and `VideoHero.vue`: hero and status-panel patterns.
- `NewsLine.vue`, `VideoCard.vue`, and `Modules.vue`: archive row patterns.
- `Creators.vue` and `TechLogos.vue`: directory and matrix patterns.
- Detail pages: dense content hierarchy and previous/next navigation.
- `public/rss.xsl`: standalone surface adaptation outside Nuxt UI.

## Mandatory Rules

### Color And Theme

- Use Nuxt UI semantic colors such as `bg-default`, `bg-elevated`, `text-highlighted`, `text-muted`, `text-dimmed`, `border-default`, and `primary`.
- Keep yellow `primary` as the only brand and interaction accent. Use dark text on solid yellow panels and controls.
- Allow blue, green, purple, or other colors only in small existing semantic category/status indicators. Do not use them for decorative panels, headings, links, or calls to action.
- Support both light and dark modes through semantic tokens. Do not create a component-local theme inversion.
- Use the mode-correct prop.show logo. Avoid filters that make logo color depend on hydration timing.
- Keep the textured page background and prevent white overscroll surfaces in dark mode.

### Typography

- Use heavy sans type for Chinese headings: `font-black`, tight or negative tracking, and compact line height.
- Use mono type for numbers, dates, episode identifiers, technical metadata, and short English labels.
- Keep metadata around 9-12px with `font-bold` and tracking near `0.14em-0.22em`.
- Keep section headings near `text-3xl md:text-4xl`; scale hero headings from `text-5xl` upward only when the available viewport and copy length support it.
- Keep body copy readable with `text-sm` or `text-base`, `leading-6` to `leading-8`, and semantic muted color.
- Make English labels short and factual. Chinese carries the main narrative and actions.

### Geometry And Depth

- Preserve the low global radius based on `--ui-radius: 0.2rem`.
- Use borders, spacing, and background changes before shadows to create hierarchy.
- Keep primary containers square or subtly rounded. Reserve `rounded-full` for real circles, status dots, avatars, or orbit graphics.
- Use shadows only as subtle elevation on hover or for a clearly raised surface.
- Avoid card-inside-card framing. One visual boundary should explain one hierarchy level.

### Layout And Spacing

- Use the shared page container and mobile-first CSS grid.
- Collapse multi-column layouts to one column below their intended breakpoint. Do not rely on content accidentally wrapping correctly.
- Prefer section rhythm around `my-20`, bordered section headings with `mb-8 pb-5`, and responsive padding such as `p-6 sm:p-10 lg:p-12` or `lg:p-14`.
- Keep asymmetric desktop layouts purposeful. Common status sidebars are about `17rem-19rem`, but content hierarchy may choose another ratio.
- Keep mobile primary content first. Move or hide tertiary metadata and decorative affordances when width is limited.
- Give media explicit width and height to prevent layout shift.

### Interaction And Motion

- Express hover with an elevated neutral background, a small `translate` or `scale`, primary-colored text/border, or directional icon movement.
- Keep transitions around 160-300ms. Animate only `transform`, `opacity`, and color for routine interactions.
- Do not add a primary-colored left border to video rows or cards on hover.
- Add `focus-visible` feedback to every custom interactive surface.
- Gate continuous or decorative animation with `prefers-reduced-motion`; use `motion-reduce` utilities where possible.
- Do not use resize or scroll listeners for effects that CSS grid, media queries, or CSS animation can handle.

### Content, Media, And States

- Derive counts, order, dates, categories, status, and platform availability from real data.
- Keep creator imagery in color by default.
- Use a cover only when it identifies content or helps navigation. Do not use a weak cover as a decorative detail-page background.
- Use `padStart(2, '0')` as minimum-width numbering; never truncate values above two digits.
- Match skeleton sections, columns, rows, media ratios, and action positions to the final component.
- Provide a useful empty state for lists and optional content. Provide a contextual error state when the component owns data failure.
- Keep copy concrete. Do not add fictional broadcast lore, fake precision, or status text that the product cannot support.

### Accessibility And Performance

- Use semantic links, buttons, navigation, headings, lists, time elements, and landmarks.
- Add accessible names to icon-only controls and useful alt text to content images.
- Use Tabler through Nuxt Icon and the existing prop.show custom icon collection. Do not hand-draw replacement icons.
- Maintain readable contrast in both themes and on yellow panels.
- Keep high-frequency state out of Vue renders. Prefer CSS for responsive layout and simple visual motion.
- Avoid new dependencies for styling or animation unless existing platform capabilities cannot meet a real requirement.

## Recommended Component Patterns

### Hero

- Use an asymmetric split: primary message and actions on one side, real metrics, logo, or status on the other.
- Use at most one meaningful mono label, one heading, one description, and up to two distinct actions in the main message block.
- A subtle 42px grid, orbit, or oversized letter may support composition, but it must stay behind content and remain cheap to render.
- On mobile, stack the main content before the status area. A two-cell mobile metric panel is acceptable when both values remain readable.

### Section Heading

- Use a bottom border and align the title with one useful count, link, or icon.
- Stack the trailing control below the heading on small screens when the horizontal row becomes cramped.
- Avoid adding an English eyebrow to every small subsection. Use it when it helps identify a real content channel.

### Archive Or List

- Use `border-y` on the group and one divider between rows.
- Structure rows with mono identity/date metadata, a dominant title and summary, optional platform/category information, and one end affordance.
- Collapse to a simple content stack on mobile and hide the nonessential end affordance.
- Use background and text changes for hover rather than inserting new layout elements.

### Directory Or Person Card

- Use one or two columns depending on count and available content.
- Keep the image in color, fixed in size, and paired with name, role, and destination.
- Use a shallow lift and neutral elevated background on hover. Do not create portrait overlays or nested biography cards.

### Status Or Action Panel

- Use a solid yellow block when the information deserves strong emphasis.
- Pair one compact mono label with a large real value or a clear action.
- Keep decorative letters or marks low contrast and out of the reading order.

### Navigation And Shell

- Keep desktop navigation on one line and the header near its current compact height.
- Preserve visible active state, mode-aware logo, keyboard focus, and a dedicated mobile navigation surface.
- Treat RSS and external platforms as listening destinations rather than primary content routes.

### Loading And Empty States

- Build skeletons from the final component's exact regions, not generic stacked bars.
- Preserve final minimum heights and responsive column changes so loading does not shift the page.
- Explain what is absent in an empty state and provide one relevant route or action when available.

### Standalone Surfaces

- Recreate semantic tokens with CSS custom properties and `prefers-color-scheme` when Nuxt UI is unavailable.
- Preserve the same accent, typography contrast, sharp borders, responsive collapse, reduced-motion behavior, and truthful data.
- Keep the underlying protocol or machine-readable output valid; visual styling must remain an enhancement.

## Prohibited Patterns

- Do not introduce a second decorative palette, gradient-led branding, neon glow, or generic glassmorphism.
- Do not use large soft radii, pill-shaped cards, heavy default shadows, or repeated floating containers.
- Do not add a decorative primary left edge to video cards or archive rows.
- Do not grayscale creator imagery by default.
- Do not reuse covers as backgrounds when they add no information.
- Do not invent counts, versions, availability, live states, or broadcast events.
- Do not fill empty space with arbitrary English labels, dots, grids, or technical copy.
- Do not animate width, height, top, or left for routine interactions.
- Do not add per-frame Vue state updates for pointer, resize, or scroll decoration.
- Do not create a new wrapper component, composable, or dependency for a one-off styling detail.

## Review Checklist

### Purpose And Content

- [ ] The component has one clear responsibility and a real information hierarchy.
- [ ] Labels, counts, states, dates, media, and destinations come from real sources.
- [ ] English metadata is concise and meaningful; Chinese copy remains natural.

### Visual System

- [ ] Semantic colors and the single yellow accent are preserved.
- [ ] Heading, body, mono metadata, border, radius, and shadow choices match nearby components.
- [ ] The layout reuses an established family without blindly duplicating a previous section.
- [ ] Images and decorative elements have a clear job.

### Responsive And States

- [ ] Check at approximately 375px, 768px, and 1280px.
- [ ] Check loading, success, empty, and error states that the data flow can produce.
- [ ] Check light mode, dark mode, and dark overscroll/background behavior.
- [ ] Confirm long titles, three-digit numbering, missing images, and missing optional metadata remain usable.

### Interaction, Accessibility, And Performance

- [ ] Keyboard focus is visible and icon-only controls have accessible names.
- [ ] Hover and active states do not cause unexpected layout movement.
- [ ] Reduced-motion mode removes continuous decoration without hiding information.
- [ ] Media dimensions prevent layout shift and animations stay on transform/opacity/color.
- [ ] Run targeted ESLint and `nuxt prepare`; report any unrelated environment blocker accurately.
