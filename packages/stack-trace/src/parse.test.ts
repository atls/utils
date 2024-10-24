import { describe } from '@jest/globals'
import { it }       from '@jest/globals'
import { expect }   from '@jest/globals'

import { parse }    from './parse.js'

describe('parse stack trace', () => {
  it('simple', () => {
    const stackTrace = parse(new Error('simple').stack!)
    const topFrame = stackTrace.topFrame!

    expect(topFrame).toBeDefined()
    expect(__filename).toEqual(expect.stringContaining(topFrame.file!))
  })
})
