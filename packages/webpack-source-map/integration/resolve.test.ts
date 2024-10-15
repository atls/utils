import type { SourceMap } from 'module'

import { describe }       from '@jest/globals'
import { beforeAll }      from '@jest/globals'
import { it }             from '@jest/globals'
import { expect }         from '@jest/globals'
import path               from 'path'
import webpack            from 'webpack'

import { resolve }        from '../src'

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

    await new Promise((res, rej) => {
      compiler.run((error) => {
        if (error && !error.message) {
          rej(error)
        } else {
          res(null)
        }
      })
    })
  })

  it('simple', () => {
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
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
