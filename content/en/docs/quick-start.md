---
title: Quick Start
description: Quickly integrate PropShow Kit components into your project.
---

# Quick Start

This guide will demonstrate how to quickly integrate a component into your project.

## Step 1: Choose a Component

Browse the component list on the left to find a component that suits your needs. For example, let's choose the **[Copy](/docs/components/copy)** component.

## Step 2: Check Dependencies

At the top or in the description of the component documentation page, it will usually state whether the component depends on other Shadcn Vue components.

For the `Copy` component, it depends on:

- `Button` component
- `Tooltip` component
- `lucide-vue-next` icons
- `@vueuse/core` (for clipboard functionality)

Ensure that you have installed these dependencies in your project:

```bash
npx shadcn-vue@latest add button tooltip
npm install @vueuse/core
```

## Step 3: Copy Code

Click the **Code** tab below the component preview. You will see the source code of the component.

Usually includes:

- Component file (e.g., `Copy.vue`)
- Style variant file (e.g., `index.ts`, if `cva` is used)

Copy these files to your project, it is recommended to keep the same directory structure, e.g., `components/prop-ui/copy/`.

## Step 4: Use Component

Now you can use the component in your application:

```vue
<script setup lang="ts">
import { Copy } from '@/components/prop-ui/copy'
</script>

<template>
    <div class="p-4">
        <Copy content="Hello, PropShow Kit!" />
    </div>
</template>
```

It's that simple! You can modify the component code as needed to perfectly fit your project requirements.
