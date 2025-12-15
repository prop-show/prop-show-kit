---
title: 行内提示
description: 行内提示组件，用于展示不同类型的提示信息。
---

## 组件示例

::component-panel{component="InlineTipExample"}
::

## 使用命令安装组件

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

### Slots

| 名称    | 说明           |
| :------ | :------------- |
| default | 提示的具体内容 |
