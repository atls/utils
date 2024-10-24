import { describe }  from '@jest/globals'
import { beforeAll } from '@jest/globals'
import { it }        from '@jest/globals'
import { expect }    from '@jest/globals'
import path          from 'path'
import webpack       from 'webpack'

describe('webpack stack trace', () => {
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
        library: {
          type: 'module'
        },
        chunkFormat: 'module',
        filename: 'simple.js',
        libraryTarget: 'module',
        path: path.join(__dirname, 'fixtures', 'dist'),
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
      },
      module: {
        rules: [{ test: /\.ts?$/, loader: 'ts-loader' }],
      },
      experiments: {
        outputModule: true
      }
    })

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
    const entryPath = path.join(__dirname, 'fixtures', 'dist', 'simple.js')

    // eslint-disable-next-line security/detect-non-literal-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const { Target } = require(entryPath)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const stackTrace = Target.parseErrorStack()

    const [repeatStringFrame, simpleFrame] = stackTrace.frames

    expect(repeatStringFrame.sourceMap).toBeDefined()
    expect(repeatStringFrame.sourceMap.payload.file).toEqual(
      expect.stringContaining('repeat-string/index.js')
    )

    expect(simpleFrame.sourceMap).toBeDefined()
    expect(simpleFrame.sourceMap.payload.file).toEqual(
      expect.stringContaining('./fixtures/simple.js')
    )
  })
})
