import path          from 'path'
import webpack       from 'webpack'
import { SourceMap } from 'module'

import { resolve }   from '../src'

describe('resolve webpack source map', () => {
  beforeAll(async () => {
    const compiler = webpack({
      context: __dirname,
      mode: 'development',
      target: 'node',
      devtool: 'eval-cheap-module-source-map',
      entry: {
        simple: path.join(__dirname, 'fixtures', 'simple.js'),
      },
      output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, 'fixtures', 'dist'),
      },
    })

    // eslint-disable-next-line no-shadow
    await new Promise((resolve, reject) => {
      compiler.run((error) => {
        if (error && !error.message) {
          reject(error)
        } else {
          resolve(null)
        }
      })
    })
  })

  it('simple', () => {
    const sourceMap = resolve(
      'webpack-internal:///./fixtures/simple.js',
      path.join(__dirname, 'fixtures', 'dist', 'simple.js')
    ) as SourceMap

    expect(sourceMap).toBeDefined()

    const entry = sourceMap.findEntry(5, 0)

    expect(entry).toBeDefined()
    expect(entry.originalLine).toBe(1)
  })
})
