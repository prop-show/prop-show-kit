---
title: 安装
description: 如何在你的项目中使用 PropShow Kit 组件。
---

# 安装

PropShow Kit 不是一个 npm 包，你不需要安装它。相反，你需要将组件源码复制到你的项目中。

## 前置要求

在使用 PropShow Kit 组件之前，请确保你的项目已经配置了 **[Shadcn Vue](https://www.shadcn-vue.com/docs/installation.html)**。

你的项目应该已经安装了以下依赖：

- `tailwindcss`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-vue-next` (或其他图标库)

## 配置工具函数

大多数组件都依赖于 `cn` 工具函数来合并类名。如果你已经按照 Shadcn Vue 的指南配置了项目，你应该已经在 `lib/utils.ts` 中有了这个函数。

```typescript
import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
```

## 添加组件

1.  在左侧菜单中选择你需要的组件。
2.  点击 **Code** 标签页查看组件源码。
3.  将代码复制到你的项目中的 `components/ui` 目录（或者你存放组件的任何地方）。
4.  如果组件依赖于其他组件（如 `Button` 或 `Badge`），请确保你也安装了这些基础组件。

## 示例

假设你想使用 `StatusBadge` 组件：

1.  确保你已经安装了 Shadcn Vue 的 `Badge` 组件：
    ```bash
    npx shadcn-vue@latest add badge
    ```
2.  复制 `StatusBadge.vue` 的代码到 `components/ui/status-badge/StatusBadge.vue`。
3.  在你的页面中引入并使用：

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
