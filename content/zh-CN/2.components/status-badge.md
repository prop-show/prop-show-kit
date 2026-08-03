---
title: Status Badge 状态徽章
description: 使用状态指示点清晰表达当前状态的徽章组件。
---

## 组件示例

::component-panel{component="StatusBadgeExample"}
::

## 使用 CLI 安装

::installation-tabs{componentName="status-badge"}
::

## 组件源码

::component-panel{component="StatusBadge" :show-preview="false"}
::

### Props

::props-table
---

data:

- name: variant
  type: BadgeVariants['variant']
  default: default
  required: false
  description: 徽章样式变体
- name: rounded
  type: StatusVariants['rounded']
  default: -
  required: false
  description: 圆角尺寸
- name: color
  type: StatusVariants['color']
  default: -
  required: false
  description: 状态指示点颜色

---

::
