import type { StackFrame } from './stack-trace.js'

import { fileURLToPath }   from 'node:url'

import StackUtils          from 'stack-utils'

import { resolve }         from '@atls/webpack-source-map'

import { StackTrace }      from './stack-trace.js'
import { isWebpackEnv }    from './constants.js'
import { isProdEnv }       from './constants.js'

const modulePath = typeof __filename === 'string' ? __filename : fileURLToPath(import.meta.url)

export const parse = (stack: string): StackTrace => {
  const lines = stack.split('\n')

  const cwd = process.cwd()
  const stackUtils = new StackUtils({ cwd })

  const frames = lines.reduce((result: Array<StackFrame>, line) => {
    const frame: StackFrame | null = stackUtils.parseLine(line.trim())

    if (frame) {
      if (frame.file && isWebpackEnv && !isProdEnv) {
        const sourceMap = resolve(frame.file, modulePath)

        if (sourceMap) {
          frame.sourceMap = sourceMap

          frame.file = sourceMap.payload.file
            .replace('.ts.js', '.ts')
            .replace('.tsx.js', '.tsx')
            .replace('.js.js', '.js')

          if (frame.line && frame.column) {
            const entry = sourceMap.findEntry(frame.line, frame.column)

            if ('originalLine' in entry && 'originalColumn' in entry) {
              frame.line = entry.originalLine
              frame.column = entry.originalColumn
            }
          }
        }
      }

      result.push(frame)
    }

    return result
  }, [])

  return new StackTrace(frames)
}
