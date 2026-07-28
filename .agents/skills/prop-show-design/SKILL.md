---
name: prop-show-design
description: Maintain the prop.show visual system when creating, redesigning, reviewing, or styling its Nuxt/Vue components, pages, layouts, loading skeletons, empty states, navigation, content archives, detail views, and standalone surfaces such as RSS XSL. Use for any prop.show UI change that can affect visual consistency, responsive behavior, dark mode, motion, content presentation, or accessibility.
---

# Prop.show Design

Keep new UI recognizably prop.show while allowing the composition to respond to its content. Enforce the brand fundamentals strictly; do not force every component into the same layout.

## Workflow

1. Read [references/design-system.md](references/design-system.md) completely before changing UI.
2. Inspect the current sources of truth:
   - `app/app.config.ts`
   - `app/assets/css/main.css`
   - the page receiving the component
   - the nearest components with the same responsibility
3. State the component's job in one sentence and classify it as a hero, archive/list, directory/card, status/action panel, navigation/shell, loading/empty state, or standalone surface.
4. Define its real content, primary action, secondary information, and required states before choosing a layout.
5. Reuse the nearest established pattern and semantic tokens. Vary the composition only when the content hierarchy requires it.
6. Implement the smallest focused component that fits the existing Nuxt, Vue, Nuxt UI, Tailwind, and Tabler Icon conventions.
7. Run the design review checklist from the reference before finishing.

## Decision Rules

- Treat explicit user requirements as highest priority.
- Treat current repository code and tokens as the source of truth when this reference becomes stale.
- Apply this project skill before generic frontend taste or redesign guidance when their aesthetics conflict.
- Keep brand tokens, accessibility, responsive behavior, and truthful content mandatory.
- Keep exact column ratios, spacing values, and decorative composition flexible within the documented ranges.
- Preserve routes, labels, content fields, and analytics-sensitive behavior unless the user asks to change them.

## Implementation Discipline

- Use semantic Nuxt UI classes instead of introducing a parallel palette.
- Use Composition API with `<script setup lang="ts">` for Vue components.
- Reuse existing app config, content schemas, components, and icon families before adding abstractions or dependencies.
- Keep route pages as composition surfaces; move a reusable visual section into a focused component.
- Make loading geometry match final geometry. Include empty and error presentation when the data flow can produce those states.
- Verify behavior in light and dark modes, at mobile and desktop widths, by keyboard, and with reduced motion.

## Completion Report

Briefly report the component pattern used, any intentional deviation from the reference, and the validation performed. Do not claim visual verification that was not run.
