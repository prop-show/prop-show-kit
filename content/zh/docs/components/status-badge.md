---
title: 状态展示
description: 状态展示
---

## 组件示例

::component-panel{component="StatusBadgeExample"}
::

## 使用命令安装组件

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
  description: 圆角大小
- name: color
  type: StatusVariants['color']
  default: -
  required: false
  description: 状态点颜色
---
::
