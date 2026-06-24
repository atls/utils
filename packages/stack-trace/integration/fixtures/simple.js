// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
import repeat from 'repeat-string'

export class Target {
  static parseErrorStack() {
    import('../../dist/parse.js').then((parse) => {
      try {
        return repeat({})
      } catch (error) {
        return parse(error.stack)
      }
    })
  }
}
