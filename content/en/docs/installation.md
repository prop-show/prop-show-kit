---
title: Installation
description: How to use PropShow Kit components in your project.
---

# Installation

PropShow Kit is not an npm package, so you don't need to install it. Instead, you need to copy the component source code into your project.

## Prerequisites

Before using PropShow Kit components, please ensure your project is already configured with **[Shadcn Vue](https://www.shadcn-vue.com/docs/installation.html)**.

Your project should have the following dependencies installed:

- `tailwindcss`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-vue-next` (or other icon libraries)

## Configure Utility Function

Most components depend on the `cn` utility function to merge class names. If you have configured your project according to the Shadcn Vue guide, you should already have this function in `lib/utils.ts`.

```typescript
import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
```

## Add Components

1.  Select the component you need from the left menu.
2.  Click the **Code** tab to view the component source code.
3.  Copy the code to your project's `components/ui` directory (or wherever you keep your components).
4.  If the component depends on other components (such as `Button` or `Badge`), make sure you have installed those base components as well.

## Example

Suppose you want to use the `StatusBadge` component:

1.  Ensure you have installed the Shadcn Vue `Badge` component:
    ```bash
    npx shadcn-vue@latest add badge
    ```
2.  Copy the code of `StatusBadge.vue` to `components/ui/status-badge/StatusBadge.vue`.
3.  Import and use it in your page:

```vue
<script setup lang="ts">
import StatusBadge from '@/components/ui/status-badge/StatusBadge.vue'
</script>

<template>
    <StatusBadge variant="default" status="success">
        Online
    </StatusBadge>
</template>
```
