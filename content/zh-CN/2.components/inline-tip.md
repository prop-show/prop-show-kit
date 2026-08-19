---
title: Inline Tip 行内提示
description: 用于展示不同类型提示信息的行内提示组件。
---

## 组件示例

::component-panel{component="InlineTipExample"}
::

## 使用 CLI 安装

::installation-tabs{componentName="inline-tip"}
::

## 组件源码

::component-panel{component="InlineTip" :show-preview="false"}
::

### Props

::props-table
---

data:

- name: label
  type: string
  default: -
  required: true
  description: 提示标签文本
- name: variant
  type: "'info' | 'warning' | 'success' | 'error'"
  default: info
  required: false
  description: 提示类型变体

---

::

### 插槽

| 名称      | 说明         |
| :-------- | :----------- |
| `default` | 提示具体内容 |
