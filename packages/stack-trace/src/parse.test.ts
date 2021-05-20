import { StackFrame } from './stack-trace'
import { parse }      from './parse'

describe('parse stack trace', () => {
  it('simple', () => {
    const stackTrace = parse(new Error('simple').stack as string)
    const topFrame = stackTrace.topFrame as StackFrame

    expect(topFrame).toBeDefined()
    expect(__filename).toEqual(expect.stringContaining(topFrame.file as string))
  })
})
