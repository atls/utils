import assert                          from 'node:assert/strict'
import { mkdtemp }                     from 'node:fs/promises'
import { rm }                          from 'node:fs/promises'
import { tmpdir }                      from 'node:os'
import { dirname }                     from 'node:path'
import { join }                        from 'node:path'
import { test }                        from 'node:test'
import { fileURLToPath }               from 'node:url'

import webpack                         from 'webpack'

import { resolve as resolveSourceMap } from '../src/index.js'

test('resolves the original source of a webpack bundle', async (context) => {
  const directory = dirname(fileURLToPath(import.meta.url))
  const outputDirectory = await mkdtemp(join(tmpdir(), 'webpack-source-map-'))

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
      libraryTarget: 'commonjs',
      path: outputDirectory,
    },
  })

  await new Promise<void>((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) reject(error)
      else if (stats?.hasErrors()) reject(new Error(stats.toString('errors-only')))
      else resolve()
    })
  })

  const sourceMap = resolveSourceMap(
    'webpack-internal:///./fixtures/simple.js',
    join(outputDirectory, 'simple.cjs')
  )

  assert.ok(sourceMap)

  const entry = sourceMap.findEntry(5, 0)

  assert.ok('originalLine' in entry)
  assert.equal(entry.originalLine, 1)
})
