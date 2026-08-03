---
title: Copy 复制按钮
description: 支持自定义样式和提示文本的复制按钮组件。
---

## 组件示例

::component-panel{component="CopyExample"}
::

## 使用 CLI 安装

::installation-tabs{componentName="copy"}
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
  description: 按钮尺寸
- name: variant
  type: ButtonVariants['variant']
  default: outline
  required: false
  description: 按钮样式变体
- name: copyTooltipText
  type: string
  default: Copy
  required: false
  description: 复制前显示的提示文本
- name: copiedTooltipText
  type: string
  default: Copied
  required: false
  description: 复制成功后显示的提示文本

---

::
