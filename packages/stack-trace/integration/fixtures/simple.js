const repeat = require('repeat-string')

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
