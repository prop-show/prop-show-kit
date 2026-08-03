---
title: 安装
description: 在项目中使用 PropShow Kit 组件的方法。
---

<!-- # 安装 -->

PropShow Kit 不是 npm 依赖包，因此无需整体安装。你只需将需要的组件源码复制到项目中。

## 前置条件

使用 PropShow Kit 组件前，请确保项目已经按照 **[Shadcn Vue 安装指南](https://www.shadcn-vue.com/docs/installation.html)** 完成配置。

项目中应已安装以下依赖：

- `tailwindcss`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `@lucide/vue`（或其他图标库）

## 配置工具函数

大多数组件依赖 `cn` 工具函数来合并类名。如果项目已经按照 Shadcn Vue 指南完成配置，`lib/utils.ts` 中应该已有这个函数。

```typescript
import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 添加组件

1. 从左侧菜单中选择需要的组件。
2. 点击 **Code** 标签页查看组件源码。
3. 将代码复制到项目的 `components/ui` 目录，或你用于存放组件的其他目录。
4. 如果组件依赖其他组件，例如 `Button` 或 `Badge`，请确保这些基础组件也已安装。

## 示例

假设你要使用 `StatusBadge` 组件：

1. 确保已经安装 Shadcn Vue 的 `Badge` 组件：

   ```bash
   npx shadcn-vue@latest add badge
   ```

2. 将 `StatusBadge.vue` 复制到 `components/ui/status-badge/StatusBadge.vue`。
3. 在页面中导入并使用：

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
