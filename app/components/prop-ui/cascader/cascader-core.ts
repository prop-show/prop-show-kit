import type { CascaderOption, CascaderValue } from './index'

export function getCascaderColumns(
  options: CascaderOption[],
  expandedPath: CascaderValue[],
) {
  const columns: CascaderOption[][] = [options]
  let currentOptions = options

  for (const value of expandedPath) {
    const option = currentOptions.find(candidate => candidate.value === value)
    if (!option?.children?.length)
      break

    columns.push(option.children)
    currentOptions = option.children
  }

  return columns
}

export function getSelectedOptions(
  options: CascaderOption[],
  values: CascaderValue[],
) {
  const selectedOptions: CascaderOption[] = []
  let currentOptions = options

  for (const value of values) {
    const option = currentOptions.find(candidate => candidate.value === value)
    if (!option)
      break

    selectedOptions.push(option)
    currentOptions = option.children ?? []
  }

  return selectedOptions
}
