---
title: Copy
description: Copy button component, supports custom styles and tooltip text.
---

## Component Example

::component-panel{component="CopyExample"}
::

## Install using CLI

::installation-tabs{componentName="copy"}
::

## Component Source

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
  description: Content to copy
- name: size
  type: "'sm' | 'default'"
  default: default
  required: false
  description: Button size
- name: variant
  type: ButtonVariants['variant']
  default: outline
  required: false
  description: Button style variant
- name: copyTooltipText
  type: string
  default: Copy
  required: false
  description: Tooltip text before copying
- name: copiedTooltipText
  type: string
  default: Copied
  required: false
  description: Tooltip text after copying
---
::
