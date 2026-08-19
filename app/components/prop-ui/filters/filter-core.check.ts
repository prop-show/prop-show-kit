import assert from 'node:assert/strict'

import { matchesFilterOption, toggleFilterValue } from './filter-core.ts'

const active = { value: 'active', label: 'Active' }
const pending = { value: 'pending', label: 'Pending' }

assert.deepEqual(toggleFilterValue([], pending.value, false), ['pending'])
assert.deepEqual(toggleFilterValue(['active'], pending.value, true), ['active', 'pending'])
assert.deepEqual(toggleFilterValue(['active', 'pending'], active.value, true), ['pending'])
assert.equal(matchesFilterOption(active, 'pending'), false)
assert.equal(matchesFilterOption(pending, 'PEND'), true)
