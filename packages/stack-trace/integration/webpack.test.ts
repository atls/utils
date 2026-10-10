import type { StackTrace } from '../src/stack-trace.js'

import assert              from 'node:assert/strict'
import { mkdtemp }         from 'node:fs/promises'
import { rm }              from 'node:fs/promises'
import { createRequire }   from 'node:module'
import { tmpdir }          from 'node:os'
import { dirname }         from 'node:path'
import { join }            from 'node:path'
import { test }            from 'node:test'
import { fileURLToPath }   from 'node:url'

import webpack             from 'webpack'

test('maps frames from a webpack bundle to their sources', async (context) => {
  const directory = dirname(fileURLToPath(import.meta.url))
  const outputDirectory = await mkdtemp(join(tmpdir(), 'stack-trace-webpack-'))

  context.after(async () => rm(outputDirectory, { recursive: true, force: true }))

  const compiler = webpack({
    context: directory,
    mode: 'development',
    target: 'node',
    devtool: 'eval-cheap-module-source-map',
    entry: {
      simple: join(directory, 'fixtures', 'simple.js'),
    },
    output: {
      filename: '[name].cjs',
      devtoolModuleFilenameTemplate: 'webpack-internal:///[resource-path]',
      libraryTarget: 'commonjs',
      path: outputDirectory,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      extensionAlias: { '.js': ['.ts', '.tsx', '.js'] },
    },
    module: {
      rules: [{ test: /\.ts?$/, loader: 'ts-loader' }],
    },
  })

  await new Promise<void>((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) reject(error)
      else if (stats?.hasErrors()) reject(new Error(stats.toString('errors-only')))
      else resolve()
    })
  })

  const requireBundle = createRequire(import.meta.url)
  const { Target } = requireBundle(join(outputDirectory, 'simple.cjs')) as {
    Target: { parseErrorStack: () => StackTrace }
  }
  const [repeatStringFrame, simpleFrame] = Target.parseErrorStack().frames

  assert.ok(repeatStringFrame.sourceMap)
  assert.match(repeatStringFrame.sourceMap.payload.file, /repeat-string\/index\.js/u)
  assert.ok(simpleFrame.sourceMap)
  assert.match(simpleFrame.sourceMap.payload.file, /\.\/fixtures\/simple\.js/u)
})
