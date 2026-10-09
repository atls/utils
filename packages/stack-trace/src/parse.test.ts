import assert    from 'node:assert/strict'
import { test }  from 'node:test'

import { parse } from './parse.js'

test('parses a stack trace frame', () => {
  const stack = 'Error: simple\n    at test (file:///sample/parse.test.ts:12:4)'
  const { topFrame } = parse(stack)

  assert.ok(topFrame)
  assert.equal(topFrame.file, 'file:///sample/parse.test.ts')
  assert.equal(topFrame.line, 12)
  assert.equal(topFrame.column, 4)
})
