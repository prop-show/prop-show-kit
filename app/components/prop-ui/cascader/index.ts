import type { HTMLAttributes } from 'vue'

export { default as Cascader } from './Cascader.vue'

export type CascaderValue = string | number

export interface CascaderOption {
  value: CascaderValue
  label: CascaderValue
  disabled?: boolean
  children?: CascaderOption[]
}

export interface CascaderProps {
  options: CascaderOption[]
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  class?: HTMLAttributes['class']
  popupClass?: HTMLAttributes['class']
  expandTrigger?: 'click' | 'hover'
  displayRender?: (
    labels: CascaderValue[],
    selectedOptions: CascaderOption[],
  ) => CascaderValue
}
