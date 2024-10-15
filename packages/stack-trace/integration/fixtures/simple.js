// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const repeat = require('repeat-string')

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { parse } = require('../../src')

export class Target {
  static parseErrorStack() {
    try {
      return repeat({})
    } catch (error) {
      return parse(error.stack)
    }
  }
}
