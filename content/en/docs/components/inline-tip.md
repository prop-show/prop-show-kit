---
title: Inline Tip
description: Inline tip component, used to display different types of tip information.
---

## Component Example

::component-panel{component="InlineTipExample"}
::

## Component Source

::component-panel{component="InlineTip" :show-preview="false"}
::

### Props

## ::props-table

data:

- name: label
  type: string
  default: -
  required: true
  description: Tip label text
- name: variant
  type: "'info' | 'warning' | 'success' | 'error'"
  default: info
  required: false
  description: Tip type variant

---

::

### Slots

| Name    | Description                     |
| :------ | :------------------------------ |
| default | The specific content of the tip |
