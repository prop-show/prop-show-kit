import assert from 'node:assert/strict'

import type { CascaderOption } from './index'

import { getCascaderColumns, getSelectedOptions } from './cascader-core.ts'

const options: CascaderOption[] = [
  {
    value: 'country',
    label: 'Country',
    children: [
      {
        value: 'city',
        label: 'City',
        children: [{ value: 'place', label: 'Place' }],
      },
    ],
  },
]
const path = ['country', 'city', 'place']

assert.deepEqual(getCascaderColumns(options, path).map(column => column[0]?.value), path)
assert.deepEqual(getSelectedOptions(options, path).map(option => option.value), path)
