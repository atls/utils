import repeat from 'repeat-string'

import { parse } from '../../src/index.js'

export class Target {
  static parseErrorStack() {
    try {
      return repeat({})
    } catch (error) {
      return parse(error.stack)
    }
  }
}
