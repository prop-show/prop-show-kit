---
title: 快速开始
description: 快速将 PropShow Kit 组件集成到你的项目中。
---

# 快速开始

本指南将演示如何快速将一个组件集成到你的项目中。

## 步骤 1: 选择组件

浏览左侧的组件列表，找到适合你需求的组件。例如，我们选择 **[Copy](/docs/components/copy)** 组件。

## 步骤 2: 检查依赖

在组件文档页面的顶部或描述中，通常会说明该组件是否依赖于其他 Shadcn Vue 组件。

对于 `Copy` 组件，它依赖于：

- `Button` 组件
- `Tooltip` 组件
- `lucide-vue-next` 图标
- `@vueuse/core` (用于剪贴板功能)

确保你的项目中已经安装了这些依赖：

```bash
npx shadcn-vue@latest add button tooltip
npm install @vueuse/core
```

## 步骤 3: 复制代码

点击组件预览下方的 **Code** 标签页。你会看到组件的源代码。

通常包括：

- 组件文件 (例如 `Copy.vue`)
- 样式变体文件 (例如 `index.ts`，如果使用了 `cva`)

将这些文件复制到你的项目中，建议保持相同的目录结构，例如 `components/prop-ui/copy/`。

## 步骤 4: 使用组件

现在你可以在你的应用中使用该组件了：

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

就是这么简单！你可以根据需要修改组件代码，使其完全符合你的项目需求。
