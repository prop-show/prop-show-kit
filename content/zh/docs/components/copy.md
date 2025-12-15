---
title: 复制
description: 复制按钮组件，支持自定义样式和提示文本。
---

## 组件示例

::component-panel{component="CopyExample"}
::

## 组件源码

::component-panel{component="Copy" :show-preview="false"}
::

### Props

::props-table
---
data:

- name: content
  type: string
  default: -
  required: true
  description: 要复制的内容
- name: size
  type: "'sm' | 'default'"
  default: default
  required: false
  description: 按钮大小
- name: variant
  type: ButtonVariants['variant']
  default: outline
  required: false
  description: 按钮样式变体
- name: copyTooltipText
  type: string
  default: Copy
  required: false
  description: 复制前的提示文本
- name: copiedTooltipText
  type: string
  default: Copied
  required: false
  description: 复制后的提示文本
---
::
