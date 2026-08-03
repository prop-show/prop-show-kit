---
title: Cascader 级联选择器
description: 用于从多层关联选项中逐级选择值，并针对桌面端与移动端提供适配交互。
---

## 组件示例

::component-panel{component="CascaderExample"}
::

## 使用 CLI 安装

::installation-tabs{componentName="cascader"}
::

## 组件源码

::component-panel{component="Cascader" :show-preview="false"}
::

### Props

::props-table
---

data:

- name: modelValue
  type: "CascaderValue[]"
  default: "[]"
  required: false
  description: 当前选中路径，通过 v-model 绑定
- name: options
  type: "CascaderOption[]"
  default: -
  required: true
  description: 多层级选项数据
- name: placeholder
  type: string
  default: Please select
  required: false
  description: 未选择值时显示的占位文本
- name: disabled
  type: boolean
  default: false
  required: false
  description: 是否禁用级联选择器
- name: allowClear
  type: boolean
  default: true
  required: false
  description: 是否允许清除当前选择
- name: expandTrigger
  type: "'click' | 'hover'"
  default: click
  required: false
  description: 展开下一级选项的触发方式
- name: displayRender
  type: "(labels: CascaderValue[], selectedOptions: CascaderOption[]) => CascaderValue"
  default: -
  required: false
  description: 自定义选中路径的显示内容
- name: class
  type: "HTMLAttributes['class']"
  default: -
  required: false
  description: 触发器的附加类名
- name: popupClass
  type: "HTMLAttributes['class']"
  default: -
  required: false
  description: 弹出层或移动端抽屉的附加类名

---

::

### 事件

| 事件                | 参数                                | 说明                 |
| :------------------ | :---------------------------------- | :------------------- |
| `update:modelValue` | `CascaderValue[]`                   | 选中路径变化时触发   |
| `change`            | `CascaderValue[], CascaderOption[]` | 完成选择或清除时触发 |

## 致谢

- 灵感来自 [cascader-shadcn](https://github.com/Ademking/cascader-shadcn)
